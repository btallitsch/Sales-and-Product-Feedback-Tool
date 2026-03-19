import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { FeedbackItem, FeedbackStatus, SortField, SortDir } from '@/types';
import { StatusBadge, CategoryBadge, DealStageBadge } from '@/components/shared/Badge';
import { formatCurrency, formatRelativeDate, URGENCY_COLORS } from '@/utils/formatters';
import Button from '@/components/shared/Button';

interface FeedbackTableProps {
  items: FeedbackItem[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  onEdit: (item: FeedbackItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (item: FeedbackItem, status: FeedbackStatus) => void;
}

function SortIcon({ field, active, dir }: { field: string; active: boolean; dir: SortDir }) {
  return (
    <span style={{ marginLeft: 4, opacity: active ? 1 : 0.3 }}>
      {active && dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </span>
  );
}

const th = (label: string, sortKey?: SortField, currentSort?: SortField, dir?: SortDir, onSort?: (f: SortField) => void, width?: number) => (
  <th
    onClick={sortKey ? () => onSort?.(sortKey) : undefined}
    style={{
      padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)',
      borderBottom: '1px solid var(--border)', cursor: sortKey ? 'pointer' : 'default',
      userSelect: 'none', whiteSpace: 'nowrap', width: width ?? 'auto',
      background: 'var(--bg-surface)',
    }}
  >
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {label}
      {sortKey && <SortIcon field={sortKey} active={currentSort === sortKey} dir={dir ?? 'desc'} />}
    </span>
  </th>
);

export default function FeedbackTable({ items, sortField, sortDir, onSort, onEdit, onDelete, onStatusChange }: FeedbackTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {th('Company / Contact', undefined, undefined, undefined, undefined, 180)}
            {th('Pain Point', undefined, undefined, undefined, undefined)}
            {th('Category')}
            {th('Stage')}
            {th('Urgency', 'urgency', sortField, sortDir, onSort, 90)}
            {th('Revenue', 'revenueImpact', sortField, sortDir, onSort, 100)}
            {th('Status')}
            {th('Date', 'createdAt', sortField, sortDir, onSort, 90)}
            {th('', undefined, undefined, undefined, undefined, 80)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const hovered = hoveredId === item.id;
            return (
              <tr
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hovered ? 'var(--bg-hover)' : 'transparent',
                  transition: 'background var(--transition)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {/* Company */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12 }}>
                    {item.companyName}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                    {item.customerName} · {item.salesRep}
                  </div>
                </td>
                {/* Pain Point */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top', maxWidth: 320 }}>
                  <div style={{
                    color: 'var(--text-primary)', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {item.painPoint}
                  </div>
                  {item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}
                </td>
                {/* Category */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <CategoryBadge category={item.category} />
                </td>
                {/* Stage */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <DealStageBadge stage={item.dealStage} />
                </td>
                {/* Urgency */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: 4, fontFamily: 'var(--font-mono)',
                    fontSize: 12, fontWeight: 700,
                    background: `${URGENCY_COLORS[item.urgency]}22`,
                    color: URGENCY_COLORS[item.urgency],
                    border: `1px solid ${URGENCY_COLORS[item.urgency]}44`,
                  }}>
                    {item.urgency}
                  </div>
                </td>
                {/* Revenue */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: item.revenueImpact >= 50000 ? 'var(--red)' : 'var(--text-primary)', fontWeight: 600 }}>
                    {formatCurrency(item.revenueImpact)}
                  </div>
                  {item.dealValue !== item.revenueImpact && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      Deal: {formatCurrency(item.dealValue)}
                    </div>
                  )}
                </td>
                {/* Status */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item, e.target.value as FeedbackStatus)}
                    style={{
                      fontSize: 10, padding: '3px 6px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer',
                      color: 'var(--text-secondary)', width: 'auto',
                    }}
                  >
                    {(['new','reviewed','in-progress','shipped','declined'] as FeedbackStatus[]).map(s => (
                      <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </td>
                {/* Date */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', gap: 4, opacity: hovered ? 1 : 0, transition: 'opacity var(--transition)' }}>
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, borderRadius: 4, display: 'flex' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => { if (window.confirm('Delete this feedback?')) onDelete(item.id); }}
                      title="Delete"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, borderRadius: 4, display: 'flex' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--red)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

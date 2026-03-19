import React, { useState } from 'react';
import { Plus, KanbanSquare, Link, DollarSign } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { CategoryBadge } from '@/components/shared/Badge';
import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureRequest, FeatureStatus, FeedbackCategory } from '@/types';
import { formatCurrency, CATEGORY_LABELS, EFFORT_LABELS } from '@/utils/formatters';

const COLUMNS: { id: FeatureStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'var(--text-muted)' },
  { id: 'planned', label: 'Planned', color: 'var(--blue)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--orange)' },
  { id: 'shipped', label: 'Shipped', color: 'var(--green)' },
  { id: 'declined', label: 'Declined', color: 'var(--text-muted)' },
];

const EMPTY_FEATURE: {
  title: string; description: string; category: FeedbackCategory;
  status: FeatureStatus; linkedFeedbackIds: string[];
  totalRevenueImpact: number; requestCount: number; priority: number;
  assignee: string; estimatedEffort: 'xs' | 's' | 'm' | 'l' | 'xl';
} = {
  title: '', description: '', category: 'integration' as FeedbackCategory,
  status: 'backlog' as FeatureStatus, linkedFeedbackIds: [],
  totalRevenueImpact: 0, requestCount: 1, priority: 50,
  assignee: '', estimatedEffort: 'm',
};

function FeatureCard({ feature, onStatusChange, onEdit, onDelete }: {
  feature: FeatureRequest;
  onStatusChange: (id: string, status: FeatureStatus) => void;
  onEdit: (f: FeatureRequest) => void;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-elevated)', border: `1px solid ${hovered ? 'var(--border-active)' : 'var(--border)'}`,
        borderRadius: 7, padding: '12px 14px', cursor: 'pointer',
        transition: 'all var(--transition)', marginBottom: 8,
      }}
      onClick={() => onEdit(feature)}
    >
      {/* Priority bar */}
      <div style={{ height: 2, background: 'var(--bg-overlay)', borderRadius: 1, marginBottom: 10 }}>
        <div style={{
          height: '100%', width: `${feature.priority}%`, borderRadius: 1,
          background: feature.priority >= 80 ? 'var(--red)' : feature.priority >= 60 ? 'var(--accent)' : 'var(--blue)',
        }} />
      </div>

      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4 }}>
        {feature.title}
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {feature.description}
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
        <CategoryBadge category={feature.category} />
        {feature.estimatedEffort && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {EFFORT_LABELS[feature.estimatedEffort]}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Link size={9} /> {feature.linkedFeedbackIds.length}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            <DollarSign size={9} /> {formatCurrency(feature.totalRevenueImpact)}
          </span>
        </div>
        <select
          value={feature.status}
          onChange={(e) => { e.stopPropagation(); onStatusChange(feature.id, e.target.value as FeatureStatus); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontSize: 9, padding: '2px 5px', background: 'var(--bg-overlay)', border: '1px solid var(--border)',
            borderRadius: 3, color: 'var(--text-secondary)', width: 'auto', cursor: 'pointer',
          }}
        >
          {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function NewFeatureForm({ onSubmit, onCancel, initial }: {
  onSubmit: (data: typeof EMPTY_FEATURE) => void;
  onCancel: () => void;
  initial?: Partial<typeof EMPTY_FEATURE>;
}) {
  const [form, setForm] = useState({ ...EMPTY_FEATURE, ...initial });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="form-group">
        <label>Feature Title</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Clear, action-oriented title" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What problem does this solve and how?" style={{ resize: 'vertical' }} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {(['integration','performance','ux','pricing','reporting','api','security','mobile','onboarding','other'] as FeedbackCategory[]).map(c => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Effort</label>
          <select value={form.estimatedEffort} onChange={e => set('estimatedEffort', e.target.value)}>
            <option value="xs">XS — Hours</option>
            <option value="s">S — Days</option>
            <option value="m">M — 1 Week</option>
            <option value="l">L — 2–4 Weeks</option>
            <option value="xl">XL — Months</option>
          </select>
        </div>
        <div className="form-group">
          <label>Assignee</label>
          <input value={form.assignee} onChange={e => set('assignee', e.target.value)} placeholder="Team or person" />
        </div>
        <div className="form-group">
          <label>Revenue Impact ($)</label>
          <input type="number" value={form.totalRevenueImpact} onChange={e => set('totalRevenueImpact', Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Priority Score (0–100)</label>
          <input type="number" min="0" max="100" value={form.priority} onChange={e => set('priority', Math.min(100, Math.max(0, Number(e.target.value))))} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => { if (form.title.trim()) onSubmit(form); }}>Save Feature</Button>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { features, createFeature, updateFeatureItem, deleteFeatureItem, updateStatus } = useFeatures();
  const [showAdd, setShowAdd] = useState(false);
  const [editFeature, setEditFeature] = useState<FeatureRequest | null>(null);

  const handleCreate = (data: typeof EMPTY_FEATURE) => {
    createFeature({ ...data, requestCount: 1 });
    setShowAdd(false);
  };

  const handleEditSave = (data: typeof EMPTY_FEATURE) => {
    if (!editFeature) return;
    updateFeatureItem({ ...editFeature, ...data });
    setEditFeature(null);
  };

  const totalRevenue = features.reduce((s, f) => s + f.totalRevenueImpact, 0);
  const shipped = features.filter(f => f.status === 'shipped').length;

  return (
    <div className="page-content">
      <TopBar
        title="Product Board"
        subtitle={`${features.length} features · ${formatCurrency(totalRevenue)} total impact · ${shipped} shipped`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={13} /> Add Feature
          </Button>
        }
      />
      <div className="page-scroll" style={{ padding: '0' }}>
        {features.length === 0 ? (
          <div style={{ padding: 24 }}>
            <EmptyState icon={<KanbanSquare size={40} />} title="No features yet" subtitle="Create features from feedback clusters to track product work" action={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus size={12} />Add Feature</Button>} />
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: 0, height: 'calc(100vh - var(--topbar-height) - var(--topbar-height))',
            overflowX: 'auto', padding: '16px 20px',
          }}>
            {COLUMNS.map((col) => {
              const colFeatures = features.filter(f => f.status === col.id).sort((a, b) => b.priority - a.priority);
              return (
                <div key={col.id} style={{
                  minWidth: 240, width: 260, marginRight: 12, flexShrink: 0,
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Column header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 10, padding: '0 2px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {col.label}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 10, padding: '1px 6px' }}>
                      {colFeatures.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {colFeatures.map(f => (
                      <FeatureCard
                        key={f.id}
                        feature={f}
                        onStatusChange={updateStatus}
                        onEdit={setEditFeature}
                        onDelete={deleteFeatureItem}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Feature Request" subtitle="Track a product work item linked to feedback signals" width={580}>
        <NewFeatureForm onSubmit={handleCreate} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editFeature} onClose={() => setEditFeature(null)} title="Edit Feature" width={580}>
        {editFeature && (
          <NewFeatureForm
            initial={editFeature}
            onSubmit={handleEditSave}
            onCancel={() => setEditFeature(null)}
          />
        )}
      </Modal>
    </div>
  );
}

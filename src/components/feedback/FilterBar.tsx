import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FeedbackFilters, FeedbackCategory, FeedbackStatus, DealStage, UrgencyLevel } from '@/types';

interface FilterBarProps {
  filters: FeedbackFilters;
  onChange: (filters: FeedbackFilters) => void;
  salesReps: string[];
  resultCount: number;
}

const sel = (label: string, value: string, onChange: (v: string) => void, opts: { value: string; label: string }[]) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ fontSize: 12, padding: '5px 8px', minWidth: 0, width: 'auto' }}
    aria-label={label}
  >
    {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

export default function FilterBar({ filters, onChange, salesReps, resultCount }: FilterBarProps) {
  const set = <K extends keyof FeedbackFilters>(key: K, value: FeedbackFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.status !== 'all' ||
    filters.urgency > 0 || filters.dealStage !== 'all' || filters.salesRep;

  const clearAll = () => onChange({
    search: '', category: 'all', status: 'all', urgency: 0, dealStage: 'all', salesRep: '',
  });

  return (
    <div style={{
      background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
        <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search pain points, companies, tags…"
          style={{ paddingLeft: 30, fontSize: 12 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-muted)' }}>
        <SlidersHorizontal size={12} />
      </div>

      {sel('Category', filters.category, (v) => set('category', v as FeedbackCategory | 'all'), [
        { value: 'all', label: 'All Categories' },
        ...['integration','performance','ux','pricing','reporting','api','security','mobile','onboarding','other'].map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
      ])}

      {sel('Status', filters.status, (v) => set('status', v as FeedbackStatus | 'all'), [
        { value: 'all', label: 'All Statuses' },
        { value: 'new', label: 'New' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'declined', label: 'Declined' },
      ])}

      {sel('Urgency', String(filters.urgency), (v) => set('urgency', Number(v) as UrgencyLevel | 0), [
        { value: '0', label: 'All Urgency' },
        { value: '5', label: 'U5 — Critical' },
        { value: '4', label: 'U4 — High' },
        { value: '3', label: 'U3 — Medium' },
        { value: '2', label: 'U2 — Low' },
        { value: '1', label: 'U1 — Very Low' },
      ])}

      {sel('Deal Stage', filters.dealStage, (v) => set('dealStage', v as DealStage | 'all'), [
        { value: 'all', label: 'All Stages' },
        { value: 'prospecting', label: 'Prospecting' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed-lost', label: 'Closed Lost' },
        { value: 'closed-won', label: 'Closed Won' },
      ])}

      {salesReps.length > 0 && sel('Sales Rep', filters.salesRep, (v) => set('salesRep', v), [
        { value: '', label: 'All Reps' },
        ...salesReps.map(r => ({ value: r, label: r })),
      ])}

      {/* Results count + clear */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
              color: 'var(--accent)', background: 'transparent', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

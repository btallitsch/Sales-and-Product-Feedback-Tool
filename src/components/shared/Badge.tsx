import React from 'react';
import { FeedbackStatus, FeedbackCategory, DealStage, UrgencyLevel, FeatureStatus } from '@/types';
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DEAL_STAGE_LABELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  FEATURE_STATUS_LABELS,
} from '@/utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
  size?: 'xs' | 'sm';
}

export function Badge({ children, color, bg, border, size = 'sm' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'xs' ? 9 : 10,
        fontWeight: 500,
        padding: size === 'xs' ? '1px 5px' : '2px 7px',
        borderRadius: 3,
        whiteSpace: 'nowrap',
        color: color ?? 'var(--text-secondary)',
        background: bg ?? 'var(--bg-overlay)',
        border: `1px solid ${border ?? 'var(--border)'}`,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  const configs: Record<FeedbackStatus, { color: string; bg: string; border: string }> = {
    new: { color: 'var(--cyan)', bg: 'var(--cyan-dim)', border: 'rgba(34,211,238,0.2)' },
    reviewed: { color: 'var(--blue)', bg: 'var(--blue-dim)', border: 'rgba(59,130,246,0.2)' },
    'in-progress': { color: 'var(--orange)', bg: 'var(--orange-dim)', border: 'rgba(249,115,22,0.2)' },
    shipped: { color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(16,185,129,0.2)' },
    declined: { color: 'var(--text-muted)', bg: 'var(--bg-overlay)', border: 'var(--border)' },
  };
  const c = configs[status];
  return <Badge color={c.color} bg={c.bg} border={c.border}>{STATUS_LABELS[status]}</Badge>;
}

export function FeatureStatusBadge({ status }: { status: FeatureStatus }) {
  const configs: Record<FeatureStatus, { color: string; bg: string; border: string }> = {
    backlog: { color: 'var(--text-muted)', bg: 'var(--bg-overlay)', border: 'var(--border)' },
    planned: { color: 'var(--blue)', bg: 'var(--blue-dim)', border: 'rgba(59,130,246,0.2)' },
    'in-progress': { color: 'var(--orange)', bg: 'var(--orange-dim)', border: 'rgba(249,115,22,0.2)' },
    shipped: { color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(16,185,129,0.2)' },
    declined: { color: 'var(--text-muted)', bg: 'var(--bg-overlay)', border: 'var(--border)' },
  };
  const c = configs[status];
  return <Badge color={c.color} bg={c.bg} border={c.border}>{FEATURE_STATUS_LABELS[status]}</Badge>;
}

export function CategoryBadge({ category }: { category: FeedbackCategory }) {
  const color = CATEGORY_COLORS[category];
  return (
    <Badge
      color={color}
      bg={`${color}18`}
      border={`${color}33`}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}

export function DealStageBadge({ stage }: { stage: DealStage }) {
  const configs: Partial<Record<DealStage, { color: string; bg: string }>> = {
    'closed-lost': { color: 'var(--red)', bg: 'var(--red-dim)' },
    'closed-won': { color: 'var(--green)', bg: 'var(--green-dim)' },
    negotiation: { color: 'var(--accent)', bg: 'var(--accent-dim)' },
  };
  const c = configs[stage] ?? { color: 'var(--text-secondary)', bg: 'var(--bg-overlay)' };
  return <Badge color={c.color} bg={c.bg}>{DEAL_STAGE_LABELS[stage]}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const color = URGENCY_COLORS[urgency];
  return (
    <Badge color={color} bg={`${color}18`} border={`${color}33`}>
      U{urgency} · {URGENCY_LABELS[urgency]}
    </Badge>
  );
}

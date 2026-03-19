import {
  FeedbackCategory,
  FeedbackStatus,
  DealStage,
  FrequencyLevel,
  UrgencyLevel,
  FeatureStatus,
} from '@/types';

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(iso);
}

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  integration: 'Integration',
  performance: 'Performance',
  ux: 'UX / Design',
  pricing: 'Pricing',
  reporting: 'Reporting',
  api: 'API',
  security: 'Security',
  mobile: 'Mobile',
  onboarding: 'Onboarding',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  integration: '#3B82F6',
  performance: '#F59E0B',
  ux: '#8B5CF6',
  pricing: '#EC4899',
  reporting: '#14B8A6',
  api: '#22D3EE',
  security: '#EF4444',
  mobile: '#10B981',
  onboarding: '#F97316',
  other: '#6B7280',
};

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: 'New',
  reviewed: 'Reviewed',
  'in-progress': 'In Progress',
  shipped: 'Shipped',
  declined: 'Declined',
};

export const FEATURE_STATUS_LABELS: Record<FeatureStatus, string> = {
  backlog: 'Backlog',
  planned: 'Planned',
  'in-progress': 'In Progress',
  shipped: 'Shipped',
  declined: 'Declined',
};

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  prospecting: 'Prospecting',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  'closed-lost': 'Closed Lost',
  'closed-won': 'Closed Won',
};

export const FREQUENCY_LABELS: Record<FrequencyLevel, string> = {
  'one-time': 'One-Time',
  occasional: 'Occasional',
  frequent: 'Frequent',
  critical: 'Critical Blocker',
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Critical',
};

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  1: '#6B7280',
  2: '#3B82F6',
  3: '#F59E0B',
  4: '#F97316',
  5: '#EF4444',
};

export const EFFORT_LABELS = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

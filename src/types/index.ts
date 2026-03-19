// ─── Enums & Union Types ─────────────────────────────────────────────────────

export type DealStage =
  | 'prospecting'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed-lost'
  | 'closed-won';

export type FeedbackCategory =
  | 'integration'
  | 'performance'
  | 'ux'
  | 'pricing'
  | 'reporting'
  | 'api'
  | 'security'
  | 'mobile'
  | 'onboarding'
  | 'other';

export type FrequencyLevel = 'one-time' | 'occasional' | 'frequent' | 'critical';

export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;

export type FeedbackStatus =
  | 'new'
  | 'reviewed'
  | 'in-progress'
  | 'shipped'
  | 'declined';

// ─── Core Data Models ─────────────────────────────────────────────────────────

export interface FeedbackItem {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string;

  // Sales context
  customerName: string;
  companyName: string;
  dealStage: DealStage;
  dealValue: number;
  salesRep: string;

  // Feedback specifics
  painPoint: string;
  category: FeedbackCategory;
  frequency: FrequencyLevel;
  urgency: UrgencyLevel;
  revenueImpact: number;

  // Enrichment
  tags: string[];
  status: FeedbackStatus;
  linkedFeatureId?: string;
  notes?: string;
}

export interface FeedbackFormData {
  customerName: string;
  companyName: string;
  dealStage: DealStage;
  dealValue: string;
  salesRep: string;
  painPoint: string;
  category: FeedbackCategory;
  frequency: FrequencyLevel;
  urgency: UrgencyLevel;
  revenueImpact: string;
  tags: string;
  notes: string;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export interface InsightCluster {
  id: string;
  category: FeedbackCategory;
  label: string;
  feedbackIds: string[];
  totalRevenueImpact: number;
  avgUrgency: number;
  dealCount: number;
  topTags: string[];
  statusBreakdown: Record<FeedbackStatus, number>;
}

// ─── Feature / Board ─────────────────────────────────────────────────────────

export type FeatureStatus = 'backlog' | 'planned' | 'in-progress' | 'shipped' | 'declined';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeatureStatus;
  linkedFeedbackIds: string[];
  totalRevenueImpact: number;
  requestCount: number;
  priority: number; // computed score
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  estimatedEffort?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalFeedback: number;
  totalRevenueAtRisk: number;
  avgUrgency: number;
  newThisWeek: number;
  closedLostRevenue: number;
  topCategory: FeedbackCategory;
  statusCounts: Record<FeedbackStatus, number>;
  categoryCounts: Record<FeedbackCategory, number>;
  urgencyDistribution: Record<UrgencyLevel, number>;
  weeklyTrend: { week: string; count: number; revenue: number }[];
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────

export interface FeedbackFilters {
  search: string;
  category: FeedbackCategory | 'all';
  status: FeedbackStatus | 'all';
  urgency: UrgencyLevel | 0;
  dealStage: DealStage | 'all';
  salesRep: string;
}

export type SortField = 'createdAt' | 'urgency' | 'revenueImpact' | 'dealValue';
export type SortDir = 'asc' | 'desc';

import { FeedbackItem, InsightCluster, DashboardMetrics, FeedbackCategory, FeedbackStatus, UrgencyLevel } from '@/types';

// ─── Clustering ────────────────────────────────────────────────────────────────

export function clusterFeedback(items: FeedbackItem[]): InsightCluster[] {
  const byCategory = new Map<FeedbackCategory, FeedbackItem[]>();

  for (const item of items) {
    const existing = byCategory.get(item.category) ?? [];
    byCategory.set(item.category, [...existing, item]);
  }

  const clusters: InsightCluster[] = [];

  for (const [category, feedbackItems] of byCategory.entries()) {
    if (feedbackItems.length === 0) continue;

    const totalRevenueImpact = feedbackItems.reduce((s, f) => s + f.revenueImpact, 0);
    const avgUrgency =
      feedbackItems.reduce((s, f) => s + f.urgency, 0) / feedbackItems.length;

    // Unique companies = deal count
    const dealCount = new Set(feedbackItems.map((f) => f.companyName)).size;

    // Top tags by frequency
    const tagFreq = new Map<string, number>();
    for (const f of feedbackItems) {
      for (const t of f.tags) {
        tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1);
      }
    }
    const topTags = [...tagFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);

    // Status breakdown
    const statusBreakdown = {
      new: 0,
      reviewed: 0,
      'in-progress': 0,
      shipped: 0,
      declined: 0,
    } as Record<FeedbackStatus, number>;
    for (const f of feedbackItems) {
      statusBreakdown[f.status]++;
    }

    clusters.push({
      id: `cluster-${category}`,
      category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      feedbackIds: feedbackItems.map((f) => f.id),
      totalRevenueImpact,
      avgUrgency,
      dealCount,
      topTags,
      statusBreakdown,
    });
  }

  // Sort by total revenue impact descending
  return clusters.sort((a, b) => b.totalRevenueImpact - a.totalRevenueImpact);
}

// ─── Dashboard Metrics ─────────────────────────────────────────────────────────

export function computeMetrics(items: FeedbackItem[]): DashboardMetrics {
  if (items.length === 0) {
    return {
      totalFeedback: 0,
      totalRevenueAtRisk: 0,
      avgUrgency: 0,
      newThisWeek: 0,
      closedLostRevenue: 0,
      topCategory: 'other',
      statusCounts: { new: 0, reviewed: 0, 'in-progress': 0, shipped: 0, declined: 0 },
      categoryCounts: {
        integration: 0, performance: 0, ux: 0, pricing: 0, reporting: 0,
        api: 0, security: 0, mobile: 0, onboarding: 0, other: 0,
      },
      urgencyDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      weeklyTrend: [],
    };
  }

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const totalRevenueAtRisk = items.reduce((s, f) => s + f.revenueImpact, 0);
  const avgUrgency = items.reduce((s, f) => s + f.urgency, 0) / items.length;
  const newThisWeek = items.filter((f) => now - new Date(f.createdAt).getTime() < oneWeek).length;
  const closedLostRevenue = items
    .filter((f) => f.dealStage === 'closed-lost')
    .reduce((s, f) => s + f.dealValue, 0);

  // Status counts
  const statusCounts = {
    new: 0, reviewed: 0, 'in-progress': 0, shipped: 0, declined: 0,
  } as Record<FeedbackStatus, number>;
  for (const f of items) statusCounts[f.status]++;

  // Category counts
  const categoryCounts = {
    integration: 0, performance: 0, ux: 0, pricing: 0, reporting: 0,
    api: 0, security: 0, mobile: 0, onboarding: 0, other: 0,
  } as Record<FeedbackCategory, number>;
  for (const f of items) categoryCounts[f.category]++;

  // Top category by count
  const topCategory = (Object.entries(categoryCounts) as [FeedbackCategory, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Urgency distribution
  const urgencyDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<UrgencyLevel, number>;
  for (const f of items) urgencyDistribution[f.urgency]++;

  // Weekly trend (last 6 weeks)
  const weeklyTrend: { week: string; count: number; revenue: number }[] = [];
  for (let w = 5; w >= 0; w--) {
    const start = new Date(now - (w + 1) * oneWeek);
    const end = new Date(now - w * oneWeek);
    const weekItems = items.filter((f) => {
      const d = new Date(f.createdAt);
      return d >= start && d < end;
    });
    const label = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeklyTrend.push({
      week: label,
      count: weekItems.length,
      revenue: weekItems.reduce((s, f) => s + f.revenueImpact, 0),
    });
  }

  return {
    totalFeedback: items.length,
    totalRevenueAtRisk,
    avgUrgency,
    newThisWeek,
    closedLostRevenue,
    topCategory,
    statusCounts,
    categoryCounts,
    urgencyDistribution,
    weeklyTrend,
  };
}

// ─── Priority Score ────────────────────────────────────────────────────────────

export function computePriorityScore(
  revenueImpact: number,
  urgency: UrgencyLevel,
  frequency: string,
  dealCount: number,
): number {
  const freqMultiplier = { 'one-time': 1, occasional: 1.5, frequent: 2, critical: 3 }[frequency] ?? 1;
  const base = (revenueImpact / 10_000) * urgency * freqMultiplier * Math.log(dealCount + 1);
  return Math.min(Math.round(base), 100);
}

// ─── Filter / Sort ─────────────────────────────────────────────────────────────

export function filterFeedback(
  items: FeedbackItem[],
  filters: {
    search: string;
    category: string;
    status: string;
    urgency: number;
    dealStage: string;
    salesRep: string;
  },
): FeedbackItem[] {
  return items.filter((f) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        f.painPoint.toLowerCase().includes(q) ||
        f.companyName.toLowerCase().includes(q) ||
        f.customerName.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.category !== 'all' && f.category !== filters.category) return false;
    if (filters.status !== 'all' && f.status !== filters.status) return false;
    if (filters.urgency > 0 && f.urgency !== filters.urgency) return false;
    if (filters.dealStage !== 'all' && f.dealStage !== filters.dealStage) return false;
    if (filters.salesRep && f.salesRep !== filters.salesRep) return false;
    return true;
  });
}

export function sortFeedback(
  items: FeedbackItem[],
  field: string,
  dir: 'asc' | 'desc',
): FeedbackItem[] {
  return [...items].sort((a, b) => {
    let av: number | string = 0;
    let bv: number | string = 0;
    if (field === 'createdAt') { av = a.createdAt; bv = b.createdAt; }
    else if (field === 'urgency') { av = a.urgency; bv = b.urgency; }
    else if (field === 'revenueImpact') { av = a.revenueImpact; bv = b.revenueImpact; }
    else if (field === 'dealValue') { av = a.dealValue; bv = b.dealValue; }
    if (typeof av === 'string') {
      return dir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    }
    return dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });
}

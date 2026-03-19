import React, { useMemo, useState } from 'react';
import { TrendingUp, Layers } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { StatusBadge, CategoryBadge } from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import { useFeedback } from '@/hooks/useFeedback';
import { clusterFeedback } from '@/utils/metrics';
import { formatCurrency, formatRelativeDate, CATEGORY_LABELS, CATEGORY_COLORS, URGENCY_COLORS } from '@/utils/formatters';
import { InsightCluster, FeedbackItem } from '@/types';

function ClusterCard({ cluster, feedbackItems }: { cluster: InsightCluster; feedbackItems: FeedbackItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[cluster.category];
  const progress = Math.round(
    ((cluster.statusBreakdown['in-progress'] + cluster.statusBreakdown.shipped) /
      Math.max(cluster.feedbackIds.length, 1)) * 100
  );

  return (
    <div style={{
      background: 'var(--bg-surface)', border: `1px solid var(--border)`,
      borderRadius: 10, overflow: 'hidden', transition: 'border-color var(--transition)',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}44`)}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: color, opacity: 0.8 }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <CategoryBadge category={cluster.category} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
              {formatCurrency(cluster.totalRevenueImpact)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Revenue at risk across {cluster.feedbackIds.length} items · {cluster.dealCount} companies
            </div>
          </div>
          <div style={{
            textAlign: 'right', fontFamily: 'var(--font-mono)',
            fontSize: 11, color: cluster.avgUrgency >= 4 ? 'var(--red)' : 'var(--accent)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{cluster.avgUrgency.toFixed(1)}</div>
            <div style={{ color: 'var(--text-muted)', marginTop: 1 }}>avg urgency</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Action Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: progress > 50 ? 'var(--green)' : 'var(--text-muted)' }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: 2, transition: 'width 600ms ease' }} />
          </div>
        </div>

        {/* Status chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {Object.entries(cluster.statusBreakdown).filter(([, v]) => v > 0).map(([status, count]) => (
            <StatusBadge key={status} status={status as any} />
          ))}
        </div>

        {/* Top tags */}
        {cluster.topTags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
            {cluster.topTags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontSize: 11, color: 'var(--text-muted)', background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0,
            transition: 'color var(--transition)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = color)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
        >
          {expanded ? '▲ Hide items' : `▼ Show ${feedbackItems.length} feedback items`}
        </button>
      </div>

      {/* Expanded feedback list */}
      {expanded && feedbackItems.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {feedbackItems.map((item, i) => (
            <div key={item.id} style={{
              padding: '12px 20px', borderBottom: i < feedbackItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 4 }}>
                  {item.painPoint}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {item.companyName} · {item.customerName} · {formatRelativeDate(item.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <StatusBadge status={item.status} />
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                  color: URGENCY_COLORS[item.urgency],
                }}>
                  U{item.urgency} · {formatCurrency(item.revenueImpact)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const { allFeedback } = useFeedback();
  const clusters = useMemo(() => clusterFeedback(allFeedback), [allFeedback]);

  const totalImpact = clusters.reduce((s, c) => s + c.totalRevenueImpact, 0);
  const totalItems = allFeedback.length;
  const uniqueCompanies = new Set(allFeedback.map(f => f.companyName)).size;

  if (clusters.length === 0) {
    return (
      <div className="page-content">
        <TopBar title="Insights" subtitle="Pattern clusters derived from captured feedback" />
        <div className="page-scroll">
          <EmptyState icon={<TrendingUp size={40} />} title="No insights yet" subtitle="Capture feedback to generate pattern clusters" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <TopBar title="Insights" subtitle={`${clusters.length} clusters from ${totalItems} items across ${uniqueCompanies} companies`} />
      <div className="page-scroll">

        {/* Summary banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(239,68,68,0.06) 100%)',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8,
          padding: '16px 20px', marginBottom: 20,
          display: 'flex', gap: 32, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Revenue at Risk</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginTop: 2 }}>
              {formatCurrency(totalImpact)}
            </div>
          </div>
          <div style={{ height: 40, width: 1, background: 'var(--border)' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Opportunity Clusters</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{clusters.length}</div>
          </div>
          <div style={{ height: 40, width: 1, background: 'var(--border)' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Companies Affected</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{uniqueCompanies}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', maxWidth: 220, textAlign: 'right', lineHeight: 1.5 }}>
            Clusters are auto-generated from feedback categories. Expand each to see individual items.
          </div>
        </div>

        {/* Grid of clusters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {clusters.map((cluster) => {
            const clusterFeedback = allFeedback.filter(f => cluster.feedbackIds.includes(f.id));
            return <ClusterCard key={cluster.id} cluster={cluster} feedbackItems={clusterFeedback} />;
          })}
        </div>
      </div>
    </div>
  );
}

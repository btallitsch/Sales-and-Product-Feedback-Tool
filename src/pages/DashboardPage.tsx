import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Layers, Calendar, Target } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MetricCard from '@/components/shared/MetricCard';
import { useFeedback } from '@/hooks/useFeedback';
import { computeMetrics, clusterFeedback } from '@/utils/metrics';
import { formatCurrency, CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS } from '@/utils/formatters';

const CHART_TOOLTIP_STYLE = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
  borderRadius: 6, fontSize: 11, color: 'var(--text-primary)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
};

export default function DashboardPage() {
  const { allFeedback } = useFeedback();
  const metrics = useMemo(() => computeMetrics(allFeedback), [allFeedback]);
  const clusters = useMemo(() => clusterFeedback(allFeedback), [allFeedback]);

  // Category bar chart data
  const categoryData = Object.entries(metrics.categoryCounts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      name: CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS],
      count: v,
      fill: CATEGORY_COLORS[k as keyof typeof CATEGORY_COLORS],
    }));

  // Status pie data
  const statusData = Object.entries(metrics.statusCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: STATUS_LABELS[k as keyof typeof STATUS_LABELS], value: v, key: k }));

  const STATUS_COLORS: Record<string, string> = {
    new: '#22D3EE', reviewed: '#3B82F6', 'in-progress': '#F97316', shipped: '#10B981', declined: '#6B7280',
  };

  // Urgency distribution
  const urgencyData = Object.entries(metrics.urgencyDistribution)
    .map(([k, v]) => ({ urgency: `U${k}`, count: v }));

  return (
    <div className="page-content">
      <TopBar title="Overview" subtitle="Revenue-linked signal intelligence across all customer feedback" />
      <div className="page-scroll">

        {/* KPI row */}
        <div className="metrics-grid">
          <MetricCard
            label="Total Feedback"
            value={String(metrics.totalFeedback)}
            sub={`${metrics.newThisWeek} new this week`}
            accent="var(--accent)"
            icon={<Layers size={16} />}
          />
          <MetricCard
            label="Revenue at Risk"
            value={formatCurrency(metrics.totalRevenueAtRisk)}
            sub="Cumulative impact across all items"
            accent="var(--red)"
            icon={<DollarSign size={16} />}
          />
          <MetricCard
            label="Closed-Lost Revenue"
            value={formatCurrency(metrics.closedLostRevenue)}
            sub="Deals lost linked to feedback"
            accent="var(--orange)"
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Avg Urgency"
            value={metrics.avgUrgency.toFixed(1)}
            sub={`/ 5.0 urgency score`}
            accent="var(--purple)"
            icon={<Target size={16} />}
          />
          <MetricCard
            label="Top Category"
            value={CATEGORY_LABELS[metrics.topCategory]}
            sub="Most requested area"
            accent={CATEGORY_COLORS[metrics.topCategory]}
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            label="New This Week"
            value={String(metrics.newThisWeek)}
            sub="Recently captured items"
            accent="var(--cyan)"
            icon={<Calendar size={16} />}
          />
        </div>

        {/* Charts row */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          {/* Feedback by Category */}
          <div className="card">
            <div className="section-header">
              <span className="section-title">Feedback by Category</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Breakdown */}
          <div className="card">
            <div className="section-header">
              <span className="section-title">Status Breakdown</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                    {statusData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.key] ?? '#6B7280'} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {statusData.map((entry) => (
                  <div key={entry.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[entry.key] }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly trend + Clusters */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          {/* Weekly volume */}
          <div className="card">
            <div className="section-header">
              <span className="section-title">Weekly Feedback Volume</span>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={metrics.weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} fill="url(#grad1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Urgency distribution */}
          <div className="card">
            <div className="section-header">
              <span className="section-title">Urgency Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={urgencyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="urgency" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {urgencyData.map((_, i) => (
                    <Cell key={i} fill={['#6B7280','#3B82F6','#F59E0B','#F97316','#EF4444'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Clusters table */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Opportunity Clusters by Revenue Impact</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Cluster', 'Items', 'Companies', 'Avg Urgency', 'Revenue at Risk', 'In Progress', 'Shipped'].map(h => (
                  <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clusters.map((cluster) => (
                <tr key={cluster.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[cluster.category], flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{CATEGORY_LABELS[cluster.category]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{cluster.feedbackIds.length}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{cluster.dealCount}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: cluster.avgUrgency >= 4 ? 'var(--red)' : cluster.avgUrgency >= 3 ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {cluster.avgUrgency.toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: cluster.totalRevenueImpact >= 100000 ? 'var(--red)' : 'var(--text-primary)' }}>
                    {formatCurrency(cluster.totalRevenueImpact)}
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>{cluster.statusBreakdown['in-progress']}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{cluster.statusBreakdown.shipped}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

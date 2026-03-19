import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ label, value, sub, accent, icon, trend }: MetricCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {accent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: accent,
            opacity: 0.8,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color: accent ?? 'var(--text-muted)', opacity: 0.7 }}>{icon}</span>
        )}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 24,
          fontWeight: 600,
          color: accent ?? 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color:
              trend === 'up'
                ? 'var(--green)'
                : trend === 'down'
                ? 'var(--red)'
                : 'var(--text-muted)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

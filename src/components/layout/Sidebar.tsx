import React from 'react';
import {
  LayoutDashboard,
  PlusSquare,
  Lightbulb,
  KanbanSquare,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react';
import { resetToSeedData } from '@/services/storage';

type Page = 'dashboard' | 'capture' | 'insights' | 'board';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  feedbackCount: number;
}

const NAV_ITEMS = [
  { id: 'dashboard' as Page, label: 'Overview', icon: LayoutDashboard },
  { id: 'capture' as Page, label: 'Capture', icon: PlusSquare },
  { id: 'insights' as Page, label: 'Insights', icon: Lightbulb },
  { id: 'board' as Page, label: 'Product Board', icon: KanbanSquare },
];

export default function Sidebar({ activePage, onNavigate, feedbackCount }: SidebarProps) {
  const handleReset = () => {
    if (window.confirm('Reset to seed data? This will overwrite all your changes.')) {
      resetToSeedData();
      window.location.reload();
    }
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '18px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              background: 'var(--accent)',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeftRight size={13} color="var(--text-inverted)" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              FeedbackBridge
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                marginTop: 2,
              }}
            >
              SALES ↔ PRODUCT
            </div>
          </div>
        </div>
      </div>

      {/* Feedback count pill */}
      <div style={{ padding: '12px 16px 8px' }}>
        <div
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Total Feedback
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
            }}
          >
            {feedbackCount.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 10px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: 'all var(--transition)',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              {item.label}
              {active && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            padding: '4px 0',
            transition: 'color var(--transition)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
        >
          <RotateCcw size={11} />
          Reset to demo data
        </button>
      </div>
    </aside>
  );
}

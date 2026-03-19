import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  children,
  style: extraStyle,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    borderRadius: 6,
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all var(--transition)',
    fontSize: size === 'sm' ? 12 : 13,
    padding: size === 'sm' ? '5px 10px' : '8px 14px',
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-inverted)',
      borderColor: 'var(--accent)',
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-active)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'var(--red-dim)',
      color: 'var(--red)',
      borderColor: 'rgba(239,68,68,0.2)',
    },
  };

  return (
    <button
      {...props}
      style={{ ...base, ...variants[variant], ...extraStyle }}
    >
      {children}
    </button>
  );
}

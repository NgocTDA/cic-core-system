import React from 'react';

// ─── StatusSummaryBar ─────────────────────────────────────────
// Row of colored summary badge-buttons shown above a data table,
// displaying record counts by status category. Clicking a badge
// filters the table to that category.
//
// Usage:
//   <StatusSummaryBar
//     items={[
//       { count: 18, label: 'Hồ sơ lỗi/xem xét',        color: 'error'   },
//       { count: 0,  label: 'Hồ sơ tất toán, đóng thẻ', color: 'info',   onClick: fn },
//       { count: 0,  label: 'Hồ sơ nghi ngờ sai lệnh',  color: 'warning' },
//     ]}
//   />

type SummaryColor = 'error' | 'warning' | 'info' | 'success';

const PALETTE: Record<SummaryColor, { bg: string; border: string; text: string }> = {
  error:   { bg: 'var(--error)',   border: 'var(--error-ink)',   text: '#fff' },
  warning: { bg: 'var(--warning)', border: 'var(--warning-ink)', text: '#fff' },
  info:    { bg: 'var(--info)',    border: 'var(--info-ink)',    text: '#fff' },
  success: { bg: 'var(--success)', border: 'var(--success-ink)', text: '#fff' },
};

export interface SummaryItem {
  count: number | string;
  label: string;
  color: SummaryColor;
  active?: boolean;
  onClick?: () => void;
}

interface StatusSummaryBarProps {
  items: SummaryItem[];
  align?: 'left' | 'right' | 'center';
  style?: React.CSSProperties;
}

const StatusSummaryBar: React.FC<StatusSummaryBarProps> = ({
  items,
  align = 'right',
  style,
}) => {
  const justifyMap = { left: 'flex-start', right: 'flex-end', center: 'center' };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
        justifyContent: justifyMap[align],
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const p = PALETTE[item.color];
        return (
          <button
            key={idx}
            onClick={item.onClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              height: 32,
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${p.border}`,
              backgroundColor: p.bg,
              color: p.text,
              cursor: item.onClick ? 'pointer' : 'default',
              fontSize: 14,
              lineHeight: '22px',
              fontFamily: 'inherit',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => {
              if (item.onClick) (e.currentTarget as HTMLElement).style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            <span style={{ fontWeight: 700 }}>{item.count}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusSummaryBar;

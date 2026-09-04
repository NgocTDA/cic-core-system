import React from 'react';
import { colors, radius, spacing, typography } from '../../design-system';

// ─── MetricSummaryBar ────────────────────────────────────────
// Băng hiển thị các chỉ số tổng hợp cốt lõi (Module, Menu, Job, v.v.)
// theo phong cách ReqHub Catalog Summary.
//
// Usage:
//   <MetricSummaryBar
//     items={[
//       { label: 'Tổng số Job', value: 48 },
//       { label: 'Đang hoạt động', value: 42, color: colors.success.dark },
//       { label: 'Tạm dừng', value: 6, color: colors.warning.dark },
//       { label: 'Kích hoạt gần nhất', value: 'Hôm nay' },
//     ]}
//   />

export interface MetricItem {
  label: string;
  value: number | string;
  subText?: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MetricSummaryBarProps {
  items: MetricItem[];
  columns?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const MetricSummaryBar: React.FC<MetricSummaryBarProps> = ({
  items,
  columns = 4,
  style,
  className,
}) => {
  return (
    <div
      className={`cic-metric-summary-bar ${className || ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        background: colors.bg.container,
        border: `1px solid ${colors.border.base}`,
        borderRadius: radius.md,
        marginBottom: spacing[4],
        overflow: 'hidden',
        boxShadow: 'none',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !!item.onClick;

        return (
          <div
            key={index}
            onClick={item.onClick}
            style={{
              padding: '14px 20px',
              borderRight: isLast ? 'none' : `1px solid ${colors.border.base}`,
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'background-color 150ms ease',
              backgroundColor: item.active ? colors.bg.subtle : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (isClickable) {
                e.currentTarget.style.backgroundColor = colors.bg.subtle;
              }
            }}
            onMouseLeave={(e) => {
              if (isClickable) {
                e.currentTarget.style.backgroundColor = item.active
                  ? colors.bg.subtle
                  : 'transparent';
              }
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.secondary,
                letterSpacing: '0.02em',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{item.label}</span>
              {item.subText && (
                <span style={{ fontSize: 11, color: colors.text.tertiary }}>
                  {item.subText}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: typography.fontWeight.bold,
                lineHeight: 1.2,
                color: item.color || colors.text.primary,
                letterSpacing: '-0.02em',
              }}
            >
              {item.value}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @media (max-width: 768px) {
          .cic-metric-summary-bar {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .cic-metric-summary-bar > div:nth-child(2) {
            border-right: none !important;
          }
          .cic-metric-summary-bar > div:nth-child(-n + 2) {
            border-bottom: 1px solid ${colors.border.base};
          }
        }
      `}</style>
    </div>
  );
};

export default MetricSummaryBar;

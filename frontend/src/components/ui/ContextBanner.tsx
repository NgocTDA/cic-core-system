import React from 'react';
import { Button } from 'antd';
import { colors, radius, spacing, typography } from '../../design-system';

// ─── ContextBanner ───────────────────────────────────────────
// Băng hiển thị ngữ cảnh không gian làm việc, dự án hoặc đơn vị
// báo cáo đang chọn. Nền xanh ngà dịu (#edf3ed), viền nhẹ (#d8e0dc).
//
// Usage:
//   <ContextBanner
//     label="Không gian vận hành"
//     value="CIC Core · Hệ thống Tác nghiệp Tập trung"
//     action={{ label: 'Làm mới phiên', onClick: handleRefresh }}
//     note="Quyền thực thi Job và lịch chạy được kiểm soát tự động theo phiên đăng nhập."
//   />

export interface ContextBannerAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

export interface ContextBannerProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  action?: ContextBannerAction;
  note?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({
  label,
  value,
  action,
  note,
  children,
  style,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        background: colors.bg.context,
        border: `1px solid ${colors.border.base}`,
        borderRadius: radius.md,
        padding: '14px 20px',
        marginBottom: spacing[4],
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {label && (
            <span
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.secondary,
              }}
            >
              {label}:
            </span>
          )}
          {value && (
            <span
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              {value}
            </span>
          )}
          {children}
        </div>

        {action && (
          <Button
            size="small"
            icon={action.icon}
            loading={action.loading}
            onClick={action.onClick}
            style={{
              borderColor: '#9fb3a9',
              background: '#ffffff',
              color: colors.text.primary,
              fontWeight: typography.fontWeight.medium,
              fontSize: typography.fontSize.sm,
              height: 28,
              borderRadius: radius.sm,
              padding: '0 12px',
            }}
          >
            {action.label}
          </Button>
        )}
      </div>

      {note && (
        <div
          style={{
            fontSize: typography.fontSize.xs,
            lineHeight: 1.5,
            color: colors.text.secondary,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

export default ContextBanner;

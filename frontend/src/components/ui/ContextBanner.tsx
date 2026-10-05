import React from 'react';
import { Button } from 'antd';

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
        background: 'var(--surface-sunken)',
        border: `1px solid var(--border)`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        marginBottom: 'var(--spacing-16)',
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
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-muted)',
              }}
            >
              {label}:
            </span>
          )}
          {value && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text)',
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
              color: 'var(--text)',
              fontWeight: 500,
              fontSize: '12px',
              height: 28,
              borderRadius: 'var(--radius-sm)',
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
            fontSize: '11px',
            lineHeight: 1.5,
            color: 'var(--text-muted)',
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

export default ContextBanner;

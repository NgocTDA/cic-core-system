import React from 'react';
import { Tag } from 'antd';
import { colors } from '@/design-system';

export type StatusRole = keyof typeof colors.statusTag;

// ─── STATUS_CONFIG ────────────────────────────────────────────
// Predefined color + label mapping for common status values
// across all modules. Extend as needed.

export const STATUS_CONFIG = {
  // Activation
  ACTIVE:    { role: 'active' as StatusRole,     color: 'success',    label: 'Hoạt động' },
  INACTIVE:  { role: 'neutral' as StatusRole,    color: 'default',    label: 'Ngừng hoạt động' },
  ARCHIVED:  { role: 'neutral' as StatusRole,    color: 'default',    label: 'Đã lưu trữ' },

  // Job execution
  RUNNING:   { role: 'processing' as StatusRole, color: 'processing', label: 'Đang chạy' },
  IDLE:      { role: 'neutral' as StatusRole,    color: 'default',    label: 'Chờ (Idle)' },
  SCHEDULED: { role: 'warning' as StatusRole,    color: 'warning',    label: 'Đã đặt lịch' },
  FAILED:    { role: 'error' as StatusRole,      color: 'error',      label: 'Lỗi' },
  PAUSED:    { role: 'warning' as StatusRole,    color: 'warning',    label: 'Tạm dừng' },

  // Approval workflow
  PENDING:   { role: 'warning' as StatusRole,    color: 'warning',    label: 'Chờ duyệt' },
  APPROVED:  { role: 'active' as StatusRole,     color: 'success',    label: 'Đã duyệt' },
  REJECTED:  { role: 'error' as StatusRole,      color: 'error',      label: 'Từ chối' },

  // Notification read-state
  UNREAD:    { role: 'error' as StatusRole,      color: 'error',      label: 'Chưa đọc' },
  READ:      { role: 'neutral' as StatusRole,    color: 'default',    label: 'Đã đọc' },

  // Data quality
  VALID:     { role: 'active' as StatusRole,     color: 'success',    label: 'Hợp lệ' },
  INVALID:   { role: 'error' as StatusRole,      color: 'error',      label: 'Không hợp lệ' },
  ERROR:     { role: 'error' as StatusRole,      color: 'error',      label: 'Hồ sơ lỗi' },
  REVIEWING: { role: 'warning' as StatusRole,    color: 'warning',    label: 'Đang xem xét' },
  CLOSED:    { role: 'neutral' as StatusRole,    color: 'default',    label: 'Đã đóng' },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;

interface StatusTagProps {
  status: StatusKey | string;
  label?: string;
  bordered?: boolean;
  minWidth?: number;
  style?: React.CSSProperties;
}

const StatusTag: React.FC<StatusTagProps> = ({
  status,
  label,
  bordered = false,
  minWidth,
  style,
}) => {
  const config = (STATUS_CONFIG as Record<string, { role: StatusRole; color: string; label: string }>)[status] ?? {
    role: 'neutral',
    color: 'default',
    label: status,
  };

  const palette = colors.statusTag[config.role] ?? colors.statusTag.neutral;

  return (
    <Tag
      bordered={bordered}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        borderColor: bordered ? palette.border : 'transparent',
        fontWeight: 600,
        fontSize: '12px',
        lineHeight: '20px',
        padding: '0 8px',
        borderRadius: '4px',
        ...(minWidth ? { minWidth, textAlign: 'center', margin: 0 } : {}),
        ...style,
      }}
    >
      {label ?? config.label}
    </Tag>
  );
};

export default StatusTag;

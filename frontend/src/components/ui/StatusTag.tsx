import React from 'react';
import { Tag } from 'antd';

export type StatusRole = 'active' | 'warning' | 'error' | 'processing' | 'neutral' | 'notice';

export const STATUS_PALETTES: Record<StatusRole, { bg: string; text: string; border: string }> = {
  active: {
    bg: 'var(--success-subtle, #eefae9)',
    text: 'var(--success-ink, #3a7401)',
    border: '#c3e4cc',
  },
  warning: {
    bg: 'var(--warning-subtle, #fef4e8)',
    text: 'var(--warning-ink, #976204)',
    border: '#f3d4a8',
  },
  error: {
    bg: 'var(--error-subtle, #fff2f0)',
    text: 'var(--error-ink, #c2181d)',
    border: '#f2bab0',
  },
  processing: {
    bg: 'var(--primary-subtle, #ecf9f3)',
    text: 'var(--primary-ink, #2c795b)',
    border: '#9dd5bb',
  },
  neutral: {
    bg: 'var(--surface-sunken, #edf7f2)',
    text: 'var(--text-muted, #4c5551)',
    border: '#d0dfd8',
  },
  notice: {
    bg: 'var(--accent-subtle, #f4f9dc)',
    text: 'var(--accent-ink, #606800)',
    border: '#e5c879',
  },
};

// ─── STATUS_CONFIG ────────────────────────────────────────────
// Predefined color + label mapping for common status values
// across all modules. Extend as needed.

export const STATUS_CONFIG = {
  ACTIVE:            { role: 'active' as StatusRole,     color: 'success',    label: 'Hoạt động' },
  INACTIVE:          { role: 'error' as StatusRole,      color: 'error',      label: 'Ngừng hoạt động' },
  'Ngừng hoạt động': { role: 'error' as StatusRole,      color: 'error',      label: 'Ngừng hoạt động' },
  'Không hoạt động': { role: 'error' as StatusRole,      color: 'error',      label: 'Ngừng hoạt động' },
  ARCHIVED:          { role: 'neutral' as StatusRole,    color: 'default',    label: 'Đã lưu trữ' },

  // Job execution
  SUCCESS:   { role: 'active' as StatusRole,     color: 'success',    label: 'Thành công' },
  FAILED:    { role: 'error' as StatusRole,      color: 'error',      label: 'Thất bại' },
  RUNNING:   { role: 'processing' as StatusRole, color: 'processing', label: 'Đang chạy' },
  IDLE:      { role: 'neutral' as StatusRole,    color: 'default',    label: 'Chờ (Idle)' },
  SCHEDULED: { role: 'warning' as StatusRole,    color: 'warning',    label: 'Đã đặt lịch' },
  PAUSED:    { role: 'warning' as StatusRole,    color: 'warning',    label: 'Tạm dừng' },
  CANCELLED: { role: 'neutral' as StatusRole,    color: 'default',    label: 'Đã hủy' },

  // Approval workflow
  DRAFT:     { role: 'neutral' as StatusRole,    color: 'default',    label: 'Tạo mới' },
  PENDING:   { role: 'warning' as StatusRole,    color: 'warning',    label: 'Chờ duyệt' },
  APPROVED:  { role: 'active' as StatusRole,     color: 'success',    label: 'Đã duyệt' },
  REJECTED:  { role: 'error' as StatusRole,      color: 'error',      label: 'Từ chối duyệt' },
  RECALLED:  { role: 'warning' as StatusRole,    color: 'warning',    label: 'Thu hồi' },

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

  const palette = STATUS_PALETTES[config.role] ?? STATUS_PALETTES.neutral;

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

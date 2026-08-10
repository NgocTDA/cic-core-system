import React from 'react';
import { Tag } from 'antd';

// ─── STATUS_CONFIG ────────────────────────────────────────────
// Predefined color + label mapping for common status values
// across all modules. Extend as needed.

export const STATUS_CONFIG = {
  // Activation
  ACTIVE:    { color: 'success',    label: 'Hoạt động' },
  INACTIVE:  { color: 'default',    label: 'Ngừng hoạt động' },
  ARCHIVED:  { color: 'default',    label: 'Đã lưu trữ' },

  // Job execution
  RUNNING:   { color: 'processing', label: 'Đang chạy' },
  IDLE:      { color: 'default',    label: 'Chờ (Idle)' },
  SCHEDULED: { color: 'warning',    label: 'Đã đặt lịch' },
  FAILED:    { color: 'error',      label: 'Lỗi' },
  PAUSED:    { color: 'warning',    label: 'Tạm dừng' },

  // Approval workflow
  PENDING:   { color: 'warning',    label: 'Chờ duyệt' },
  APPROVED:  { color: 'success',    label: 'Đã duyệt' },
  REJECTED:  { color: 'error',      label: 'Từ chối' },

  // Notification read-state
  UNREAD:    { color: 'error',      label: 'Chưa đọc' },
  READ:      { color: 'default',    label: 'Đã đọc' },

  // Data quality
  VALID:     { color: 'success',    label: 'Hợp lệ' },
  INVALID:   { color: 'error',      label: 'Không hợp lệ' },
  ERROR:     { color: 'error',      label: 'Hồ sơ lỗi' },
  REVIEWING: { color: 'warning',    label: 'Đang xem xét' },
  CLOSED:    { color: 'default',    label: 'Đã đóng' },
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
  const config = STATUS_CONFIG[status as StatusKey] ?? {
    color: 'default',
    label: status,
  };

  return (
    <Tag
      color={config.color}
      bordered={bordered}
      style={{
        ...(minWidth ? { minWidth, textAlign: 'center', margin: 0 } : {}),
        ...style,
      }}
    >
      {label ?? config.label}
    </Tag>
  );
};

export default StatusTag;

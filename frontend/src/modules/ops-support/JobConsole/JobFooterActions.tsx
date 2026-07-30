'use client';

import React from 'react';
import { Button, Space, App } from 'antd';
import { ThunderboltOutlined, SaveOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { colors, spacing, radius } from '@/design-system';
import type { JobConsoleStatus } from './types';

interface JobFooterActionsProps {
  status: JobConsoleStatus;
  onRunNow: () => void;
  onToggleStatus: () => void;
  onSave: () => void;
}

export const JobFooterActions: React.FC<JobFooterActionsProps> = ({
  status,
  onRunNow,
  onToggleStatus,
  onSave,
}) => {
  const { message } = App.useApp();
  const isActive = status === 'ACTIVE';

  const handleSaveClick = () => {
    onSave();
    message.success('Đã lưu cấu hình Job thành công!');
  };

  const handleRunNowClick = () => {
    onRunNow();
    message.success('Đã kích hoạt lượt chạy (Run Now)!');
  };

  return (
    <div
      style={{
        padding: `${spacing[3]}px ${spacing[6]}px`,
        backgroundColor: colors.bg.subtle,
        borderTop: `1px solid ${colors.border.split}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        type="primary"
        icon={<ThunderboltOutlined />}
        onClick={handleRunNowClick}
        style={{
          backgroundColor: colors.warning.dark,
          borderColor: colors.warning.dark,
          color: colors.neutral[0],
          fontWeight: 500,
        }}
      >
        Chạy ngay (Run Now)
      </Button>

      <Space size="middle">
        <Button
          onClick={onToggleStatus}
          icon={isActive ? <PauseOutlined /> : <PlayCircleOutlined />}
        >
          {isActive ? 'Tạm dừng Job' : 'Kích hoạt Job'}
        </Button>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveClick}
        >
          Lưu cấu hình
        </Button>
      </Space>
    </div>
  );
};

export default JobFooterActions;

'use client';

import React from 'react';
import { Table, Button, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { StatusTag, CodeText } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import type { IJobLogConsole } from './types';

const { Text } = Typography;

interface JobLogsTabProps {
  logs: IJobLogConsole[];
  onRefreshLogs?: () => void;
}

export const JobLogsTab: React.FC<JobLogsTabProps> = ({ logs, onRefreshLogs }) => {
  const columns: TableProps<IJobLogConsole>['columns'] = [
    {
      title: 'Thời gian chạy',
      dataIndex: 'time',
      key: 'time',
      width: 170,
      render: (v: string) => <Text strong style={{ fontFamily: typography.fontFamily.mono, fontSize: 12 }}>{v}</Text>,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (v: string) => <Text type="secondary" style={{ fontFamily: typography.fontFamily.mono, fontSize: 12 }}>{v}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s: string) => (
        <StatusTag status={s} />
      ),
    },
    {
      title: 'Node IP',
      dataIndex: 'node',
      key: 'node',
      width: 120,
      render: (v: string) => <CodeText>{v}</CodeText>,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (v: string) => <Text style={{ fontSize: typography.fontSize.sm }}>{v}</Text>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: typography.fontSize.sm }}>
          Lịch sử thực thi gần nhất ({logs.length} lượt)
        </Text>
        <Button type="link" size="small" icon={<ReloadOutlined />} onClick={onRefreshLogs}>
          Làm mới Log
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        size="small"
        pagination={false}
        bordered
        locale={{ emptyText: 'Chưa có nhật ký thực thi nào' }}
      />
    </div>
  );
};

export default JobLogsTab;

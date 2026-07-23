'use client';

import React from 'react';
import { Table, Progress, Typography } from 'antd';
import type { TableProps } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { StatusTag, ActionMenu, CodeText, tablePagination } from '@/components/ui';
import { colors, typography } from '@/design-system';
import { humanizeCron } from './cronLocale';
import type { IJobSimple } from './types';

const { Text } = Typography;

interface JobListProps {
  data: IJobSimple[];
  onView: (job: IJobSimple) => void;
  onEdit: (job: IJobSimple) => void;
  onDelete: (job: IJobSimple) => void;
  onToggleStatus: (job: IJobSimple) => void;
  onRunNow: (job: IJobSimple) => void;
  onStop: (job: IJobSimple) => void;
}

const JobList: React.FC<JobListProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onRunNow,
  onStop,
}) => {
  const columns: TableProps<IJobSimple>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: 'Mã job',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (code: string) => <CodeText>{code}</CodeText>,
    },
    {
      title: 'Tên job',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string) => <Text>{name}</Text>,
    },
    {
      title: 'Lịch chạy',
      dataIndex: 'cron',
      key: 'cron',
      width: 220,
      render: (_, job) => (
        <div>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, display: 'block' }} ellipsis>
            {humanizeCron(job.cron)}
          </Text>
          <CodeText muted style={{ fontSize: typography.fontSize.xs }}>{job.cron}</CodeText>
        </div>
      ),
    },
    {
      title: 'Tiến trình',
      key: 'progress',
      width: 220,
      render: (_, job) =>
        job.runStatus === 'RUNNING' ? (
          <div>
            <Progress percent={job.progress ?? 0} size="small" status="active" />
            {job.currentStep && (
              <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                {job.currentStep}
              </Text>
            )}
          </div>
        ) : (
          <StatusTag status={job.runStatus} />
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status: string) => <StatusTag status={status} minWidth={100} />,
    },
    {
      title: 'Lần chạy cuối',
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
      width: 170,
      render: (v?: string) => (
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{v ?? '—'}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, job) => {
        const running = job.runStatus === 'RUNNING';
        return (
          <ActionMenu
            items={[
              running
                ? { key: 'stop', label: 'Dừng chạy', icon: <StopOutlined />, onClick: () => onStop(job) }
                : { key: 'run', label: 'Chạy ngay', icon: <PlayCircleOutlined />, onClick: () => onRunNow(job) },
              {
                key: 'toggle',
                label: job.status === 'ACTIVE' ? 'Tắt (vô hiệu hóa)' : 'Bật (kích hoạt)',
                icon: job.status === 'ACTIVE' ? <PauseCircleOutlined /> : <CheckCircleOutlined />,
                onClick: () => onToggleStatus(job),
              },
              { type: 'divider' },
              { key: 'view', label: 'Xem chi tiết', icon: <EyeOutlined />, onClick: () => onView(job) },
              { key: 'edit', label: 'Chỉnh sửa', icon: <EditOutlined />, onClick: () => onEdit(job) },
              { type: 'divider' },
              { key: 'delete', label: 'Xóa', icon: <DeleteOutlined />, danger: true, onClick: () => onDelete(job) },
            ]}
          />
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      size="middle"
      pagination={tablePagination()}
      scroll={{ x: 1100, y: 'calc(100vh - 380px)' }}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default JobList;

'use client';

import React from 'react';
import { Drawer, Descriptions, Progress, Table, Button, Space, Divider, Typography, Statistic, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { StatusTag, CodeText } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import type { IJobSimple, IJobRunSimple } from './types';

const { Text } = Typography;

interface JobDetailDrawerProps {
  open: boolean;
  job: IJobSimple | null;
  runs: IJobRunSimple[];
  onClose: () => void;
  onRunNow: (job: IJobSimple) => void;
  onStop: (job: IJobSimple) => void;
}

const formatDuration = (ms?: number) => {
  if (!ms) return '—';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
};

const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  open,
  job,
  runs,
  onClose,
  onRunNow,
  onStop,
}) => {
  if (!job) return null;

  const running = job.runStatus === 'RUNNING';

  const runColumns: TableProps<IJobRunSimple>['columns'] = [
    { title: 'Bắt đầu', dataIndex: 'startTime', key: 'startTime', width: 150 },
    {
      title: 'Kết quả',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s: string) => <StatusTag status={s} />,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (v?: number) => formatDuration(v),
    },
    { title: 'Kích hoạt bởi', dataIndex: 'triggeredBy', key: 'triggeredBy', width: 120 },
    {
      title: 'Ghi chú',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      ellipsis: true,
      render: (v?: string) =>
        v ? <Text style={{ color: colors.error.base, fontSize: typography.fontSize.sm }}>{v}</Text> : '—',
    },
  ];

  return (
    <Drawer
      title="Chi tiết job"
      placement="right"
      width={640}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          {running ? (
            <Button danger icon={<StopOutlined />} onClick={() => onStop(job)}>
              Dừng chạy
            </Button>
          ) : (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => onRunNow(job)}>
              Chạy ngay
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Mã job">
          <CodeText>{job.code}</CodeText>
        </Descriptions.Item>
        <Descriptions.Item label="Tên job">{job.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{job.description ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Lịch chạy">{job.scheduleText}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <StatusTag status={job.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái chạy">
          <StatusTag status={job.runStatus} />
        </Descriptions.Item>
        <Descriptions.Item label="Lần chạy cuối">{job.lastRunTime ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Lần chạy kế tiếp">{job.nextRunTime ?? '—'}</Descriptions.Item>
      </Descriptions>

      {running && (
        <div style={{ marginTop: spacing[4] }}>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
            Tiến trình hiện tại
          </Text>
          <Progress percent={job.progress ?? 0} status="active" />
          {job.currentStep && (
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              {job.currentStep}
            </Text>
          )}
        </div>
      )}

      <Divider orientation="left" style={{ marginTop: spacing[5] }}>
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Thống kê</Text>
      </Divider>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Tỷ lệ thành công" value={job.successRate} suffix="%" valueStyle={{ color: colors.success.base }} />
        </Col>
        <Col span={6}>
          <Statistic title="Số lần thành công" value={job.successCount} />
        </Col>
        <Col span={6}>
          <Statistic title="Số lần lỗi" value={job.failureCount} valueStyle={{ color: colors.error.base }} />
        </Col>
        <Col span={6}>
          <Statistic title="Thời lượng TB" value={formatDuration(job.avgDuration)} />
        </Col>
      </Row>

      <Divider orientation="left" style={{ marginTop: spacing[5] }}>
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
          Lịch sử chạy gần đây
        </Text>
      </Divider>
      <Table
        columns={runColumns}
        dataSource={runs}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ y: 240 }}
        locale={{ emptyText: 'Chưa có lịch sử chạy' }}
      />
    </Drawer>
  );
};

export default JobDetailDrawer;

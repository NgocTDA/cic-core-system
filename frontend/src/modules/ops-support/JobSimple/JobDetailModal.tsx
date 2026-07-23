'use client';

import React from 'react';
import { Modal, Descriptions, Progress, Table, Button, Space, Divider, Typography, Statistic, Row, Col, Collapse, Tag } from 'antd';
import type { TableProps } from 'antd';
import { PlayCircleOutlined, StopOutlined, HistoryOutlined } from '@ant-design/icons';
import { StatusTag, CodeText, STATUS_CONFIG } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import { humanizeCron, TIMEZONE_OPTIONS } from './cronLocale';
import type { IJobSimple, IJobRunSimple, IJobChangeLog } from './types';

const { Text } = Typography;

const BTN_MIN_WIDTH = 120;

interface JobDetailModalProps {
  open: boolean;
  job: IJobSimple | null;
  runs: IJobRunSimple[];
  changeLogs: IJobChangeLog[];
  onClose: () => void;
  onRunNow: (job: IJobSimple) => void;
  onStop: (job: IJobSimple) => void;
}

// Hiển thị giá trị cũ/mới: dùng StatusTag nếu là trạng thái đã biết
const renderChangeValue = (v?: string) => {
  if (!v) return '—';
  return v in STATUS_CONFIG ? <StatusTag status={v} /> : <Text style={{ fontSize: typography.fontSize.sm }}>{v}</Text>;
};

const formatDuration = (ms?: number) => {
  if (!ms) return '—';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
};

const tzLabel = (tz?: string) => TIMEZONE_OPTIONS.find((t) => t.value === tz)?.label ?? tz ?? '—';

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  open,
  job,
  runs,
  changeLogs,
  onClose,
  onRunNow,
  onStop,
}) => {
  if (!job) return null;

  const running = job.runStatus === 'RUNNING';

  const changeColumns: TableProps<IJobChangeLog>['columns'] = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time', width: 150 },
    { title: 'Người thực hiện', dataIndex: 'user', key: 'user', width: 130 },
    { title: 'Hành động', dataIndex: 'action', key: 'action', width: 120 },
    { title: 'Trường', dataIndex: 'field', key: 'field', width: 110, render: (v?: string) => v ?? '—' },
    { title: 'Giá trị cũ', dataIndex: 'oldValue', key: 'oldValue', width: 120, render: renderChangeValue },
    { title: 'Giá trị mới', dataIndex: 'newValue', key: 'newValue', width: 120, render: renderChangeValue },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true, render: (v?: string) => v ?? '—' },
  ];

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
    <Modal
      title="Chi tiết job"
      open={open}
      onCancel={onClose}
      width={720}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3] }}>
          {running ? (
            <Button danger icon={<StopOutlined />} onClick={() => onStop(job)} style={{ minWidth: BTN_MIN_WIDTH }}>
              Dừng chạy
            </Button>
          ) : (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => onRunNow(job)} style={{ minWidth: BTN_MIN_WIDTH }}>
              Chạy ngay
            </Button>
          )}
          <Button onClick={onClose} style={{ minWidth: BTN_MIN_WIDTH }}>
            Đóng
          </Button>
        </div>
      }
    >
      <Descriptions column={1} size="small" bordered style={{ marginTop: spacing[2] }}>
        <Descriptions.Item label="Mã job">
          <CodeText>{job.code}</CodeText>
        </Descriptions.Item>
        <Descriptions.Item label="Tên job">{job.name}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{job.description ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Lịch chạy">
          <Space size="small" wrap>
            <Text>{humanizeCron(job.cron)}</Text>
            <CodeText muted>{job.cron}</CodeText>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Múi giờ">{tzLabel(job.timezone)}</Descriptions.Item>
        <Descriptions.Item label="Số lần thử lại khi thất bại">{job.maxRetries} lần</Descriptions.Item>
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

      {/* Lịch sử thay đổi (audit) — mặc định thu gọn, theo chuẩn màn chi tiết */}
      <Collapse
        style={{ marginTop: spacing[5] }}
        items={[
          {
            key: 'change-log',
            label: (
              <Space size="small">
                <HistoryOutlined style={{ color: colors.text.secondary }} />
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Lịch sử thay đổi
                </Text>
                <Tag style={{ fontSize: typography.fontSize.xs }}>{changeLogs.length}</Tag>
              </Space>
            ),
            children: (
              <Table
                columns={changeColumns}
                dataSource={changeLogs}
                rowKey="id"
                size="small"
                pagination={false}
                scroll={{ x: 760, y: 250 }}
                locale={{ emptyText: 'Chưa có lịch sử thay đổi' }}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default JobDetailModal;

'use client';

import React from 'react';
import { Modal, Descriptions, Progress, Table, Button, Space, Divider, Typography, Statistic, Row, Col, Collapse, Tag, Badge } from 'antd';
import type { TableProps } from 'antd';
import { PlayCircleOutlined, StopOutlined, HistoryOutlined, BellOutlined, CodeOutlined, SlidersOutlined } from '@ant-design/icons';
import { StatusTag, CodeText, STATUS_CONFIG } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import { humanizeCron, TIMEZONE_OPTIONS } from './cronLocale';
import type { IJobSimple, IJobRunSimple, IJobChangeLog, NotificationChannel } from './types';

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

const formatJobTypeLabel = (type?: string) => {
  switch (type) {
    case 'SPRING_BEAN':
      return 'Java Bean (Spring Component)';
    case 'REST_API':
      return 'REST API Endpoint';
    case 'SQL_SCRIPT':
      return 'SQL Stored Procedure / Script';
    default:
      return type ?? '—';
  }
};

const formatChannelTag = (channel: NotificationChannel) => {
  switch (channel) {
    case 'SMS':
      return <Tag color="orange" key="SMS">SMS</Tag>;
    case 'PUSH':
      return <Tag color="blue" key="PUSH">Push (Web)</Tag>;
    case 'EMAIL':
      return <Tag color="green" key="EMAIL">Email</Tag>;
    default:
      return <Tag key={channel}>{channel}</Tag>;
  }
};

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
    {
      title: 'Node IP',
      dataIndex: 'nodeIp',
      key: 'nodeIp',
      width: 110,
      render: (ip?: string) => (ip ? <CodeText>{ip}</CodeText> : '—'),
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

  const notifyEventsSummary = [
    { key: 'onStart', label: 'Bắt đầu Job', config: job.notificationSettings?.events?.onStart },
    { key: 'onSuccess', label: 'Kết thúc (Thành công)', config: job.notificationSettings?.events?.onSuccess },
    { key: 'onFailure', label: 'Job gặp Lỗi', config: job.notificationSettings?.events?.onFailure },
    { key: 'onFinalFailure', label: 'Thất bại hoàn toàn', config: job.notificationSettings?.events?.onFinalFailure },
  ];

  return (
    <Modal
      title="Chi tiết job"
      open={open}
      onCancel={onClose}
      width={780}
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
      <Descriptions column={2} size="small" bordered style={{ marginTop: spacing[2] }}>
        <Descriptions.Item label="Mã job" span={1}>
          <CodeText>{job.code}</CodeText>
        </Descriptions.Item>
        <Descriptions.Item label="Loại xử lý" span={1}>
          <Tag color="purple">{formatJobTypeLabel(job.jobType)}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Tên job" span={2}>
          <Text strong>{job.name}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Mô tả" span={2}>
          {job.description ?? '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Đích thực thi" span={2}>
          <CodeText>{job.targetComponent ?? '—'}</CodeText>
        </Descriptions.Item>

        {job.jobParamsYaml && (
          <Descriptions.Item label="Tham số YAML Payload" span={2}>
            <pre style={{ margin: 0, padding: spacing[2], backgroundColor: '#1e293b', color: '#38bdf8', borderRadius: 6, fontSize: typography.fontSize.xs, fontFamily: 'monospace' }}>
              {job.jobParamsYaml}
            </pre>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Lịch chạy" span={1}>
          <Space size="small" direction="vertical">
            <Text>{humanizeCron(job.cron)}</Text>
            <CodeText muted>{job.cron}</CodeText>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Múi giờ" span={1}>
          {tzLabel(job.timezone)}
        </Descriptions.Item>

        <Descriptions.Item label="Chính sách Misfire" span={1}>
          {job.misfirePolicy === 'FIRE_NOW' ? 'Fire Now (Chạy bù ngay)' : 'Do Nothing (Bỏ qua)'}
        </Descriptions.Item>
        <Descriptions.Item label="Timeout tối đa" span={1}>
          {job.timeoutSeconds ? `${job.timeoutSeconds} giây` : '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Chống chạy song song" span={1}>
          {job.disallowConcurrent ? <Badge status="success" text="Đã kích hoạt" /> : <Badge status="default" text="Tắt" />}
        </Descriptions.Item>
        <Descriptions.Item label="Thử lại khi thất bại" span={1}>
          {job.maxRetries} lần (Khoảng chờ: {job.retryInterval ?? 30}s, {job.backoffStrategy === 'EXPONENTIAL' ? `Exponential ${job.backoffMultiplier ?? 2}x` : 'Cố định'})
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái" span={1}>
          <StatusTag status={job.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái chạy" span={1}>
          <StatusTag status={job.runStatus} />
        </Descriptions.Item>

        <Descriptions.Item label="Lần chạy cuối" span={1}>
          {job.lastRunTime ?? '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Lần chạy kế tiếp" span={1}>
          {job.nextRunTime ?? '—'}
        </Descriptions.Item>
      </Descriptions>

      {/* Cấu hình Thông báo Tóm tắt */}
      <Divider orientation="left" style={{ marginTop: spacing[4] }}>
        <Space>
          <BellOutlined style={{ color: colors.text.secondary }} />
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Cấu hình Cảnh báo & Thông báo</Text>
        </Space>
      </Divider>
      
      {job.notificationSettings?.enableNotify ? (
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Email nhận tin">
            {job.notificationSettings.notifyEmails || '—'}
          </Descriptions.Item>
          <Descriptions.Item label="SĐT nhận SMS">
            {job.notificationSettings.notifyPhoneNumbers || '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Kênh thông báo theo Sự kiện">
            <Space direction="vertical" style={{ width: '100%' }}>
              {notifyEventsSummary.map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: typography.fontSize.xs }}>{item.label}:</Text>
                  <div>
                    {item.config?.enabled && item.config.channels.length > 0 ? (
                      item.config.channels.map((ch) => formatChannelTag(ch))
                    ) : (
                      <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>Tắt</Text>
                    )}
                  </div>
                </div>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
          Cảnh báo sự cố chưa được bật cho Job này.
        </Text>
      )}

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

      {/* Lịch sử thay đổi (audit) */}
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


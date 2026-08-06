import React from 'react';
import { Card, Descriptions, Tag, Table, Typography, Space } from 'antd';
import {
  CodeOutlined,
  CalendarOutlined,
  SyncOutlined,
  BellOutlined,
  MessageOutlined,
  DesktopOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { colors, typography, radius } from '@/design-system';
import type { IJob } from '../types';

const { Text } = Typography;

interface ConfigTabProps {
  job: IJob;
}

const ConfigTab: React.FC<ConfigTabProps> = ({ job }) => {
  const categoryMap: Record<string, string> = {
    DATA_SYNC: 'Đồng bộ dữ liệu (DATA_SYNC)',
    REPORT: 'Sinh báo cáo thống kê (REPORT)',
    CLEANUP: 'Dọn dẹp & Lưu trữ dữ liệu (CLEANUP)',
    VALIDATION: 'Kiểm tra & Đối soát dữ liệu (VALIDATION)',
    BATCH: 'Xử lý lô / Batch (BATCH)',
    SPRING_BEAN: 'Java Spring Component (SPRING_BEAN)',
    REST_API: 'REST API Endpoint (REST_API)',
    SQL_SCRIPT: 'SQL Stored Procedure (SQL_SCRIPT)',
  };

  const misfireMap: Record<string, string> = {
    FIRE_NOW: 'Chạy bù ngay khi đủ điều kiện',
    DO_NOTHING: 'Bỏ qua lượt lỗi, chờ lịch tiếp theo',
  };

  const backoffMap: Record<string, string> = {
    FIXED: 'Cố định',
    EXPONENTIAL_2X: 'Cấp số nhân - 2x',
    EXPONENTIAL_3X: 'Cấp số nhân - 3x',
    EXPONENTIAL_5X: 'Cấp số nhân - 5x',
  };

  const triggerTypeMap: Record<string, string> = {
    SCHEDULER: 'Bộ lập lịch (Scheduler)',
    EVENT: 'Theo sự kiện (Event-driven)',
    MANUAL: 'Thủ công (Manual)',
  };

  const schedulerTypeMap: Record<string, string> = {
    CRON_EXPRESSION: 'Biểu thức Cron',
    TIME_PICKER: 'Chọn thời gian chi tiết',
  };

  const notificationColumns = [
    {
      title: 'Sự kiện kích hoạt',
      dataIndex: 'eventLabel',
      key: 'eventLabel',
      width: 180,
      render: (text: string) => <Text strong style={{ fontSize: typography.fontSize.sm }}>{text}</Text>,
    },
    {
      title: (
        <Space size={4}>
          <MessageOutlined style={{ color: colors.subsystem.kkn }} />
          <span>SMS</span>
        </Space>
      ),
      dataIndex: 'sms',
      key: 'sms',
      width: 90,
      align: 'center' as const,
      render: (val: boolean) => <Tag color={val ? 'green' : 'default'}>{val ? 'Bật' : 'Tắt'}</Tag>,
    },
    {
      title: (
        <Space size={4}>
          <DesktopOutlined style={{ color: colors.primary[500] }} />
          <span>Push (Web)</span>
        </Space>
      ),
      dataIndex: 'push',
      key: 'push',
      width: 110,
      align: 'center' as const,
      render: (val: boolean) => <Tag color={val ? 'blue' : 'default'}>{val ? 'Bật' : 'Tắt'}</Tag>,
    },
    {
      title: (
        <Space size={4}>
          <MailOutlined style={{ color: colors.success.base }} />
          <span>Email</span>
        </Space>
      ),
      dataIndex: 'email',
      key: 'email',
      width: 90,
      align: 'center' as const,
      render: (val: boolean) => <Tag color={val ? 'green' : 'default'}>{val ? 'Bật' : 'Tắt'}</Tag>,
    },
    {
      title: (
        <Space size={4}>
          <UserOutlined style={{ color: colors.primary[600] }} />
          <span>Người dùng / Email nhận riêng</span>
        </Space>
      ),
      dataIndex: 'customRecipients',
      key: 'customRecipients',
      render: (recipients: string[]) =>
        recipients && recipients.length > 0 ? (
          <Space wrap size={[4, 4]}>
            {recipients.map((item) => (
              <Tag key={item} color="blue">{item}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>Chưa cấu hình</Text>
        ),
    },
  ];

  const matrix = job.notificationMatrix || {
    onStart: { sms: false, push: false, email: true, customRecipients: [] },
    onSuccess: { sms: false, push: false, email: true, customRecipients: [] },
    onFailure: { sms: true, push: true, email: true, customRecipients: ['alert_group@cic.org.vn'] },
    onRetry: { sms: false, push: true, email: false, customRecipients: [] },
  };

  const notificationData = [
    { key: 'onStart', eventLabel: 'Khi bắt đầu chạy Job', ...matrix.onStart },
    { key: 'onSuccess', eventLabel: 'Khi hoàn tất thành công', ...matrix.onSuccess },
    { key: 'onFailure', eventLabel: 'Khi gặp sự cố / Thất bại', ...matrix.onFailure },
    { key: 'onRetry', eventLabel: 'Khi thử lại (Retry)', ...matrix.onRetry },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
      {/* KHỐI 1: Thông tin chung */}
      <Card title={<Space><CodeOutlined style={{ color: colors.primary[500] }} /><span>Thông tin chung</span></Space>}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Mã Job">
            <Text code strong>{job.code}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tên Job">{job.name}</Descriptions.Item>
          <Descriptions.Item label="Loại Job">
            <Tag color="blue">{categoryMap[job.category] || job.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Chủ sở hữu">{job.owner || 'admin_01'}</Descriptions.Item>
          <Descriptions.Item label="Mô tả Job" span={2}>
            {job.description || 'Không có mô tả'}
          </Descriptions.Item>
          <Descriptions.Item label="Tham số bổ sung (YAML/JSON)" span={2}>
            <pre style={{
              background: '#f8fafc',
              color: '#0f172a',
              border: `1px solid ${colors.border.base}`,
              padding: '12px',
              borderRadius: radius.md,
              fontFamily: typography.fontFamily.mono,
              margin: 0,
              maxHeight: '180px',
              overflowY: 'auto'
            }}>
              {job.params || '# Không có tham số động'}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* KHỐI 2: Cấu hình lập lịch và điều phối */}
      <Card title={<Space><CalendarOutlined style={{ color: colors.primary[500] }} /><span>Lập lịch và xử lý lỗi</span></Space>}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Điều kiện kích hoạt">
            <Tag color="cyan">{triggerTypeMap[job.triggerType || 'SCHEDULER'] || 'Bộ lập lịch (Scheduler)'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức đặt lịch">
            <Tag color="purple">{schedulerTypeMap[job.schedulerType || 'CRON_EXPRESSION'] || 'Biểu thức Cron'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Biểu thức Cron / Cấu hình thời gian" span={2}>
            <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontFamily: typography.fontFamily.mono, fontWeight: 'bold' }}>
              {job.cron || job.schedule?.expression || '0 0 1 * * *'}
            </code>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian chờ tối đa">
            {job.timeout} giây
          </Descriptions.Item>
          <Descriptions.Item label="Xử lý khi bỏ lỡ lượt chạy">
            {misfireMap[job.misfire || 'FIRE_NOW']}
          </Descriptions.Item>
          <Descriptions.Item label="Cho phép chạy song song" span={2}>
            <Tag color={job.concurrent ? 'red' : 'green'}>
              {job.concurrent ? 'Khóa chạy song song' : 'Cho phép chạy song song'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* KHỐI 3: Chính sách xử lý khi lỗi */}
      <Card title={<Space><SyncOutlined style={{ color: colors.primary[500] }} /><span>Khối Chính sách xử lý khi lỗi</span></Space>}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Số lần thử lại tối đa">
            {job.maxRetries ?? job.retryPolicy?.maxRetries ?? 3} lần
          </Descriptions.Item>
          <Descriptions.Item label="Khoảng chờ ban đầu">
            {job.retryInterval ?? 60} giây
          </Descriptions.Item>
          <Descriptions.Item label="Giãn cách thời gian (Backoff)" span={2}>
            <Tag color="orange">{backoffMap[job.backoff || 'EXPONENTIAL_2X'] || 'Cấp số nhân - 2x'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* KHỐI 4: Thiết lập Cảnh báo Sự cố */}
      <Card title={<Space><BellOutlined style={{ color: colors.primary[500] }} /><span>Thiết lập cảnh báo sự cố</span></Space>}>
        <Descriptions column={1} bordered style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Email nhận cảnh báo chung">
            {job.notifyEmails || 'admin@cic.org.vn, alert@cic.org.vn'}
          </Descriptions.Item>
        </Descriptions>

        <Text strong style={{ fontSize: typography.fontSize.sm, display: 'block', marginBottom: 12 }}>
          Cấu hình thông báo
        </Text>

        <Table
          columns={notificationColumns}
          dataSource={notificationData}
          pagination={false}
          size="small"
          bordered
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default ConfigTab;

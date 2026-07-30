'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Row, Col, InputNumber, Checkbox, Switch, Typography, Table, Space } from 'antd';
import {
  CodeOutlined,
  CalendarOutlined,
  SyncOutlined,
  BellOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { colors, spacing, typography, radius } from '@/design-system';
import type { IJobConsoleItem, JobConsoleType, BackoffStrategyConsole, BackoffMultiplierConsole } from './types';

const { Text } = Typography;

interface JobConfigTabProps {
  job: IJobConsoleItem;
  onChange: (patch: Partial<IJobConsoleItem>) => void;
}

export const JobConfigTab: React.FC<JobConfigTabProps> = ({ job, onChange }) => {
  const [form] = Form.useForm<IJobConsoleItem>();

  useEffect(() => {
    form.setFieldsValue(job);
  }, [job, form]);

  const handleValuesChange = (_: any, allValues: Partial<IJobConsoleItem>) => {
    if (allValues.type && allValues.type !== job.type) {
      let label = 'Spring Bean & Method Target';
      if (allValues.type === 'REST_API') label = 'REST API Endpoint URL';
      else if (allValues.type === 'SQL_SCRIPT') label = 'Stored Procedure / SQL Command';
      onChange({ ...allValues, targetLabel: label });
    } else {
      onChange(allValues);
    }
  };

  const currentJobType = Form.useWatch('type', form) || job.type;
  const currentBackoff = Form.useWatch('backoff', form) || job.backoff;
  const enableNotify = Form.useWatch('enableNotify', form) ?? job.enableNotify;

  const getTargetLabelText = (type: JobConsoleType) => {
    switch (type) {
      case 'SPRING_BEAN':
        return 'Spring Bean & Method Target';
      case 'REST_API':
        return 'REST API Endpoint URL';
      case 'SQL_SCRIPT':
        return 'Stored Procedure / SQL Command';
      default:
        return 'Đích thực thi';
    }
  };

  const getTargetPlaceholder = (type: JobConsoleType) => {
    switch (type) {
      case 'SPRING_BEAN':
        return 'exchangeRateSyncService.syncDailyRates';
      case 'REST_API':
        return 'https://notif-service.internal/api/v1/retry-failed';
      case 'SQL_SCRIPT':
        return 'CALL proc_purge_audit_logs(?);';
      default:
        return '';
    }
  };

  // Event matrix columns for Notifications (SMS, Push Web, Email)
  const notificationColumns = [
    {
      title: 'Sự kiện kích hoạt',
      dataIndex: 'eventLabel',
      key: 'eventLabel',
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
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item name={['notificationMatrix', record.eventKey, 'sms']} valuePropName="checked" noStyle>
          <Checkbox disabled={!enableNotify} />
        </Form.Item>
      ),
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
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item name={['notificationMatrix', record.eventKey, 'push']} valuePropName="checked" noStyle>
          <Checkbox disabled={!enableNotify} />
        </Form.Item>
      ),
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
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item name={['notificationMatrix', record.eventKey, 'email']} valuePropName="checked" noStyle>
          <Checkbox disabled={!enableNotify} />
        </Form.Item>
      ),
    },
  ];

  const notificationData = [
    { key: 'onStart', eventKey: 'onStart', eventLabel: 'Khi bắt đầu chạy Job' },
    { key: 'onSuccess', eventKey: 'onSuccess', eventLabel: 'Khi hoàn tất thành công' },
    { key: 'onFailure', eventKey: 'onFailure', eventLabel: 'Khi gặp sự cố / Thất bại' },
    { key: 'onRetry', eventKey: 'onRetry', eventLabel: 'Khi thử lại (Retry)' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={job}
      onValuesChange={handleValuesChange}
      style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}
    >
      {/* SECTION 1: Định nghĩa Kỹ thuật */}
      <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
          <CodeOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
          <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1. Định nghĩa Kỹ thuật (Job Definition)
          </Text>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="code" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Mã Job (Job Code)</Text>}>
              <Input disabled style={{ fontFamily: typography.fontFamily.mono, backgroundColor: colors.bg.subtle }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="name" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tên hiển thị</Text>} rules={[{ required: true }]}>
              <Input placeholder="Tên hiển thị của Job" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="type" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Loại xử lý (Job Type)</Text>} rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'SPRING_BEAN', label: 'Java Bean (Spring Component)' },
                  { value: 'REST_API', label: 'REST API Endpoint' },
                  { value: 'SQL_SCRIPT', label: 'SQL Stored Procedure / Script' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="target" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>{getTargetLabelText(currentJobType)}</Text>} rules={[{ required: true }]}>
              <Input placeholder={getTargetPlaceholder(currentJobType)} style={{ fontFamily: typography.fontFamily.mono }} />
            </Form.Item>
          </Col>
        </Row>

        {/* YAML Payload Editor Box */}
        <Form.Item
          name="params"
          label={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tham số nghiệp vụ bổ sung (YAML Payload)</Text>
              <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>Chỉ chứa payload/dữ liệu động</Text>
            </div>
          }
        >
          <Input.TextArea
            rows={3}
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.fontSize.sm,
              backgroundColor: colors.neutral[900],
              color: colors.success.base,
              borderRadius: radius.md,
            }}
          />
        </Form.Item>
      </div>

      {/* SECTION 2: Lập lịch Cron & Điều phối */}
      <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
          <CalendarOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
          <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            2. Cấu hình Lập lịch & Điều phối (Scheduling)
          </Text>
        </div>

        <Form.Item name="cron" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Biểu thức Cron (Cron Expression)</Text>} rules={[{ required: true }]}>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <Input style={{ fontFamily: typography.fontFamily.mono, fontWeight: 'bold' }} />
          </div>
        </Form.Item>

        <div
          style={{
            backgroundColor: colors.primary[50],
            border: `1px solid ${colors.primary[100]}`,
            padding: spacing[2],
            borderRadius: radius.md,
            marginBottom: spacing[4],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            color: colors.primary[700],
            fontSize: typography.fontSize.xs,
          }}
        >
          <InfoCircleOutlined />
          <span>{job.cronDesc || 'Giải thích chu kỳ thực thi...'}</span>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="misfire" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Chính sách Misfire</Text>}>
              <Select
                options={[
                  { value: 'FIRE_NOW', label: 'Fire Now (Chạy bù ngay khi khôi phục)' },
                  { value: 'DO_NOTHING', label: 'Do Nothing (Bỏ qua lượt lỗi, chờ chu kỳ tới)' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="timeout" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Thời gian chờ tối đa (Timeout Seconds)</Text>}>
              <InputNumber min={1} style={{ width: '100%' }} suffix="giây" />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.bg.subtle,
            borderRadius: radius.md,
            border: `1px solid ${colors.border.split}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Text strong style={{ fontSize: typography.fontSize.sm, display: 'block' }}>
              Không cho phép chạy song song (Disallow Concurrent Execution)
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
              Ngăn lượt chạy mới nếu lượt cũ chưa kết thúc
            </Text>
          </div>
          <Form.Item name="concurrent" valuePropName="checked" noStyle>
            <Checkbox />
          </Form.Item>
        </div>
      </div>

      {/* SECTION 3: Chính sách Thử lại khi Lỗi */}
      <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
          <SyncOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
          <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            3. Chính sách Thử lại khi Lỗi (Retry Policy)
          </Text>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={currentBackoff === 'EXPONENTIAL' ? 8 : 12}>
            <Form.Item name="maxRetries" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Số lần thử lại tối đa (Max Retries)</Text>}>
              <InputNumber min={0} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={currentBackoff === 'EXPONENTIAL' ? 8 : 12}>
            <Form.Item name="retryInterval" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Khoảng chờ ban đầu (Giây)</Text>}>
              <InputNumber min={1} style={{ width: '100%' }} suffix="s" />
            </Form.Item>
          </Col>

          <Col xs={24} md={currentBackoff === 'EXPONENTIAL' ? 4 : 12}>
            <Form.Item name="backoff" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Thuật toán giãn cách (Backoff)</Text>}>
              <Select
                options={[
                  { value: 'FIXED', label: 'Cố định (Fixed Delay)' },
                  { value: 'EXPONENTIAL', label: 'Cấp số nhân (Exponential)' },
                ]}
              />
            </Form.Item>
          </Col>

          {currentBackoff === 'EXPONENTIAL' && (
            <Col xs={24} md={4}>
              <Form.Item name="backoffMultiplier" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Hệ số nhân</Text>}>
                <Select
                  options={[
                    { value: '2x', label: '2x (Gấp đôi)' },
                    { value: '3x', label: '3x (Gấp ba)' },
                    { value: '5x', label: '5x (Gấp 5)' },
                  ]}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>

      {/* SECTION 4: Thiết lập Cảnh báo Sự cố (3 kênh: SMS / Push / Email) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <BellOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
            <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              4. Thiết lập Cảnh báo Sự cố (Alerting & Notifications)
            </Text>
          </div>

          <Form.Item name="enableNotify" valuePropName="checked" noStyle>
            <Switch checkedChildren="Kích hoạt cảnh báo" unCheckedChildren="Tắt cảnh báo" />
          </Form.Item>
        </div>

        <div style={{ opacity: enableNotify ? 1 : 0.4, pointerEvents: enableNotify ? 'auto' : 'none', transition: 'all 0.2s ease' }}>
          <Form.Item name="notifyEmails" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Danh sách Email nhận cảnh báo (Phân cách bởi dấu phẩy)</Text>} style={{ marginBottom: spacing[3] }}>
            <Input placeholder="devops@company.com, alert@company.com" disabled={!enableNotify} />
          </Form.Item>

          <Text strong style={{ fontSize: typography.fontSize.sm, display: 'block', marginBottom: spacing[2] }}>
            Ma trận Kênh nhận thông báo theo sự kiện (SMS / Push Web / Email)
          </Text>

          <Table
            columns={notificationColumns}
            dataSource={notificationData}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: 'Chưa cấu hình sự kiện thông báo' }}
          />
        </div>
      </div>
    </Form>
  );
};

export default JobConfigTab;

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  CodeOutlined,
  CalendarOutlined,
  BellOutlined,
  MessageOutlined,
  DesktopOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { colors, spacing, radius, typography } from '@/design-system';
import { mockJobs } from './mockData';
import type {
  IJob,
  IConsoleNotificationMatrix,
  TriggerTypeOption,
} from './types';
import { getCronDescription } from './cronUtils';

const { Text } = Typography;

const SYSTEM_USERS = [
  { value: 'admin_01@cic.org.vn', label: 'admin_01 — Nguyễn Văn Admin (Quản trị hệ thống)' },
  { value: 'operator_01@cic.org.vn', label: 'operator_01 — Trần Văn Vận Hành (Chuyên viên vận hành)' },
  { value: 'manager_01@cic.org.vn', label: 'manager_01 — Lê Văn Quản Lý (Trưởng phòng CNTT)' },
  { value: 'alert_group@cic.org.vn', label: 'alert_group@cic.org.vn — Nhóm trực ca 24/7' },
];

const DEFAULT_NOTIFICATION_MATRIX: IConsoleNotificationMatrix = {
  onStart: { sms: false, push: false, email: true, customRecipients: [] },
  onSuccess: { sms: false, push: false, email: true, customRecipients: [] },
  onSlaBreach: { sms: false, push: false, email: true, customRecipients: [] },
  onFailure: { sms: true, push: true, email: true, customRecipients: ['alert_group@cic.org.vn'] },
  onRetry: { sms: false, push: true, email: false, customRecipients: [] },
};

const JobFormContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const jobId = params?.id as string | undefined;
  const cloneId = searchParams?.get('cloneId');
  const isEditMode = !!jobId;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<IJob | null>(null);

  const watchTriggerType: TriggerTypeOption = Form.useWatch('triggerType', form) || 'SCHEDULER';
  const watchCron: string = Form.useWatch('cron', form) || '';
  const watchDependencies: any[] = Form.useWatch('dependencies', form) || [];

  useEffect(() => {
    if (watchDependencies && watchDependencies.length > 0) {
      if (watchTriggerType !== 'EVENT') {
        form.setFieldsValue({ triggerType: 'EVENT' });
      }
    }
  }, [watchDependencies, watchTriggerType, form]);

  useEffect(() => {
    const targetId = jobId || cloneId;

    if (targetId) {
      const found = mockJobs.find((j) => j.id === targetId);
      if (found) {
        setJob(found);

        const emailTags = found.notifyEmails
          ? found.notifyEmails.split(/[,;]\s*/).filter(Boolean)
          : ['admin@cic.org.vn'];

        form.setFieldsValue({
          code: isEditMode ? found.code : `${found.code}_COPY`,
          name: isEditMode ? found.name : `${found.name} (Bản sao)`,
          category: found.category || 'DATA_SYNC',
          serviceCode: found.serviceCode || 'SVC_CIC_CORE_SYNC',
          description: found.description || '',
          params:
            found.params ||
            `# Tham số YAML/JSON động\nsourceApi: "https://api.internal/v1"\nbatchSize: 500`,

          // Trigger & Schedule & Error Handling
          triggerType: found.triggerType || 'SCHEDULER',
          dependsOn: found.dependsOn || [],
          dependencies: found.dependencies || [],
          cron: found.cron || found.schedule?.expression || '0 0 1 * * *',
          eventName: 'EVT_DATA_IMPORTED',

          slaTimeout: found.slaTimeout || 1800,
          retentionSuccess: found.retentionSuccess || 7,
          retentionError: found.retentionError || 30,
          timeout: found.timeout || 300,
          misfire: found.misfire || 'FIRE_NOW',
          concurrent: found.concurrent ?? true, // Default: Khóa chạy song song (true)

          // Retry policy
          maxRetries: found.maxRetries ?? found.retryPolicy?.maxRetries ?? 3,
          retryInterval: found.retryInterval ?? 60,

          // Notifications
          notifyEmails: emailTags,
          notificationMatrix: found.notificationMatrix || DEFAULT_NOTIFICATION_MATRIX,
        });
      } else if (isEditMode) {
        message.error('Job không tồn tại');
        router.push('/ops-support/job-management');
      }
    } else {
      // Set defaults for new job
      form.setFieldsValue({
        code: 'JOB_DATA_PROCESS',
        name: 'Xử lý dữ liệu định kỳ',
        category: 'DATA_SYNC',
        serviceCode: 'SVC_CIC_CORE_SYNC',
        description: 'Mô tả công việc và các bước thực hiện trong quy trình tự động hóa',
        params: `# Tham số YAML/JSON động\nsourceApi: "https://api.internal/v1"\nbatchSize: 500`,

        triggerType: 'SCHEDULER',
        dependsOn: [],
        dependencies: [],
        cron: '0 0 1 * * *',
        eventName: 'EVT_DATA_IMPORTED',

        slaTimeout: 1800,
        retentionSuccess: 7,
        retentionError: 30,
        timeout: 300,
        misfire: 'FIRE_NOW',
        concurrent: true, // Mặc định Khóa chạy song song

        maxRetries: 3,
        retryInterval: 60,

        notifyEmails: ['admin@cic.org.vn', 'alert@cic.org.vn'],
        notificationMatrix: DEFAULT_NOTIFICATION_MATRIX,
      });
    }
  }, [jobId, cloneId, isEditMode, form, router]);

  const dependsOnOptions = useMemo(() => {
    return mockJobs
      .filter((j) => !isEditMode || j.id !== jobId)
      .map((j) => ({
        value: j.id,
        label: `${j.code} - ${j.name}`,
      }));
  }, [isEditMode, jobId]);

  useHeaderActions(
    {
      title: isEditMode ? 'Cập nhật thông tin Job' : 'Thiết lập Job mới',
      onBack: () => router.push('/ops-support/job-management'),
      breadcrumb: isEditMode
        ? 'Hỗ trợ vận hành > Quản lý Job > Cập nhật thông tin Job'
        : 'Hỗ trợ vận hành > Quản lý Job > Thiết lập Job mới',
    },
    [isEditMode, job?.name, router]
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      message.success(
        isEditMode
          ? `Lưu cấu hình Job ${values.code} thành công`
          : `Lưu Job mới ${values.code} thành công`
      );

      router.push('/ops-support/job-management');
    } catch (error: any) {
      message.error(error.message || 'Vui lòng kiểm tra lại các trường thông tin chưa hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  // Matrix table column configuration
  const notificationColumns = [
    {
      title: 'Sự kiện kích hoạt',
      dataIndex: 'eventLabel',
      key: 'eventLabel',
      width: 180,
      render: (text: string) => (
        <Text strong style={{ fontSize: typography.fontSize.sm }}>
          {text}
        </Text>
      ),
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
      render: (_: any, record: any) => (
        <Form.Item
          name={['notificationMatrix', record.eventKey, 'sms']}
          valuePropName="checked"
          noStyle
        >
          <Checkbox />
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
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item
          name={['notificationMatrix', record.eventKey, 'push']}
          valuePropName="checked"
          noStyle
        >
          <Checkbox />
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
      width: 90,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item
          name={['notificationMatrix', record.eventKey, 'email']}
          valuePropName="checked"
          noStyle
        >
          <Checkbox />
        </Form.Item>
      ),
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
      render: (_: any, record: any) => (
        <Form.Item
          name={['notificationMatrix', record.eventKey, 'customRecipients']}
          noStyle
        >
          <Select
            mode="tags"
            placeholder="Chọn user hoặc gõ email riêng..."
            style={{ width: '100%' }}
            options={SYSTEM_USERS}
            maxTagCount="responsive"
          />
        </Form.Item>
      ),
    },
  ];

  const notificationData = [
    { key: 'onStart', eventKey: 'onStart', eventLabel: 'Khi bắt đầu chạy Job' },
    { key: 'onSuccess', eventKey: 'onSuccess', eventLabel: 'Khi hoàn tất thành công' },
    { key: 'onSlaBreach', eventKey: 'onSlaBreach', eventLabel: 'Khi chạy chậm quá SLA' },
    { key: 'onFailure', eventKey: 'onFailure', eventLabel: 'Khi gặp sự cố / Thất bại' },
    { key: 'onRetry', eventKey: 'onRetry', eventLabel: 'Khi thử lại (Retry)' },
  ];

  return (
    <PageLayout>
      <Card
        style={{
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.split}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}
        >
          {/* KHỐI 1: Thông tin chung */}
          <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[5] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <CodeOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
              <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                Thông tin chung
              </Text>
            </div>

            {/* Hàng 1: Mã Job, Tên Job, Loại Job, Mã dịch vụ */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="code"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Mã Job (Tối đa 20 ký tự)</Text>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã Job' },
                    {
                      pattern: /^[A-Z0-9_-]{1,20}$/,
                      message: 'Tối đa 20 ký tự, chỉ gồm chữ in hoa, số, (-), (_)',
                    },
                  ]}
                  extra="Chỉ chấp nhận chữ in hoa, số, (-), (_)"
                >
                  <Input
                    maxLength={20}
                    placeholder="VD: JOB_EXPORT_DATA"
                    disabled={isEditMode}
                    style={{ fontFamily: typography.fontFamily.mono }}
                    onChange={(e) => {
                      const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                      form.setFieldsValue({ code: formatted });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="name"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tên Job (Tối đa 100 ký tự)</Text>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên Job' },
                    { max: 100, message: 'Tên Job không vượt quá 100 ký tự' },
                  ]}
                >
                  <Input maxLength={100} placeholder="VD: Đồng bộ dữ liệu báo cáo hằng ngày" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="category"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Loại Job</Text>}
                  rules={[{ required: true, message: 'Vui lòng chọn loại Job' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      { value: 'DATA_SYNC', label: 'Đồng bộ dữ liệu (DATA_SYNC)' },
                      { value: 'REPORT', label: 'Sinh báo cáo thống kê (REPORT)' },
                      { value: 'CLEANUP', label: 'Dọn dẹp & Lưu trữ dữ liệu (CLEANUP)' },
                      { value: 'VALIDATION', label: 'Kiểm tra & Đối soát dữ liệu (VALIDATION)' },
                      { value: 'BATCH', label: 'Xử lý lô / Batch (BATCH)' },
                      { value: 'SPRING_BEAN', label: 'Java Spring Component (SPRING_BEAN)' },
                      { value: 'REST_API', label: 'REST API Endpoint (REST_API)' },
                      { value: 'SQL_SCRIPT', label: 'SQL Stored Procedure (SQL_SCRIPT)' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="serviceCode"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Mã dịch vụ</Text>}
                  rules={[{ required: true, message: 'Vui lòng nhập mã dịch vụ' }]}
                >
                  <Input maxLength={50} placeholder="VD: SVC_CIC_CORE_SYNC" style={{ fontFamily: typography.fontFamily.mono }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Hàng 2: Mô tả Job (FULL WIDTH) */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="description"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Mô tả Job (Tối đa 1000 ký tự)</Text>}
                  rules={[{ max: 1000, message: 'Mô tả không vượt quá 1000 ký tự' }]}
                >
                  <Input.TextArea
                    rows={3}
                    maxLength={1000}
                    showCount
                    placeholder="Mô tả mục đích nghiệp vụ, phạm vi dữ liệu xử lý của Job..."
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Hàng 3: Tham số bổ sung (FULL WIDTH) */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="params"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tham số bổ sung (YAML/JSON, Tối đa 1500 ký tự)</Text>}
                  rules={[{ max: 1500, message: 'Tham số bổ sung không vượt quá 1500 ký tự' }]}
                >
                  <Input.TextArea
                    rows={4}
                    maxLength={1500}
                    showCount
                    placeholder="# Cấu hình tham số dạng YAML hoặc JSON&#10;sourceApi: 'https://api.internal/v1'&#10;batchSize: 500"
                    style={{
                      fontFamily: typography.fontFamily.mono,
                      fontSize: typography.fontSize.sm,
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      border: `1px solid ${colors.border.base}`,
                      borderRadius: radius.md,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* KHỐI 2: Cấu hình Lập lịch & Điều phối & Xử lý lỗi */}
          <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[5] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <CalendarOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
              <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                Lập lịch và xử lý lỗi
              </Text>
            </div>

            {/* HÀNG 1: Điều kiện kích hoạt (25%) | Job cần hoàn thành trước (50%) | Chờ ban đầu (12.5%) | Chờ tối đa (12.5%) */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="triggerType"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Điều kiện kích hoạt</Text>}
                  rules={[{ required: true }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    disabled={watchDependencies && watchDependencies.length > 0}
                    options={[
                      { value: 'SCHEDULER', label: 'Bộ lập lịch (Scheduler)' },
                      { value: 'EVENT', label: 'Theo sự kiện (Event-driven)' },
                      { value: 'MANUAL', label: 'Thủ công (Manual)' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="slaTimeout"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>SLA dự kiến (s)</Text>}
                  rules={[{ type: 'number', min: 1, message: 'Từ 1s' }]}
                >
                  <InputNumber min={1} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>

              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="retryInterval"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Chờ ban đầu (giây)</Text>}
                  rules={[{ type: 'number', min: 1, max: 86400, message: 'Từ 1 đến 86400s' }]}
                >
                  <InputNumber min={1} max={86400} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>



              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="timeout"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Chờ tối đa (giây)</Text>}
                  rules={[
                    { required: true, message: 'Nhập thời gian chờ' },
                    { type: 'number', min: 1, max: 86400, message: 'Từ 1 đến 86400s' },
                  ]}
                >
                  <InputNumber min={1} max={86400} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>
            </Row>

            {/* HÀNG 2: Biểu thức Cron | Số lần thử lại tối đa | Chạy song song | Xử lý khi bỏ lỡ lượt chạy */}
            <Row gutter={[16, 16]} style={{ marginTop: spacing[3] }}>
              <Col xs={24} sm={12} md={6}>
                {watchTriggerType === 'SCHEDULER' && (
                  <Form.Item
                    name="cron"
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Biểu thức Cron</Text>}
                    rules={[{ required: true, message: 'Vui lòng nhập biểu thức Cron' }]}
                    extra={
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                          💡 Diễn giải: <Text strong style={{ color: colors.primary[600] }}>{getCronDescription(watchCron || '0 0 1 * * *')}</Text>
                        </Text>
                      </div>
                    }
                  >
                    <Input
                      placeholder="0 0 1 * * *"
                      style={{ fontFamily: typography.fontFamily.mono, fontWeight: 'bold' }}
                    />
                  </Form.Item>
                )}

                {watchTriggerType === 'EVENT' && (
                  <Form.Item
                    name="eventName"
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tên sự kiện kích hoạt</Text>}
                    rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
                  >
                    <Input placeholder="VD: EVT_CUSTOMER_DATA_IMPORTED" style={{ fontFamily: typography.fontFamily.mono }} />
                  </Form.Item>
                )}

                {watchTriggerType === 'MANUAL' && (
                  <Form.Item
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Cơ chế kích hoạt</Text>}
                  >
                    <Input
                      disabled
                      value="Thủ công (Giao diện / API)"
                      style={{ background: colors.neutral[100], color: colors.text.secondary }}
                    />
                  </Form.Item>
                )}
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="maxRetries"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Số lần thử lại tối đa</Text>}
                  rules={[{ type: 'number', min: 0, max: 10, message: 'Từ 0 đến 10 lần' }]}
                >
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} placeholder="VD: 3" suffix="lần" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="concurrent"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Chạy song song</Text>}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      { value: true, label: 'Khóa chạy song song' },
                      { value: false, label: 'Cho phép chạy song song' },
                    ]}
                  />
                </Form.Item>
              </Col>

              {watchTriggerType === 'SCHEDULER' && (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="misfire"
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Xử lý khi bỏ lỡ lượt chạy</Text>}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        { value: 'FIRE_NOW', label: 'Chạy bù ngay khi đủ điều kiện' },
                        { value: 'DO_NOTHING', label: 'Bỏ qua lượt lỗi, chờ lịch tiếp theo' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            {/* HÀNG 3: Retention */}
            <Row gutter={[16, 16]} style={{ marginTop: spacing[3] }}>
              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="retentionSuccess"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Lưu log thành công (ngày)</Text>}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} suffix="ngày" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="retentionError"
                  label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Lưu log lỗi (ngày)</Text>}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} suffix="ngày" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* KHỐI CẤU HÌNH PHỤ THUỘC */}
          <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[5] }}>
            <Form.List name="dependencies">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <CodeOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
                      <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                        Cấu hình phụ thuộc
                      </Text>
                    </div>
                    <Button type="dashed" onClick={() => add({ conditionType: 'SUCCESS' })}>
                      + Thêm Job phụ thuộc
                    </Button>
                  </div>
                  <Table
                    dataSource={fields}
                    pagination={false}
                    rowKey="name"
                    bordered
                    size="small"
                    columns={[
                      {
                        title: 'Mã Job xử lý trước',
                        dataIndex: 'name',
                        width: '40%',
                        render: (name) => (
                          <Form.Item name={[name, 'jobId']} noStyle rules={[{ required: true, message: 'Vui lòng chọn Job' }]}>
                            <Select
                              showSearch
                              placeholder="Chọn Job..."
                              options={dependsOnOptions}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        )
                      },
                      {
                        title: 'Điều kiện',
                        dataIndex: 'name',
                        width: '40%',
                        render: (name) => (
                          <Form.Item name={[name, 'conditionType']} noStyle rules={[{ required: true, message: 'Vui lòng chọn ĐK' }]}>
                            <Select
                              options={[
                                { value: 'SUCCESS', label: 'Khi thành công' },
                                { value: 'FAILURE', label: 'Khi thất bại' },
                                { value: 'ALWAYS', label: 'Luôn luôn (Bất kể kết quả)' },
                              ]}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        )
                      },
                      {
                        title: '',
                        key: 'action',
                        width: '20%',
                        align: 'center',
                        render: (_, field) => (
                          <Button type="text" danger onClick={() => remove(field.name)}>
                            Xóa
                          </Button>
                        )
                      }
                    ]}
                  />
                </>
              )}
            </Form.List>
          </div>

          {/* KHỐI 3: Thiết lập Cảnh báo Sự cố */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <BellOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
              <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                Thiết lập cảnh báo sự cố
              </Text>
            </div>

            <div>
              <Row gutter={[16, 16]} style={{ marginBottom: spacing[3] }}>
                <Col xs={24}>
                  <Form.Item
                    name="notifyEmails"
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Email nhận cảnh báo chung (Phân cách bằng dấu chấm phẩy ; hoặc Enter)</Text>}
                  >
                    <Select
                      mode="tags"
                      tokenSeparators={[';', ',']}
                      placeholder="VD: admin@company.com; alert@company.com"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Text strong style={{ fontSize: typography.fontSize.sm, display: 'block', marginBottom: spacing[2] }}>
                Cấu hình thông báo
              </Text>

              <Table
                columns={notificationColumns}
                dataSource={notificationData}
                pagination={false}
                size="small"
                bordered
                rowKey="key"
                scroll={{ x: 750 }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing[3],
              marginTop: spacing[4],
              paddingTop: spacing[4],
              borderTop: `1px solid ${colors.border.split}`,
            }}
          >
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              style={{ minWidth: 100 }}
            >
              Lưu
            </Button>
            <Button onClick={() => router.push('/ops-support/job-management')} style={{ minWidth: 100 }}>
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </PageLayout>
  );
};

const JobFormPage: React.FC = () => (
  <React.Suspense fallback={<PageLayout><Card loading /></PageLayout>}>
    <JobFormContent />
  </React.Suspense>
);

export default JobFormPage;

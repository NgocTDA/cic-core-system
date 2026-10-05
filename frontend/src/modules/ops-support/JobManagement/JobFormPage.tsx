'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Modal,
  Tooltip,
  Radio,
  Tag,
} from 'antd';
import {
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
import { useRole, hasPermission } from '@/context/RoleContext';
import { mockJobs } from './mockData';
import type {
  IJob,
  IConsoleNotificationMatrix,
  TriggerTypeOption,
} from './types';
import { getCronDescription } from './cronUtils';

const { Text } = Typography;

// M3-17: Username - Họ tên - Email
const SYSTEM_USERS = [
  { value: 'admin_01@cic.org.vn', label: 'admin_01 - Nguyễn Văn Admin - admin_01@cic.org.vn', isInternal: true },
  { value: 'operator_01@cic.org.vn', label: 'operator_01 - Trần Văn Vận Hành - operator_01@cic.org.vn', isInternal: true },
  { value: 'manager_01@cic.org.vn', label: 'manager_01 - Lê Văn Quản Lý - manager_01@cic.org.vn', isInternal: true },
  { value: 'alert_group@cic.org.vn', label: 'alert_group@cic.org.vn - Nhóm trực ca 24/7 - alert_group@cic.org.vn', isInternal: true },
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
  const { currentRole } = useRole();

  const canManageParam = hasPermission(currentRole, 'manage_param');
  const canConfigDep = hasPermission(currentRole, 'config_dependency');

  const jobId = params?.id as string | undefined;
  const isEditMode = !!jobId;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<IJob | null>(null);
  const [initialUpdatedAt, setInitialUpdatedAt] = useState<string>('');
  const [hasCircularError, setHasCircularError] = useState(false);

  const watchTriggerType: TriggerTypeOption = Form.useWatch('triggerType', form) || 'SCHEDULER';
  const watchCron: string = Form.useWatch('cron', form) || '';
  const watchDependencies = Form.useWatch('dependencies', form);
  const watchMaxRetries = Form.useWatch('maxRetries', form);

  useEffect(() => {
    const targetId = jobId;

    if (targetId) {
      const found = mockJobs.find((j) => j.id === targetId);
      if (found) {
        setJob(found);
        setInitialUpdatedAt(found.updatedAt || '');

        const emailTags = found.notifyEmails
          ? found.notifyEmails.split(/[,;\n]\s*/).filter(Boolean)
          : ['admin@cic.org.vn'];

        const resolvedDependencies =
          found.dependencies && found.dependencies.length > 0
            ? found.dependencies
            : (found.dependsOn || []).map((id) => ({ jobId: id, conditionType: 'SUCCESS' }));

        form.setFieldsValue({
          code: found.code,
          name: found.name,
          category: found.category || 'DATA_SYNC',
          serviceCode: found.serviceCode || 'SVC_CIC_CORE_SYNC',
          description: found.description || '',
          params:
            found.params ||
            `# Tham số YAML/JSON động\nsourceApi: "https://api.internal/v1"\nbatchSize: 500`,

          triggerType: found.triggerType || 'SCHEDULER',
          dependsOn: found.dependsOn || [],
          dependencies: resolvedDependencies,
          cron: found.cron || found.schedule?.expression || '0 0 1 * * ?',
          eventName: found.eventName || 'EVT_DATA_IMPORTED',

          slaTimeout: found.slaTimeout || 1800,
          retentionSuccess: found.retentionSuccess ?? 3650,
          retentionError: found.retentionError ?? 3650,
          timeout: found.timeout || 300,
          misfire: found.misfire || 'FIRE_NOW',
          concurrent: found.concurrent ?? true, // Mặc định: Khóa chạy song song (true)

          maxRetries: found.maxRetries ?? found.retryPolicy?.maxRetries ?? 3,
          retryInterval: found.retryInterval ?? 60,

          notifyEmails: emailTags,
          notificationMatrix: found.notificationMatrix || DEFAULT_NOTIFICATION_MATRIX,
        });
      } else if (isEditMode) {
        message.error('Job không tồn tại');
        router.push('/ops-support/job-management');
      }
    } else {
      // M3-05: Giá trị mặc định 3650 cho Lưu log thành công và Lưu log lỗi
      // M3-06: Cron 0 0 1 * * ?
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
        cron: '0 0 1 * * ?',
        eventName: 'EVT_DATA_IMPORTED',

        slaTimeout: 1800,
        retentionSuccess: 3650,
        retentionError: 3650,
        timeout: 300,
        misfire: 'FIRE_NOW',
        concurrent: true,

        maxRetries: 3,
        retryInterval: 60,

        notifyEmails: ['admin@cic.org.vn', 'alert@cic.org.vn'],
        notificationMatrix: {
          onStart: { sms: false, push: false, email: false, customRecipients: [] },
          onSuccess: { sms: false, push: false, email: false, customRecipients: [] },
          onSlaBreach: { sms: false, push: false, email: false, customRecipients: [] },
          onFailure: { sms: false, push: true, email: true, customRecipients: ['alert_group@cic.org.vn'] },
          onRetry: { sms: false, push: false, email: false, customRecipients: [] },
        },
      });
    }
  }, [jobId, isEditMode, form, router]);

  const currentSelectedDepIds = useMemo(() => {
    return (watchDependencies || []).map((d: any) => d?.jobId).filter(Boolean);
  }, [watchDependencies]);

  const dependsOnOptions = useMemo(() => {
    return mockJobs
      .filter((j) => j.status === 'ACTIVE' && (!isEditMode || j.id !== jobId))
      .map((j) => ({
        value: j.id,
        label: j.code,
        jobName: j.name,
        disabled: currentSelectedDepIds.includes(j.id),
      }));
  }, [isEditMode, jobId, currentSelectedDepIds]);

  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: 'Xác nhận hủy thay đổi',
        content: 'Bạn có chắc chắn muốn hủy thay đổi cấu hình job không? Dữ liệu sau khi hủy thay đổi cấu hình sẽ không thể phục hồi.',
        icon: null,
        centered: true,
        okText: 'Tiếp tục',
        cancelText: 'Hủy',
        okButtonProps: { danger: true },
        footer: (_, { OkBtn, CancelBtn }) => (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
            <CancelBtn />
            <OkBtn />
          </div>
        ),
        onOk: () => {
          router.push('/ops-support/job-management');
        },
      });
    } else {
      router.push('/ops-support/job-management');
    }
  };

  useHeaderActions(
    {
      title: isEditMode ? 'Cập nhật thông tin Job' : 'Thiết lập Job mới',
      onBack: handleCancel,
      breadcrumb: isEditMode
        ? 'Hỗ trợ vận hành > Quản lý Job > Cập nhật thông tin Job'
        : 'Hỗ trợ vận hành > Quản lý Job > Thiết lập Job mới',
    },
    [isEditMode, job?.name, router]
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setHasCircularError(false);
      const values = await form.validateFields();

      // M4-08 / WAR_003: Xung đột dữ liệu khi chỉnh sửa
      if (isEditMode && jobId) {
        const latestJob = mockJobs.find((j) => j.id === jobId);
        if (latestJob && initialUpdatedAt && latestJob.updatedAt !== initialUpdatedAt) {
          message.warning('Dữ liệu đã bị thay đổi bởi người khác. Vui lòng làm mới trang.');
          setLoading(false);
          return;
        }
      }

      // M3-16 / ERR_021: Lỗi vòng tròn phụ thuộc
      if (isEditMode && values.dependencies && values.dependencies.length > 0) {
        const hasSelfDep = values.dependencies.some((d: any) => d?.jobId === jobId);
        if (hasSelfDep) {
          setHasCircularError(true);
          message.error('Phát hiện phụ thuộc vòng tròn giữa các job. Vui lòng kiểm tra lại quan hệ phụ thuộc.');
          setLoading(false);
          return;
        }
      }

      // SUC_002: Lưu cấu hình job thành công.
      message.success('Lưu cấu hình job thành công.');
      router.push('/ops-support/job-management');
    } catch (error: any) {
      message.error(error.message || 'Vui lòng kiểm tra lại các trường thông tin chưa hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  // M3-17: Tag render custom to distinguish internal user vs external email
  const recipientTagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const isInternal = SYSTEM_USERS.some((u) => u.value === value) || (typeof value === 'string' && value.endsWith('@cic.org.vn'));
    return (
      <Tag
        color={isInternal ? 'blue' : 'orange'}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 4 }}
      >
        {label || value}
      </Tag>
    );
  };

  // Matrix table column configuration
  const notificationColumns = [
    {
      title: 'Sự kiện kích hoạt',
      dataIndex: 'eventLabel',
      key: 'eventLabel',
      width: 180,
      render: (text: string) => (
        <Text strong style={{ fontSize: '12px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: (
        <Space size={4}>
          <MessageOutlined style={{ color: 'var(--chart-5-amber)' }} />
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
          <DesktopOutlined style={{ color: 'var(--primary)' }} />
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
          <MailOutlined style={{ color: 'var(--success)' }} />
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
          <UserOutlined style={{ color: 'var(--primary-hover)' }} />
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
            tagRender={recipientTagRender}
            placeholder="Chọn người dùng hoặc nhập email..."
            style={{ width: '100%' }}
            options={SYSTEM_USERS}
            maxTagCount="responsive"
          />
        </Form.Item>
      ),
    },
  ];

  // M3-10: Đúng 5 sự kiện chuẩn
  const notificationData = [
    { key: 'onStart', eventKey: 'onStart', eventLabel: 'Khi bắt đầu chạy' },
    { key: 'onSuccess', eventKey: 'onSuccess', eventLabel: 'Khi hoàn tất thành công' },
    { key: 'onSlaBreach', eventKey: 'onSlaBreach', eventLabel: 'Khi chạy chậm quá SLA' },
    { key: 'onFailure', eventKey: 'onFailure', eventLabel: 'Khi gặp sự cố' },
    { key: 'onRetry', eventKey: 'onRetry', eventLabel: 'Khi thử lại' },
  ];

  return (
    <PageLayout>
      <Card
        style={{
          borderRadius: 'var(--radius-lg)',
          border: `1px solid var(--color-neutral-100)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}
        >
          {/* KHỐI 1: Thông tin chung */}
          <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-20)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)' }}>
              <CodeOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
              <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                Thông tin chung
              </Text>
            </div>

            {/* Hàng 1: Mã Job, Tên Job, Loại Job, Mã dịch vụ */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="code"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Mã Job</Text>}
                  rules={[
                    { required: true, message: 'Mã Job không được để trống.' },
                    {
                      pattern: /^[A-Z0-9_-]{1,20}$/,
                      message: 'Mã Job tối đa 20 ký tự, chỉ gồm A-Z, 0-9, (-) và (_).',
                    },
                  ]}
                  extra="Tối đa 20 ký tự (A-Z, 0-9, -, _)"
                >
                  <Input
                    maxLength={20}
                    placeholder="VD: BATCH_SETTLEMENT"
                    disabled={isEditMode}
                    style={{ fontFamily: 'var(--font-mono, monospace)' }}
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
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Tên Job</Text>}
                  rules={[
                    { required: true, message: 'Tên Job không được để trống.' },
                    { max: 100, message: 'Tên Job không được vượt quá 100 ký tự.' },
                  ]}
                >
                  <Input maxLength={100} placeholder="VD: Đồng bộ dữ liệu báo cáo hằng ngày" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="category"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Loại Job</Text>}
                  rules={[{ required: true, message: 'Loại Job không được để trống.' }]}
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
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Mã dịch vụ</Text>}
                  rules={[{ required: true, message: 'Mã dịch vụ không được để trống.' }]}
                >
                  <Input maxLength={50} placeholder="VD: SVC_CIC_CORE_SYNC" style={{ fontFamily: 'var(--font-mono, monospace)' }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Hàng 2: Mô tả Job (FULL WIDTH) */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="description"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Mô tả Job</Text>}
                  rules={[{ max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự.' }]}
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

            {/* Hàng 3: Tham số bổ sung (FULL WIDTH) - M3-14 / M4-07 */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="params"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Tham số bổ sung (YAML/JSON, Tối đa 1500 ký tự)</Text>}
                  rules={[{ max: 1500, message: 'Tham số bổ sung không được vượt quá 1500 ký tự.' }]}
                >
                  <Input.TextArea
                    rows={4}
                    maxLength={1500}
                    disabled={!canManageParam}
                    showCount
                    placeholder="# Cấu hình tham số dạng YAML hoặc JSON&#10;sourceApi: 'https://api.internal/v1'&#10;batchSize: 500"
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '12px',
                      backgroundColor: !canManageParam ? 'var(--surface-sunken)' : 'var(--bg-subtle)',
                      color: 'var(--text)',
                      border: `1px solid var(--border)`,
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* KHỐI 2: Cấu hình Lập lịch & Điều phối & Xử lý lỗi */}
          <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-20)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)' }}>
              <CalendarOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
              <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                Lập lịch và xử lý lỗi
              </Text>
            </div>

            {/* --- HÀNG 1: CHỈ CHỨA CÁC NÚT SEGMENTED CONTROL --- */}
            <Row gutter={[16, 16]}>
              {/* 1. Điều kiện kích hoạt */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="triggerType"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Điều kiện kích hoạt</Text>}
                  rules={[{ required: true, message: 'Điều kiện kích hoạt không được để trống.' }]}
                >
                  <Radio.Group optionType="button" buttonStyle="solid" style={{ display: 'flex', width: '100%' }}>
                    <Radio.Button value="SCHEDULER" style={{ flex: 1, textAlign: 'center' }}>Bộ lập lịch</Radio.Button>
                    <Radio.Button value="EVENT" style={{ flex: 1, textAlign: 'center' }}>Sự kiện</Radio.Button>
                    <Radio.Button value="MANUAL" style={{ flex: 1, textAlign: 'center' }}>Thủ công</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {/* 2. Chạy song song */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="concurrent"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Chạy song song</Text>}
                  rules={[{ required: true, message: 'Chạy song song không được để trống.' }]}
                >
                  <Radio.Group optionType="button" buttonStyle="solid" style={{ display: 'flex', width: '100%' }}>
                    <Radio.Button value={true} style={{ flex: 1, textAlign: 'center' }}>Khóa</Radio.Button>
                    <Radio.Button value={false} style={{ flex: 1, textAlign: 'center' }}>Cho phép</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {/* 3. Xử lý khi bỏ lỡ (chỉ hiện khi SCHEDULER) */}
              {watchTriggerType === 'SCHEDULER' && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="misfire"
                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Xử lý khi bỏ lỡ lượt chạy</Text>}
                    rules={[{ required: true, message: 'Xử lý khi bỏ lỡ lượt chạy không được để trống.' }]}
                  >
                    <Radio.Group optionType="button" buttonStyle="solid" style={{ display: 'flex', width: '100%' }}>
                      <Radio.Button value="FIRE_NOW" style={{ flex: 1, textAlign: 'center' }}>Chạy bù ngay</Radio.Button>
                      <Radio.Button value="DO_NOTHING" style={{ flex: 1, textAlign: 'center' }}>Bỏ qua</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
            </Row>

            {/* --- HÀNG 2 VÀ 3: CHỨA CÁC Ô NHẬP LIỆU (Tự dồn hàng) --- */}
            <Row gutter={[16, 16]} style={{ marginTop: 'var(--spacing-16)' }}>
              {/* 4. Biểu thức Cron (chỉ hiện khi SCHEDULER) */}
              {watchTriggerType === 'SCHEDULER' && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="cron"
                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Biểu thức Cron (6 trường)</Text>}
                    rules={[
                      { required: true, message: 'Biểu thức Cron không được để trống.' },
                      {
                        validator(_, value) {
                          if (!value) return Promise.resolve();
                          const parts = value.trim().split(/\s+/);
                          if (parts.length !== 6) {
                            return Promise.reject(new Error('Biểu thức Cron phải có đúng 6 trường (Giây Phút Giờ Ngày Tháng Thứ).'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    extra={
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                          Diễn giải: <Text strong style={{ color: 'var(--primary-hover)' }}>{getCronDescription(watchCron || '0 0 1 * * ?')}</Text>
                        </Text>
                      </div>
                    }
                  >
                    <Input
                      placeholder="0 0 1 * * ?"
                      style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 'bold' }}
                    />
                  </Form.Item>
                </Col>
              )}

              {/* 5. Tên sự kiện (chỉ hiện khi EVENT) */}
              {watchTriggerType === 'EVENT' && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="eventName"
                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Tên sự kiện kích hoạt</Text>}
                    rules={[
                      { required: true, message: 'Tên sự kiện kích hoạt không được để trống.' },
                      { max: 255, message: 'Tên sự kiện kích hoạt không vượt quá 255 ký tự.' },
                      { pattern: /^[A-Za-z0-9_-]+$/, message: 'Tên sự kiện kích hoạt không hợp lệ.' },
                    ]}
                  >
                    <Input placeholder="VD: EVT_CUSTOMER_DATA_IMPORTED" style={{ fontFamily: 'var(--font-mono, monospace)' }} />
                  </Form.Item>
                </Col>
              )}

              {/* 6. SLA dự kiến */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="slaTimeout"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>SLA dự kiến (s)</Text>}
                  rules={[{ type: 'number', min: 1, message: 'SLA dự kiến phải từ 1 giây.' }]}
                >
                  <InputNumber min={1} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>

              {/* 7. Chờ tối đa */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="timeout"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Chờ tối đa (giây)</Text>}
                  rules={[
                    { required: true, message: 'Chờ tối đa (giây) không được để trống.' },
                    { type: 'number', min: 1, max: 86400, message: 'Chờ tối đa (giây) phải từ 1 đến 86400 giây.' },
                  ]}
                >
                  <InputNumber min={1} max={86400} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>

              {/* 8. Số lần thử lại tối đa */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="maxRetries"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Thử lại tối đa</Text>}
                  rules={[
                    { required: true, message: 'Số lần thử lại không được để trống.' },
                    { type: 'number', min: 0, max: 10, message: 'Thử lại phải từ 0 đến 10 lần.' },
                  ]}
                >
                  <InputNumber min={0} max={10} precision={0} style={{ width: '100%' }} placeholder="VD: 3" suffix="lần" />
                </Form.Item>
              </Col>

              {/* 9. Chờ ban đầu (giữa các lần thử lại) */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="retryInterval"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Chờ ban đầu (giây)</Text>}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const retries = getFieldValue('maxRetries');
                        if (retries > 0 && (value === undefined || value === null || value === '')) {
                          return Promise.reject(new Error('Chờ ban đầu không được để trống khi số lần thử lại > 0.'));
                        }
                        if (value !== undefined && value !== null && (value < 1 || value > 86400)) {
                          return Promise.reject(new Error('Chờ ban đầu phải từ 1 đến 86400 giây.'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber min={1} max={86400} precision={0} style={{ width: '100%' }} suffix="s" />
                </Form.Item>
              </Col>

              {/* 10. Lưu log thành công */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="retentionSuccess"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Lưu log TC (ngày)</Text>}
                  rules={[{ required: true, message: 'Lưu log thành công không được để trống.' }]}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} suffix="ngày" />
                </Form.Item>
              </Col>

              {/* 11. Lưu log lỗi */}
              <Col xs={12} sm={8} md={4}>
                <Form.Item
                  name="retentionError"
                  label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Lưu log lỗi (ngày)</Text>}
                  rules={[{ required: true, message: 'Lưu log lỗi không được để trống.' }]}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} suffix="ngày" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* KHỐI 3: Cấu hình phụ thuộc - M3-08, M3-09, M3-13, M3-15 */}
          <div
            style={{
              borderBottom: `1px solid var(--color-neutral-100)`,
              paddingBottom: 'var(--spacing-20)',
              padding: hasCircularError ? 'var(--spacing-12)' : 0,
              border: hasCircularError ? `1px solid var(--error)` : undefined,
              borderRadius: hasCircularError ? 'var(--radius-md)' : undefined,
              backgroundColor: hasCircularError ? 'var(--error-subtle)' : undefined,
            }}
          >
            <Form.List name="dependencies">
              {(fields, { add, remove }) => {
                const isLimitReached = fields.length >= 10;
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-16)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                        <CodeOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
                        <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                          Cấu hình phụ thuộc
                        </Text>
                      </div>
                      <Tooltip
                        title={
                          !canConfigDep
                            ? 'Vai trò Quản lý vận hành (ROLE-QLVH) chỉ được xem cấu hình phụ thuộc'
                            : isLimitReached
                            ? 'Số lượng Job phụ thuộc đã đạt giới hạn 10.'
                            : undefined
                        }
                      >
                        <span>
                          <Button
                            type="dashed"
                            disabled={isLimitReached || !canConfigDep}
                            onClick={() => add({ conditionType: 'SUCCESS' })}
                          >
                            + Thêm Job phụ thuộc
                          </Button>
                        </span>
                      </Tooltip>
                    </div>

                    {hasCircularError && (
                      <div style={{ marginBottom: 'var(--spacing-12)', color: 'var(--error)', fontWeight: 500 }}>
                        ⚠️ Phát hiện phụ thuộc vòng tròn giữa các job. Vui lòng kiểm tra lại quan hệ phụ thuộc.
                      </div>
                    )}

                    <Table
                      dataSource={fields}
                      pagination={false}
                      rowKey="name"
                      bordered
                      size="small"
                      columns={[
                        {
                          title: 'Mã Job phụ thuộc (xử lý trước)',
                          dataIndex: 'name',
                          width: '30%',
                          render: (name) => (
                            <Form.Item name={[name, 'jobId']} noStyle rules={[{ required: true, message: 'Vui lòng chọn Job' }]}>
                              <Select
                                showSearch
                                disabled={!canConfigDep}
                                placeholder="Chọn Job phụ thuộc..."
                                options={dependsOnOptions}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: 'Tên Job',
                          dataIndex: 'name',
                          width: '30%',
                          render: (name) => {
                            const selectedJobId = form.getFieldValue(['dependencies', name, 'jobId']);
                            const targetJob = mockJobs.find((j) => j.id === selectedJobId);
                            return <Text>{targetJob?.name || '—'}</Text>;
                          },
                        },
                        {
                          title: 'Điều kiện kích hoạt',
                          dataIndex: 'name',
                          width: '30%',
                          render: (name) => (
                            <Form.Item name={[name, 'conditionType']} noStyle rules={[{ required: true, message: 'Vui lòng chọn điều kiện kích hoạt' }]}>
                              <Radio.Group disabled={!canConfigDep}>
                                <Radio value="SUCCESS">Khi thành công</Radio>
                                <Radio value="FAILURE">Khi thất bại</Radio>
                                <Radio value="ALWAYS">Luôn luôn</Radio>
                              </Radio.Group>
                            </Form.Item>
                          ),
                        },
                        {
                          title: 'Thao tác',
                          key: 'action',
                          width: '10%',
                          align: 'center',
                          render: (_, field) =>
                            canConfigDep ? (
                              <Button type="text" danger onClick={() => remove(field.name)}>
                                Xóa
                              </Button>
                            ) : (
                              <Text type="secondary">—</Text>
                            ),
                        },
                      ]}
                    />
                  </>
                );
              }}
            </Form.List>
          </div>

          {/* KHỐI 4: Thiết lập Cảnh báo Sự cố - M3-07, M3-10 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)' }}>
              <BellOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
              <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                Thiết lập cảnh báo sự cố
              </Text>
            </div>

            <div>
              <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-12)' }}>
                <Col xs={24}>
                  <Form.Item
                    name="notifyEmails"
                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Email nhận cảnh báo chung (Phân cách bằng dấu phẩy, dấu chấm phẩy, Enter hoặc xuống dòng)</Text>}
                  >
                    <Select
                      mode="tags"
                      tokenSeparators={[';', ',', '\n']}
                      placeholder="VD: admin@company.com, alert@company.com"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: 'var(--spacing-8)' }}>
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
              gap: 'var(--spacing-12)',
              marginTop: 'var(--spacing-16)',
              paddingTop: 'var(--spacing-16)',
              borderTop: `1px solid var(--color-neutral-100)`,
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
            <Button onClick={handleCancel} style={{ minWidth: 100 }}>
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

'use client';

import React, { useEffect, useState } from 'react';
import { App, Form, Input, Select, Row, Col, InputNumber, Switch, Table, Checkbox, Space, Card, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, BellOutlined, SlidersOutlined, CodeOutlined, SyncOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { PageLayout, SectionCard } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { colors, spacing, typography } from '@/design-system';
import CronScheduler from './CronScheduler';
import { getJobById, saveJobToStore } from './useJobSimple';
import { DEFAULT_CRON, DEFAULT_TIMEZONE, isValidCron } from './cronLocale';
import type {
  JobStatus,
  JobType,
  MisfirePolicy,
  BackoffStrategy,
  BackoffMultiplier,
  NotificationChannel,
  IJobFormValues,
} from './types';

const { Text } = Typography;
const LIST_PATH = '/ops-support/jobs';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu hóa' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'SPRING_BEAN', label: 'Java Bean (Spring Component)' },
  { value: 'REST_API', label: 'REST API Endpoint' },
  { value: 'SQL_SCRIPT', label: 'SQL Stored Procedure / Script' },
];

const MISFIRE_OPTIONS = [
  { value: 'FIRE_NOW', label: 'Fire Now (Chạy bù ngay khi khôi phục engine)' },
  { value: 'DO_NOTHING', label: 'Do Nothing (Bỏ qua lượt lỗi, chờ chu kỳ tới)' },
];

const BACKOFF_STRATEGY_OPTIONS = [
  { value: 'FIXED', label: 'Cố định (Fixed Delay)' },
  { value: 'EXPONENTIAL', label: 'Tăng dần cấp số nhân (Exponential)' },
];

const BACKOFF_MULTIPLIER_OPTIONS = [
  { value: 2, label: 'Gấp 2 lần (2x)' },
  { value: 3, label: 'Gấp 3 lần (3x)' },
];

interface JobFormPageProps {
  mode: 'create' | 'edit';
}

const JobFormPageInner: React.FC<JobFormPageProps> = ({ mode }) => {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm<IJobFormValues>();

  const isEdit = mode === 'edit';
  const jobId = isEdit ? String(params?.id ?? '') : undefined;

  const [cron, setCron] = useState<string>(DEFAULT_CRON);
  const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);
  const [jobName, setJobName] = useState<string>('');
  const [cronError, setCronError] = useState<string>('');

  // Form State Triggers
  const selectedJobType = Form.useWatch('jobType', form) ?? 'SPRING_BEAN';
  const selectedBackoffStrategy = Form.useWatch('backoffStrategy', form) ?? 'FIXED';
  const enableNotify = Form.useWatch(['notificationSettings', 'enableNotify'], form) ?? false;

  const handleCronChange = (val: string) => {
    setCron(val);
    if (cronError) setCronError('');
  };

  useEffect(() => {
    if (isEdit && jobId) {
      const job = getJobById(jobId);
      if (job) {
        form.setFieldsValue({
          code: job.code,
          name: job.name,
          description: job.description,
          maxRetries: job.maxRetries ?? 3,
          status: job.status ?? 'ACTIVE',
          jobType: job.jobType ?? 'SPRING_BEAN',
          targetComponent: job.targetComponent ?? '',
          jobParamsYaml: job.jobParamsYaml ?? '',
          misfirePolicy: job.misfirePolicy ?? 'FIRE_NOW',
          timeoutSeconds: job.timeoutSeconds ?? 300,
          disallowConcurrent: job.disallowConcurrent ?? true,
          retryInterval: job.retryInterval ?? 30,
          backoffStrategy: job.backoffStrategy ?? 'FIXED',
          backoffMultiplier: job.backoffMultiplier ?? 2,
          notificationSettings: job.notificationSettings ?? {
            enableNotify: false,
            events: {
              onStart: { enabled: false, channels: [] },
              onSuccess: { enabled: false, channels: [] },
              onFailure: { enabled: false, channels: [] },
              onFinalFailure: { enabled: false, channels: [] },
            },
          },
        });
        setCron(job.cron);
        setTimezone(job.timezone);
        setJobName(job.name);
      } else {
        message.error('Job không tồn tại');
        router.push(LIST_PATH);
      }
    } else {
      form.setFieldsValue({
        status: 'ACTIVE',
        maxRetries: 3,
        jobType: 'SPRING_BEAN',
        misfirePolicy: 'FIRE_NOW',
        timeoutSeconds: 300,
        disallowConcurrent: true,
        retryInterval: 30,
        backoffStrategy: 'FIXED',
        backoffMultiplier: 2,
        notificationSettings: {
          enableNotify: false,
          events: {
            onStart: { enabled: false, channels: [] },
            onSuccess: { enabled: false, channels: [] },
            onFailure: { enabled: false, channels: [] },
            onFinalFailure: { enabled: false, channels: [] },
          },
        },
      });
    }
  }, [isEdit, jobId, form, message, router]);

  const handleSubmit = async () => {
    if (!isValidCron(cron)) {
      setCronError('Lịch chạy không hợp lệ — vui lòng chọn hoặc nhập biểu thức cron đúng.');
      message.error('Lịch chạy không hợp lệ');
      return;
    }
    try {
      const values = await form.validateFields();
      saveJobToStore(
        {
          ...values,
          cron,
          timezone,
        },
        jobId,
      );
      message.success(isEdit ? 'Cập nhật job thành công' : 'Thêm job mới thành công');
      router.push(LIST_PATH);
    } catch {
      message.error('Vui lòng kiểm tra lại các trường bắt buộc');
    }
  };

  useHeaderActions(
    {
      title: isEdit ? `Chỉnh sửa job${jobName ? `: ${jobName}` : ''}` : 'Thêm job mới',
      actions: [
        { key: 'back', label: 'Quay lại', icon: <ArrowLeftOutlined />, onClick: () => router.push(LIST_PATH) },
        { key: 'save', label: isEdit ? 'Cập nhật' : 'Lưu', type: 'primary', icon: <SaveOutlined />, onClick: handleSubmit },
      ],
    },
    [isEdit, jobName, cron, timezone, cronError],
  );

  // Dynamic Label & Placeholder cho Target Component
  const getTargetLabel = (type: JobType) => {
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

  const getTargetPlaceholder = (type: JobType) => {
    switch (type) {
      case 'SPRING_BEAN':
        return 'VD: customerSyncService.syncDailyBatch';
      case 'REST_API':
        return 'VD: https://api.internal/v1/sync';
      case 'SQL_SCRIPT':
        return 'VD: CALL proc_purge_logs(?);';
      default:
        return '';
    }
  };

  // Helper toggle event channel trong Notification Matrix
  const handleMatrixChannelChange = (
    eventKey: 'onStart' | 'onSuccess' | 'onFailure' | 'onFinalFailure',
    channel: NotificationChannel,
    checked: boolean,
  ) => {
    const currentSettings = form.getFieldValue('notificationSettings') || {};
    const currentEvents = currentSettings.events || {};
    const eventConfig = currentEvents[eventKey] || { enabled: false, channels: [] };

    let newChannels = [...(eventConfig.channels || [])];
    if (checked) {
      if (!newChannels.includes(channel)) newChannels.push(channel);
    } else {
      newChannels = newChannels.filter((c: string) => c !== channel);
    }

    const newEnabled = newChannels.length > 0;

    form.setFieldsValue({
      notificationSettings: {
        ...currentSettings,
        events: {
          ...currentEvents,
          [eventKey]: {
            enabled: newEnabled,
            channels: newChannels,
          },
        },
      },
    });
  };

  const matrixEvents: Array<{ key: 'onStart' | 'onSuccess' | 'onFailure' | 'onFinalFailure'; title: string; desc: string }> = [
    { key: 'onStart', title: 'Bắt đầu Job', desc: 'Gửi khi Job bắt đầu được kích hoạt' },
    { key: 'onSuccess', title: 'Kết thúc Job (Thành công)', desc: 'Gửi khi Job hoàn thành xử lý thành công' },
    { key: 'onFailure', title: 'Job gặp Lỗi', desc: 'Gửi mỗi khi lượt chạy xảy ra sự cố' },
    { key: 'onFinalFailure', title: 'Thất bại hoàn toàn', desc: 'Gửi khi đã thử lại hết số lần max retries vẫn lỗi' },
  ];

  return (
    <PageLayout>
      <Form form={form} layout="vertical" requiredMark style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
        
        {/* 1. Định nghĩa Kỹ thuật & Nghiệp vụ */}
        <SectionCard title="Thông tin Cơ bản & Định nghĩa Kỹ thuật">
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="code"
                label="Mã job"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã job' },
                  { pattern: /^[A-Z0-9_]+$/, message: 'Chỉ gồm chữ in hoa, số và dấu gạch dưới' },
                ]}
              >
                <Input placeholder="VD: SYNC_CUSTOMER_DB" disabled={isEdit} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item name="name" label="Tên job" rules={[{ required: true, message: 'Vui lòng nhập tên job' }]}>
                <Input placeholder="VD: Đồng bộ dữ liệu khách hàng" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn về công dụng và mục tiêu của job" />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item name="jobType" label="Loại xử lý (Job Type)" rules={[{ required: true }]}>
                <Select options={JOB_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item
                name="targetComponent"
                label={getTargetLabel(selectedJobType)}
                rules={[{ required: true, message: 'Vui lòng nhập đối tượng / đường dẫn thực thi' }]}
              >
                <Input placeholder={getTargetPlaceholder(selectedJobType)} style={{ fontFamily: typography.fontFamily.mono }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="jobParamsYaml"
            label="Tham số nghiệp vụ bổ sung (YAML Payload)"
            tooltip="Payload chứa tham số động dạng YAML truyền cho Job Engine khi chạy"
          >
            <Input.TextArea
              rows={3}
              placeholder={'sourceApi: "https://crm.internal/api/v2"\nbatchSize: 500'}
              style={{ fontFamily: typography.fontFamily.mono, backgroundColor: colors.neutral[900], color: colors.success.base }}
            />
          </Form.Item>
        </SectionCard>

        {/* 2. Lập lịch & Điều phối */}
        <SectionCard title="Lập lịch & Điều phối (Scheduling)">
          <Form.Item label="Lịch chạy Cron" required>
            <CronScheduler
              cron={cron}
              timezone={timezone}
              onCronChange={handleCronChange}
              onTimezoneChange={setTimezone}
              errorText={cronError}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="misfirePolicy" label="Chính sách Misfire (Xử lý khi bỏ lỡ lượt chạy)">
                <Select options={MISFIRE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="timeoutSeconds"
                label="Thời gian chờ tối đa (Timeout)"
                tooltip="Thời gian tối đa tính bằng Giây trước khi hệ thống ngắt chạy"
              >
                <InputNumber min={1} style={{ width: '100%' }} suffix="giây" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="disallowConcurrent" valuePropName="checked">
            <Switch size="small" />
            <Text style={{ marginLeft: spacing[2], fontSize: typography.fontSize.sm }}>
              <strong>Khóa chống chạy song song (Disallow Concurrent Execution):</strong> Ngăn không cho lượt chạy mới khởi tạo khi lượt cũ chưa hoàn tất.
            </Text>
          </Form.Item>
        </SectionCard>

        {/* 3. Chính sách Thử lại khi Lỗi */}
        <SectionCard title="Chính sách Thử lại khi Lỗi (Retry Policy)">
          <Row gutter={24}>
            <Col xs={24} md={6}>
              <Form.Item
                name="maxRetries"
                label="Số lần thử lại tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số lần thử lại' }]}
              >
                <InputNumber min={0} max={10} style={{ width: '100%' }} suffix="lần" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="retryInterval" label="Khoảng thời gian chờ giữa các lần (giây)">
                <InputNumber min={1} style={{ width: '100%' }} suffix="giây" />
              </Form.Item>
            </Col>
            <Col xs={24} md={selectedBackoffStrategy === 'EXPONENTIAL' ? 6 : 12}>
              <Form.Item name="backoffStrategy" label="Thuật toán giãn cách (Backoff)">
                <Select options={BACKOFF_STRATEGY_OPTIONS} />
              </Form.Item>
            </Col>
            {selectedBackoffStrategy === 'EXPONENTIAL' && (
              <Col xs={24} md={6}>
                <Form.Item
                  name="backoffMultiplier"
                  label="Hệ số nhân (Multiplier)"
                  tooltip="Khoảng chờ giữa các lần thử lại sẽ được nhân với hệ số này"
                >
                  <Select options={BACKOFF_MULTIPLIER_OPTIONS} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </SectionCard>

        {/* 4. Cấu hình Cảnh báo & Thông báo Sự cố */}
        <SectionCard
          title="Thiết lập Cảnh báo & Thông báo Sự cố"
          extra={
            <Form.Item name={['notificationSettings', 'enableNotify']} valuePropName="checked" noStyle>
              <Switch checkedChildren="Bật cảnh báo" unCheckedChildren="Tắt cảnh báo" />
            </Form.Item>
          }
        >
          {enableNotify ? (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name={['notificationSettings', 'notifyEmails']} label="Danh sách Email nhận cảnh báo (phân cách bởi dấu phẩy)">
                    <Input placeholder="devops@cic.org.vn, sysadmin@cic.org.vn" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name={['notificationSettings', 'notifyPhoneNumbers']} label="Danh sách SĐT nhận SMS (phân cách bởi dấu phẩy)">
                    <Input placeholder="0901234567, 0988776655" />
                  </Form.Item>
                </Col>
              </Row>

              <div>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2], display: 'block' }}>
                  Ma trận Tùy chọn Kênh thông báo theo Sự kiện:
                </Text>
                
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const currentSettings = form.getFieldValue('notificationSettings') || {};
                    const events = currentSettings.events || {};

                    const matrixColumns = [
                      {
                        title: 'Sự kiện / Trạng thái Job',
                        key: 'event',
                        render: (_: any, record: typeof matrixEvents[0]) => (
                          <div>
                            <Text strong style={{ fontSize: typography.fontSize.sm }}>{record.title}</Text>
                            <div style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>{record.desc}</div>
                          </div>
                        ),
                      },
                      {
                        title: 'SMS (Điện thoại)',
                        key: 'sms',
                        width: 140,
                        align: 'center' as const,
                        render: (_: any, record: typeof matrixEvents[0]) => {
                          const eventCfg = events[record.key] || { channels: [] };
                          const isChecked = (eventCfg.channels || []).includes('SMS');
                          return (
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => handleMatrixChannelChange(record.key, 'SMS', e.target.checked)}
                            >
                              SMS
                            </Checkbox>
                          );
                        },
                      },
                      {
                        title: 'PUSH (Web Notification)',
                        key: 'push',
                        width: 180,
                        align: 'center' as const,
                        render: (_: any, record: typeof matrixEvents[0]) => {
                          const eventCfg = events[record.key] || { channels: [] };
                          const isChecked = (eventCfg.channels || []).includes('PUSH');
                          return (
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => handleMatrixChannelChange(record.key, 'PUSH', e.target.checked)}
                            >
                              Push (Web)
                            </Checkbox>
                          );
                        },
                      },
                      {
                        title: 'EMAIL',
                        key: 'email',
                        width: 140,
                        align: 'center' as const,
                        render: (_: any, record: typeof matrixEvents[0]) => {
                          const eventCfg = events[record.key] || { channels: [] };
                          const isChecked = (eventCfg.channels || []).includes('EMAIL');
                          return (
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => handleMatrixChannelChange(record.key, 'EMAIL', e.target.checked)}
                            >
                              Email
                            </Checkbox>
                          );
                        },
                      },
                    ];

                    return (
                      <Table
                        columns={matrixColumns}
                        dataSource={matrixEvents}
                        rowKey="key"
                        pagination={false}
                        size="small"
                        bordered
                      />
                    );
                  }}
                </Form.Item>
              </div>
            </Space>
          ) : (
            <Card style={{ backgroundColor: colors.bg.page, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: typography.fontSize.sm }}>
                Tính năng cảnh báo sự cố đang tắt cho Job này. Gạt nút công tắc ở trên để kích hoạt gửi thông báo qua SMS, Push (Web) hoặc Email.
              </Text>
            </Card>
          )}
        </SectionCard>

      </Form>
    </PageLayout>
  );
};

const JobFormPage: React.FC<JobFormPageProps> = ({ mode }) => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <JobFormPageInner mode={mode} />
  </App>
);

export default JobFormPage;


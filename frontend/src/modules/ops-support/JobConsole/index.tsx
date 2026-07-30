'use client';

import React, { useState } from 'react';
import {
  App,
  Row,
  Col,
  Tabs,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Switch,
  Table,
  message,
} from 'antd';
import {
  SlidersOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  PlusOutlined,
  CodeOutlined,
  CalendarOutlined,
  SyncOutlined,
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { colors, spacing, radius, typography } from '@/design-system';
import { useJobConsole } from './useJobConsole';
import JobSidebarList from './JobSidebarList';
import JobConfigTab from './JobConfigTab';
import JobLogsTab from './JobLogsTab';
import JobFooterActions from './JobFooterActions';
import type { IJobConsoleItem, JobConsoleType } from './types';

const { Text } = Typography;

const JobConsoleInner: React.FC = () => {
  const {
    currentJob,
    filteredJobsList,
    selectedCode,
    activeTab,
    keyword,
    statusFilter,
    setKeyword,
    setStatusFilter,
    setActiveTab,
    selectJob,
    updateCurrentJobField,
    toggleStatus,
    runNow,
    saveJobConfig,
    createNewJob,
  } = useJobConsole();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [lastUpdated, setLastUpdated] = useState<string>('2026-07-24 09:24');

  const createJobType = Form.useWatch('type', createForm) || 'SPRING_BEAN';
  const createBackoff = Form.useWatch('backoff', createForm) || 'EXPONENTIAL';
  const createEnableNotify = Form.useWatch('enableNotify', createForm) ?? true;

  const handleRefreshEngine = () => {
    setLastUpdated(new Date().toISOString().replace('T', ' ').substring(0, 16));
    message.success('Đã làm mới dữ liệu Job Engine');
  };

  const handleOpenCreateModal = () => {
    createForm.resetFields();
    createForm.setFieldsValue({
      type: 'SPRING_BEAN',
      cron: '0 0 1 * * *',
      cronDesc: 'Chạy vào 01:00 AM hằng ngày',
      misfire: 'FIRE_NOW',
      timeout: 300,
      concurrent: true,
      maxRetries: 3,
      retryInterval: 60,
      backoff: 'EXPONENTIAL',
      backoffMultiplier: '2x',
      enableNotify: true,
      notifyEmails: 'admin@cic.org.vn',
      params: `# Tham số YAML động\nsourceApi: "https://api.internal/v1"\nbatchSize: 500`,
      notificationMatrix: {
        onStart: { sms: false, push: false, email: true },
        onSuccess: { sms: false, push: false, email: true },
        onFailure: { sms: true, push: true, email: true },
        onRetry: { sms: false, push: true, email: false },
      },
    });
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      let label = 'Spring Bean & Method Target';
      if (values.type === 'REST_API') label = 'REST API Endpoint URL';
      else if (values.type === 'SQL_SCRIPT') label = 'Stored Procedure / SQL Command';

      const newJobItem: IJobConsoleItem = {
        cronDesc: 'Lịch chạy mới khởi tạo',
        status: 'ACTIVE',
        logs: [],
        ...values,
        targetLabel: label,
      };

      createNewJob(newJobItem);
      setCreateModalOpen(false);
      message.success(`Đã khởi tạo Job mới: ${newJobItem.code}`);
    } catch {
      message.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
    }
  };

  useHeaderActions(
    {
      title: 'Quản lý Job 2 - Engine & Management Console',
      actions: [
        {
          key: 'refresh',
          label: 'Làm mới Engine',
          icon: <ReloadOutlined />,
          onClick: handleRefreshEngine,
        },
        {
          key: 'create',
          label: 'Tạo Job mới',
          type: 'primary',
          icon: <PlusOutlined />,
          onClick: handleOpenCreateModal,
        },
      ],
    },
    [],
  );

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

  const createNotificationColumns = [
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
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item name={['notificationMatrix', record.eventKey, 'sms']} valuePropName="checked" noStyle>
          <Checkbox disabled={!createEnableNotify} />
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
        <Form.Item name={['notificationMatrix', record.eventKey, 'push']} valuePropName="checked" noStyle>
          <Checkbox disabled={!createEnableNotify} />
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
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Form.Item name={['notificationMatrix', record.eventKey, 'email']} valuePropName="checked" noStyle>
          <Checkbox disabled={!createEnableNotify} />
        </Form.Item>
      ),
    },
  ];

  const createNotificationData = [
    { key: 'onStart', eventKey: 'onStart', eventLabel: 'Khi bắt đầu chạy Job' },
    { key: 'onSuccess', eventKey: 'onSuccess', eventLabel: 'Khi hoàn tất thành công' },
    { key: 'onFailure', eventKey: 'onFailure', eventLabel: 'Khi gặp sự cố / Thất bại' },
    { key: 'onRetry', eventKey: 'onRetry', eventLabel: 'Khi thử lại (Retry)' },
  ];

  return (
    <PageLayout>
      <Row gutter={16}>
        {/* Lề trái: Master list sidebar */}
        <Col xs={24} lg={8} xl={7}>
          <JobSidebarList
            jobs={filteredJobsList}
            selectedCode={selectedCode}
            keyword={keyword}
            statusFilter={statusFilter}
            onSearchChange={setKeyword}
            onStatusFilterChange={setStatusFilter}
            onSelectJob={selectJob}
          />
        </Col>

        {/* Vùng chính: Detail config & logs */}
        <Col xs={24} lg={16} xl={17}>
          <div
            style={{
              backgroundColor: colors.bg.container,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.split}`,
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 170px)',
              minHeight: 650,
              overflow: 'hidden',
            }}
          >
            {/* Header Tabs bar */}
            <div
              style={{
                borderBottom: `1px solid ${colors.border.split}`,
                backgroundColor: colors.bg.subtle,
                paddingLeft: spacing[4],
                paddingRight: spacing[4],
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as 'config' | 'logs')}
                style={{ marginBottom: -1 }}
                items={[
                  {
                    key: 'config',
                    label: (
                      <Space size={6}>
                        <SlidersOutlined />
                        <span>Cấu hình & Lập lịch</span>
                      </Space>
                    ),
                  },
                  {
                    key: 'logs',
                    label: (
                      <Space size={6}>
                        <UnorderedListOutlined />
                        <span>Lịch sử thực thi (Logs)</span>
                      </Space>
                    ),
                  },
                ]}
              />

              <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
                Cập nhật lúc: <Text strong style={{ fontSize: typography.fontSize.xs }}>{lastUpdated}</Text>
              </Text>
            </div>

            {/* Nội dung Tab (Scrollable) */}
            <div
              style={{
                flex: 1,
                padding: spacing[5],
                overflowY: 'auto',
              }}
            >
              {currentJob ? (
                activeTab === 'config' ? (
                  <JobConfigTab job={currentJob} onChange={updateCurrentJobField} />
                ) : (
                  <JobLogsTab logs={currentJob.logs || []} onRefreshLogs={handleRefreshEngine} />
                )
              ) : (
                <div style={{ textAlign: 'center', padding: spacing[8], color: colors.text.tertiary }}>
                  Chưa chọn job nào
                </div>
              )}
            </div>

            {/* Sticky Footer Actions */}
            {currentJob && (
              <JobFooterActions
                status={currentJob.status}
                onRunNow={runNow}
                onToggleStatus={toggleStatus}
                onSave={() => saveJobConfig(currentJob)}
              />
            )}
          </div>
        </Col>
      </Row>

      {/* Modal Tạo Job mới đầy đủ 4 phần thông tin */}
      <Modal
        title="Tạo mới job engine"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        width={820}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3] }}>
            <Button type="primary" onClick={handleCreateSubmit} style={{ minWidth: 120 }}>
              Tạo job
            </Button>
            <Button onClick={() => setCreateModalOpen(false)} style={{ minWidth: 120 }}>
              Hủy
            </Button>
          </div>
        }
      >
        <div style={{ maxHeight: '68vh', overflowY: 'auto', paddingRight: spacing[2] }}>
          <Form form={createForm} layout="vertical" style={{ marginTop: spacing[2], display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            
            {/* 1. Định nghĩa Kỹ thuật */}
            <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[3] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <CodeOutlined style={{ color: colors.primary[500] }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase' }}>
                  1. Định nghĩa Kỹ thuật (Job Definition)
                </Text>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="code"
                    label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Mã Job (Job Code)</Text>}
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã Job' },
                      { pattern: /^[A-Z0-9_]+$/, message: 'Mã job chỉ bao gồm chữ in hoa, số và dấu gạch dưới' },
                    ]}
                  >
                    <Input placeholder="VD: JOB_EXPORT_DAILY_DATA" style={{ fontFamily: typography.fontFamily.mono }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="name" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tên hiển thị</Text>} rules={[{ required: true, message: 'Vui lòng nhập tên Job' }]}>
                    <Input placeholder="VD: Xuất dữ liệu báo cáo hằng ngày" />
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
                  <Form.Item name="target" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Đích thực thi</Text>} rules={[{ required: true }]}>
                    <Input placeholder={getTargetPlaceholder(createJobType)} style={{ fontFamily: typography.fontFamily.mono }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="params" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Tham số nghiệp vụ bổ sung (YAML Payload)</Text>}>
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

            {/* 2. Lập lịch & Điều phối */}
            <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[3] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <CalendarOutlined style={{ color: colors.primary[500] }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase' }}>
                  2. Cấu hình Lập lịch & Điều phối (Scheduling)
                </Text>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={14}>
                  <Form.Item name="cron" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Biểu thức Cron (Cron Expression)</Text>} rules={[{ required: true }]}>
                    <Input placeholder="0 0 1 * * *" style={{ fontFamily: typography.fontFamily.mono, fontWeight: 'bold' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={10}>
                  <Form.Item name="misfire" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Chính sách Misfire</Text>}>
                    <Select
                      options={[
                        { value: 'FIRE_NOW', label: 'Fire Now (Chạy bù khi khôi phục)' },
                        { value: 'DO_NOTHING', label: 'Do Nothing (Bỏ qua lượt lỗi)' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="timeout" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Thời gian chờ tối đa (Timeout Seconds)</Text>}>
                    <InputNumber min={1} style={{ width: '100%' }} suffix="giây" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
                  <Form.Item name="concurrent" valuePropName="checked" noStyle>
                    <Checkbox>Không cho phép chạy song song (Disallow Concurrent)</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* 3. Chính sách Thử lại khi Lỗi */}
            <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[3] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <SyncOutlined style={{ color: colors.primary[500] }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase' }}>
                  3. Chính sách Thử lại khi Lỗi (Retry Policy)
                </Text>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={createBackoff === 'EXPONENTIAL' ? 8 : 12}>
                  <Form.Item name="maxRetries" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Số lần thử lại tối đa</Text>}>
                    <InputNumber min={0} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={createBackoff === 'EXPONENTIAL' ? 8 : 12}>
                  <Form.Item name="retryInterval" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Khoảng chờ ban đầu (Giây)</Text>}>
                    <InputNumber min={1} style={{ width: '100%' }} suffix="s" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={createBackoff === 'EXPONENTIAL' ? 4 : 12}>
                  <Form.Item name="backoff" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Thuật toán Backoff</Text>}>
                    <Select
                      options={[
                        { value: 'FIXED', label: 'Cố định (Fixed)' },
                        { value: 'EXPONENTIAL', label: 'Cấp số nhân (Exponential)' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                {createBackoff === 'EXPONENTIAL' && (
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

            {/* 4. Cảnh báo & Thông báo */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[2] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                  <BellOutlined style={{ color: colors.primary[500] }} />
                  <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase' }}>
                    4. Thiết lập Cảnh báo Sự cố (Alerting & Notifications)
                  </Text>
                </div>

                <Form.Item name="enableNotify" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </div>

              <div style={{ opacity: createEnableNotify ? 1 : 0.4, pointerEvents: createEnableNotify ? 'auto' : 'none' }}>
                <Form.Item name="notifyEmails" label={<Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>Email nhận cảnh báo</Text>}>
                  <Input placeholder="admin@company.com, alert@company.com" disabled={!createEnableNotify} />
                </Form.Item>

                <Text strong style={{ fontSize: typography.fontSize.sm, display: 'block', marginBottom: spacing[2] }}>
                  Ma trận Kênh thông báo theo sự kiện (SMS / Push Web / Email)
                </Text>

                <Table
                  columns={createNotificationColumns}
                  dataSource={createNotificationData}
                  pagination={false}
                  size="small"
                  bordered
                />
              </div>
            </div>

          </Form>
        </div>
      </Modal>
    </PageLayout>
  );
};

export const JobConsole: React.FC = () => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <JobConsoleInner />
  </App>
);

export default JobConsole;

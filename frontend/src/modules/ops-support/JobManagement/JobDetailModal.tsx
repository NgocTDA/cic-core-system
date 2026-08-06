'use client';

import React, { useState } from 'react';
import {
  Modal,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Typography,
  Table,
  Checkbox,
  message,
} from 'antd';
import {
  PlayCircleOutlined,
  CodeOutlined,
  CalendarOutlined,
  BellOutlined,
  MessageOutlined,
  DesktopOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ChangeHistoryCollapse } from '@/components/ui';
import { colors, spacing, radius, typography } from '@/design-system';
import type { IJob } from './types';
import { mockChangeHistoryData } from './mockData';
import { getCronDescription } from './cronUtils';
import RunProgressDrawer from './modals/RunProgressDrawer';

const { Text } = Typography;

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

interface JobDetailModalProps {
  visible: boolean;
  job: IJob | null;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  visible,
  job,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  if (!job) return null;

  const handleRunJob = () => {
    Modal.confirm({
      title: 'Xác nhận thực hiện Job',
      icon: null,
      centered: true,
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>Bạn có chắc chắn muốn kích hoạt chạy Job này ngay bây giờ không?</p>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: radius.md, border: `1px solid ${colors.border.base}` }}>
            <div><Text type="secondary">Mã Job: </Text><Text code strong style={{ color: '#000000' }}>{job.code}</Text></div>
            <div><Text type="secondary">Tên Job: </Text><Text strong>{job.name}</Text></div>
          </div>
        </div>
      ),
      okText: 'Chạy ngay',
      cancelText: 'Hủy',
      okButtonProps: { type: 'primary', style: { minWidth: 90 } },
      cancelButtonProps: { style: { minWidth: 90 } },
      footer: (_, { OkBtn, CancelBtn }) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          <CancelBtn />
          <OkBtn />
        </div>
      ),
      onOk: () => {
        setIsRunning(true);
        message.success(`Job ${job.code} đã bắt đầu chạy thành công`);
      },
    });
  };

  const handleStopJob = () => {
    setTimeout(() => {
      message.success('Đã dừng Job thành công');
      setIsRunning(false);
    }, 800);
  };

  // Email tags list parsing
  const emailTags = job.notifyEmails
    ? job.notifyEmails.split(/[,;]\s*/).filter(Boolean)
    : ['admin@cic.org.vn', 'alert@cic.org.vn'];

  // Matrix table data formatting
  const matrix = job.notificationMatrix || {
    onStart: { sms: false, push: false, email: true, customRecipients: [] },
    onSuccess: { sms: false, push: false, email: true, customRecipients: [] },
    onFailure: { sms: true, push: true, email: true, customRecipients: ['alert_group@cic.org.vn'] },
    onRetry: { sms: false, push: true, email: false, customRecipients: [] },
  };

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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
              <Tag key={item} color="blue">
                {item}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
            Chưa cấu hình
          </Text>
        ),
    },
  ];

  const notificationData = [
    { key: 'onStart', eventLabel: 'Khi bắt đầu chạy Job', ...matrix.onStart },
    { key: 'onSuccess', eventLabel: 'Khi hoàn tất thành công', ...matrix.onSuccess },
    { key: 'onFailure', eventLabel: 'Khi gặp sự cố / Thất bại', ...matrix.onFailure },
    { key: 'onRetry', eventLabel: 'Khi thử lại (Retry)', ...matrix.onRetry },
  ];

  return (
    <>
      <Modal
        title={`Chi tiết Job: ${job.name}`}
        open={visible}
        onCancel={onClose}
        width="70vw"
        centered
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onClose} style={{ minWidth: 100 }}>
              Đóng
            </Button>
          </div>
        }
      >
        <div style={{ maxHeight: 'calc(80vh - 110px)', overflowY: 'auto', paddingRight: 4 }}>
          {/* Quick Action Header Bar: Status Tag first, Chạy ngay button to its right */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: spacing[3],
              marginBottom: spacing[4],
              paddingBottom: spacing[3],
              borderBottom: `1px solid ${colors.border.split}`,
            }}
          >
            <Tag
              color={job.status === 'ACTIVE' ? 'green' : 'default'}
              style={{ fontSize: 13, padding: '4px 12px', margin: 0 }}
            >
              {job.status === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG'}
            </Tag>

            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleRunJob}
            >
              Chạy ngay
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
            {/* KHỐI 1: Thông tin chung */}
            <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                <CodeOutlined style={{ color: colors.primary[500], fontSize: 18 }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                  Thông tin chung
                </Text>
              </div>

              {/* Hàng 1: Mã Job, Tên Job, Loại Job, Mã dịch vụ */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mã Job
                    </Text>
                    <Text code strong style={{ fontSize: typography.fontSize.base, color: '#000000' }}>
                      {job.code}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tên Job
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {job.name}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Loại Job
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {categoryMap[job.category] || job.category}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mã dịch vụ
                    </Text>
                    <Text code strong style={{ fontSize: typography.fontSize.base, color: '#000000' }}>
                      {job.serviceCode || 'SVC_CIC_CORE_SYNC'}
                    </Text>
                  </div>
                </Col>
              </Row>

              {/* Hàng 2: Mô tả Job */}
              <Row gutter={[16, 16]} style={{ marginTop: spacing[3] }}>
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mô tả Job
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                      {job.description || 'Không có mô tả'}
                    </Text>
                  </div>
                </Col>
              </Row>

              {/* Hàng 3: Tham số bổ sung */}
              <Row gutter={[16, 16]} style={{ marginTop: spacing[3] }}>
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tham số bổ sung (YAML/JSON)
                    </Text>
                    <pre
                      style={{
                        fontFamily: typography.fontFamily.mono,
                        fontSize: typography.fontSize.sm,
                        backgroundColor: '#f8fafc',
                        color: '#0f172a',
                        border: `1px solid ${colors.border.base}`,
                        borderRadius: radius.md,
                        padding: spacing[3],
                        margin: 0,
                        maxHeight: 180,
                        overflowY: 'auto',
                      }}
                    >
                      {job.params || '# Không có tham số bổ sung'}
                    </pre>
                  </div>
                </Col>
              </Row>
            </div>

            {/* KHỐI 2: Cấu hình Lập lịch & Xử lý lỗi */}
            <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                <CalendarOutlined style={{ color: colors.primary[500], fontSize: 18 }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                  Lập lịch và xử lý lỗi
                </Text>
              </div>

              {/* HÀNG 1: Điều kiện kích hoạt, Thời gian chờ tối đa, Xử lý khi bỏ lỡ, Cho phép chạy song song */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Điều kiện kích hoạt
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {triggerTypeMap[job.triggerType || 'SCHEDULER'] || 'Bộ lập lịch (Scheduler)'}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Thời gian chờ tối đa
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {job.timeout || 300} giây
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Xử lý khi bỏ lỡ lượt chạy
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {misfireMap[job.misfire || 'FIRE_NOW']}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Cho phép chạy song song
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {job.concurrent ? 'Khóa chạy song song' : 'Cho phép chạy song song'}
                    </Text>
                  </div>
                </Col>
              </Row>

              {/* HÀNG 2: Biểu thức Cron, Số lần thử lại tối đa, Khoảng chờ ban đầu, Giãn cách thời gian */}
              <Row gutter={[16, 16]} style={{ marginTop: spacing[3] }}>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Biểu thức Cron
                    </Text>
                    <code
                      style={{
                        background: colors.neutral[100],
                        padding: '4px 10px',
                        borderRadius: radius.md,
                        fontFamily: typography.fontFamily.mono,
                        fontWeight: 'bold',
                        fontSize: typography.fontSize.base,
                        color: '#000000',
                      }}
                    >
                      {job.cron || job.schedule?.expression || '0 0 1 * * *'}
                    </code>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.xs, display: 'block', marginTop: 4, color: colors.primary[600] }}>
                      💡 Diễn giải: {getCronDescription(job.cron || job.schedule?.expression || '0 0 1 * * *')}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Số lần thử lại tối đa
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {job.maxRetries ?? job.retryPolicy?.maxRetries ?? 3} lần
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Khoảng chờ ban đầu
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {job.retryInterval ?? 60} giây
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Giãn cách thời gian (Backoff)
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.base }}>
                      {backoffMap[job.backoff || 'EXPONENTIAL_2X'] || 'Cấp số nhân - 2x'}
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>

            {/* KHỐI 3: Thiết lập Cảnh báo Sự cố */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                <BellOutlined style={{ color: colors.primary[500], fontSize: 18 }} />
                <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                  Thiết lập cảnh báo sự cố
                </Text>
              </div>

              <div>
                <div style={{ marginBottom: spacing[3] }}>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    Email nhận cảnh báo chung
                  </Text>
                  <Space wrap size={[6, 6]}>
                    {emailTags.map((email) => (
                      <Tag key={email} color="blue" icon={<MailOutlined />}>
                        {email}
                      </Tag>
                    ))}
                  </Space>
                </div>

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

            {/* KHỐI 4: Bảng Lịch sử thay đổi (Audit Change History Collapse) */}
            <ChangeHistoryCollapse data={mockChangeHistoryData} />
          </div>
        </div>
      </Modal>

      {/* Run Progress Drawer */}
      {job && (
        <RunProgressDrawer
          visible={isRunning}
          jobName={job.name}
          jobCode={job.code}
          onClose={() => setIsRunning(false)}
          onStop={handleStopJob}
        />
      )}
    </>
  );
};

export default JobDetailModal;

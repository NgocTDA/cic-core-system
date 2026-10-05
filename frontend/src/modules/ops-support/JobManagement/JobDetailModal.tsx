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
  Input,
  Empty,
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
import { ChangeHistoryCollapse, StatusTag } from '@/components/ui';
import { useRole, hasPermission } from '@/context/RoleContext';
import type { IJob } from './types';
import { mockChangeHistoryData, mockJobs } from './mockData';
import { getCronDescription } from './cronUtils';

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
  const { currentRole } = useRole();
  if (!job) return null;

  const isViewerRole = currentRole === 'ROLE-CBNV' || currentRole === 'VIEWER';

  // Helper mask secrets in YAML/JSON (M2-03)
  const maskSecretParams = (paramsStr?: string): string => {
    if (!paramsStr) return '# Không có tham số bổ sung';
    if (!isViewerRole) return paramsStr;
    return paramsStr.replace(
      /((?:password|secret|token|key|pwd)[\w-]*\s*[:=]\s*)(['"]?)([^'"\n\r]+)(['"]?)/gi,
      '$1$2******$4'
    );
  };

  // Helper mask email before @ (M2-03)
  const maskEmail = (email: string): string => {
    if (!isViewerRole) return email;
    return email.replace(/^[^@]+/, '*****');
  };

  const handleRunJob = () => {
    Modal.confirm({
      title: 'Xác nhận thực hiện Job',
      icon: null,
      centered: true,
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>Bạn có chắc chắn muốn kích hoạt chạy job không?</p>
          <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid var(--border)` }}>
            <div><Text type="secondary">Mã Job: </Text><Text code strong style={{ color: 'var(--text)' }}>{job.code}</Text></div>
            <div><Text type="secondary">Tên Job: </Text><Text strong>{job.name}</Text></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Tham số chạy bổ sung (JSON/YAML):</div>
            <Input.TextArea 
              defaultValue={job.params || ''}
              placeholder='{ "run_date": "2023-10-01" }'
              rows={4}
              maxLength={1500}
            />
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
        message.success(`Job ${job.code} đã bắt đầu chạy thành công`);
      },
    });
  };

  // Email tags list parsing
  const rawEmailTags = job.notifyEmails
    ? job.notifyEmails.split(/[,;]\s*/).filter(Boolean)
    : ['admin@cic.org.vn', 'alert@cic.org.vn'];
  const emailTags = rawEmailTags.map(maskEmail);

  const historyData = mockChangeHistoryData.map((item) => ({
    ...item,
    ipAddress: isViewerRole && item.ipAddress
      ? item.ipAddress.replace(/^\d+\.\d+\.\d+\./, '***.***.***.')
      : item.ipAddress,
  }));

  const matrix = job.notificationMatrix || {
    onStart: { sms: false, push: false, email: true, customRecipients: [] },
    onSuccess: { sms: false, push: false, email: true, customRecipients: [] },
    onSlaBreach: { sms: false, push: false, email: true, customRecipients: [] },
    onFailure: { sms: true, push: true, email: true, customRecipients: ['alert_group@cic.org.vn'] },
    onRetry: { sms: false, push: true, email: false, customRecipients: [] },
  };

  const dependencies =
    job.dependencies && job.dependencies.length > 0
      ? job.dependencies
      : (job.dependsOn || []).map((id) => ({ jobId: id, conditionType: 'SUCCESS' }));

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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
      render: (val: boolean) => <Checkbox checked={val} disabled />,
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
      render: (recipients: string[]) =>
        recipients && recipients.length > 0 ? (
          <Space wrap size={[4, 4]}>
            {recipients.map((item) => (
              <Tag key={item} color="blue">
                {maskEmail(item)}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Chưa cấu hình
          </Text>
        ),
    },
  ];

  const notificationData = [
    { key: 'onStart', eventLabel: 'Khi bắt đầu chạy', ...matrix.onStart },
    { key: 'onSuccess', eventLabel: 'Khi hoàn tất thành công', ...matrix.onSuccess },
    { key: 'onSlaBreach', eventLabel: 'Khi chạy chậm quá SLA', ...matrix.onSlaBreach },
    { key: 'onFailure', eventLabel: 'Khi gặp sự cố', ...matrix.onFailure },
    { key: 'onRetry', eventLabel: 'Khi thử lại', ...matrix.onRetry },
  ];

  return (
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
              gap: 'var(--spacing-12)',
              marginBottom: 'var(--spacing-16)',
              paddingBottom: 'var(--spacing-12)',
              borderBottom: `1px solid var(--color-neutral-100)`,
            }}
          >
            <StatusTag status={job.status} />

            {hasPermission(currentRole, 'run') && job.status === 'ACTIVE' && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleRunJob}
              >
                Chạy ngay
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)' }}>
            {/* KHỐI 1: Thông tin chung */}
            <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-16)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
                <CodeOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                  Thông tin chung
                </Text>
              </div>

              {/* Hàng 1: Mã Job, Tên Job, Loại Job, Mã dịch vụ */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mã Job
                    </Text>
                    <Text code strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {job.code}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tên Job
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.name}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Loại Job
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {categoryMap[job.category] || job.category}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mã dịch vụ
                    </Text>
                    <Text code strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {job.serviceCode || 'SVC_CIC_CORE_SYNC'}
                    </Text>
                  </div>
                </Col>
              </Row>

              {/* Hàng 2: Mô tả Job */}
              <Row gutter={[16, 16]} style={{ marginTop: 'var(--spacing-12)' }}>
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Mô tả Job
                    </Text>
                    <Text style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {job.description || 'Không có mô tả'}
                    </Text>
                  </div>
                </Col>
              </Row>

              {/* Hàng 3: Tham số bổ sung */}
              <Row gutter={[16, 16]} style={{ marginTop: 'var(--spacing-12)' }}>
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tham số bổ sung (YAML/JSON)
                    </Text>
                    <pre
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text)',
                        border: `1px solid var(--border)`,
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-12)',
                        margin: 0,
                        maxHeight: 180,
                        overflowY: 'auto',
                      }}
                    >
                      {maskSecretParams(job.params)}
                    </pre>
                  </div>
                </Col>
              </Row>
            </div>

            {/* KHỐI 2: Cấu hình Lập lịch & Xử lý lỗi */}
            <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-16)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
                <CalendarOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                  Lập lịch và xử lý lỗi
                </Text>
              </div>

              {/* --- HÀNG 1: CÁC THÔNG TIN ĐIỀU KHIỂN CHÍNH --- */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Điều kiện kích hoạt
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {triggerTypeMap[job.triggerType || 'SCHEDULER'] || 'Bộ lập lịch (Scheduler)'}
                    </Text>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Chạy song song
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.concurrent ? 'Khóa' : 'Cho phép'}
                    </Text>
                  </div>
                </Col>

                {(!job.triggerType || job.triggerType === 'SCHEDULER') && (
                  <Col xs={24} sm={12} md={8}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                        Xử lý khi bỏ lỡ lượt chạy
                      </Text>
                      <Text strong style={{ fontSize: '14px' }}>
                        {misfireMap[job.misfire || 'FIRE_NOW']}
                      </Text>
                    </div>
                  </Col>
                )}
              </Row>

              {/* --- HÀNG 2 VÀ 3: CÁC THÔNG SỐ CẤU HÌNH --- */}
              <Row gutter={[16, 16]} style={{ marginTop: 'var(--spacing-16)' }}>
                {job.triggerType === 'EVENT' ? (
                  <Col xs={24} sm={12} md={8}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                        Tên sự kiện kích hoạt
                      </Text>
                      <Text strong style={{ fontSize: '14px', fontFamily: 'var(--font-mono, monospace)' }}>
                        {job.eventName || 'EVT_CUSTOMER_DATA_IMPORTED'}
                      </Text>
                    </div>
                  </Col>
                ) : (job.triggerType === 'SCHEDULER' || !job.triggerType) ? (
                  <Col xs={24} sm={12} md={8}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                        Biểu thức Cron
                      </Text>
                      {(job.cron || job.schedule?.expression) ? (
                        <>
                          <code
                            style={{
                              background: 'var(--color-neutral-100)',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-md)',
                              fontFamily: 'var(--font-mono, monospace)',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              color: 'var(--text)',
                            }}
                          >
                            {job.cron || job.schedule?.expression}
                          </code>
                          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 4, color: 'var(--primary-hover)' }}>
                            Diễn giải: {getCronDescription(job.cron || job.schedule?.expression || '')}
                          </Text>
                        </>
                      ) : (
                        <Text strong style={{ fontSize: '14px' }}>-</Text>
                      )}
                    </div>
                  </Col>
                ) : null}

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      SLA dự kiến (s)
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.slaTimeout ? `${job.slaTimeout}s` : 'Chưa cấu hình'}
                    </Text>
                  </div>
                </Col>

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Chờ tối đa (giây)
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.timeout ? `${job.timeout}s` : '300s'}
                    </Text>
                  </div>
                </Col>

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Thử lại tối đa
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.maxRetries ?? job.retryPolicy?.maxRetries ?? 3} lần
                    </Text>
                  </div>
                </Col>

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Chờ ban đầu (giây)
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.retryInterval ?? 60}s
                    </Text>
                  </div>
                </Col>

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lưu log TC (ngày)
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.retentionSuccess === 0 ? 'Không lưu' : `${job.retentionSuccess ?? 3650} ngày`}
                    </Text>
                  </div>
                </Col>

                <Col xs={12} sm={8} md={4}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lưu log lỗi (ngày)
                    </Text>
                    <Text strong style={{ fontSize: '14px' }}>
                      {job.retentionError === 0 ? 'Không lưu' : `${job.retentionError ?? 3650} ngày`}
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>

            {/* KHỐI 3: Cấu hình phụ thuộc */}
            <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-20)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)' }}>
                <CodeOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
                <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                  Cấu hình phụ thuộc
                </Text>
              </div>
              {dependencies && dependencies.length > 0 ? (
                <Table
                  dataSource={dependencies}
                  pagination={false}
                  rowKey="jobId"
                  bordered
                  size="small"
                  columns={[
                    {
                      title: 'Mã Job phụ thuộc (xử lý trước)',
                      dataIndex: 'jobId',
                      width: 220,
                      render: (id) => {
                        const depJob = mockJobs.find((j) => j.id === id);
                        return <Text strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>{depJob?.code || id}</Text>;
                      }
                    },
                    {
                      title: 'Tên Job',
                      dataIndex: 'jobId',
                      render: (id) => {
                        const depJob = mockJobs.find((j) => j.id === id);
                        return <Text>{depJob?.name || '—'}</Text>;
                      }
                    },
                    {
                      title: 'Điều kiện kích hoạt',
                      dataIndex: 'conditionType',
                      width: 200,
                      render: (type) => (
                        <Text>
                          {type === 'SUCCESS' ? 'Khi thành công' : type === 'FAILURE' ? 'Khi thất bại' : 'Luôn luôn (Bất kể kết quả)'}
                        </Text>
                      )
                    }
                  ]}
                />
              ) : (
                <Empty description="Không có Job phụ thuộc" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>

            {/* KHỐI 4: Thiết lập Cảnh báo Sự cố */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
                <BellOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                  Thiết lập cảnh báo sự cố
                </Text>
              </div>

              <div>
                <div style={{ marginBottom: 'var(--spacing-12)' }}>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 6 }}>
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

            {/* KHỐI 5: Bảng Lịch sử thay đổi (Audit Change History Collapse) */}
            <ChangeHistoryCollapse data={historyData} />
          </div>
        </div>
      </Modal>
  );
};

export default JobDetailModal;

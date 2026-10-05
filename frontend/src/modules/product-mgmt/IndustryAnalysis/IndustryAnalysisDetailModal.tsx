'use client';

import React from 'react';
import { Modal, Row, Col, Button, Typography, Space, Tag } from 'antd';
import {
  DownloadOutlined,
  PaperClipOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { StatusTag, ChangeHistoryCollapse } from '@/components/ui';
import type { IIndustryProduct } from './types';

const { Text } = Typography;

interface IndustryAnalysisDetailModalProps {
  open: boolean;
  product: IIndustryProduct | null;
  onClose: () => void;
  onDownload: (product: IIndustryProduct) => void;
  onApprove?: (product: IIndustryProduct) => void;
  onSendApproval?: (product: IIndustryProduct) => void;
}

const IndustryAnalysisDetailModal: React.FC<IndustryAnalysisDetailModalProps> = ({
  open,
  product,
  onClose,
  onDownload,
  onApprove,
  onSendApproval,
}) => {
  if (!product) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Chi tiết sản phẩm: ${product.name}`}
      width="70vw"
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', padding: `var(--spacing-8) 0` }}>
          <Button onClick={onClose} style={{ minWidth: 100, borderRadius: 'var(--radius-md)' }}>
            Đóng
          </Button>
        </div>
      }
    >
      <div style={{ maxHeight: 'calc(80vh - 110px)', overflowY: 'auto', paddingRight: 4 }}>
        {/* Quick Action Header Bar (Style chuẩn JobDetailModal) */}
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
          <StatusTag status={product.status} style={{ fontSize: 13, padding: '4px 12px', margin: 0 }} />

          {product.status === 'PENDING' && onApprove && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                onClose();
                onApprove(product);
              }}
            >
              Phê duyệt ngay
            </Button>
          )}

          {(product.status === 'DRAFT' || product.status === 'REJECTED' || product.status === 'RECALLED') && onSendApproval && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                onClose();
                onSendApproval(product);
              }}
            >
              Gửi duyệt
            </Button>
          )}

          {product.fileName && (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => onDownload(product)}
            >
              Tải tệp báo cáo
            </Button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)' }}>
          {/* KHỐI 1: Thông tin chung */}
          <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
              <FileTextOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
              <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                Thông tin chung
              </Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Mã sản phẩm
                  </Text>
                  <Text strong style={{ fontSize: '14px', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                    {product.code}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Tên sản phẩm báo cáo
                  </Text>
                  <Text strong style={{ fontSize: '14px' }}>
                    {product.name}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Năm tài chính
                  </Text>
                  <Tag color="cyan" style={{ fontWeight: 600, fontSize: '12px' }}>
                    {product.fiscalYear}
                  </Tag>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Mã ngành nghề
                  </Text>
                  <Text strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {product.industryCode}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={18}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Tên ngành nghề
                  </Text>
                  <Text strong style={{ fontSize: '12px' }}>
                    {product.industryName}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* KHỐI 2: Dữ liệu khởi tạo & Phê duyệt */}
          <div style={{ borderBottom: `1px solid var(--color-neutral-100)`, paddingBottom: 'var(--spacing-16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
              <BarChartOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
              <Text strong style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text)' }}>
                Tiến trình & Phê duyệt
              </Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Ngày tạo lập
                  </Text>
                  <Text strong style={{ fontSize: '12px' }}>
                    {product.createdAt}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Người tạo
                  </Text>
                  <Space size={6}>
                    <UserOutlined style={{ color: 'var(--primary)' }} />
                    <Text strong style={{ fontSize: '12px' }}>
                      {product.createdBy} ({product.creatorFullName})
                    </Text>
                  </Space>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Người duyệt
                  </Text>
                  {product.approvedBy ? (
                    <Space size={6}>
                      <UserOutlined style={{ color: 'var(--success)' }} />
                      <Text strong style={{ fontSize: '12px', color: 'var(--success)' }}>
                        {product.approvedBy} ({product.approverFullName})
                      </Text>
                    </Space>
                  ) : (
                    <Text type="secondary">—</Text>
                  )}
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Ngày duyệt
                  </Text>
                  <Text strong style={{ fontSize: '12px' }}>
                    {product.approvedAt || '—'}
                  </Text>
                </div>
              </Col>

              {product.fileName && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tệp báo cáo đính kèm
                    </Text>
                    <div
                      style={{
                        background: 'var(--bg-subtle)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid var(--border)`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-12)',
                      }}
                    >
                      <PaperClipOutlined style={{ color: 'var(--primary)', fontSize: 16 }} />
                      <Button
                        type="link"
                        onClick={() => onDownload(product)}
                        style={{ padding: 0, height: 'auto', fontWeight: 600 }}
                      >
                        {product.fileName}
                      </Button>
                      {product.fileSize && (
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          ({product.fileSize})
                        </Text>
                      )}
                    </div>
                  </div>
                </Col>
              )}

              {product.approvalNote && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Ý kiến phê duyệt
                    </Text>
                    <div
                      style={{
                        background: 'var(--success-subtle)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        color: 'var(--success-ink)',
                        fontSize: '12px',
                      }}
                    >
                      {product.approvalNote}
                    </div>
                  </div>
                </Col>
              )}

              {product.rejectReason && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lý do từ chối duyệt
                    </Text>
                    <div
                      style={{
                        background: 'var(--error-subtle)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        color: 'var(--error-ink)',
                        fontSize: '12px',
                      }}
                    >
                      {product.rejectReason}
                    </div>
                  </div>
                </Col>
              )}

              {product.recallReason && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lý do thu hồi
                    </Text>
                    <div
                      style={{
                        background: 'var(--warning-subtle)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        color: 'var(--warning-ink)',
                        fontSize: '12px',
                      }}
                    >
                      {product.recallReason}
                    </div>
                  </div>
                </Col>
              )}

              {product.notes && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Ghi chú mô tả
                    </Text>
                    <div
                      style={{
                        background: 'var(--bg-subtle)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid var(--border)`,
                        color: 'var(--text)',
                        fontSize: '12px',
                      }}
                    >
                      {product.notes}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          {/* KHỐI 3: Audit Change History Table (Chuẩn Rule 8) */}
          <ChangeHistoryCollapse data={product.history || []} defaultActive={false} />
        </div>
      </div>
    </Modal>
  );
};

export default IndustryAnalysisDetailModal;

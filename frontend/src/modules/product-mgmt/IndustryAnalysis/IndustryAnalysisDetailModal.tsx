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
import { colors, spacing, typography, radius } from '@/design-system';
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} style={{ minWidth: 100, borderRadius: radius.md }}>
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
            gap: spacing[3],
            marginBottom: spacing[4],
            paddingBottom: spacing[3],
            borderBottom: `1px solid ${colors.border.split}`,
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
          {/* KHỐI 1: Thông tin chung */}
          <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
              <FileTextOutlined style={{ color: colors.primary[500], fontSize: 18 }} />
              <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                Thông tin chung
              </Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Mã sản phẩm
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.base, color: colors.primary[500], whiteSpace: 'nowrap' }}>
                    {product.code}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Tên sản phẩm báo cáo
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.base }}>
                    {product.name}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Năm tài chính
                  </Text>
                  <Tag color="cyan" style={{ fontWeight: 600, fontSize: typography.fontSize.sm }}>
                    {product.fiscalYear}
                  </Tag>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Mã ngành nghề
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.base, color: colors.neutral[800] }}>
                    {product.industryCode}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={18}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Tên ngành nghề
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.sm }}>
                    {product.industryName}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* KHỐI 2: Dữ liệu khởi tạo & Phê duyệt */}
          <div style={{ borderBottom: `1px solid ${colors.border.split}`, paddingBottom: spacing[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
              <BarChartOutlined style={{ color: colors.primary[500], fontSize: 18 }} />
              <Text strong style={{ fontSize: typography.fontSize.base, textTransform: 'uppercase', color: colors.text.primary }}>
                Tiến trình & Phê duyệt
              </Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Ngày tạo lập
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.sm }}>
                    {product.createdAt}
                  </Text>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Người tạo
                  </Text>
                  <Space size={6}>
                    <UserOutlined style={{ color: colors.primary[500] }} />
                    <Text strong style={{ fontSize: typography.fontSize.sm }}>
                      {product.createdBy} ({product.creatorFullName})
                    </Text>
                  </Space>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Người duyệt
                  </Text>
                  {product.approvedBy ? (
                    <Space size={6}>
                      <UserOutlined style={{ color: colors.success.base }} />
                      <Text strong style={{ fontSize: typography.fontSize.sm, color: colors.success.base }}>
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
                  <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    Ngày duyệt
                  </Text>
                  <Text strong style={{ fontSize: typography.fontSize.sm }}>
                    {product.approvedAt || '—'}
                  </Text>
                </div>
              </Col>

              {product.fileName && (
                <Col xs={24}>
                  <div>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Tệp báo cáo đính kèm
                    </Text>
                    <div
                      style={{
                        background: colors.bg.subtle,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.border.base}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: spacing[3],
                      }}
                    >
                      <PaperClipOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
                      <Button
                        type="link"
                        onClick={() => onDownload(product)}
                        style={{ padding: 0, height: 'auto', fontWeight: 600 }}
                      >
                        {product.fileName}
                      </Button>
                      {product.fileSize && (
                        <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
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
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Ý kiến phê duyệt
                    </Text>
                    <div
                      style={{
                        background: colors.statusTag.active.bg,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.statusTag.active.border}`,
                        color: colors.statusTag.active.text,
                        fontSize: typography.fontSize.sm,
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
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lý do từ chối duyệt
                    </Text>
                    <div
                      style={{
                        background: colors.statusTag.error.bg,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.statusTag.error.border}`,
                        color: colors.statusTag.error.text,
                        fontSize: typography.fontSize.sm,
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
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Lý do thu hồi
                    </Text>
                    <div
                      style={{
                        background: colors.statusTag.warning.bg,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.statusTag.warning.border}`,
                        color: colors.statusTag.warning.text,
                        fontSize: typography.fontSize.sm,
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
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Ghi chú mô tả
                    </Text>
                    <div
                      style={{
                        background: colors.bg.subtle,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.border.base}`,
                        color: colors.text.primary,
                        fontSize: typography.fontSize.sm,
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

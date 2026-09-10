'use client';

import React from 'react';
import { Modal, Form, Input, Button, Typography, Alert, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, RollbackOutlined, SendOutlined } from '@ant-design/icons';
import { colors, radius, spacing, typography } from '@/design-system';
import type { IIndustryProduct } from './types';

const { Text } = Typography;
const { TextArea } = Input;

// ─── Modal Gửi duyệt ──────────────────────────────────────────
interface SendApprovalModalProps {
  open: boolean;
  product: IIndustryProduct | null;
  onClose: () => void;
  onConfirm: (product: IIndustryProduct) => void;
}

export const SendApprovalModal: React.FC<SendApprovalModalProps> = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Xác nhận gửi duyệt báo cáo"
      width={520}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3], padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => onConfirm(product)}
            style={{ minWidth: 120 }}
          >
            Gửi duyệt
          </Button>
        </div>
      }
    >
      <div style={{ padding: `${spacing[3]} 0` }}>
        <p style={{ color: colors.text.primary, marginBottom: spacing[3] }}>
          Bạn có chắc chắn muốn gửi duyệt sản phẩm báo cáo này không?
        </p>
        <div
          style={{
            backgroundColor: colors.bg.subtle,
            padding: spacing[3],
            borderRadius: radius.md,
            border: `1px solid ${colors.border.base}`,
          }}
        >
          <div style={{ marginBottom: spacing[1] }}>
            <Text strong style={{ color: colors.primary[500], marginRight: spacing[2], whiteSpace: 'nowrap' }}>
              {product.code}
            </Text>
            <Text strong style={{ color: colors.text.primary }}>{product.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs, display: 'block' }}>
            Ngành nghề: {product.industryName} | Năm tài chính: {product.fiscalYear}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

// ─── Modal Phê duyệt ──────────────────────────────────────────
interface ApproveModalProps {
  open: boolean;
  product: IIndustryProduct | null;
  onClose: () => void;
  onConfirm: (product: IIndustryProduct, note: string) => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  if (!product) return null;

  const handleOk = async () => {
    const values = await form.validateFields();
    onConfirm(product, values.approvalNote || '');
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Phê duyệt báo cáo phân tích ngành"
      width={560}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3], padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleOk}
            style={{ minWidth: 120 }}
          >
            Xác nhận duyệt
          </Button>
        </div>
      }
    >
      <div style={{ padding: `${spacing[2]} 0` }}>
        <div
          style={{
            backgroundColor: colors.bg.subtle,
            padding: spacing[3],
            borderRadius: radius.md,
            border: `1px solid ${colors.border.base}`,
            marginBottom: spacing[4],
          }}
        >
          <div style={{ marginBottom: spacing[1] }}>
            <Text strong style={{ color: colors.primary[500], marginRight: spacing[2], whiteSpace: 'nowrap' }}>
              {product.code}
            </Text>
            <Text strong style={{ color: colors.text.primary }}>{product.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs, display: 'block' }}>
            Người tạo: {product.createdBy} ({product.creatorFullName}) | Năm tài chính: {product.fiscalYear}
          </Text>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item name="approvalNote" label="Ý kiến phê duyệt">
            <TextArea rows={3} placeholder="Nhập ý kiến hoặc ghi chú phê duyệt (tùy chọn)..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

// ─── Modal Từ chối duyệt ──────────────────────────────────────
interface RejectModalProps {
  open: boolean;
  product: IIndustryProduct | null;
  onClose: () => void;
  onConfirm: (product: IIndustryProduct, reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  if (!product) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(product, values.rejectReason);
      form.resetFields();
    } catch {
      // validation error
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Từ chối duyệt báo cáo phân tích ngành"
      width={560}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3], padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button
            danger
            type="primary"
            icon={<CloseCircleOutlined />}
            onClick={handleOk}
            style={{ minWidth: 120 }}
          >
            Từ chối duyệt
          </Button>
        </div>
      }
    >
      <div style={{ padding: `${spacing[2]} 0` }}>
        <Alert
          type="warning"
          showIcon
          message="Hồ sơ sau khi từ chối sẽ trả về người tạo để hoàn thiện lại dữ liệu."
          style={{ marginBottom: spacing[4], borderRadius: radius.md }}
        />

        <div
          style={{
            backgroundColor: colors.bg.subtle,
            padding: spacing[3],
            borderRadius: radius.md,
            border: `1px solid ${colors.border.base}`,
            marginBottom: spacing[4],
          }}
        >
          <div style={{ marginBottom: spacing[1] }}>
            <Text strong style={{ color: colors.primary[500], marginRight: spacing[2], whiteSpace: 'nowrap' }}>
              {product.code}
            </Text>
            <Text strong style={{ color: colors.text.primary }}>{product.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs, display: 'block' }}>
            Người tạo: {product.createdBy} ({product.creatorFullName}) | Năm tài chính: {product.fiscalYear}
          </Text>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="Lý do từ chối duyệt"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối duyệt' }]}
          >
            <TextArea rows={4} placeholder="Nêu rõ lý do sai lệch chỉ tiêu, thiếu nguồn dữ liệu hoặc yêu cầu cập nhật..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

// ─── Modal Thu hồi ────────────────────────────────────────────
interface RecallModalProps {
  open: boolean;
  product: IIndustryProduct | null;
  onClose: () => void;
  onConfirm: (product: IIndustryProduct, reason: string) => void;
}

export const RecallModal: React.FC<RecallModalProps> = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  if (!product) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(product, values.recallReason);
      form.resetFields();
    } catch {
      // validation error
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Thu hồi báo cáo phân tích ngành"
      width={560}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3], padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            danger
            icon={<RollbackOutlined />}
            onClick={handleOk}
            style={{ minWidth: 120 }}
          >
            Xác nhận thu hồi
          </Button>
        </div>
      }
    >
      <div style={{ padding: `${spacing[2]} 0` }}>
        <Alert
          type="error"
          showIcon
          message="Báo cáo bị thu hồi sẽ ngừng phục vụ khai thác cho đến khi được chỉnh sửa và duyệt lại."
          style={{ marginBottom: spacing[4], borderRadius: radius.md }}
        />

        <div
          style={{
            backgroundColor: colors.bg.subtle,
            padding: spacing[3],
            borderRadius: radius.md,
            border: `1px solid ${colors.border.base}`,
            marginBottom: spacing[4],
          }}
        >
          <div style={{ marginBottom: spacing[1] }}>
            <Text strong style={{ color: colors.primary[500], marginRight: spacing[2], whiteSpace: 'nowrap' }}>
              {product.code}
            </Text>
            <Text strong style={{ color: colors.text.primary }}>{product.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: typography.fontSize.xs, display: 'block' }}>
            Trạng thái hiện tại: {product.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
          </Text>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item
            name="recallReason"
            label="Lý do thu hồi"
            rules={[{ required: true, message: 'Vui lòng nhập lý do thu hồi báo cáo' }]}
          >
            <TextArea rows={4} placeholder="Nêu rõ lý do thu hồi báo cáo (ví dụ: phát hiện sai lệch số liệu, điều chỉnh tập mẫu...)..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

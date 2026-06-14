import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { colors, radius } from '@/design-system';

const { TextArea } = Input;

interface RejectReasonModalProps {
  open: boolean;
  tenTep?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

// Modal bắt nhập lý do khi CIC trả báo cáo về TCTD để sửa — dùng
// chung cho Modal trong list và trang chi tiết [id].
export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  tenTep,
  loading,
  onCancel,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const trimmed = reason.trim();

  return (
    <Modal
      title="Yêu cầu TCTD sửa báo cáo"
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Button onClick={onCancel} style={{ minWidth: 100, borderRadius: radius.md }}>
            Hủy
          </Button>
          <Button
            danger
            type="primary"
            icon={<CloseCircleOutlined />}
            disabled={!trimmed}
            loading={loading}
            onClick={() => onConfirm(trimmed)}
            style={{ minWidth: 100, borderRadius: radius.md }}
          >
            Xác nhận yêu cầu sửa
          </Button>
        </div>
      }
    >
      <div style={{ paddingTop: 8 }}>
        {tenTep && (
          <div style={{ marginBottom: 12, fontSize: 13, color: colors.text.secondary }}>
            Báo cáo <strong style={{ fontFamily: 'monospace', color: colors.primary[700] }}>{tenTep}</strong> sẽ được trả lại TCTD để chỉnh sửa.
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Lý do yêu cầu sửa <span style={{ color: colors.error.base }}>*</span>
        </div>
        <TextArea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Nhập lý do để TCTD nắm và chỉnh sửa lại..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          maxLength={500}
          showCount
        />
      </div>
    </Modal>
  );
};

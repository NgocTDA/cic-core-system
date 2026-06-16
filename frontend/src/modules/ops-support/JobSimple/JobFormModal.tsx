'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { spacing } from '@/design-system';
import type { IJobSimple, IJobFormValues } from './types';

interface JobFormModalProps {
  open: boolean;
  editing: IJobSimple | null;
  onCancel: () => void;
  onSubmit: (values: IJobFormValues, editingId?: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu hóa' },
];

const JobFormModal: React.FC<JobFormModalProps> = ({ open, editing, onCancel, onSubmit }) => {
  const [form] = Form.useForm<IJobFormValues>();

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          code: editing.code,
          name: editing.name,
          description: editing.description,
          scheduleText: editing.scheduleText,
          status: editing.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'ACTIVE' });
      }
    }
  }, [open, editing, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values, editing?.id);
    });
  };

  return (
    <Modal
      title={editing ? 'Chỉnh sửa job' : 'Thêm job mới'}
      open={open}
      onCancel={onCancel}
      width={560}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3] }}>
          <Button onClick={onCancel} style={{ minWidth: 96 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleOk} style={{ minWidth: 96 }}>
            Lưu
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" requiredMark>
        <Form.Item
          name="code"
          label="Mã job"
          rules={[
            { required: true, message: 'Vui lòng nhập mã job' },
            { pattern: /^[A-Z0-9_]+$/, message: 'Chỉ gồm chữ in hoa, số và dấu gạch dưới' },
          ]}
        >
          <Input placeholder="VD: SYNC_CUSTOMER_DB" disabled={!!editing} />
        </Form.Item>
        <Form.Item name="name" label="Tên job" rules={[{ required: true, message: 'Vui lòng nhập tên job' }]}>
          <Input placeholder="VD: Đồng bộ dữ liệu khách hàng" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Mô tả ngắn về job" />
        </Form.Item>
        <Form.Item
          name="scheduleText"
          label="Lịch chạy"
          rules={[{ required: true, message: 'Vui lòng nhập lịch chạy' }]}
        >
          <Input placeholder="VD: 0 2 * * * (Hằng ngày 02:00)" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobFormModal;

'use client';

import React, { useState } from 'react';
import { Modal, Form, Select, Input, Upload, Button, message, Space } from 'antd';
import { UploadOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { colors, spacing, radius, typography } from '@/design-system';
import {
  PRODUCT_CATALOG_OPTIONS,
  FISCAL_YEAR_OPTIONS,
  INDUSTRY_OPTIONS,
  type IIndustryProduct,
} from './types';

const { TextArea } = Input;

interface IndustryAnalysisCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newProduct: Partial<IIndustryProduct>, submitForApproval?: boolean) => void;
}

const IndustryAnalysisCreateModal: React.FC<IndustryAnalysisCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleProductSelect = (selectedCode: string) => {
    const catalogItem = PRODUCT_CATALOG_OPTIONS.find((p) => p.value === selectedCode);
    if (catalogItem) {
      form.setFieldsValue({
        name: catalogItem.name,
        industryCode: catalogItem.defaultIndustry,
      });
    }
  };

  const handleSubmit = async (submitForApproval: boolean) => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const industryItem = INDUSTRY_OPTIONS.find((i) => i.value === values.industryCode);

      const newProductData: Partial<IIndustryProduct> = {
        code: values.code,
        name: values.name,
        fiscalYear: values.fiscalYear,
        industryCode: values.industryCode,
        industryName: industryItem ? industryItem.name : values.industryCode,
        notes: values.notes,
        fileName: values.fileUpload?.[0]?.name || `BC_${values.code}_${values.fiscalYear}.xlsx`,
        fileSize: '3.2 MB',
      };

      onSubmit(newProductData, submitForApproval);
      form.resetFields();
      onClose();
    } catch {
      // Form validation error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Thêm mới báo cáo phân tích ngành, trung bình ngành"
      width={720}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[3], padding: `${spacing[2]} 0` }}>
          <Button onClick={onClose} disabled={submitting} style={{ minWidth: 90, borderRadius: radius.md }}>
            Hủy
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            loading={submitting}
            style={{ minWidth: 110, borderRadius: radius.md }}
          >
            Lưu dự thảo
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSubmit(true)}
            loading={submitting}
            style={{ minWidth: 140, borderRadius: radius.md }}
          >
            Lưu & Gửi duyệt
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fiscalYear: 2025,
        }}
        style={{ marginTop: spacing[3] }}
      >
        <Form.Item
          name="code"
          label="Sản phẩm"
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
        >
          <Select
            placeholder="Chọn sản phẩm từ danh mục"
            showSearch
            optionFilterProp="label"
            onChange={handleProductSelect}
            options={PRODUCT_CATALOG_OPTIONS.map((p) => ({
              value: p.value,
              label: p.label,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên sản phẩm báo cáo"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder="Tên báo cáo phân tích ngành / trung bình ngành" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
          <Form.Item
            name="fiscalYear"
            label="Năm tài chính"
            rules={[{ required: true, message: 'Vui lòng chọn năm tài chính' }]}
          >
            <Select
              placeholder="Chọn năm tài chính"
              options={FISCAL_YEAR_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            name="industryCode"
            label="Ngành nghề"
            rules={[{ required: true, message: 'Vui lòng chọn ngành nghề' }]}
          >
            <Select
              placeholder="Chọn ngành nghề"
              showSearch
              optionFilterProp="label"
              options={INDUSTRY_OPTIONS.map((i) => ({
                value: i.value,
                label: i.label,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="fileUpload"
          label="Tệp báo cáo đính kèm"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Tải lên tệp Excel / Word / PDF</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <TextArea rows={3} placeholder="Nhập ghi chú, phương pháp tính toán hoặc mô tả tập mẫu dữ liệu..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IndustryAnalysisCreateModal;

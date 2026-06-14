import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import type { JobCategory, JobPriority, JobStatus } from '../types';

interface BasicInfoTabProps {
  form: FormInstance;
  isEditMode: boolean;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form, isEditMode }) => {
  const categoryOptions: { value: JobCategory; label: string }[] = [
    { value: 'DATA_SYNC', label: 'Đồng bộ dữ liệu' },
    { value: 'REPORT', label: 'Báo cáo' },
    { value: 'CLEANUP', label: 'Dọn dẹp' },
    { value: 'VALIDATION', label: 'Kiểm tra' },
    { value: 'BATCH', label: 'Xử lý hàng loạt' },
  ];

  const priorityOptions: { value: JobPriority; label: string }[] = [
    { value: 1, label: 'Rất cao (1)' },
    { value: 2, label: 'Cao (2)' },
    { value: 3, label: 'Trung bình (3)' },
    { value: 4, label: 'Thấp (4)' },
    { value: 5, label: 'Rất thấp (5)' },
  ];

  const statusOptions: { value: JobStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
    { value: 'ARCHIVED', label: 'Lưu trữ' },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="code"
            label="Mã Job"
            rules={[
              { required: true, message: 'Vui lòng nhập mã Job' },
              { pattern: /^[A-Z0-9_]+$/, message: 'Mã Job phải là chữ hoa, số và dấu gạch dưới' },
            ]}
          >
            <Input placeholder="VD: DAILY_SYNC_JOB" disabled={isEditMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Tên Job"
            rules={[{ required: true, message: 'Vui lòng nhập tên Job' }]}
          >
            <Input placeholder="VD: Đồng bộ dữ liệu hàng ngày từ Core Banking" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về Job này" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục" options={categoryOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
          >
            <Select placeholder="Chọn độ ưu tiên" options={priorityOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái" options={statusOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="owner"
            label="Người quản lý"
            rules={[{ required: true, message: 'Vui lòng nhập người quản lý' }]}
          >
            <Input placeholder="Tên hoặc email người quản lý" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name="tags" label="Thẻ (Tags)">
            <Select
              mode="tags"
              placeholder="Nhập hoặc chọn thẻ"
              options={[
                { value: 'critical', label: 'critical' },
                { value: 'daily', label: 'daily' },
                { value: 'weekly', label: 'weekly' },
                { value: 'monthly', label: 'monthly' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name={['timeout']}
            label="Timeout (giây)"
            rules={[{ required: true, message: 'Vui lòng nhập timeout' }]}
          >
            <Input type="number" placeholder="3600" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BasicInfoTab;

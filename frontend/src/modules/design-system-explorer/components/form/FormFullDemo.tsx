'use client';

import React, { useState } from 'react';
import {
    Form, Input, InputNumber, Select, DatePicker, Checkbox, Radio,
    Switch, Slider, Upload, Button, Typography, Space, Divider, Alert, Spin, Row, Col,
} from 'antd';
import { SaveOutlined, CloseOutlined, InboxOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;
const DATE_FORMAT = 'DD/MM/YYYY';

const FormFullDemo: React.FC = () => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useHeaderActions({ title: 'Form mẫu đầy đủ' }, []);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <ComponentShowcase
            name="Form mẫu đầy đủ"
            group="form"
            description="Form khai báo tích hợp tất cả input types với đầy đủ validation, required markers, loading submit, và layout chuẩn."
            behaviors={[
                'Trường bắt buộc đánh dấu (*) — không dùng requiredMark của Ant Design',
                'Chỉ có DUY NHẤT 1 Primary button (Lưu) trong khu vực hành động',
                'Huỷ là Secondary button',
                'Submit tự động disable + loading spinner khi đang xử lý',
                'Validate tất cả fields khi submit',
                'Validate inline khi blur từng field',
                'Trim whitespace đầu/cuối cho text fields khi blur',
                'Layout 2 cột trên desktop, 1 cột trên mobile',
            ]}
            wide
            demoMinHeight={600}
            code={`// Form mẫu — MH Thêm mới
// Nút: [Lưu (primary)] [Lưu và gửi duyệt (default)] [Huỷ (default)]
// MH Chỉnh sửa: [Lưu (primary)] [Huỷ (default)]

<Form form={form} layout="vertical" onFinish={handleSubmit}>
  <Row gutter={[16, 0]}>
    <Col xs={24} md={12}>
      <Form.Item name="code" label={<>Mã <Required /></>}
        rules={[{ required: true, message: 'Bắt buộc' }]}>
        <Input placeholder="Mã" onBlur={() => trimField('code')} />
      </Form.Item>
    </Col>
    // ... more fields
  </Row>

  <Form.Item style={{ marginBottom: 0 }}>
    <Space>
      <Button type="primary" htmlType="submit" loading={submitting} icon={<SaveOutlined />}>
        Lưu
      </Button>
      <Button htmlType="button" onClick={() => router.back()}>Huỷ</Button>
    </Space>
  </Form.Item>
</Form>`}
        >
            {submitted ? (
                <Alert
                    type="success"
                    message="Submit thành công!"
                    description={<>Form đã được submit. <Button type="link" size="small" onClick={() => { form.resetFields(); setSubmitted(false); }}>Reset</Button></>}
                    showIcon
                />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    style={{ maxWidth: 720 }}
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="code"
                                label={<><Text>Mã TCTD</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                                rules={[{ required: true, message: 'Vui lòng nhập mã TCTD' }]}
                            >
                                <Input
                                    placeholder="Mã TCTD"
                                    maxLength={20}
                                    onBlur={() => { const v = form.getFieldValue('code'); form.setFieldValue('code', v?.trim()); }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="name"
                                label={<><Text>Tên tổ chức</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input
                                    placeholder="Tên tổ chức"
                                    maxLength={255}
                                    onBlur={() => { const v = form.getFieldValue('name'); form.setFieldValue('name', v?.trim()); }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="type"
                                label={<><Text>Loại hình</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                                rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
                            >
                                <Select
                                    placeholder="Chọn loại hình"
                                    options={[
                                        { value: 'BANK',    label: 'Ngân hàng thương mại' },
                                        { value: 'FINANCE', label: 'Công ty tài chính' },
                                        { value: 'CREDIT',  label: 'Quỹ tín dụng nhân dân' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="effectiveDate"
                                label={<><Text>Ngày hiệu lực</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker format={DATE_FORMAT} placeholder={DATE_FORMAT} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="creditLimit"
                                label="Hạn mức tín dụng (VNĐ)"
                            >
                                <InputNumber<number>
                                    style={{ width: '100%', textAlign: 'right' }}
                                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(v) => Number(v?.replace(/\./g, '') ?? 0)}
                                    min={0}
                                    placeholder="0"
                                    suffix="VNĐ"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="email" label="Email liên hệ"
                                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                            >
                                <Input placeholder="Email" maxLength={254} />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item name="description" label="Ghi chú">
                                <Input.TextArea
                                    placeholder="Ghi chú"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="isActive" label="Trạng thái" valuePropName="checked" initialValue={true}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                                    <Form.Item name="isActive" valuePropName="checked" noStyle initialValue={true}>
                                        <Switch />
                                    </Form.Item>
                                    <Text style={{ fontSize: typography.fontSize.sm }}>Hoạt động</Text>
                                </div>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="permission"
                                label={<><Text>Quyền truy cập</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 quyền' }]}
                            >
                                <Checkbox.Group options={['Xem', 'Thêm', 'Sửa', 'Xóa', 'Duyệt']} />
                            </Form.Item>
                        </Col>

                        <Divider style={{ margin: `${spacing[2]} 0` }} />

                        <Col xs={24}>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        icon={<SaveOutlined />}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        htmlType="submit"
                                        disabled={submitting}
                                    >
                                        Lưu và gửi duyệt
                                    </Button>
                                    <Button
                                        htmlType="button"
                                        onClick={() => form.resetFields()}
                                        icon={<CloseOutlined />}
                                        disabled={submitting}
                                    >
                                        Huỷ
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </ComponentShowcase>
    );
};

export default FormFullDemo;

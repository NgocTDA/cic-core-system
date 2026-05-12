'use client';

import React, { useState } from 'react';
import { Form, Input, Typography, Space, Tag, Alert } from 'antd';
import { MailOutlined, UserOutlined, SearchOutlined, LockOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const SPECIAL_CHARS_RE = /[<>'";\-\-\/\*]/g;

const TextboxDemo: React.FC = () => {
    const [form] = Form.useForm();
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    useHeaderActions({ title: 'Textbox / Input' }, []);

    const handleBlurTrim = (field: string) => {
        const val = form.getFieldValue(field);
        if (typeof val === 'string') {
            form.setFieldValue(field, val.trim());
        }
    };

    const handleSpecialKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const forbidden = ['<', '>', "'", '"', ';'];
        if (forbidden.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <ComponentShowcase
            name="Textbox / Input"
            group="form"
            description="Ô nhập văn bản chuẩn. Hỗ trợ trim tự động, chặn ký tự đặc biệt, validation email, required marker (*) và các variant."
            behaviors={[
                'Tự động trim khoảng trắng đầu/cuối khi blur (onBlur)',
                'Chặn ký tự đặc biệt: < > \' " ; -- /* */',
                'Trường bắt buộc đánh dấu (*) bên cạnh label',
                'Tìm kiếm Like: không phân biệt hoa thường, tìm cả không dấu',
                'Email: validate format chuẩn, maxlength 254 ký tự',
                'Placeholder trùng với tên trường (không thêm "Nhập...")',
                'Validate inline khi blur + khi submit',
            ]}
            code={`import { Form, Input } from 'antd';

// Trường thường với trim + chặn ký tự đặc biệt
<Form.Item
  name="fullName"
  label="Họ và tên"
  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
>
  <Input
    placeholder="Họ và tên"
    onBlur={(e) => form.setFieldValue('fullName', e.target.value.trim())}
    onKeyDown={(e) => {
      if (['<', '>', "'", '"', ';'].includes(e.key)) e.preventDefault();
    }}
    maxLength={255}
  />
</Form.Item>

// Email
<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true },
    { type: 'email', message: 'Email không hợp lệ' },
  ]}
>
  <Input placeholder="Email" prefix={<MailOutlined />} maxLength={254} />
</Form.Item>`}
            demoMinHeight={420}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(vals) => setSubmitResult(JSON.stringify(vals, null, 2))}
                style={{ maxWidth: 480 }}
            >
                {/* Normal text */}
                <Form.Item
                    name="fullName"
                    label={<><Text>Họ và tên</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: colors.text.tertiary }} />}
                        placeholder="Họ và tên"
                        onBlur={() => handleBlurTrim('fullName')}
                        onKeyDown={handleSpecialKeyDown}
                        maxLength={255}
                        showCount
                    />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    label={<><Text>Email</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: colors.text.tertiary }} />}
                        placeholder="Email"
                        maxLength={254}
                        onBlur={() => handleBlurTrim('email')}
                    />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: 8, message: 'Tối thiểu 8 ký tự' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                {/* Search (Like) */}
                <Form.Item name="search" label="Tìm kiếm (Like)">
                    <Input.Search
                        prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
                        placeholder="Tìm theo tên, mã..."
                        enterButton="Tìm"
                        allowClear
                    />
                </Form.Item>

                {/* Disabled */}
                <Form.Item name="readonly" label="Chỉ đọc">
                    <Input value="Giá trị không thể chỉnh sửa" disabled />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <button
                            type="submit"
                            style={{
                                background: colors.primary[500], color: '#fff', border: 'none',
                                borderRadius: 6, padding: `${spacing[2]} ${spacing[5]}`, cursor: 'pointer',
                                fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium,
                            }}
                        >
                            Submit (kiểm tra validation)
                        </button>
                        <button
                            type="button"
                            onClick={() => { form.resetFields(); setSubmitResult(null); }}
                            style={{
                                background: 'transparent', color: colors.text.secondary,
                                border: `1px solid ${colors.border.base}`, borderRadius: 6,
                                padding: `${spacing[2]} ${spacing[4]}`, cursor: 'pointer',
                                fontSize: typography.fontSize.sm,
                            }}
                        >
                            Reset
                        </button>
                    </Space>
                </Form.Item>

                {submitResult && (
                    <Alert
                        type="success"
                        message="Submit thành công"
                        description={<pre style={{ fontSize: 12, margin: 0 }}>{submitResult}</pre>}
                        closable
                        onClose={() => setSubmitResult(null)}
                    />
                )}
            </Form>
        </ComponentShowcase>
    );
};

export default TextboxDemo;

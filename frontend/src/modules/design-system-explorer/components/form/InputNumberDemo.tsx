'use client';

import React, { useState } from 'react';
import { Form, InputNumber, Typography, Space, Row, Col, Tooltip } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const InputNumberDemo: React.FC = () => {
    const [form] = Form.useForm();
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    useHeaderActions({ title: 'Input Number' }, []);

    return (
        <ComponentShowcase
            name="Input Number"
            group="form"
            description="Ô nhập số với format dấu chấm phân nghìn, dấu phẩy thập phân (chuẩn VN). Hỗ trợ validate min/max, căn phải, và tooltip giá trị đầy đủ."
            behaviors={[
                'Chỉ cho phép nhập số và dấu "-" (âm), "," (thập phân)',
                'Tự động format dấu "." phân cách hàng nghìn khi blur',
                'Mặc định hiển thị 2 chữ số thập phân (có thể cấu hình)',
                'Hover vào giá trị thập phân: tooltip hiển thị đầy đủ (tối đa 5 chữ số)',
                'Validate tức thời min/max khi thay đổi giá trị',
                'Căn phải dữ liệu — nhất quán với table column số',
                'Hệ thống hỗ trợ tối thiểu 20 chữ số nguyên cho tiền tệ VND',
            ]}
            code={`import { InputNumber } from 'antd';

// Số tiền VNĐ (format . nghìn, không có thập phân)
<Form.Item name="amount" label="Số tiền (VNĐ)" rules={[{ required: true }]}>
  <InputNumber
    style={{ width: '100%', textAlign: 'right' }}
    formatter={(v) => \`\${v}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')}
    parser={(v) => v!.replace(/\\./g, '')}
    min={0}
    placeholder="0"
  />
</Form.Item>

// Số thập phân (tỷ lệ %)
<Form.Item name="rate" label="Tỷ lệ (%)" rules={[{ required: true }]}>
  <InputNumber
    style={{ width: '100%', textAlign: 'right' }}
    min={0} max={100}
    precision={2}
    formatter={(v) => \`\${v}%\`}
    parser={(v) => v!.replace('%', '')}
  />
</Form.Item>`}
            demoMinHeight={400}
        >
            <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
                <Row gutter={[16, 0]}>
                    {/* Integer */}
                    <Col span={24}>
                        <Form.Item
                            name="amount"
                            label={<><Text>Số tiền (VNĐ)</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập số tiền' },
                                { type: 'number', min: 0, message: 'Số tiền phải ≥ 0' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%', textAlign: 'right' }}
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={(v) => Number(v!.replace(/\./g, ''))}
                                min={0}
                                placeholder="0"
                                suffix="VNĐ"
                            />
                        </Form.Item>
                    </Col>

                    {/* Percentage */}
                    <Col span={12}>
                        <Form.Item
                            name="rate"
                            label="Tỷ lệ lãi (%)"
                            rules={[
                                { type: 'number', min: 0, max: 100, message: 'Từ 0 đến 100' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%', textAlign: 'right' }}
                                min={0} max={100}
                                precision={2}
                                suffix="%"
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </Col>

                    {/* Age / integer with min/max */}
                    <Col span={12}>
                        <Form.Item
                            name="months"
                            label="Thời hạn vay (tháng)"
                            rules={[
                                { type: 'number', min: 1, max: 360, message: 'Từ 1 đến 360 tháng' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%', textAlign: 'right' }}
                                min={1} max={360}
                                suffix="tháng"
                                placeholder="12"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Tooltip demo for decimal */}
                <div
                    style={{
                        padding: spacing[4],
                        background: colors.bg.subtle,
                        borderRadius: 6,
                        border: `1px solid ${colors.border.split}`,
                        marginTop: spacing[2],
                    }}
                >
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[2] }}>
                        Hover để xem giá trị thập phân đầy đủ
                    </Text>
                    <Space wrap>
                        {[1234567.12, 9876543210.456789, 0.00123].map((v) => (
                            <Tooltip
                                key={v}
                                title={`Giá trị đầy đủ: ${v.toLocaleString('vi-VN', { maximumFractionDigits: 5 })}`}
                            >
                                <div
                                    style={{
                                        padding: `${spacing[1]} ${spacing[3]}`,
                                        background: colors.bg.container,
                                        border: `1px solid ${colors.border.base}`,
                                        borderRadius: 4,
                                        fontVariantNumeric: 'tabular-nums',
                                        fontSize: typography.fontSize.sm,
                                        cursor: 'default',
                                        textAlign: 'right',
                                    }}
                                >
                                    {v.toLocaleString('vi-VN', { maximumFractionDigits: 2 })}
                                </div>
                            </Tooltip>
                        ))}
                    </Space>
                </div>
            </Form>
        </ComponentShowcase>
    );
};

export default InputNumberDemo;

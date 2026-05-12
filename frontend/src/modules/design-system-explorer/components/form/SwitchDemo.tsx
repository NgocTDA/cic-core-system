'use client';

import React, { useState } from 'react';
import { Form, Switch, Typography, Space, Row, Col, Divider } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const SwitchDemo: React.FC = () => {
    const [val1, setVal1] = useState(true);
    const [val2, setVal2] = useState(false);
    const [loading1, setLoading1] = useState(false);

    useHeaderActions({ title: 'Switch' }, []);

    const handleToggleWithLoading = async (checked: boolean) => {
        setLoading1(true);
        await new Promise(r => setTimeout(r, 1500));
        setLoading1(false);
        setVal1(checked);
    };

    return (
        <ComponentShowcase
            name="Switch"
            group="form"
            description="Toggle bật/tắt với nhãn trạng thái rõ ràng. Loading state khi đang xử lý để tránh click nhiều lần."
            behaviors={[
                'Luôn có nhãn trạng thái rõ ràng bên cạnh (Bật / Tắt)',
                'Loading state khi đang gọi API để tránh click nhiều lần',
                'Kết hợp với Tooltip khi cần giải thích thêm',
                'disabled khi không có quyền hoặc điều kiện chưa đủ',
                'Có thể dùng checkedChildren / unCheckedChildren để thay đổi text trong switch',
            ]}
            code={`import { Switch } from 'antd';

// Switch với nhãn bên cạnh
const [enabled, setEnabled] = useState(false);
const [loading, setLoading] = useState(false);

const handleChange = async (checked: boolean) => {
  setLoading(true);
  await updateStatus(checked); // API call
  setLoading(false);
  setEnabled(checked);
};

<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Switch checked={enabled} onChange={handleChange} loading={loading} />
  <Text>{enabled ? 'Bật' : 'Tắt'}</Text>
</div>

// Trong Form
<Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
</Form.Item>`}
        >
            <Form layout="vertical" style={{ maxWidth: 420 }}>
                <Row gutter={[16, 16]}>
                    {/* Basic with loading */}
                    <Col span={24}>
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[3] }}>
                            Với loading state (click để xem hiệu ứng ~1.5s)
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                            <Switch
                                checked={val1}
                                onChange={handleToggleWithLoading}
                                loading={loading1}
                            />
                            <Text style={{ color: val1 ? colors.success.base : colors.text.secondary, fontWeight: typography.fontWeight.medium }}>
                                {val1 ? 'Bật' : 'Tắt'}
                            </Text>
                        </div>
                    </Col>

                    <Divider style={{ margin: `${spacing[2]} 0` }} />

                    {/* checkedChildren / unCheckedChildren */}
                    <Col span={24}>
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[3] }}>
                            Với checkedChildren / unCheckedChildren
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                            <Switch
                                checked={val2}
                                checkedChildren="Bật"
                                unCheckedChildren="Tắt"
                                onChange={setVal2}
                            />
                            <Text style={{ color: colors.text.secondary }}>
                                Giá trị: <code style={{ fontFamily: typography.fontFamily.mono }}>{String(val2)}</code>
                            </Text>
                        </div>
                    </Col>

                    <Divider style={{ margin: `${spacing[2]} 0` }} />

                    {/* In Form */}
                    <Col span={24}>
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[3] }}>
                            Trong Form
                        </Text>
                        <Space direction="vertical" style={{ width: '100%', gap: spacing[3] }}>
                            {[
                                { name: 'isActive',    label: 'Trạng thái hoạt động',       defaultChecked: true  },
                                { name: 'allowEmail',  label: 'Nhận thông báo qua email',    defaultChecked: false },
                                { name: 'isPublic',    label: 'Hiển thị công khai',          defaultChecked: true  },
                                { name: 'isDisabled',  label: 'Bị vô hiệu hóa (disabled)',   defaultChecked: true  },
                            ].map((item, i) => (
                                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing[2]} ${spacing[3]}`, background: colors.bg.subtle, borderRadius: 6 }}>
                                    <Text style={{ fontSize: typography.fontSize.sm }}>{item.label}</Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                                        <Switch
                                            defaultChecked={item.defaultChecked}
                                            disabled={item.name === 'isDisabled'}
                                            size="small"
                                        />
                                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, minWidth: 24 }}>
                                            {item.defaultChecked ? 'Bật' : 'Tắt'}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </Space>
                    </Col>
                </Row>
            </Form>
        </ComponentShowcase>
    );
};

export default SwitchDemo;

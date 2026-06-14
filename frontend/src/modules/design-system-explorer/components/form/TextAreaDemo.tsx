'use client';

import React, { useState } from 'react';
import { Form, Input, Typography, Tag, Space } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;
const { TextArea } = Input;

const BLOCKED_PATTERN = /[<>'";\-]{2}|\/\*|\*\//;

const TextAreaDemo: React.FC = () => {
    const [value1, setValue1]         = useState('');
    const [value2, setValue2]         = useState('');
    const [trimmedValue, setTrimmed]  = useState('');
    const [blockedKey, setBlockedKey] = useState('');

    useHeaderActions({ title: 'TextArea' }, []);

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTrimmed(e.target.value.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const blocked = ['<', '>', ';'];
        if (blocked.includes(e.key)) {
            e.preventDefault();
            setBlockedKey(e.key);
            setTimeout(() => setBlockedKey(''), 2000);
        }
    };

    return (
        <ComponentShowcase
            name="TextArea"
            group="form"
            description="Vùng nhập văn bản nhiều dòng. Tự động trim khoảng trắng khi blur, chặn ký tự đặc biệt nguy hiểm, hỗ trợ giới hạn ký tự và auto-resize."
            behaviors={[
                'Auto-trim: khoảng trắng đầu/cuối bị xóa khi rời khỏi ô',
                'Chặn ký tự đặc biệt nguy hiểm: < > ; -- /* */',
                'showCount: hiển thị số ký tự hiện tại / tối đa',
                'autoSize: tự co dãn chiều cao theo nội dung',
                'autoSize có thể giới hạn: { minRows: 3, maxRows: 8 }',
                'allowClear: nút xóa nhanh toàn bộ nội dung',
            ]}
            code={`// Auto-trim + chặn ký tự nguy hiểm
const BLOCKED_CHARS = ['<', '>', "'", '"', ';'];

<TextArea
  onBlur={(e) => form.setFieldValue('note', e.target.value.trim())}
  onKeyDown={(e) => {
    if (BLOCKED_CHARS.includes(e.key)) e.preventDefault();
  }}
  maxLength={500}
  showCount
  autoSize={{ minRows: 3, maxRows: 8 }}
  allowClear
/>`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5], maxWidth: 560 }}>
                {/* Auto-trim demo */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[2] }}>
                        Auto-trim khi blur
                    </Text>
                    <TextArea
                        placeholder="Thêm khoảng trắng đầu/cuối rồi click ra ngoài..."
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        allowClear
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                        onBlur={(e) => setValue1(e.target.value.trim())}
                    />
                    {value1 && (
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, display: 'block', marginTop: spacing[1] }}>
                            Đã trim: {value1}
                        </Text>
                    )}
                </div>

                {/* Blocked chars demo */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[2] }}>
                        Chặn ký tự đặc biệt <code style={{ fontFamily: typography.fontFamily.mono, fontSize: 11 }}>&lt; &gt; ;</code>
                    </Text>
                    <TextArea
                        placeholder="Thử gõ < > ; vào đây — sẽ bị chặn"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {blockedKey && (
                        <Tag color="error" style={{ marginTop: spacing[1] }}>
                            Ký tự {blockedKey} bị chặn
                        </Tag>
                    )}
                </div>

                {/* showCount + maxLength */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[2] }}>
                        showCount + maxLength
                    </Text>
                    <TextArea
                        placeholder="Nhận xét, ghi chú (tối đa 300 ký tự)..."
                        maxLength={300}
                        showCount
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        allowClear
                    />
                </div>

                {/* Form integration */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[2] }}>
                        Tích hợp với Form (required)
                    </Text>
                    <Form layout="vertical">
                        <Form.Item
                            label="Lý do điều chỉnh (*)"
                            name="reason"
                            rules={[{ required: true, message: 'Vui lòng nhập lý do' }, { min: 10, message: 'Tối thiểu 10 ký tự' }]}
                        >
                            <TextArea
                                autoSize={{ minRows: 3 }}
                                maxLength={500}
                                showCount
                                placeholder="Mô tả chi tiết lý do điều chỉnh..."
                            />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default TextAreaDemo;

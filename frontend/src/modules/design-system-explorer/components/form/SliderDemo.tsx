'use client';

import React, { useState } from 'react';
import { Slider, InputNumber, Row, Col, Typography, Space, Tag } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const SliderDemo: React.FC = () => {
    const [val1, setVal1]       = useState(60);
    const [val2, setVal2]       = useState<[number, number]>([20, 80]);
    const [val3, setVal3]       = useState(500);
    const [inputVal, setInput]  = useState(60);

    useHeaderActions({ title: 'Slider' }, []);

    const syncInput = (v: number) => { setVal1(v); setInput(v); };
    const syncSlider = (v: number | null) => { if (v !== null) { setVal1(v); setInput(v); } };

    const getColor = (v: number) => {
        if (v < 30)  return colors.error.base;
        if (v < 60)  return colors.warning.base;
        return colors.success.base;
    };

    return (
        <ComponentShowcase
            name="Slider"
            group="form"
            description="Thanh trượt để chọn giá trị số trong khoảng cho trước. Thường dùng để lọc theo phạm vi (min-max) hoặc điều chỉnh tỷ lệ/ngưỡng trong nghiệp vụ tín dụng."
            behaviors={[
                'Đồng bộ với InputNumber: slider và input số luôn khớp nhau',
                'Range slider: chọn khoảng min–max (dùng mảng [min, max])',
                'Tooltip mặc định hiện giá trị khi kéo; có thể format tooltip',
                'Màu track thay đổi theo ngưỡng (thấp/trung/cao)',
                'Có thể disable để chỉ xem giá trị',
                'Dùng marks để đánh dấu các mốc quan trọng',
            ]}
            code={`// Đồng bộ Slider + InputNumber
const [value, setValue] = useState(60);

<Row align="middle" gutter={16}>
  <Col flex="auto">
    <Slider min={0} max={100} value={value} onChange={setValue} />
  </Col>
  <Col>
    <InputNumber min={0} max={100} value={value} onChange={(v) => setValue(v ?? 0)} />
  </Col>
</Row>

// Range slider (lọc phạm vi)
<Slider range min={0} max={100}
  value={[min, max]}
  onChange={([min, max]) => setRange([min, max])}
  tooltip={{ formatter: (v) => \`\${v}%\` }}
/>`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6], maxWidth: 560 }}>
                {/* Basic + InputNumber sync */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[3] }}>
                        Đồng bộ với InputNumber
                    </Text>
                    <Row align="middle" gutter={12}>
                        <Col flex="auto">
                            <Slider
                                min={0} max={100}
                                value={val1}
                                onChange={syncInput}
                                trackStyle={{ backgroundColor: getColor(val1) }}
                                handleStyle={{ borderColor: getColor(val1) }}
                            />
                        </Col>
                        <Col>
                            <InputNumber
                                min={0} max={100}
                                value={inputVal}
                                onChange={syncSlider}
                                style={{ width: 72 }}
                            />
                        </Col>
                    </Row>
                    <Tag
                        style={{
                            marginTop: spacing[1],
                            background: getColor(val1) + '18',
                            color: getColor(val1),
                            border: `1px solid ${getColor(val1)}50`,
                        }}
                    >
                        {val1 < 30 ? 'Thấp' : val1 < 60 ? 'Trung bình' : 'Cao'} — {val1}%
                    </Tag>
                </div>

                {/* Range */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[3] }}>
                        Range slider — Lọc phạm vi tín dụng
                    </Text>
                    <Slider
                        range
                        min={0} max={100}
                        value={val2}
                        onChange={(v) => setVal2(v as [number, number])}
                        tooltip={{ formatter: (v) => `${v}%` }}
                        trackStyle={[{ backgroundColor: colors.primary[500] }]}
                        marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                    />
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                        Phạm vi: {val2[0]}% – {val2[1]}%
                    </Text>
                </div>

                {/* Score range */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[3] }}>
                        Điểm tín dụng (0–900) với marks
                    </Text>
                    <Slider
                        min={0} max={900}
                        value={val3}
                        onChange={setVal3}
                        tooltip={{ formatter: (v) => `${v} điểm` }}
                        marks={{ 0: '0', 300: '300', 500: '500', 650: '650', 800: '800', 900: '900' }}
                        step={10}
                    />
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                        Điểm: {val3}
                    </Text>
                </div>

                {/* Disabled */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, display: 'block', marginBottom: spacing[3] }}>
                        Disabled (chỉ xem)
                    </Text>
                    <Slider min={0} max={100} value={72} disabled />
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default SliderDemo;

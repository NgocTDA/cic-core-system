'use client';

import React, { useState } from 'react';
import { Typography, Space, Switch, Row, Col } from 'antd';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from 'recharts';
import ComponentShowcase from '../../ComponentShowcase';
import { SectionCard } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const TREND_DATA = [
    { month: 'T1', received: 4200, processed: 3800, error: 120 },
    { month: 'T2', received: 3800, processed: 3600, error:  98 },
    { month: 'T3', received: 5100, processed: 4900, error: 145 },
    { month: 'T4', received: 4700, processed: 4500, error: 110 },
    { month: 'T5', received: 5300, processed: 5100, error:  88 },
    { month: 'T6', received: 4900, processed: 4700, error: 130 },
];

const RATE_DATA = [
    { month: 'T1', rate: 0.92, target: 0.95 },
    { month: 'T2', rate: 0.94, target: 0.95 },
    { month: 'T3', rate: 0.91, target: 0.95 },
    { month: 'T4', rate: 0.96, target: 0.95 },
    { month: 'T5', rate: 0.97, target: 0.95 },
    { month: 'T6', rate: 0.98, target: 0.95 },
];

const AREA_DATA = [
    { month: 'T1', value: 1200 },
    { month: 'T2', value: 1450 },
    { month: 'T3', value: 1300 },
    { month: 'T4', value: 1700 },
    { month: 'T5', value: 1900 },
    { month: 'T6', value: 2100 },
];

const TOOLTIP_STYLE = {
    background: colors.bg.container,
    border: `1px solid ${colors.border.base}`,
    borderRadius: 6,
    fontSize: 12,
};

const ChartLineDemo: React.FC = () => {
    const [showDots, setShowDots] = useState(true);

    useHeaderActions({ title: 'Biểu đồ đường' }, []);

    return (
        <ComponentShowcase
            name="Biểu đồ đường (Line / Area)"
            group="dashboard"
            description="Line chart cho xu hướng theo thời gian. Area chart khi muốn nhấn mạnh khối lượng tích lũy. Dùng target line (nét đứt) để so sánh thực tế vs mục tiêu."
            behaviors={[
                'Luôn wrap trong SectionCard để nhất quán layout',
                'ResponsiveContainer để tự động fit theo container',
                'Multi-series: mỗi series một màu từ colors.subsystem.*',
                'Target line dùng nét đứt (strokeDasharray) + màu error/warning',
                'Area chart: LinearGradient fill để tạo hiệu ứng mờ dần',
                'Dot hiển thị điểm dữ liệu — tắt dot khi nhiều điểm quá dày',
                'Tooltip hiển thị đầy đủ giá trị khi hover',
            ]}
            wide
            demoMinHeight={400}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: typography.fontSize.sm }}>Hiển thị dot</Text>
                        <Switch checked={showDots} onChange={setShowDots} size="small" />
                    </div>
                </Space>
            }
            code={`import { LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { colors } from '@/design-system';

// Multi-series line chart
<ResponsiveContainer width="100%" height={260}>
  <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
    <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.text.secondary }} />
    <YAxis tick={{ fontSize: 12, fill: colors.text.secondary }} />
    <Tooltip contentStyle={{ background: colors.bg.container, border: \`1px solid \${colors.border.base}\`, borderRadius: 6, fontSize: 12 }} />
    <Legend wrapperStyle={{ fontSize: 12 }} />
    <Line type="monotone" dataKey="received"  name="Nhận về"  stroke={colors.subsystem.collection} strokeWidth={2} dot={showDots ? { r: 4 } : false} />
    <Line type="monotone" dataKey="processed" name="Xử lý"    stroke={colors.subsystem.product}    strokeWidth={2} dot={showDots ? { r: 4 } : false} />
    <Line type="monotone" dataKey="error"     name="Lỗi"      stroke={colors.error.base}           strokeWidth={2} dot={showDots ? { r: 4 } : false} />
  </LineChart>
</ResponsiveContainer>

// Target reference line (nét đứt)
<Line type="monotone" dataKey="target" name="Mục tiêu" stroke={colors.error.base}
  strokeDasharray="5 5" dot={false} strokeWidth={1.5} />

// Area chart với gradient
<defs>
  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%"  stopColor={colors.subsystem.collection} stopOpacity={0.15} />
    <stop offset="95%" stopColor={colors.subsystem.collection} stopOpacity={0} />
  </linearGradient>
</defs>
<Area type="monotone" dataKey="value" fill="url(#areaGrad)" stroke={colors.subsystem.collection} />`}
        >
            <Space direction="vertical" style={{ width: '100%', gap: spacing[4] }}>
                {/* Multi-series line */}
                <SectionCard title="Xu hướng thu thập & xử lý dữ liệu">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={TREND_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                            <YAxis tick={{ fontSize: 11, fill: colors.text.secondary }} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="received"  name="Nhận về"  stroke={colors.subsystem.collection} strokeWidth={2} dot={showDots ? { r: 4, fill: colors.subsystem.collection } : false} />
                            <Line type="monotone" dataKey="processed" name="Đã xử lý" stroke={colors.subsystem.product}    strokeWidth={2} dot={showDots ? { r: 4, fill: colors.subsystem.product }    : false} />
                            <Line type="monotone" dataKey="error"     name="Lỗi"      stroke={colors.error.base}           strokeWidth={2} dot={showDots ? { r: 4, fill: colors.error.base }           : false} />
                        </LineChart>
                    </ResponsiveContainer>
                </SectionCard>

                <Row gutter={[16, 0]}>
                    {/* Target line */}
                    <Col xs={24} md={12}>
                        <SectionCard title="Tỷ lệ xử lý đúng hạn vs mục tiêu 95%">
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={RATE_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                    <YAxis domain={[0.85, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '']} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <ReferenceLine y={0.95} stroke={colors.error.base} strokeDasharray="4 4" label={{ value: '95%', position: 'right', fontSize: 10, fill: colors.error.base }} />
                                    <Line type="monotone" dataKey="rate"   name="Thực tế"  stroke={colors.subsystem.collection} strokeWidth={2} dot={showDots ? { r: 4, fill: colors.subsystem.collection } : false} />
                                    <Line type="monotone" dataKey="target" name="Mục tiêu" stroke={colors.error.base} strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
                                </LineChart>
                            </ResponsiveContainer>
                        </SectionCard>
                    </Col>

                    {/* Area chart */}
                    <Col xs={24} md={12}>
                        <SectionCard title="Tổng hồ sơ tích lũy (Area chart)">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={AREA_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor={colors.subsystem.collection} stopOpacity={0.15} />
                                            <stop offset="95%" stopColor={colors.subsystem.collection} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                    <YAxis tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Hồ sơ"
                                        stroke={colors.subsystem.collection}
                                        strokeWidth={2}
                                        fill="url(#areaGrad)"
                                        dot={showDots ? { r: 4, fill: colors.subsystem.collection } : false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </SectionCard>
                    </Col>
                </Row>
            </Space>
        </ComponentShowcase>
    );
};

export default ChartLineDemo;

'use client';

import React, { useState } from 'react';
import { Typography, Row, Col } from 'antd';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ComposedChart, Bar, Area,
} from 'recharts';
import ComponentShowcase from '../../ComponentShowcase';
import { SectionCard } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const PIE_DATA = [
    { name: 'Ngân hàng TM',      value: 42, color: colors.subsystem.collection },
    { name: 'Công ty tài chính', value: 28, color: colors.subsystem.product },
    { name: 'Quỹ tín dụng ND',   value: 18, color: colors.subsystem.kkn },
    { name: 'Tổ chức khác',      value: 12, color: colors.neutral[400] },
];

const STATUS_PIE = [
    { name: 'Hoạt động',  value: 210, color: colors.success.base },
    { name: 'Chờ duyệt',  value: 80,  color: colors.warning.base },
    { name: 'Vô hiệu',    value: 40,  color: colors.neutral[400] },
    { name: 'Lỗi',        value: 20,  color: colors.error.base },
];

const LINE_DATA = [
    { month: 'T1', rate: 0.92, target: 0.95 },
    { month: 'T2', rate: 0.94, target: 0.95 },
    { month: 'T3', rate: 0.91, target: 0.95 },
    { month: 'T4', rate: 0.96, target: 0.95 },
    { month: 'T5', rate: 0.97, target: 0.95 },
    { month: 'T6', rate: 0.98, target: 0.95 },
];

const DUAL_DATA = [
    { month: 'T1', volume: 4200, rate: 0.92 },
    { month: 'T2', volume: 3800, rate: 0.94 },
    { month: 'T3', volume: 5100, rate: 0.91 },
    { month: 'T4', volume: 4700, rate: 0.96 },
    { month: 'T5', volume: 5300, rate: 0.97 },
    { month: 'T6', volume: 4900, rate: 0.98 },
];

const ChartPieDemo: React.FC = () => {
    useHeaderActions({ title: 'Biểu đồ tròn / Dual Axis' }, []);

    return (
        <ComponentShowcase
            name="Biểu đồ tròn / Đường / Dual Axis"
            group="dashboard"
            description="Pie / Donut cho phân bổ danh mục. Line chart cho xu hướng. Dual Axis (cột + đường) cho Volume + Tỷ lệ — phổ biến trong báo cáo tín dụng."
            behaviors={[
                'Pie: Tooltip hiển thị % và giá trị tuyệt đối',
                'Donut: innerRadius để tạo vùng trống ở giữa, có thể đặt tổng',
                'Line: dùng cho dữ liệu xu hướng theo thời gian',
                'Dual Axis: trục Y trái = Volume (Bar), trục Y phải = Tỷ lệ % (Line)',
                'Target line (nét đứt) để so sánh thực tế vs mục tiêu',
                'Tất cả màu từ colors.subsystem.* hoặc semantic colors',
            ]}
            wide
            demoMinHeight={500}
            code={`// Donut chart
<PieChart>
  <Pie data={data} cx="50%" cy="50%"
    innerRadius={60} outerRadius={90}
    dataKey="value" label={({name, percent}) => \`\${name} \${(percent*100).toFixed(0)}%\`}
  >
    {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

// Dual Axis: Bar (khối lượng) + Line (tỷ lệ)
<ComposedChart data={data}>
  <XAxis dataKey="month" />
  <YAxis yAxisId="left"  orientation="left"  />
  <YAxis yAxisId="right" orientation="right" tickFormatter={v => \`\${(v*100).toFixed(0)}%\`} />
  <Bar     yAxisId="left"  dataKey="volume" fill={colors.subsystem.collection} />
  <Line    yAxisId="right" dataKey="rate"   stroke={colors.error.base} dot={{ r: 4 }} />
</ComposedChart>`}
        >
            <Row gutter={[16, 16]}>
                {/* Donut */}
                <Col xs={24} md={12}>
                    <SectionCard title="Phân bổ loại hình TCTD">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={PIE_DATA}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={90}
                                    dataKey="value"
                                    paddingAngle={2}
                                >
                                    {PIE_DATA.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: colors.bg.container, border: `1px solid ${colors.border.base}`, borderRadius: 6, fontSize: 12 }}
                                    formatter={(v: number) => [`${v}%`, '']}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Col>

                {/* Status pie */}
                <Col xs={24} md={12}>
                    <SectionCard title="Phân bổ trạng thái hồ sơ">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={STATUS_PIE} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                                    {STATUS_PIE.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: colors.bg.container, border: `1px solid ${colors.border.base}`, borderRadius: 6, fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Col>

                {/* Line chart with target */}
                <Col xs={24} md={12}>
                    <SectionCard title="Tỷ lệ xử lý đúng hạn vs mục tiêu 95%">
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={LINE_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                <YAxis domain={[0.85, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                <Tooltip contentStyle={{ background: colors.bg.container, border: `1px solid ${colors.border.base}`, borderRadius: 6, fontSize: 12 }} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '']} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey="rate"   name="Thực tế" stroke={colors.subsystem.collection} strokeWidth={2} dot={{ r: 4, fill: colors.subsystem.collection }} />
                                <Line type="monotone" dataKey="target" name="Mục tiêu" stroke={colors.error.base} strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Col>

                {/* Dual axis */}
                <Col xs={24} md={12}>
                    <SectionCard title="Khối lượng + Tỷ lệ xử lý (Dual Axis)">
                        <ResponsiveContainer width="100%" height={220}>
                            <ComposedChart data={DUAL_DATA} margin={{ top: 8, right: 32, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                <YAxis yAxisId="right" orientation="right" domain={[0.85, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11, fill: colors.text.secondary }} />
                                <Tooltip
                                    contentStyle={{ background: colors.bg.container, border: `1px solid ${colors.border.base}`, borderRadius: 6, fontSize: 12 }}
                                    formatter={(v: number, name: string) => name === 'Tỷ lệ' ? [`${(v * 100).toFixed(1)}%`, name] : [v.toLocaleString('vi-VN'), name]}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar yAxisId="left" dataKey="volume" name="Khối lượng" fill={colors.subsystem.collection + '80'} radius={[3, 3, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="rate" name="Tỷ lệ" stroke={colors.error.base} strokeWidth={2} dot={{ r: 3, fill: colors.error.base }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Col>
            </Row>
        </ComponentShowcase>
    );
};

export default ChartPieDemo;

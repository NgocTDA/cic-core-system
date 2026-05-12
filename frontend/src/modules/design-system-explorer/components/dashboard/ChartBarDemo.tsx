'use client';

import React, { useState } from 'react';
import { Typography, Space, Switch, Radio } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import ComponentShowcase from '../../ComponentShowcase';
import { SectionCard } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const MONTHLY_DATA = [
    { month: 'T1', received: 4200, processed: 3800, error: 120 },
    { month: 'T2', received: 3800, processed: 3600, error: 98 },
    { month: 'T3', received: 5100, processed: 4900, error: 145 },
    { month: 'T4', received: 4700, processed: 4500, error: 110 },
    { month: 'T5', received: 5300, processed: 5100, error: 88 },
    { month: 'T6', received: 4900, processed: 4700, error: 130 },
];

const TCTD_DATA = [
    { name: 'NH Vietcombank', value: 12450 },
    { name: 'NH Agribank',    value: 10320 },
    { name: 'NH BIDV',        value: 9870 },
    { name: 'NH Vietinbank',  value: 8540 },
    { name: 'NH MB Bank',     value: 7230 },
    { name: 'NH Techcombank', value: 6890 },
];

const BAR_COLORS = [
    colors.subsystem.collection,
    colors.subsystem.product,
    colors.subsystem.kkn,
    colors.subsystem.ops,
    colors.subsystem.analytics,
    colors.subsystem.governance,
];

const ChartBarDemo: React.FC = () => {
    const [stacked, setStacked] = useState(false);

    useHeaderActions({ title: 'Biểu đồ cột' }, []);

    return (
        <ComponentShowcase
            name="Biểu đồ cột (Bar/Column)"
            group="dashboard"
            description="Biểu đồ cột dọc/ngang cho so sánh dữ liệu theo danh mục hoặc theo kỳ. Dùng Recharts với colors từ design token."
            behaviors={[
                'Luôn wrap trong SectionCard để nhất quán layout',
                'ResponsiveContainer để tự động fit theo container',
                'Tooltip hiển thị giá trị đầy đủ khi hover',
                'Legend hiển thị chú thích series',
                'Stacked bar dùng khi cần so sánh thành phần',
                'Màu sắc từ colors.subsystem.* hoặc semantic colors',
                'Horizontal bar khi label danh mục quá dài',
            ]}
            wide
            demoMinHeight={400}
            code={`import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '@/design-system';

// Column chart (dọc)
<ResponsiveContainer width="100%" height={280}>
  <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
    <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.text.secondary }} />
    <YAxis tick={{ fontSize: 12, fill: colors.text.secondary }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="received"  name="Nhận"    fill={colors.subsystem.collection} radius={[3,3,0,0]} />
    <Bar dataKey="processed" name="Xử lý"   fill={colors.subsystem.product}    radius={[3,3,0,0]} />
    <Bar dataKey="error"     name="Lỗi"     fill={colors.error.base}           radius={[3,3,0,0]} />
  </BarChart>
</ResponsiveContainer>`}
        >
            <Space direction="vertical" style={{ width: '100%', gap: spacing[4] }}>
                <SectionCard
                    title="Tình hình thu thập dữ liệu theo tháng"
                    extra={
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>Stacked</Text>
                            <Switch size="small" checked={stacked} onChange={setStacked} />
                        </div>
                    }
                >
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={MONTHLY_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.text.secondary }} />
                            <YAxis tick={{ fontSize: 12, fill: colors.text.secondary }} />
                            <Tooltip
                                contentStyle={{
                                    background: colors.bg.container,
                                    border: `1px solid ${colors.border.base}`,
                                    borderRadius: 6,
                                    fontSize: 12,
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="received"  name="Nhận về"   stackId={stacked ? 'a' : undefined} fill={colors.subsystem.collection} radius={stacked ? [0,0,0,0] : [3,3,0,0]} />
                            <Bar dataKey="processed" name="Đã xử lý"  stackId={stacked ? 'a' : undefined} fill={colors.subsystem.product}    radius={stacked ? [0,0,0,0] : [3,3,0,0]} />
                            <Bar dataKey="error"     name="Lỗi"        stackId={stacked ? 'a' : undefined} fill={colors.error.base}           radius={stacked ? [3,3,0,0] : [3,3,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="Top 6 TCTD nộp báo cáo nhiều nhất (Horizontal)">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={TCTD_DATA}
                            layout="vertical"
                            margin={{ top: 4, right: 40, left: 110, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.border.split} horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: colors.text.secondary }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: colors.text.secondary }} width={110} />
                            <Tooltip
                                contentStyle={{ background: colors.bg.container, border: `1px solid ${colors.border.base}`, borderRadius: 6, fontSize: 12 }}
                                formatter={(v: number) => [v.toLocaleString('vi-VN'), 'Hồ sơ']}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {TCTD_DATA.map((_, i) => (
                                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>
            </Space>
        </ComponentShowcase>
    );
};

export default ChartBarDemo;

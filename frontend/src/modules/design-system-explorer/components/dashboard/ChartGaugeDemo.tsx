'use client';

import React, { useState } from 'react';
import { Typography, Slider, Row, Col, Tag } from 'antd';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import ComponentShowcase from '../../ComponentShowcase';
import { SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const SCORE_RANGES = [
    { min: 0,   max: 300, label: 'Rất thấp', color: colors.error.base },
    { min: 300, max: 500, label: 'Thấp',      color: colors.warning.base },
    { min: 500, max: 650, label: 'Trung bình', color: '#fadb14' },
    { min: 650, max: 800, label: 'Tốt',        color: colors.success.base },
    { min: 800, max: 900, label: 'Rất tốt',    color: colors.primary[500] },
];

const getScoreInfo = (score: number) => {
    return SCORE_RANGES.find(r => score >= r.min && score < r.max)
        ?? SCORE_RANGES[SCORE_RANGES.length - 1];
};

interface GaugeProps {
    score: number;
    maxScore?: number;
}

const CreditGauge: React.FC<GaugeProps> = ({ score, maxScore = 900 }) => {
    const pct      = Math.min(score / maxScore, 1);
    const info     = getScoreInfo(score);
    const arcData  = [{ value: pct * 100 }];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 200, height: 120 }}>
                <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart
                        cx="50%" cy="100%"
                        innerRadius="60%"
                        outerRadius="100%"
                        startAngle={180}
                        endAngle={0}
                        data={arcData}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background={{ fill: colors.neutral[200] }}
                            dataKey="value"
                            fill={info.color}
                            cornerRadius={4}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Center text */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0, left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: info.color, lineHeight: 1 }}>
                        {score}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>/ {maxScore}</div>
                </div>
            </div>

            <Tag
                style={{
                    marginTop: spacing[3],
                    background: info.color + '20',
                    color: info.color,
                    border: `1px solid ${info.color}50`,
                    borderRadius: radius.full,
                    fontWeight: typography.fontWeight.semibold,
                }}
            >
                {info.label}
            </Tag>
        </div>
    );
};

const ChartGaugeDemo: React.FC = () => {
    const [score1, setScore1] = useState(720);
    const [score2, setScore2] = useState(450);
    const [score3, setScore3] = useState(860);

    useHeaderActions({ title: 'Gauge / Đồng hồ' }, []);

    return (
        <ComponentShowcase
            name="Gauge — Điểm tín dụng"
            group="dashboard"
            description="Biểu đồ đồng hồ bán vòng tròn thể hiện điểm tín dụng theo dải màu từ đỏ đến xanh. Dùng Recharts RadialBarChart."
            behaviors={[
                'Score range: 0-300 Rất thấp (đỏ), 300-500 Thấp (cam), 500-650 Trung bình (vàng)',
                '650-800 Tốt (xanh lá), 800-900 Rất tốt (xanh dương)',
                'Hiển thị điểm số và label rang ở giữa/dưới biểu đồ',
                'Background arc màu xám nhạt thể hiện max score',
                'Interactive: slide để xem thay đổi realtime',
                'Ghi chú: @ant-design/charts có Gauge component native hơn',
            ]}
            wide
            demoBackground={colors.bg.page}
            demoMinHeight={350}
            code={`// Dùng Recharts RadialBarChart để mock Gauge
// Khuyến nghị dùng @ant-design/charts Gauge cho production:
// import { Gauge } from '@ant-design/charts';
// <Gauge percent={score/900} range={{ color: 'l(0) 0:#ff4d4f 0.5:#faad14 1:#52c41a' }} />

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

<RadialBarChart
  cx="50%" cy="100%"
  innerRadius="60%" outerRadius="100%"
  startAngle={180} endAngle={0}
  data={[{ value: (score / 900) * 100 }]}
>
  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
  <RadialBar background={{ fill: '#f0f0f0' }} dataKey="value" fill={scoreColor} />
</RadialBarChart>`}
        >
            <Row gutter={[24, 16]} justify="center">
                <Col xs={24} sm={8}>
                    <SectionCard title="Điểm tín dụng KH 1">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[3] }}>
                            <CreditGauge score={score1} />
                            <Slider
                                min={0} max={900} value={score1} onChange={setScore1}
                                style={{ width: 160 }}
                                tooltip={{ formatter: (v) => `${v} điểm` }}
                            />
                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>Kéo để thay đổi điểm</Text>
                        </div>
                    </SectionCard>
                </Col>

                <Col xs={24} sm={8}>
                    <SectionCard title="Điểm tín dụng KH 2">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[3] }}>
                            <CreditGauge score={score2} />
                            <Slider
                                min={0} max={900} value={score2} onChange={setScore2}
                                style={{ width: 160 }}
                                tooltip={{ formatter: (v) => `${v} điểm` }}
                            />
                        </div>
                    </SectionCard>
                </Col>

                <Col xs={24} sm={8}>
                    <SectionCard title="Điểm tín dụng KH 3">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[3] }}>
                            <CreditGauge score={score3} />
                            <Slider
                                min={0} max={900} value={score3} onChange={setScore3}
                                style={{ width: 160 }}
                                tooltip={{ formatter: (v) => `${v} điểm` }}
                            />
                        </div>
                    </SectionCard>
                </Col>
            </Row>

            {/* Score ranges legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[4], justifyContent: 'center' }}>
                {SCORE_RANGES.map((r) => (
                    <Tag
                        key={r.label}
                        style={{
                            background: r.color + '18',
                            color: r.color,
                            border: `1px solid ${r.color}50`,
                            fontSize: typography.fontSize.xs,
                        }}
                    >
                        {r.min}–{r.max}: {r.label}
                    </Tag>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: spacing[2] }}>
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                    💡 Production: Dùng @ant-design/charts Gauge hoặc Bullet chart cho kết quả chuyên nghiệp hơn
                </Text>
            </div>
        </ComponentShowcase>
    );
};

export default ChartGaugeDemo;

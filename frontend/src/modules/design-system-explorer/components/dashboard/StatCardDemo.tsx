'use client';

import React from 'react';
import { Card, Typography, Row, Col, Tag, Space } from 'antd';
import {
    ArrowUpOutlined, ArrowDownOutlined, MinusOutlined,
    TeamOutlined, FileTextOutlined, CheckCircleOutlined,
    WarningOutlined, DollarOutlined,
} from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing, radius, shadows } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
    iconBg?: string;
    trend?: { value: number; label?: string };
    subtitle?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, iconBg, trend, subtitle, color }) => {
    const trendColor = trend
        ? trend.value > 0 ? colors.success.base : trend.value < 0 ? colors.error.base : colors.text.secondary
        : undefined;
    const TrendIcon = trend
        ? trend.value > 0 ? ArrowUpOutlined : trend.value < 0 ? ArrowDownOutlined : MinusOutlined
        : null;

    return (
        <Card
            bordered={false}
            style={{ borderRadius: radius.lg, boxShadow: shadows.card, height: '100%' }}
            styles={{ body: { padding: spacing[5] } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, lineHeight: 1.4 }}>
                    {title}
                </Text>
                {icon && (
                    <div
                        style={{
                            width: 40, height: 40, borderRadius: radius.lg,
                            background: (iconBg ?? colors.primary[50]),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: 20,
                            color: color ?? colors.primary[500],
                        }}
                    >
                        {icon}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2], marginBottom: trend || subtitle ? spacing[2] : 0 }}>
                <Text
                    style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: color ?? colors.text.primary,
                        lineHeight: 1.1,
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                </Text>
                {unit && (
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{unit}</Text>
                )}
            </div>

            {(trend || subtitle) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    {trend && TrendIcon && (
                        <span style={{ color: trendColor, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                            <TrendIcon /> {Math.abs(trend.value)}%
                        </span>
                    )}
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                        {trend?.label ?? subtitle}
                    </Text>
                </div>
            )}
        </Card>
    );
};

const StatCardDemo: React.FC = () => {
    useHeaderActions({ title: 'StatCard' }, []);

    return (
        <ComponentShowcase
            name="StatCard"
            group="dashboard"
            description="Card hiển thị metric / chỉ số quan trọng với giá trị, đơn vị, icon, và trend so với kỳ trước. Dùng ở đầu các Dashboard."
            behaviors={[
                'Hiển thị số liệu với format dấu . phân nghìn (toLocaleString vi-VN)',
                'Trend: màu xanh lá khi tăng, đỏ khi giảm, xám khi không thay đổi',
                'Icon background dùng màu pastel từ design token',
                'Responsive: 4 cột trên desktop, 2 cột tablet, 1 cột mobile',
                'Hover effect nhẹ (boxShadow thay đổi)',
                'Không dùng màu hardcode — tất cả từ colors.*',
            ]}
            wide
            demoMinHeight={200}
            code={`// StatCard component
interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: { value: number; label?: string }; // +/- % so với kỳ trước
  color?: string;
}

// Sử dụng
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} xl={6}>
    <StatCard
      title="Tổng TCTD đang kết nối"
      value={1234}
      icon={<TeamOutlined />}
      iconBg={colors.primary[50]}
      color={colors.primary[500]}
      trend={{ value: 5.2, label: 'so với tháng trước' }}
    />
  </Col>
  // ...
</Row>`}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Tổng TCTD kết nối"
                        value={1284}
                        icon={<TeamOutlined />}
                        iconBg={colors.primary[50]}
                        color={colors.primary[500]}
                        trend={{ value: 5.2, label: 'so với tháng trước' }}
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Hồ sơ xử lý hôm nay"
                        value={18452}
                        unit="hồ sơ"
                        icon={<FileTextOutlined />}
                        iconBg={colors.subsystem.collection + '20'}
                        color={colors.subsystem.collection}
                        trend={{ value: 12.1, label: 'so với hôm qua' }}
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Tỷ lệ hồ sơ lỗi"
                        value="0.82"
                        unit="%"
                        icon={<WarningOutlined />}
                        iconBg={colors.warning.light}
                        color={colors.warning.dark}
                        trend={{ value: -0.3, label: 'cải thiện so với tuần trước' }}
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Sản phẩm TTTD đã cung cấp"
                        value={9876543}
                        unit="SP"
                        icon={<CheckCircleOutlined />}
                        iconBg={colors.success.light}
                        color={colors.success.dark}
                        trend={{ value: 8.4, label: 'so với tháng trước' }}
                    />
                </Col>
            </Row>

            {/* Variants */}
            <Row gutter={[16, 16]} style={{ marginTop: spacing[4] }}>
                <Col xs={24} sm={12} xl={8}>
                    <StatCard
                        title="Dư nợ tổng hợp"
                        value="2.45"
                        unit="nghìn tỷ VNĐ"
                        icon={<DollarOutlined />}
                        iconBg={colors.subsystem.product + '20'}
                        color={colors.subsystem.product}
                        subtitle="Tính đến cuối tháng 3/2025"
                    />
                </Col>
                <Col xs={24} sm={12} xl={8}>
                    <StatCard
                        title="TCTD chưa nộp báo cáo"
                        value={23}
                        icon={<WarningOutlined />}
                        iconBg={colors.error.light}
                        color={colors.error.base}
                        trend={{ value: 0, label: 'không thay đổi' }}
                    />
                </Col>
                <Col xs={24} sm={12} xl={8}>
                    <StatCard
                        title="Uptime hệ thống"
                        value="99.98"
                        unit="%"
                        icon={<CheckCircleOutlined />}
                        iconBg={colors.success.light}
                        color={colors.success.dark}
                        subtitle="30 ngày gần nhất"
                    />
                </Col>
            </Row>
        </ComponentShowcase>
    );
};

export { StatCard };
export default StatCardDemo;

'use client';

import React from 'react';
import { Typography, Row, Col, Card, Tag, Statistic, Divider, Space } from 'antd';
import {
    ContainerOutlined, TableOutlined, FormOutlined, InteractionOutlined,
    BellOutlined, BarChartOutlined, TagOutlined, LayoutOutlined,
    ArrowRightOutlined, CheckCircleFilled, InfoCircleFilled,
} from '@ant-design/icons';
import Link from 'next/link';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius, shadows } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';
import { GROUP_CONFIG } from './ComponentShowcase';

const { Title, Text, Paragraph } = Typography;

const GROUPS = [
    {
        key: 'layout',
        icon: <ContainerOutlined />,
        count: 3,
        components: ['PageLayout', 'SectionCard', 'FilterBar'],
        basePath: '/design-system/layout',
        firstPath: '/design-system/layout/page-layout',
    },
    {
        key: 'data-display',
        icon: <TableOutlined />,
        count: 7,
        components: ['StatusTag', 'StatusSummaryBar', 'ActionMenu', 'CodeText', 'Table', 'Cài đặt hiển thị', 'Lịch sử thay đổi'],
        basePath: '/design-system/data-display',
        firstPath: '/design-system/data-display/status-tag',
    },
    {
        key: 'form',
        icon: <FormOutlined />,
        count: 11,
        components: ['Textbox', 'InputNumber', 'TextArea', 'Select', 'DatePicker', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Upload', 'Form mẫu'],
        basePath: '/design-system/form',
        firstPath: '/design-system/form/textbox',
    },
    {
        key: 'button',
        icon: <InteractionOutlined />,
        count: 2,
        components: ['Kiểu & trạng thái', 'Pattern thao tác'],
        basePath: '/design-system/button',
        firstPath: '/design-system/button/variants',
    },
    {
        key: 'feedback',
        icon: <BellOutlined />,
        count: 3,
        components: ['Modal & Drawer', 'Notification / Message', 'Alert'],
        basePath: '/design-system/feedback',
        firstPath: '/design-system/feedback/modal',
    },
    {
        key: 'dashboard',
        icon: <BarChartOutlined />,
        count: 6,
        components: ['StatCard', 'Biểu đồ cột', 'Biểu đồ đường', 'Biểu đồ tròn', 'Gauge', 'Dual Axis'],
        basePath: '/design-system/dashboard',
        firstPath: '/design-system/dashboard/stat-card',
    },
    {
        key: 'tokens',
        icon: <TagOutlined />,
        count: 4,
        components: ['Màu sắc', 'Typography', 'Spacing & Radius', 'Shadows & Transitions'],
        basePath: '/design-system/tokens',
        firstPath: '/design-system/tokens/colors',
    },
] as const;

const KEY_RULES = [
    {
        icon: <CheckCircleFilled style={{ color: colors.success.base }} />,
        title: 'Luôn dùng design tokens',
        desc: 'Không hardcode hex color hay padding value. Import từ @/design-system.',
    },
    {
        icon: <CheckCircleFilled style={{ color: colors.success.base }} />,
        title: 'Shared UI components cho mọi page list',
        desc: 'Dùng PageLayout, FilterBar, SectionCard, StatusTag, ActionMenu, tablePagination.',
    },
    {
        icon: <CheckCircleFilled style={{ color: colors.success.base }} />,
        title: 'Header actions qua hook',
        desc: 'useHeaderActions({ title, actions }) — không sửa AppHeader.tsx trực tiếp.',
    },
    {
        icon: <InfoCircleFilled style={{ color: colors.info.base }} />,
        title: 'Ngày: DD/MM/YYYY, Số: dấu . nghìn / , thập phân',
        desc: 'Hover vào ngày hiển thị full datetime. Số thập phân mặc định 2 chữ số.',
    },
    {
        icon: <InfoCircleFilled style={{ color: colors.info.base }} />,
        title: 'Căn lề: Text trái / Số phải / Ngày giữa',
        desc: 'Áp dụng cho cả header bảng và giá trị ô. STT và Thao tác cố định (sticky).',
    },
    {
        icon: <InfoCircleFilled style={{ color: colors.info.base }} />,
        title: 'Validation: inline khi blur + submit',
        desc: 'Trường bắt buộc đánh dấu (*). Trim whitespace đầu/cuối tự động.',
    },
];

const DSELanding: React.FC = () => {
    useHeaderActions({ title: 'Design System Explorer' }, []);

    const totalComponents = GROUPS.reduce((s, g) => s + g.count, 0);

    return (
        <PageLayout>
            {/* ─── Hero ──────────────────────────────────────────── */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${colors.subsystem.design}12 0%, ${colors.subsystem.design}06 100%)`,
                    border: `1px solid ${colors.subsystem.design}25`,
                    borderRadius: radius.xl,
                    padding: `${spacing[8]} ${spacing[8]}`,
                    marginBottom: spacing[6],
                }}
            >
                <Row align="middle" gutter={[24, 24]}>
                    <Col flex="auto">
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] }}>
                            <LayoutOutlined style={{ color: colors.subsystem.design, fontSize: 28 }} />
                            <Title level={1} style={{ margin: 0, color: colors.subsystem.design, fontSize: typography.fontSize['3xl'] }}>
                                Design System Explorer
                            </Title>
                        </div>
                        <Paragraph style={{ color: colors.text.secondary, margin: 0, maxWidth: 560, fontSize: typography.fontSize.base }}>
                            Thư viện component dùng chung cho toàn bộ CIC Core System.
                            Mỗi component được trình bày kèm mô tả, behaviors và demo trực tiếp.
                        </Paragraph>
                    </Col>
                    <Col>
                        <Row gutter={32}>
                            <Col>
                                <Statistic
                                    title={<Text style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>Tổng components</Text>}
                                    value={totalComponents}
                                    valueStyle={{ color: colors.subsystem.design, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}
                                />
                            </Col>
                            <Col>
                                <Statistic
                                    title={<Text style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>Nhóm</Text>}
                                    value={GROUPS.length}
                                    valueStyle={{ color: colors.subsystem.design, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            {/* ─── Layout Explorer entry ─────────────────────────── */}
            <Link href="/design-system/layout-explorer" style={{ textDecoration: 'none' }}>
                <Card
                    hoverable
                    style={{
                        marginBottom: spacing[6],
                        border: `1.5px solid ${colors.subsystem.design}40`,
                        borderRadius: radius.lg,
                        background: colors.bg.container,
                        boxShadow: shadows.sm,
                    }}
                    styles={{ body: { padding: `${spacing[4]} ${spacing[6]}` } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                            <div
                                style={{
                                    width: 44, height: 44,
                                    borderRadius: radius.lg,
                                    background: colors.subsystem.design + '18',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <LayoutOutlined style={{ color: colors.subsystem.design, fontSize: 22 }} />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: typography.fontSize.md, color: colors.text.primary }}>
                                    Layout hệ thống
                                </Text>
                                <div>
                                    <Text style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                                        Khám phá cấu trúc layout tổng thể — Header, Sidebar, Content Area, Breadcrumb — với annotations tương tác.
                                    </Text>
                                </div>
                            </div>
                        </div>
                        <ArrowRightOutlined style={{ color: colors.subsystem.design, fontSize: 18 }} />
                    </div>
                </Card>
            </Link>

            {/* ─── Component Groups ──────────────────────────────── */}
            <SectionCard title={`Component Groups (${GROUPS.length} nhóm)`} style={{ marginBottom: spacing[6] }}>
                <Row gutter={[16, 16]} style={{ paddingTop: spacing[3] }}>
                    {GROUPS.map((g) => {
                        const gc = GROUP_CONFIG[g.key];
                        return (
                            <Col xs={24} sm={12} lg={8} key={g.key}>
                                <Link href={g.firstPath} style={{ textDecoration: 'none' }}>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: radius.lg,
                                            border: `1px solid ${gc.color}30`,
                                            background: colors.bg.container,
                                            height: '100%',
                                        }}
                                        styles={{ body: { padding: spacing[4] } }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[3] }}>
                                            <div
                                                style={{
                                                    width: 36, height: 36,
                                                    borderRadius: radius.md,
                                                    background: gc.color + '18',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                    color: gc.color,
                                                    fontSize: 18,
                                                }}
                                            >
                                                {g.icon}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text strong style={{ color: colors.text.primary, fontSize: typography.fontSize.base }}>
                                                        {gc.label}
                                                    </Text>
                                                    <Tag
                                                        style={{
                                                            background: gc.color + '15',
                                                            color: gc.color,
                                                            border: 'none',
                                                            fontSize: typography.fontSize.xs,
                                                            lineHeight: '18px',
                                                        }}
                                                    >
                                                        {g.count}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[1] }}>
                                            {g.components.slice(0, 5).map((c) => (
                                                <Tag
                                                    key={c}
                                                    style={{
                                                        fontSize: 11,
                                                        background: colors.bg.subtle,
                                                        color: colors.text.secondary,
                                                        border: `1px solid ${colors.border.split}`,
                                                        borderRadius: radius.sm,
                                                        margin: 0,
                                                        padding: '0 6px',
                                                    }}
                                                >
                                                    {c}
                                                </Tag>
                                            ))}
                                            {g.components.length > 5 && (
                                                <Tag style={{ fontSize: 11, background: 'transparent', color: colors.text.tertiary, border: 'none', margin: 0 }}>
                                                    +{g.components.length - 5}
                                                </Tag>
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </SectionCard>

            {/* ─── Key rules ─────────────────────────────────────── */}
            <SectionCard title="Quy tắc quan trọng">
                <Row gutter={[12, 12]} style={{ paddingTop: spacing[3] }}>
                    {KEY_RULES.map((r, i) => (
                        <Col xs={24} md={12} key={i}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: spacing[3],
                                    padding: spacing[3],
                                    background: colors.bg.subtle,
                                    borderRadius: radius.md,
                                    border: `1px solid ${colors.border.split}`,
                                }}
                            >
                                <div style={{ flexShrink: 0, paddingTop: 2 }}>{r.icon}</div>
                                <div>
                                    <Text strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, display: 'block' }}>
                                        {r.title}
                                    </Text>
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                                        {r.desc}
                                    </Text>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </SectionCard>
        </PageLayout>
    );
};

export default DSELanding;

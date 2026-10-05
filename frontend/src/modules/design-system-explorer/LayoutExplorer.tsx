'use client';

import React, { useState } from 'react';
import { Typography, Card, Tag, Drawer, Space, Divider, Badge } from 'antd';
import {
    CloseOutlined, LayoutOutlined, MenuOutlined,
    BellOutlined, HomeOutlined, AppstoreOutlined,
} from '@ant-design/icons';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius, shadows, layout, zIndex } from '@/modules/design-system-explorer/tokens';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Title, Text, Paragraph } = Typography;

interface Zone {
    id: string;
    label: string;
    shortLabel: string;
    color: string;
    x: number;
    y: number;
    w: number;
    h: number;
    description: string;
    tokens: { key: string; value: string }[];
    notes: string[];
}

const ZONES: Zone[] = [
    {
        id: 'sidebar',
        label: 'AppSidebar',
        shortLabel: 'Sidebar',
        color: 'var(--chart-4-indigo)',
        x: 0, y: 0, w: 22, h: 100,
        description: 'Sidebar điều hướng cố định bên trái. Dark theme với màu riêng của từng subsystem khi active.',
        tokens: [
            { key: 'colors.sidebar.bg',          value: 'var(--color-ink-900)' },
            { key: 'colors.sidebar.bgDeep',       value: 'var(--color-ink-950)' },
            { key: 'layout.sidebarWidth',         value: '256px' },
            { key: 'layout.sidebarCollapsedWidth',value: '64px' },
            { key: 'zIndex.sticky',               value: '1100' },
        ],
        notes: [
            'Subsystem switcher ở trên cùng (SubSystemSwitcher)',
            'Menu item active dùng màu của subsystem đang chọn',
            'Collapse/expand qua nút ở footer sidebar',
            'Mobile: render trong Ant Design Drawer',
            'Version info ở footer (CIC Core System v1.1.0)',
        ],
    },
    {
        id: 'header',
        label: 'AppHeader',
        shortLabel: 'Header',
        color: 'var(--chart-6-sky)',
        x: 22, y: 0, w: 78, h: 13,
        description: 'Header sticky phía trên content area. Hiển thị breadcrumb, tiêu đề trang, và actions đăng ký qua hook.',
        tokens: [
            { key: 'layout.headerHeight',  value: '56px' },
            { key: 'colors.bg.container',  value: '#ffffff' },
            { key: 'shadows.sm',           value: '0 2px 8px rgba(0,0,0,0.06)' },
            { key: 'zIndex.sticky',        value: '1100' },
        ],
        notes: [
            'Breadcrumb tự động từ path và subsystem active',
            'Page title được set qua useHeaderActions hook',
            'Actions (Thêm mới, Xuất Excel...) qua useHeaderActions',
            'Bell icon thông báo ở bên phải',
            'Collapse button cho sidebar ở bên trái',
        ],
    },
    {
        id: 'content',
        label: 'Content Area',
        shortLabel: 'Content',
        color: 'var(--primary)',
        x: 22, y: 13, w: 78, h: 87,
        description: 'Vùng nội dung chính. Bao gồm PageLayout wrapper cho mọi page.',
        tokens: [
            { key: 'colors.bg.page',          value: 'var(--bg)' },
            { key: 'layout.contentPadding',    value: '16px 24px 24px' },
            { key: 'layout.contentPaddingMobile', value: '16px' },
        ],
        notes: [
            'Mọi page đều wrap trong <PageLayout>',
            'Overflow hidden — nội dung scroll bên trong SectionCard',
            'Background màu page (bg.page) phân biệt với card (bg.container)',
            'Flex layout: column direction, fill remaining height',
        ],
    },
    {
        id: 'subsystem-switcher',
        label: 'SubSystemSwitcher',
        shortLabel: 'Switcher',
        color: 'var(--chart-5-amber)',
        x: 0, y: 0, w: 22, h: 15,
        description: 'Component chuyển đổi giữa 7 phân hệ. Hiển thị tên + màu sắc của subsystem đang active.',
        tokens: [
            { key: 'colors.sidebar.bg',     value: 'var(--color-ink-900)' },
            { key: 'colors.subsystem.*',    value: '7 màu khác nhau' },
        ],
        notes: [
            'Lưu subsystem đang active vào localStorage',
            'Dropdown danh sách tất cả 7 phân hệ',
            'Menu item active thay đổi màu theo subsystem',
            'Collapsed: chỉ hiện icon subsystem',
        ],
    },
];

const SCALE = 4.8;

const LayoutExplorer: React.FC = () => {
    const [activeZone, setActiveZone] = useState<Zone | null>(null);

    useHeaderActions({ title: 'Layout hệ thống' }, []);

    return (
        <PageLayout>
            {/* Intro */}
            <div style={{ marginBottom: 'var(--spacing-20)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)', marginBottom: 'var(--spacing-8)' }}>
                    <LayoutOutlined style={{ color: colors.subsystem.design, fontSize: 24 }} />
                    <Title level={2} style={{ margin: 0 }}>Layout hệ thống</Title>
                </div>
                <Paragraph style={{ color: 'var(--text-muted)', margin: 0 }}>
                    Khám phá cấu trúc layout tổng thể của CIC Core System. Click vào từng vùng để xem chi tiết tokens và behavior.
                </Paragraph>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-20)', flexWrap: 'wrap' }}>
                {/* ─── Diagram ─────────────────────────────────────── */}
                <SectionCard
                    title="Sơ đồ layout"
                    extra={
                        <Tag style={{ fontSize: '11px', cursor: 'default' }}>
                            Click để xem chi tiết
                        </Tag>
                    }
                    style={{ flex: '1 1 460px' }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '56.25%',
                            marginTop: 'var(--spacing-12)',
                            background: 'var(--bg)',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid var(--border)`,
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ position: 'absolute', inset: 0 }}>
                            {/* Background grid */}
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(var(--color-neutral-100) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                            {/* Sidebar zone */}
                            <ZoneBlock zone={ZONES[0]} active={activeZone?.id === ZONES[0].id} onClick={() => setActiveZone(ZONES[0])} />
                            {/* Header zone */}
                            <ZoneBlock zone={ZONES[1]} active={activeZone?.id === ZONES[1].id} onClick={() => setActiveZone(ZONES[1])} />
                            {/* Content zone */}
                            <ZoneBlock zone={ZONES[2]} active={activeZone?.id === ZONES[2].id} onClick={() => setActiveZone(ZONES[2])} />

                            {/* Sidebar internal mockup */}
                            <div style={{ position: 'absolute', left: '1%', top: '14%', width: '20%' }}>
                                {/* Switcher */}
                                <div
                                    style={{
                                        margin: '2% 4% 1%',
                                        height: '12%',
                                        background: colors.subsystem.design + '30',
                                        borderRadius: 3,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 8, color: colors.subsystem.design, fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setActiveZone(ZONES[3])}
                                >
                                    Subsystem
                                </div>
                                {/* Menu items */}
                                {['Dashboard', 'Module 1', 'Module 2', 'Module 3', 'Module 4'].map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            margin: '2% 4%',
                                            height: '7%',
                                            background: i === 0 ? colors.subsystem.design + '60' : 'transparent',
                                            borderRadius: 2,
                                            display: 'flex', alignItems: 'center',
                                            paddingLeft: 6,
                                            fontSize: 7,
                                            color: i === 0 ? '#fff' : 'var(--color-secondary-300)',
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Header internal mockup */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '23%', top: '1%',
                                    width: '75%', height: '10%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0 2%',
                                    pointerEvents: 'none',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 12, height: 8, background: 'var(--color-neutral-300)', borderRadius: 2 }} />
                                    <div style={{ width: 40, height: 8, background: 'var(--color-neutral-300)', borderRadius: 2 }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 30, height: 8, background: colors.subsystem.design + '40', borderRadius: 10 }} />
                                    <div style={{ width: 20, height: 8, background: colors.subsystem.design + '40', borderRadius: 10 }} />
                                    <div style={{ width: 10, height: 10, background: 'var(--color-neutral-300)', borderRadius: '50%' }} />
                                </div>
                            </div>

                            {/* Content internal mockup */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '23%', top: '14%',
                                    width: '74%', height: '84%',
                                    padding: '2%',
                                    pointerEvents: 'none',
                                }}
                            >
                                <div style={{ width: '60%', height: 8, background: 'var(--color-neutral-300)', borderRadius: 2, marginBottom: 6 }} />
                                <div
                                    style={{
                                        background: '#fff', borderRadius: 4, padding: '3%', height: '40%',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 6,
                                        display: 'flex', gap: 4,
                                    }}
                                >
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ flex: 1, background: 'var(--bg)', borderRadius: 3 }} />
                                    ))}
                                </div>
                                <div style={{ background: '#fff', borderRadius: 4, padding: '2%', height: '45%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ height: 6, background: 'var(--bg)', borderRadius: 2, marginBottom: 4 }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone legend */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-12)', marginTop: 'var(--spacing-16)', flexWrap: 'wrap' }}>
                        {ZONES.slice(0, 3).map((z) => (
                            <div
                                key={z.id}
                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', cursor: 'pointer' }}
                                onClick={() => setActiveZone(z)}
                            >
                                <div style={{ width: 12, height: 12, borderRadius: 3, background: z.color + '40', border: `2px solid ${z.color}` }} />
                                <Text style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{z.label}</Text>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ─── Zone detail ─────────────────────────────────── */}
                <div style={{ flex: '1 1 300px', minWidth: 280 }}>
                    {activeZone ? (
                        <SectionCard
                            title={activeZone.label}
                            extra={
                                <Tag
                                    style={{
                                        background: activeZone.color + '18',
                                        color: activeZone.color,
                                        border: `1px solid ${activeZone.color}40`,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setActiveZone(null)}
                                >
                                    ✕ Đóng
                                </Tag>
                            }
                            style={{ height: '100%' }}
                        >
                            <div style={{ paddingTop: 'var(--spacing-8)' }}>
                                <Paragraph style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    {activeZone.description}
                                </Paragraph>

                                <Divider style={{ margin: `var(--spacing-12) 0` }} />

                                <Text strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Design Tokens
                                </Text>
                                <div style={{ marginTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                                    {activeZone.tokens.map((t) => (
                                        <div
                                            key={t.key}
                                            style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: `var(--spacing-8) var(--spacing-12)`,
                                                background: 'var(--bg-subtle)',
                                                borderRadius: 'var(--radius-sm)',
                                                border: `1px solid var(--color-neutral-100)`,
                                            }}
                                        >
                                            <code style={{ fontSize: 11, color: 'var(--color-info-500)', fontFamily: typography.fontFamily.mono }}>
                                                {t.key}
                                            </code>
                                            <code style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: typography.fontFamily.mono }}>
                                                {t.value}
                                            </code>
                                        </div>
                                    ))}
                                </div>

                                <Divider style={{ margin: `var(--spacing-12) 0` }} />

                                <Text strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Lưu ý
                                </Text>
                                <ul style={{ marginTop: 'var(--spacing-8)', paddingLeft: 'var(--spacing-20)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                                    {activeZone.notes.map((n, i) => (
                                        <li key={i} style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6 }}>
                                            {n}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SectionCard>
                    ) : (
                        <SectionCard title="Chi tiết vùng" style={{ height: '100%' }}>
                            <div
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    minHeight: 200, color: 'var(--text-subtle)', gap: 'var(--spacing-12)',
                                }}
                            >
                                <LayoutOutlined style={{ fontSize: 36, color: colors.subsystem.design + '50' }} />
                                <Text style={{ color: 'var(--text-subtle)', textAlign: 'center' }}>
                                    Click vào một vùng trong sơ đồ để xem chi tiết
                                </Text>
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

interface ZoneBlockProps {
    zone: Zone;
    active: boolean;
    onClick: () => void;
}

const ZoneBlock: React.FC<ZoneBlockProps> = ({ zone, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            position: 'absolute',
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.w}%`,
            height: `${zone.h}%`,
            background: active ? zone.color + '30' : zone.color + '12',
            border: `2px solid ${active ? zone.color : zone.color + '50'}`,
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px 6px',
        }}
    >
        <span
            style={{
                fontSize: 9,
                fontWeight: 700,
                color: zone.color,
                background: '#fff',
                padding: '1px 4px',
                borderRadius: 2,
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                opacity: active ? 1 : 0.7,
            }}
        >
            {zone.shortLabel}
        </span>
    </div>
);

export default LayoutExplorer;

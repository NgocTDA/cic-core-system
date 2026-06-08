'use client';

import React, { useState } from 'react';
import { Typography, Row, Col, Space, Switch } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius, shadows, transitions } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Title, Text } = Typography;

const SHADOW_USE: Record<string, string> = {
    none: 'Reset shadow',
    xs:   'SectionCard, FilterBar card',
    sm:   'AppHeader',
    md:   'Elevated panel',
    lg:   '',
    xl:   '',
    card: 'Card hover state',
    menu: 'Dropdown, popup menu (align AntD)',
};

const DURATION_ANTD: Record<string, string> = {
    fast:   'motionDurationFast: \'0.1s\'',
    normal: 'motionDurationMid: \'0.2s\'',
    slow:   'motionDurationSlow: \'0.3s\'',
    slower: '— (không có AntD equivalent)',
};

const ShadowsDemo: React.FC = () => {
    const [animated, setAnimated] = useState(false);

    useHeaderActions({ title: 'Shadows & Transitions' }, []);

    return (
        <PageLayout>
            <Title level={2} style={{ margin: `0 0 ${spacing[6]}` }}>Shadows & Transitions</Title>

            <Row gutter={[20, 20]}>
                {/* Shadows */}
                <Col xs={24} lg={14}>
                    <SectionCard title="Shadows">
                        <div style={{ paddingTop: spacing[3], display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                            {Object.entries(shadows).map(([key, val]) => (
                                <div
                                    key={key}
                                    style={{
                                        padding: spacing[4],
                                        background: val === 'none' ? colors.bg.subtle : colors.bg.container,
                                        borderRadius: radius.md,
                                        boxShadow: val,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: val === 'none' ? `1px dashed ${colors.border.split}` : undefined,
                                    }}
                                >
                                    <div>
                                        <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500] }}>
                                            shadows.{key}
                                        </code>
                                        {SHADOW_USE[key] && (
                                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginTop: 2 }}>
                                                {SHADOW_USE[key]}
                                            </Text>
                                        )}
                                    </div>
                                    {val !== 'none' && (
                                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, maxWidth: 200, textAlign: 'right', wordBreak: 'break-all' }}>
                                            {val}
                                        </Text>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Transitions */}
                <Col xs={24} lg={10}>
                    {/* Duration */}
                    <SectionCard title="Transition Duration">
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[3] }}>
                            Token format: milliseconds. AntD ThemeConfig dùng giây — không truyền token trực tiếp vào ThemeConfig.
                        </Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                            {Object.entries(transitions.duration).map(([key, val]) => (
                                <div key={key} style={{ background: colors.bg.subtle, borderRadius: radius.sm, padding: `${spacing[2]} ${spacing[3]}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500] }}>
                                            duration.{key}
                                        </code>
                                        <Text style={{ fontSize: typography.fontSize.sm, fontWeight: 600 }}>{val}</Text>
                                    </div>
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginTop: spacing[1] }}>
                                        {DURATION_ANTD[key]}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Easing */}
                    <SectionCard title="Easing" style={{ marginTop: spacing[4] }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                            {Object.entries(transitions.easing).map(([key, val]) => (
                                <div key={key} style={{ background: colors.bg.subtle, borderRadius: radius.sm, padding: `${spacing[2]} ${spacing[3]}` }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500], display: 'block', marginBottom: spacing[1] }}>
                                        easing.{key}
                                    </code>
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, wordBreak: 'break-all' }}>
                                        {val}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Shorthand transitions demo */}
                <Col xs={24}>
                    <SectionCard title="Transition Shorthands — Demo tương tác">
                        <div style={{ marginBottom: spacing[4], display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                            <Text style={{ fontSize: typography.fontSize.sm }}>Bật hover effect</Text>
                            <Switch checked={animated} onChange={setAnimated} size="small" />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[4] }}>
                            {([
                                { key: 'all',       label: 'transitions.all',       desc: 'all 200ms standard' },
                                { key: 'allFast',   label: 'transitions.allFast',   desc: 'all 100ms standard' },
                                { key: 'allSlow',   label: 'transitions.allSlow',   desc: 'all 300ms standard' },
                                { key: 'transform', label: 'transitions.transform', desc: 'transform only' },
                                { key: 'opacity',   label: 'transitions.opacity',   desc: 'opacity only' },
                                { key: 'colors',    label: 'transitions.colors',    desc: 'color + bg + border' },
                            ] as const).map((item) => (
                                <div
                                    key={item.key}
                                    style={{
                                        padding: spacing[4],
                                        borderRadius: radius.md,
                                        border: `1px solid ${colors.border.base}`,
                                        background: colors.bg.container,
                                        minWidth: 160,
                                        cursor: animated ? 'pointer' : 'default',
                                        transition: animated ? (transitions[item.key] as string) : 'none',
                                        userSelect: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!animated) return;
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(-2px)';
                                        el.style.boxShadow = shadows.md;
                                        el.style.background = colors.primary[50];
                                        el.style.borderColor = colors.primary[400];
                                        el.style.color = colors.primary[600];
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!animated) return;
                                        const el = e.currentTarget;
                                        el.style.transform = '';
                                        el.style.boxShadow = '';
                                        el.style.background = colors.bg.container;
                                        el.style.borderColor = colors.border.base;
                                        el.style.color = '';
                                    }}
                                >
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500], display: 'block', marginBottom: spacing[1] }}>
                                        {item.label}
                                    </code>
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                                        {item.desc}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>
            </Row>
        </PageLayout>
    );
};

export default ShadowsDemo;

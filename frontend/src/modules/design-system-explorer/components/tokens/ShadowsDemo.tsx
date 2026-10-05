'use client';

import React, { useState } from 'react';
import { Typography, Row, Col, Space, Switch } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius, shadows, transitions } from '@/modules/design-system-explorer/tokens';
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
            <Title level={2} style={{ margin: `0 0 var(--spacing-24)` }}>Shadows & Transitions</Title>

            <Row gutter={[20, 20]}>
                {/* Shadows */}
                <Col xs={24} lg={14}>
                    <SectionCard title="Shadows">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            {Object.entries(shadows).map(([key, val]) => (
                                <div
                                    key={key}
                                    style={{
                                        padding: 'var(--spacing-16)',
                                        background: val === 'none' ? 'var(--bg-subtle)' : 'var(--surface)',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: val,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: val === 'none' ? `1px dashed var(--color-neutral-100)` : undefined,
                                    }}
                                >
                                    <div>
                                        <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)' }}>
                                            shadows.{key}
                                        </code>
                                        {SHADOW_USE[key] && (
                                            <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                                                {SHADOW_USE[key]}
                                            </Text>
                                        )}
                                    </div>
                                    {val !== 'none' && (
                                        <Text style={{ fontSize: '11px', color: 'var(--text-subtle)', maxWidth: 200, textAlign: 'right', wordBreak: 'break-all' }}>
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
                        <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-12)' }}>
                            Token format: milliseconds. AntD ThemeConfig dùng giây — không truyền token trực tiếp vào ThemeConfig.
                        </Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                            {Object.entries(transitions.duration).map(([key, val]) => (
                                <div key={key} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: `var(--spacing-8) var(--spacing-12)` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)' }}>
                                            duration.{key}
                                        </code>
                                        <Text style={{ fontSize: '12px', fontWeight: 600 }}>{val}</Text>
                                    </div>
                                    <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: 'var(--spacing-4)' }}>
                                        {DURATION_ANTD[key]}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Easing */}
                    <SectionCard title="Easing" style={{ marginTop: 'var(--spacing-16)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                            {Object.entries(transitions.easing).map(([key, val]) => (
                                <div key={key} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: `var(--spacing-8) var(--spacing-12)` }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', display: 'block', marginBottom: 'var(--spacing-4)' }}>
                                        easing.{key}
                                    </code>
                                    <Text style={{ fontSize: '11px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
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
                        <div style={{ marginBottom: 'var(--spacing-16)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
                            <Text style={{ fontSize: '12px' }}>Bật hover effect</Text>
                            <Switch checked={animated} onChange={setAnimated} size="small" />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)' }}>
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
                                        padding: 'var(--spacing-16)',
                                        borderRadius: 'var(--radius-md)',
                                        border: `1px solid var(--border)`,
                                        background: 'var(--surface)',
                                        minWidth: 160,
                                        cursor: animated ? 'pointer' : 'default',
                                        transition: animated ? (transitions[item.key] as string) : 'none',
                                        userSelect: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!animated) return;
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(-2px)';
                                        el.style.boxShadow = 'var(--elevation-2)';
                                        el.style.background = 'var(--primary-subtle)';
                                        el.style.borderColor = 'var(--color-primary-400)';
                                        el.style.color = 'var(--primary-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!animated) return;
                                        const el = e.currentTarget;
                                        el.style.transform = '';
                                        el.style.boxShadow = '';
                                        el.style.background = 'var(--surface)';
                                        el.style.borderColor = 'var(--border)';
                                        el.style.color = '';
                                    }}
                                >
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', display: 'block', marginBottom: 'var(--spacing-4)' }}>
                                        {item.label}
                                    </code>
                                    <Text style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
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

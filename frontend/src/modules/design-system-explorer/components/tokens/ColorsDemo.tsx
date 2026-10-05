'use client';

import React, { useState } from 'react';
import { Typography, Tooltip, message, Row, Col, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/modules/design-system-explorer/tokens';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text, Title } = Typography;

interface SwatchProps {
    name: string;
    value: string;
    textColor?: string;
}

const Swatch: React.FC<SwatchProps> = ({ name, value, textColor = '#fff' }) => {
    const [messageApi, ctx] = message.useMessage();

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        messageApi.success(`Đã copy: ${value}`);
    };

    return (
        <>
            {ctx}
            <Tooltip title={`${name} — Click để copy`} mouseEnterDelay={0.5}>
                <div
                    onClick={handleCopy}
                    style={{
                        background: value,
                        borderRadius: 'var(--radius-md)',
                        padding: `var(--spacing-12) var(--spacing-12)`,
                        cursor: 'pointer',
                        minHeight: 56,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        border: value === '#ffffff' || value === '#fafafa' ? `1px solid var(--border)` : 'none',
                        transition: 'transform 100ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <Text style={{ fontSize: 10, color: textColor, fontFamily: typography.fontFamily.mono, lineHeight: 1.3, display: 'block' }}>
                        {name}
                    </Text>
                    <Text style={{ fontSize: 10, color: textColor + 'bb', fontFamily: typography.fontFamily.mono }}>
                        {value}
                    </Text>
                </div>
            </Tooltip>
        </>
    );
};

const ColorsDemo: React.FC = () => {
    useHeaderActions({ title: 'Màu sắc — Design Tokens' }, []);

    return (
        <PageLayout>
            <Title level={2} style={{ margin: `0 0 var(--spacing-8)` }}>Màu sắc</Title>
            <Text style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-24)' }}>
                Click vào màu để copy hex value. Import từ <code style={{ fontFamily: typography.fontFamily.mono }}>@/design-system</code>.
            </Text>

            {/* Subsystem colors */}
            <SectionCard title="Màu Subsystem" style={{ marginBottom: 'var(--spacing-20)' }}>
                <Row gutter={[8, 8]} style={{ paddingTop: 'var(--spacing-12)' }}>
                    {Object.entries(colors.subsystem).map(([key, val]) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={key}>
                            <Swatch name={`colors.subsystem.${key}`} value={val} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Primary */}
            <SectionCard title="Primary (Brand)" style={{ marginBottom: 'var(--spacing-20)' }}>
                <Row gutter={[8, 8]} style={{ paddingTop: 'var(--spacing-12)' }}>
                    {Object.entries(colors.primary).map(([key, val]) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={key}>
                            <Swatch name={`colors.primary[${key}]`} value={val} textColor={Number(key) >= 500 ? '#fff' : colors.neutral[800]} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Semantic */}
            <SectionCard title="Semantic Colors" style={{ marginBottom: 'var(--spacing-20)' }}>
                <Row gutter={[8, 8]} style={{ paddingTop: 'var(--spacing-12)' }}>
                    {[
                        { name: 'colors.success.light', value: 'var(--success-subtle)', text: colors.neutral[800] },
                        { name: 'colors.success.base',  value: 'var(--success)' },
                        { name: 'colors.success.dark',  value: 'var(--success-ink)' },
                        { name: 'colors.warning.light', value: 'var(--warning-subtle)', text: colors.neutral[800] },
                        { name: 'colors.warning.base',  value: 'var(--warning)' },
                        { name: 'colors.warning.dark',  value: 'var(--warning-ink)' },
                        { name: 'colors.error.light',   value: 'var(--error-subtle)', text: colors.neutral[800] },
                        { name: 'colors.error.base',    value: 'var(--error)' },
                        { name: 'colors.error.dark',    value: 'var(--error-ink)' },
                        { name: 'colors.info.light',    value: 'var(--info-subtle)', text: colors.neutral[800] },
                        { name: 'colors.info.base',     value: 'var(--info)' },
                        { name: 'colors.info.dark',     value: 'var(--info-ink)' },
                    ].map((s) => (
                        <Col xs={12} sm={8} md={6} key={s.name}>
                            <Swatch name={s.name} value={s.value} textColor={s.text} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Neutral */}
            <SectionCard title="Neutral Scale" style={{ marginBottom: 'var(--spacing-20)' }}>
                <Row gutter={[8, 8]} style={{ paddingTop: 'var(--spacing-12)' }}>
                    {Object.entries(colors.neutral).map(([key, val]) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={key}>
                            <Swatch name={`colors.neutral[${key}]`} value={val} textColor={Number(key) >= 600 ? '#fff' : colors.neutral[800]} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Background + Text + Border */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <SectionCard title="Background">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', paddingTop: 'var(--spacing-12)' }}>
                            {Object.entries(colors.bg).map(([key, val]) => (
                                typeof val === 'string' && (
                                    <Swatch key={key} name={`colors.bg.${key}`} value={val} textColor={'var(--color-neutral-700)'} />
                                )
                            ))}
                        </div>
                    </SectionCard>
                </Col>
                <Col xs={24} md={8}>
                    <SectionCard title="Text">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', paddingTop: 'var(--spacing-12)' }}>
                            {Object.entries(colors.text).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `var(--spacing-8) var(--spacing-12)`, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: val }}>colors.text.{key}</code>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-subtle)' }}>{val}</code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>
                <Col xs={24} md={8}>
                    <SectionCard title="Border">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', paddingTop: 'var(--spacing-12)' }}>
                            {Object.entries(colors.border).map(([key, val]) => (
                                <div key={key} style={{ border: `2px solid ${val}`, padding: `var(--spacing-8) var(--spacing-12)`, borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)' }}>colors.border.{key} = {val}</code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>
            </Row>
        </PageLayout>
    );
};

export default ColorsDemo;

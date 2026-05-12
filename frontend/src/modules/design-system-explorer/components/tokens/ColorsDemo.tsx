'use client';

import React, { useState } from 'react';
import { Typography, Tooltip, message, Row, Col, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
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
                        borderRadius: radius.md,
                        padding: `${spacing[3]} ${spacing[3]}`,
                        cursor: 'pointer',
                        minHeight: 56,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        border: value === '#ffffff' || value === '#fafafa' ? `1px solid ${colors.border.base}` : 'none',
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
            <Title level={2} style={{ margin: `0 0 ${spacing[2]}` }}>Màu sắc</Title>
            <Text style={{ color: colors.text.secondary, display: 'block', marginBottom: spacing[6] }}>
                Click vào màu để copy hex value. Import từ <code style={{ fontFamily: typography.fontFamily.mono }}>@/design-system</code>.
            </Text>

            {/* Subsystem colors */}
            <SectionCard title="Màu Subsystem" style={{ marginBottom: spacing[5] }}>
                <Row gutter={[8, 8]} style={{ paddingTop: spacing[3] }}>
                    {Object.entries(colors.subsystem).map(([key, val]) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={key}>
                            <Swatch name={`colors.subsystem.${key}`} value={val} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Primary */}
            <SectionCard title="Primary (Brand)" style={{ marginBottom: spacing[5] }}>
                <Row gutter={[8, 8]} style={{ paddingTop: spacing[3] }}>
                    {Object.entries(colors.primary).map(([key, val]) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={key}>
                            <Swatch name={`colors.primary[${key}]`} value={val} textColor={Number(key) >= 500 ? '#fff' : colors.neutral[800]} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Semantic */}
            <SectionCard title="Semantic Colors" style={{ marginBottom: spacing[5] }}>
                <Row gutter={[8, 8]} style={{ paddingTop: spacing[3] }}>
                    {[
                        { name: 'colors.success.light', value: colors.success.light, text: colors.neutral[800] },
                        { name: 'colors.success.base',  value: colors.success.base },
                        { name: 'colors.success.dark',  value: colors.success.dark },
                        { name: 'colors.warning.light', value: colors.warning.light, text: colors.neutral[800] },
                        { name: 'colors.warning.base',  value: colors.warning.base },
                        { name: 'colors.warning.dark',  value: colors.warning.dark },
                        { name: 'colors.error.light',   value: colors.error.light, text: colors.neutral[800] },
                        { name: 'colors.error.base',    value: colors.error.base },
                        { name: 'colors.error.dark',    value: colors.error.dark },
                        { name: 'colors.info.light',    value: colors.info.light, text: colors.neutral[800] },
                        { name: 'colors.info.base',     value: colors.info.base },
                        { name: 'colors.info.dark',     value: colors.info.dark },
                    ].map((s) => (
                        <Col xs={12} sm={8} md={6} key={s.name}>
                            <Swatch name={s.name} value={s.value} textColor={s.text} />
                        </Col>
                    ))}
                </Row>
            </SectionCard>

            {/* Neutral */}
            <SectionCard title="Neutral Scale" style={{ marginBottom: spacing[5] }}>
                <Row gutter={[8, 8]} style={{ paddingTop: spacing[3] }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], paddingTop: spacing[3] }}>
                            {Object.entries(colors.bg).map(([key, val]) => (
                                typeof val === 'string' && (
                                    <Swatch key={key} name={`colors.bg.${key}`} value={val} textColor={colors.neutral[700]} />
                                )
                            ))}
                        </div>
                    </SectionCard>
                </Col>
                <Col xs={24} md={8}>
                    <SectionCard title="Text">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], paddingTop: spacing[3] }}>
                            {Object.entries(colors.text).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing[2]} ${spacing[3]}`, background: colors.bg.subtle, borderRadius: radius.sm }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: val }}>colors.text.{key}</code>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.text.tertiary }}>{val}</code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>
                <Col xs={24} md={8}>
                    <SectionCard title="Border">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], paddingTop: spacing[3] }}>
                            {Object.entries(colors.border).map(([key, val]) => (
                                <div key={key} style={{ border: `2px solid ${val}`, padding: `${spacing[2]} ${spacing[3]}`, borderRadius: radius.sm, background: colors.bg.container }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.text.secondary }}>colors.border.{key} = {val}</code>
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

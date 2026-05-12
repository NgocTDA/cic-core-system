'use client';

import React, { useState } from 'react';
import { Typography, Tag, Row, Col, Collapse } from 'antd';
import { CodeOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';

const { Title, Text, Paragraph } = Typography;

export type GroupKey =
    | 'layout'
    | 'data-display'
    | 'form'
    | 'button'
    | 'feedback'
    | 'dashboard'
    | 'tokens';

export const GROUP_CONFIG: Record<GroupKey, { label: string; color: string }> = {
    'layout':       { label: 'Layout & Structure',    color: colors.info.base },
    'data-display': { label: 'Hiển thị dữ liệu',      color: colors.success.base },
    'form':         { label: 'Form & Nhập liệu',       color: colors.subsystem.kkn },
    'button':       { label: 'Button',                 color: colors.subsystem.ops },
    'feedback':     { label: 'Feedback & Overlay',     color: colors.warning.dark },
    'dashboard':    { label: 'Dashboard Components',   color: colors.subsystem.analytics },
    'tokens':       { label: 'Design Tokens',          color: colors.subsystem.governance },
};

interface ComponentShowcaseProps {
    name: string;
    group: GroupKey;
    description: string;
    behaviors: string[];
    code: string;
    controls?: React.ReactNode;
    children: React.ReactNode;
    wide?: boolean;
    demoBackground?: string;
    demoMinHeight?: number;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
    name,
    group,
    description,
    behaviors,
    code,
    controls,
    children,
    wide = false,
    demoBackground,
    demoMinHeight = 120,
}) => {
    const [copied, setCopied] = useState(false);
    const gc = GROUP_CONFIG[group];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: do nothing
        }
    };

    const leftSpan  = wide ? 24 : 7;
    const rightSpan = wide ? 24 : 17;

    return (
        <PageLayout>
            {/* ─── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: spacing[5] }}>
                <Tag
                    style={{
                        background: gc.color + '18',
                        color: gc.color,
                        border: `1px solid ${gc.color}50`,
                        borderRadius: radius.full,
                        marginBottom: spacing[3],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                    }}
                >
                    {gc.label}
                </Tag>
                <Title level={2} style={{ margin: 0, color: colors.text.primary, lineHeight: 1.2 }}>
                    {name}
                </Title>
                <Paragraph
                    style={{
                        color: colors.text.secondary,
                        fontSize: typography.fontSize.base,
                        margin: `${spacing[2]} 0 0`,
                    }}
                >
                    {description}
                </Paragraph>
            </div>

            {/* ─── Main content ────────────────────────────────────── */}
            <Row gutter={[20, 20]}>
                {/* Left: behaviors + controls */}
                <Col xs={24} lg={leftSpan}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                        <SectionCard title="Behaviors">
                            <ul
                                style={{
                                    margin: 0,
                                    paddingLeft: spacing[5],
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: spacing[2],
                                    paddingTop: spacing[2],
                                }}
                            >
                                {behaviors.map((b, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            color: colors.text.secondary,
                                            fontSize: typography.fontSize.sm,
                                            lineHeight: typography.lineHeight.relaxed,
                                        }}
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>

                        {controls && (
                            <SectionCard title="Props / Controls">
                                <div style={{ paddingTop: spacing[2] }}>{controls}</div>
                            </SectionCard>
                        )}
                    </div>
                </Col>

                {/* Right: live demo */}
                <Col xs={24} lg={rightSpan}>
                    <SectionCard
                        title="Demo trực tiếp"
                        extra={
                            <Tag
                                style={{
                                    background: colors.success.light,
                                    color: colors.success.dark,
                                    border: `1px solid ${colors.success.base}40`,
                                    fontSize: typography.fontSize.xs,
                                    cursor: 'default',
                                }}
                            >
                                Interactive
                            </Tag>
                        }
                        style={{ height: '100%' }}
                    >
                        <div
                            style={{
                                background: demoBackground ?? colors.bg.subtle,
                                borderRadius: radius.md,
                                padding: spacing[6],
                                border: `1px dashed ${colors.border.base}`,
                                minHeight: demoMinHeight,
                                marginTop: spacing[3],
                            }}
                        >
                            {children}
                        </div>
                    </SectionCard>
                </Col>
            </Row>

            {/* ─── Code snippet ────────────────────────────────────── */}
            <Collapse
                style={{ marginTop: spacing[5] }}
                items={[
                    {
                        key: 'code',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                                <CodeOutlined style={{ color: colors.text.secondary }} />
                                <Text style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                                    Code snippet
                                </Text>
                            </div>
                        ),
                        children: (
                            <div style={{ position: 'relative' }}>
                                <pre
                                    style={{
                                        background: '#1e2030',
                                        color: '#cdd6f4',
                                        padding: spacing[5],
                                        borderRadius: radius.md,
                                        fontSize: typography.fontSize.sm,
                                        fontFamily: typography.fontFamily.mono,
                                        overflowX: 'auto',
                                        margin: 0,
                                        lineHeight: 1.7,
                                        border: `1px solid ${colors.neutral[800]}`,
                                    }}
                                >
                                    <code>{code}</code>
                                </pre>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        position: 'absolute',
                                        top: spacing[3],
                                        right: spacing[3],
                                        background: colors.neutral[700],
                                        border: 'none',
                                        borderRadius: radius.sm,
                                        padding: `${spacing[1]} ${spacing[3]}`,
                                        cursor: 'pointer',
                                        color: copied ? colors.success.base : colors.neutral[300],
                                        fontSize: typography.fontSize.xs,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing[1],
                                        transition: 'all 150ms ease',
                                    }}
                                >
                                    {copied ? <CheckOutlined /> : <CopyOutlined />}
                                    <span>{copied ? 'Đã copy' : 'Copy'}</span>
                                </button>
                            </div>
                        ),
                    },
                ]}
            />
        </PageLayout>
    );
};

export default ComponentShowcase;

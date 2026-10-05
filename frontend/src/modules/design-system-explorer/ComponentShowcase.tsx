'use client';

import React, { useState } from 'react';
import { Typography, Tag, Row, Col, Collapse } from 'antd';
import { CodeOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/modules/design-system-explorer/tokens';

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
    'layout':       { label: 'Layout & Structure',    color: 'var(--info)' },
    'data-display': { label: 'Hiển thị dữ liệu',      color: 'var(--success)' },
    'form':         { label: 'Form & Nhập liệu',       color: 'var(--chart-5-amber)' },
    'button':       { label: 'Button',                 color: 'var(--chart-4-indigo)' },
    'feedback':     { label: 'Feedback & Overlay',     color: 'var(--warning-ink)' },
    'dashboard':    { label: 'Dashboard Components',   color: 'var(--chart-8-rose)' },
    'tokens':       { label: 'Design Tokens',          color: 'var(--color-info-500)' },
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
            <div style={{ marginBottom: 'var(--spacing-20)' }}>
                <Tag
                    style={{
                        background: gc.color + '18',
                        color: gc.color,
                        border: `1px solid ${gc.color}50`,
                        borderRadius: radius.full,
                        marginBottom: 'var(--spacing-12)',
                        fontSize: '11px',
                        fontWeight: typography.fontWeight.medium,
                    }}
                >
                    {gc.label}
                </Tag>
                <Title level={2} style={{ margin: 0, color: 'var(--text)', lineHeight: 1.2 }}>
                    {name}
                </Title>
                <Paragraph
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        margin: `var(--spacing-8) 0 0`,
                    }}
                >
                    {description}
                </Paragraph>
            </div>

            {/* ─── Main content ────────────────────────────────────── */}
            <Row gutter={[20, 20]}>
                {/* Left: behaviors + controls */}
                <Col xs={24} lg={leftSpan}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                        <SectionCard title="Behaviors">
                            <ul
                                style={{
                                    margin: 0,
                                    paddingLeft: 'var(--spacing-20)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--spacing-8)',
                                    paddingTop: 'var(--spacing-8)',
                                }}
                            >
                                {behaviors.map((b, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '12px',
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
                                <div style={{ paddingTop: 'var(--spacing-8)' }}>{controls}</div>
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
                                    background: 'var(--success-subtle)',
                                    color: 'var(--success-ink)',
                                    border: `1px solid var(--success)40`,
                                    fontSize: '11px',
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
                                background: demoBackground ?? 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-24)',
                                border: `1px dashed var(--border)`,
                                minHeight: demoMinHeight,
                                marginTop: 'var(--spacing-12)',
                            }}
                        >
                            {children}
                        </div>
                    </SectionCard>
                </Col>
            </Row>

            {/* ─── Code snippet ────────────────────────────────────── */}
            <Collapse
                style={{ marginTop: 'var(--spacing-20)' }}
                items={[
                    {
                        key: 'code',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                                <CodeOutlined style={{ color: 'var(--text-muted)' }} />
                                <Text style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
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
                                        padding: 'var(--spacing-20)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '12px',
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
                                        top: 'var(--spacing-12)',
                                        right: 'var(--spacing-12)',
                                        background: 'var(--color-neutral-700)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: `var(--spacing-4) var(--spacing-12)`,
                                        cursor: 'pointer',
                                        color: copied ? 'var(--success)' : 'var(--color-neutral-300)',
                                        fontSize: '11px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-4)',
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

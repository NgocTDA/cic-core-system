'use client';

import React from 'react';
import { Typography, Row, Col } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing } from '@/modules/design-system-explorer/tokens';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Title, Text } = Typography;

const TypographyDemo: React.FC = () => {
    useHeaderActions({ title: 'Typography' }, []);

    return (
        <PageLayout>
            <Title level={2} style={{ margin: `0 0 var(--spacing-24)` }}>Typography</Title>

            <Row gutter={[20, 20]}>
                {/* Font Family */}
                <Col xs={24}>
                    <SectionCard title="Font Family">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)', paddingTop: 'var(--spacing-12)' }}>
                            <div>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                    typography.fontFamily.sans
                                </code>
                                <Text style={{ fontFamily: typography.fontFamily.sans, fontSize: '14px' }}>
                                    Inter — Văn bản thường: ABCDEFGHabcdefgh 0123456789 ÀÁÂÃàáâã
                                </Text>
                            </div>
                            <div>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                    typography.fontFamily.mono
                                </code>
                                <Text style={{ fontFamily: typography.fontFamily.mono, fontSize: '12px' }}>
                                    Mono — Code: {'{{variable}}'} · SELECT * FROM table WHERE id = 1; · JOB-2024-001
                                </Text>
                            </div>
                        </div>
                    </SectionCard>
                </Col>

                {/* Font Sizes */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Font Size">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                            {Object.entries(typography.fontSize).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-16)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', minWidth: 140, flexShrink: 0 }}>
                                        fontSize.{key} — {val}
                                    </code>
                                    <span style={{ fontSize: val, color: 'var(--text)', lineHeight: 1.2 }}>
                                        Văn bản mẫu
                                    </span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Font Weights */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Font Weight">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            {Object.entries(typography.fontWeight).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', minWidth: 140, flexShrink: 0 }}>
                                        fontWeight.{key} — {val}
                                    </code>
                                    <Text style={{ fontSize: '14px', fontWeight: val, color: 'var(--text)' }}>
                                        Văn bản mẫu
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Line Height */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Line Height">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            {Object.entries(typography.lineHeight).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', gap: 'var(--spacing-16)', alignItems: 'flex-start' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', minWidth: 140, flexShrink: 0, paddingTop: 2 }}>
                                        lineHeight.{key}<br />{val}
                                    </code>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            lineHeight: val,
                                            color: 'var(--text)',
                                            background: colors.subsystem.design + '10',
                                            borderLeft: `2px solid ${colors.subsystem.design}`,
                                            padding: `0 var(--spacing-12)`,
                                            maxWidth: 240,
                                        }}
                                    >
                                        Hàng thứ nhất của đoạn văn bản mẫu hiển thị line-height.
                                        Hàng thứ hai để so sánh khoảng cách dòng.
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Letter Spacing */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Letter Spacing">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)' }}>
                            {Object.entries(typography.letterSpacing).map(([key, val]) => (
                                <div key={key}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                        letterSpacing.{key} — {val}
                                    </code>
                                    <Text style={{ fontSize: '16px', letterSpacing: val, color: 'var(--text)' }}>
                                        VĂN BẢN MẪU — Sample Text 0123
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

export default TypographyDemo;

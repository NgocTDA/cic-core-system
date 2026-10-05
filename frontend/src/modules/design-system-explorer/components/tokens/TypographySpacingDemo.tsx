'use client';

import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius, shadows } from '@/modules/design-system-explorer/tokens';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Title, Text } = Typography;

const TypographySpacingDemo: React.FC = () => {
    useHeaderActions({ title: 'Typography & Spacing' }, []);

    return (
        <PageLayout>
            <Title level={2} style={{ margin: `0 0 var(--spacing-24)` }}>Typography & Spacing</Title>

            <Row gutter={[20, 20]}>
                {/* Font sizes */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Font Size">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                            {Object.entries(typography.fontSize).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-16)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', minWidth: 120 }}>
                                        typography.fontSize.{key}
                                    </code>
                                    <span style={{ fontSize: val, color: 'var(--text)', lineHeight: 1.2 }}>
                                        Aa — {val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Font weights */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Font Weight">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            {Object.entries(typography.fontWeight).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)' }}>
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', minWidth: 130 }}>
                                        fontWeight.{key}
                                    </code>
                                    <Text style={{ fontSize: '16px', fontWeight: val, color: 'var(--text)' }}>
                                        Văn bản mẫu ({val})
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Font Family" style={{ marginTop: 'var(--spacing-16)' }}>
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            <div>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                    typography.fontFamily.sans
                                </code>
                                <Text style={{ fontFamily: typography.fontFamily.sans, fontSize: '14px' }}>
                                    Inter — Văn bản thường: ABCDEFabcdef 0123456789
                                </Text>
                            </div>
                            <div>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                    typography.fontFamily.mono
                                </code>
                                <Text style={{ fontFamily: typography.fontFamily.mono, fontSize: '12px' }}>
                                    Mono — Code: {'{{variable}}'} SELECT * FROM table WHERE id = 1;
                                </Text>
                            </div>
                        </div>
                    </SectionCard>
                </Col>

                {/* Spacing */}
                <Col xs={24}>
                    <SectionCard title="Spacing (8pt grid)">
                        <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-16)' }}>
                            Đơn vị cơ sở: 4px. spacing[1] = 4px, spacing[2] = 8px, spacing[4] = 16px...
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'flex-end' }}>
                            {Object.entries(spacing).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                                    <div
                                        style={{
                                            width: 8,
                                            height: val,
                                            background: colors.subsystem.design + '60',
                                            borderRadius: 2,
                                            minHeight: 4,
                                            border: `1px solid ${colors.subsystem.design}`,
                                        }}
                                    />
                                    <code style={{ fontSize: 9, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                                        [{key}]<br />{val}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Shadows */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Shadows">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                            {Object.entries(shadows).filter(([, v]) => v !== 'none').map(([key, val]) => (
                                <div
                                    key={key}
                                    style={{
                                        padding: 'var(--spacing-16)',
                                        background: 'var(--surface)',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: val,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)' }}>
                                        shadows.{key}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Radius */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Border Radius">
                        <div style={{ paddingTop: 'var(--spacing-12)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)' }}>
                            {Object.entries(radius).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                                    <div
                                        style={{
                                            width: 56, height: 56,
                                            background: colors.subsystem.design + '20',
                                            border: `2px solid ${colors.subsystem.design}`,
                                            borderRadius: val,
                                        }}
                                    />
                                    <code style={{ fontSize: 10, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', textAlign: 'center' }}>
                                        radius.{key}<br />{val}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>
            </Row>
        </PageLayout>
    );
};

export default TypographySpacingDemo;

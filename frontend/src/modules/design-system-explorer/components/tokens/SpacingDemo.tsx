'use client';

import React from 'react';
import { Typography, Row, Col } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/modules/design-system-explorer/tokens';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Title, Text } = Typography;

const SpacingDemo: React.FC = () => {
    useHeaderActions({ title: 'Spacing & Radius' }, []);

    return (
        <PageLayout>
            <Title level={2} style={{ margin: `0 0 var(--spacing-24)` }}>Spacing & Border Radius</Title>

            <Row gutter={[20, 20]}>
                {/* Spacing scale */}
                <Col xs={24}>
                    <SectionCard title="Spacing (8pt grid)">
                        <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-16)' }}>
                            Đơn vị cơ sở: 4px. spacing[1] = 4px · spacing[2] = 8px · spacing[4] = 16px · spacing[6] = 24px
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

                {/* Spacing table */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Spacing — Bảng tra cứu">
                        <div style={{ paddingTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                            {Object.entries(spacing).map(([key, val]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-12)',
                                        padding: `var(--spacing-4) var(--spacing-8)`,
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-subtle)',
                                    }}
                                >
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', minWidth: 80 }}>
                                        spacing[{key}]
                                    </code>
                                    <Text style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: 36 }}>
                                        {val}px
                                    </Text>
                                    <div
                                        style={{
                                            height: 8,
                                            width: val,
                                            background: colors.subsystem.design,
                                            borderRadius: 2,
                                            minWidth: 4,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </Col>

                {/* Border radius */}
                <Col xs={24} lg={12}>
                    <SectionCard title="Border Radius">
                        <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-16)' }}>
                            &apos;var(--radius-md)&apos; = 6px là default (align AntD). Modal/Drawer dùng &apos;var(--radius-lg)&apos; = 8px.
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)' }}>
                            {Object.entries(radius).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                                    <div
                                        style={{
                                            width: key === 'full' ? 56 : 56,
                                            height: key === 'full' ? 56 : 56,
                                            background: colors.subsystem.design + '20',
                                            border: `2px solid ${colors.subsystem.design}`,
                                            borderRadius: val,
                                        }}
                                    />
                                    <code style={{ fontSize: 10, fontFamily: typography.fontFamily.mono, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                                        radius.{key}<br />{val}
                                    </code>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'var(--spacing-20)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                            {Object.entries(radius).map(([key, val]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-12)',
                                        padding: `var(--spacing-4) var(--spacing-8)`,
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-subtle)',
                                    }}
                                >
                                    <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', minWidth: 100 }}>
                                        radius.{key}
                                    </code>
                                    <Text style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {val}
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

export default SpacingDemo;

'use client';

import React, { useState } from 'react';
import { Typography, Switch, Tag } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/modules/design-system-explorer/tokens';
import ComponentShowcase from '../../ComponentShowcase';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const PageLayoutDemo: React.FC = () => {
    const [noPadding, setNoPadding] = useState(false);

    useHeaderActions({ title: 'PageLayout' }, []);

    return (
        <ComponentShowcase
            name="PageLayout"
            group="layout"
            description="Container wrapper bắt buộc cho mọi page. Cung cấp padding chuẩn (16px 24px 24px trên desktop, 8px trên mobile), flex column layout và overflow hidden. Mọi page đều bắt đầu bằng <PageLayout>."
            behaviors={[
                'Padding tự động: 16px 24px 24px trên desktop, 8px trên mobile (useIsMobile)',
                'noPadding: bỏ toàn bộ padding — dùng cho full-bleed content',
                'flex column + minHeight 0: giúp child element stretch và scroll đúng',
                'overflow hidden: ngăn content tràn ra ngoài viewport',
                'Mọi page đều PHẢI bọc trong <PageLayout> — không tự viết wrapper riêng',
            ]}
            code={`import { PageLayout } from '@/components/ui';

// Dạng cơ bản — dùng cho mọi page
<PageLayout>
  {/* content */}
</PageLayout>

// Không padding (full-bleed)
<PageLayout noPadding>
  {/* content */}
</PageLayout>`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
                    <Switch checked={noPadding} onChange={setNoPadding} size="small" />
                    <Text style={{ fontSize: '12px' }}>noPadding</Text>
                </div>

                {/* Mock preview */}
                <div style={{
                    border: `2px dashed var(--border)`,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--bg)',
                    position: 'relative',
                }}>
                    <div style={{
                        background: colors.neutral[800],
                        padding: `var(--spacing-8) var(--spacing-16)`,
                        fontSize: '11px',
                        color: '#fff',
                        fontFamily: typography.fontFamily.mono,
                    }}>
                        AppHeader
                    </div>
                    <div style={{ display: 'flex', minHeight: 200 }}>
                        <div style={{
                            width: 56,
                            background: 'var(--text)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontSize: 9, color: 'var(--text-subtle)', fontFamily: typography.fontFamily.mono, writingMode: 'vertical-rl' }}>Sidebar</Text>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: noPadding ? 0 : '16px 24px 24px',
                            background: 'var(--bg)',
                            transition: 'padding 200ms',
                            position: 'relative',
                        }}>
                            {!noPadding && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: 16,
                                    background: colors.subsystem.design + '20',
                                    borderBottom: `1px dashed ${colors.subsystem.design}`,
                                }} />
                            )}
                            {!noPadding && (
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, bottom: 0, left: 0,
                                        width: 24,
                                        background: colors.subsystem.design + '15',
                                        borderRight: `1px dashed ${colors.subsystem.design}`,
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, bottom: 0, right: 0,
                                        width: 24,
                                        background: colors.subsystem.design + '15',
                                        borderLeft: `1px dashed ${colors.subsystem.design}`,
                                    }} />
                                </>
                            )}
                            <div style={{
                                background: 'var(--surface)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-12)',
                                border: `1px solid var(--border)`,
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                fontFamily: typography.fontFamily.mono,
                            }}>
                                &lt;PageLayout{noPadding ? ' noPadding' : ''}&gt; — content area
                            </div>
                        </div>
                    </div>
                    {!noPadding && (
                        <div style={{
                            position: 'absolute',
                            top: 42,
                            right: 'var(--spacing-12)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-4)',
                        }}>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-top: 16px</Tag>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-x: 24px</Tag>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-bottom: 24px</Tag>
                        </div>
                    )}
                </div>

                <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-16)' }}>
                    <Text style={{ fontSize: '12px', fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: 'var(--spacing-8)' }}>
                        Props
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                        {[
                            { prop: 'children', type: 'ReactNode', desc: 'Nội dung page' },
                            { prop: 'noPadding?', type: 'boolean', desc: 'Bỏ padding (full-bleed), mặc định false' },
                        ].map(({ prop, type, desc }) => (
                            <div key={prop} style={{ display: 'flex', gap: 'var(--spacing-12)', alignItems: 'baseline' }}>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', minWidth: 100 }}>{prop}</code>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-subtle)', minWidth: 80 }}>{type}</code>
                                <Text style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default PageLayoutDemo;

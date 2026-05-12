'use client';

import React, { useState } from 'react';
import { Typography, Switch, Tag } from 'antd';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, typography, spacing, shadows, radius } from '@/design-system';
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                    <Switch checked={noPadding} onChange={setNoPadding} size="small" />
                    <Text style={{ fontSize: typography.fontSize.sm }}>noPadding</Text>
                </div>

                {/* Mock preview */}
                <div style={{
                    border: `2px dashed ${colors.border.base}`,
                    borderRadius: radius.lg,
                    overflow: 'hidden',
                    background: colors.bg.page,
                    position: 'relative',
                }}>
                    <div style={{
                        background: colors.neutral[800],
                        padding: `${spacing[2]} ${spacing[4]}`,
                        fontSize: typography.fontSize.xs,
                        color: '#fff',
                        fontFamily: typography.fontFamily.mono,
                    }}>
                        AppHeader
                    </div>
                    <div style={{ display: 'flex', minHeight: 200 }}>
                        <div style={{
                            width: 56,
                            background: colors.neutral[900],
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontSize: 9, color: colors.text.tertiary, fontFamily: typography.fontFamily.mono, writingMode: 'vertical-rl' }}>Sidebar</Text>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: noPadding ? 0 : '16px 24px 24px',
                            background: colors.bg.page,
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
                                background: colors.bg.container,
                                borderRadius: radius.md,
                                padding: spacing[3],
                                border: `1px solid ${colors.border.base}`,
                                fontSize: typography.fontSize.xs,
                                color: colors.text.secondary,
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
                            right: spacing[3],
                            display: 'flex',
                            flexDirection: 'column',
                            gap: spacing[1],
                        }}>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-top: 16px</Tag>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-x: 24px</Tag>
                            <Tag color="purple" style={{ fontSize: 10 }}>padding-bottom: 24px</Tag>
                        </div>
                    )}
                </div>

                <div style={{ background: colors.bg.subtle, borderRadius: radius.md, padding: spacing[4] }}>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: spacing[2] }}>
                        Props
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                        {[
                            { prop: 'children', type: 'ReactNode', desc: 'Nội dung page' },
                            { prop: 'noPadding?', type: 'boolean', desc: 'Bỏ padding (full-bleed), mặc định false' },
                        ].map(({ prop, type, desc }) => (
                            <div key={prop} style={{ display: 'flex', gap: spacing[3], alignItems: 'baseline' }}>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500], minWidth: 100 }}>{prop}</code>
                                <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.text.tertiary, minWidth: 80 }}>{type}</code>
                                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>{desc}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default PageLayoutDemo;

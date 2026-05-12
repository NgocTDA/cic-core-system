'use client';

import { DEMO_REGISTRY } from '@/modules/design-system-explorer/demoRegistry';
import { colors, spacing, typography } from '@/design-system';
import { PageLayout } from '@/components/ui';

interface Props {
    params: { group: string; component: string };
}

export default function DemoPage({ params }: Props) {
    const key  = `${params.group}/${params.component}`;
    const Demo = DEMO_REGISTRY[key];

    if (!Demo) {
        return (
            <PageLayout>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 320,
                    gap: spacing[3],
                }}>
                    <div style={{ fontSize: 48 }}>🔍</div>
                    <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                        Demo không tìm thấy
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, fontFamily: typography.fontFamily.mono }}>
                        {key}
                    </div>
                </div>
            </PageLayout>
        );
    }

    return <Demo />;
}

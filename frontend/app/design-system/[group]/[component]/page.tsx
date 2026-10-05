'use client';

import { DEMO_REGISTRY } from '@/modules/design-system-explorer/demoRegistry';
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
                    gap: 12,
                }}>
                    <div style={{ fontSize: 48 }}>🔍</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
                        Demo không tìm thấy
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                        {key}
                    </div>
                </div>
            </PageLayout>
        );
    }

    return <Demo />;
}

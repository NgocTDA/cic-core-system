'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const SrsOutline = dynamicImport(() => import('@/modules/tools/SrsOutline'), {
    ssr: false,
});

export default function SrsOutlinePage() {
    return <SrsOutline />;
}

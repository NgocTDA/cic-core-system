'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const ConfluenceToWord = dynamicImport(() => import('@/modules/tools/ConfluenceToWord'), {
    ssr: false,
});

export default function ConfluenceToWordPage() {
    return <ConfluenceToWord />;
}

'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const UIDocGenerator = dynamicImport(() => import('@/modules/tools/UIDocGenerator'), {
    ssr: false,
});

export default function UIDocGeneratorPage() {
    return <UIDocGenerator />;
}

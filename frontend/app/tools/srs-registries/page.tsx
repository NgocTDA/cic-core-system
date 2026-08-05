'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const SrsRegistries = dynamicImport(() => import('@/modules/tools/SrsRegistries'), {
    ssr: false,
});

export default function SrsRegistriesPage() {
    return <SrsRegistries />;
}

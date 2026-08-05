'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const SrsConfluenceImporter = dynamicImport(() => import('@/modules/tools/SrsConfluenceImporter'), {
    ssr: false,
});

export default function SrsConfluenceImporterPage() {
    return <SrsConfluenceImporter />;
}

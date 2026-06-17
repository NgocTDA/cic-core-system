'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const ConfluenceImporter = dynamicImport(() => import('@/modules/tools/ConfluenceImporter'), {
    ssr: false,
});

export default function ConfluenceImporterPage() {
    return <ConfluenceImporter />;
}

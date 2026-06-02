'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobDetailPage = dynamicImport(() => import('@/modules/ops-support/JobManagement/JobDetailPage'), {
  ssr: false,
});

export default function JobDetailPageEntry() {
    return <JobDetailPage />;
}

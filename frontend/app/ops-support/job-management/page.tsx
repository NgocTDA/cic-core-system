'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobManagement = dynamicImport(() => import('@/modules/ops-support/JobManagement'), {
  ssr: false,
});

export default function JobManagementPage() {
    return <JobManagement />;
}

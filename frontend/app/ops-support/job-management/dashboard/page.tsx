'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobDashboard = dynamicImport(() => import('@/modules/ops-support/JobManagement/JobDashboard'), {
  ssr: false,
});

export default function DashboardPage() {
  return <JobDashboard />;
}

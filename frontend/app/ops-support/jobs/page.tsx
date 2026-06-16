'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobSimple = dynamicImport(() => import('@/modules/ops-support/JobSimple'), {
  ssr: false,
});

export default function JobsPage() {
  return <JobSimple />;
}

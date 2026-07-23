'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobFormPage = dynamicImport(() => import('@/modules/ops-support/JobSimple/JobFormPage'), {
  ssr: false,
});

export default function EditJobPage() {
  return <JobFormPage mode="edit" />;
}

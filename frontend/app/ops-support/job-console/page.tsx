export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const JobConsole = dynamicImport(() => import('@/modules/ops-support/JobConsole'), {
  ssr: false,
});

export default function JobConsolePage() {
  return <JobConsole />;
}

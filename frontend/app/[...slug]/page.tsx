import { notFound } from 'next/navigation';
import { findMenuPathMatch } from '@/config/navigation';
import UnavailableFeature from '@/components/UnavailableFeature';

// Keep planned menu entries usable without making arbitrary URLs look valid.
// More specific implemented pages take precedence over this catch-all route.
export default function PlannedFeaturePage({ params }: { params: { slug: string[] } }) {
  const pathname = `/${params.slug.join('/')}`;
  const match = findMenuPathMatch(pathname);
  if (!match || match.matchedPath !== pathname) notFound();

  return <UnavailableFeature title={match.item.label} />;
}

import PlannedFeaturePage from '../../[...slug]/page';

// Resolve planned portal entries inside the existing portal layout.
export default function PlannedPortalFeaturePage({ params }: { params: { slug: string[] } }) {
  return <PlannedFeaturePage params={{ slug: ['web-portal', ...params.slug] }} />;
}

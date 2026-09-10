'use client';
import dynamic from 'next/dynamic';

const IndustryAnalysis = dynamic(
  () => import('@/modules/product-mgmt/IndustryAnalysis/index'),
  { ssr: false },
);

export default function IndustryAnalysisCreatedProductsRoute() {
  return <IndustryAnalysis />;
}

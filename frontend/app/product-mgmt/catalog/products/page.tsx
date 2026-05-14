'use client';
import dynamic from 'next/dynamic';

const ProductCatalog = dynamic(
  () => import('@/modules/product-mgmt/ProductCatalog/index'),
  { ssr: false },
);

export default function ProductCatalogRoute() {
  return <ProductCatalog />;
}

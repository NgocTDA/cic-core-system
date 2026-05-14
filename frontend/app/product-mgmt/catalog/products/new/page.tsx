'use client';
import dynamic from 'next/dynamic';

const ProductFormPage = dynamic(
  () => import('@/modules/product-mgmt/ProductCatalog/ProductFormPage'),
  { ssr: false },
);

export default function NewProductRoute() {
  return <ProductFormPage mode="create" />;
}

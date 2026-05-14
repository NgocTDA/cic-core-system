'use client';
import dynamic from 'next/dynamic';

const ProductFormPage = dynamic(
  () => import('@/modules/product-mgmt/ProductCatalog/ProductFormPage'),
  { ssr: false },
);

export default function EditProductRoute() {
  return <ProductFormPage mode="edit" />;
}

'use client';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { PageLayout, StatusSummaryBar } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import ProductFilter from './ProductFilter';
import ProductList from './ProductList';
import { useProductCatalog } from './useProductCatalog';

const ProductCatalogPage: React.FC = () => {
  const router = useRouter();
  const { data, loading, summaryItems, handleSearch, handleReset, handleDelete, handleToggleStatus } =
    useProductCatalog();

  useHeaderActions(
    {
      title: 'Danh mục sản phẩm',
      actions: [
        {
          key: 'add',
          label: 'Thêm sản phẩm',
          icon: <PlusOutlined />,
          type: 'primary',
          onClick: () => router.push('/product-mgmt/catalog/products/new'),
        },
      ],
    },
    [],
  );

  return (
    <PageLayout>
      <ProductFilter loading={loading} onSearch={handleSearch} onReset={handleReset} />

      <StatusSummaryBar items={summaryItems} />

      <ProductList
        data={data}
        loading={loading}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </PageLayout>
  );
};

const ProductCatalogPageWithApp: React.FC = () => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <ProductCatalogPage />
  </App>
);

export default ProductCatalogPageWithApp;

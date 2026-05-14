'use client';
import { useState, useMemo } from 'react';
import { App } from 'antd';
import type { IProduct, IProductFilter } from './productTypes';
import { MOCK_PRODUCTS } from './mockData';

// Shared mutable store (simulates server state within a session)
let _store: IProduct[] = [...MOCK_PRODUCTS];

export function useProductCatalog() {
  const { modal, message } = App.useApp();
  const [data, setData] = useState<IProduct[]>(_store);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<IProductFilter>({});

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        if (!p.code.toLowerCase().includes(kw) && !p.name.toLowerCase().includes(kw)) return false;
      }
      if (filter.productType && p.productType !== filter.productType) return false;
      if (filter.productGroup && p.productGroup !== filter.productGroup) return false;
      if (filter.subjectType && !p.subjectType.includes(filter.subjectType)) return false;
      if (filter.status && p.status !== filter.status) return false;
      return true;
    });
  }, [data, filter]);

  const handleSearch = (values: IProductFilter) => {
    setLoading(true);
    setFilter(values);
    setTimeout(() => setLoading(false), 300);
  };

  const handleReset = () => {
    setFilter({});
  };

  const handleDelete = (record: IProduct) => {
    modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc muốn xóa sản phẩm "${record.name}" (${record.code})?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        _store = _store.filter((p) => p.id !== record.id);
        setData([..._store]);
        message.success('Đã xóa sản phẩm');
      },
    });
  };

  const handleToggleStatus = (record: IProduct) => {
    const next = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const label = next === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa';
    modal.confirm({
      title: `Xác nhận ${label} sản phẩm`,
      content: `Bạn có chắc muốn ${label} sản phẩm "${record.name}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        _store = _store.map((p) => p.id === record.id ? { ...p, status: next } : p);
        setData([..._store]);
        message.success(`Đã ${label} sản phẩm`);
      },
    });
  };

  const saveProduct = (values: Partial<IProduct> & { id?: string }) => {
    if (values.id) {
      _store = _store.map((p) => p.id === values.id ? { ...p, ...values } as IProduct : p);
    } else {
      const newProduct: IProduct = {
        ...values,
        id: String(Date.now()),
      } as IProduct;
      _store = [newProduct, ..._store];
    }
    setData([..._store]);
  };

  const getById = (id: string): IProduct | undefined => {
    return _store.find((p) => p.id === id);
  };

  const summaryItems = useMemo(() => [
    { count: data.length,                              label: 'Tổng sản phẩm',      color: 'info'    as const },
    { count: data.filter(p => p.status === 'ACTIVE').length,   label: 'Đang hoạt động', color: 'success' as const },
    { count: data.filter(p => p.status === 'INACTIVE').length, label: 'Vô hiệu hóa',    color: 'warning' as const },
  ], [data]);

  return {
    data: filtered,
    loading,
    filter,
    summaryItems,
    handleSearch,
    handleReset,
    handleDelete,
    handleToggleStatus,
    saveProduct,
    getById,
  };
}

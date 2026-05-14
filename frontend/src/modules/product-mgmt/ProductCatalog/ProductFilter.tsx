'use client';
import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import { FilterBar, FilterCol } from '@/components/ui';
import {
  PRODUCT_TYPE_OPTIONS,
  PRODUCT_GROUP_OPTIONS,
  SUBJECT_TYPE_OPTIONS,
} from './productTypes';
import type { IProductFilter } from './productTypes';

const { RangePicker } = DatePicker;

interface ProductFilterProps {
  loading?: boolean;
  onSearch: (values: IProductFilter) => void;
  onReset: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ loading, onSearch, onReset }) => {
  const [keyword, setKeyword] = React.useState('');
  const [productType, setProductType] = React.useState<string | undefined>();
  const [productGroup, setProductGroup] = React.useState<string | undefined>();
  const [subjectType, setSubjectType] = React.useState<string | undefined>();
  const [status, setStatus] = React.useState<string | undefined>();

  const handleSearch = () => {
    onSearch({ keyword, productType, productGroup, subjectType, status });
  };

  const handleReset = () => {
    setKeyword('');
    setProductType(undefined);
    setProductGroup(undefined);
    setSubjectType(undefined);
    setStatus(undefined);
    onReset();
  };

  return (
    <FilterBar onSearch={handleSearch} onReset={handleReset} loading={loading}>
      <FilterCol>
        <Input
          placeholder="Mã hoặc tên sản phẩm"
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </FilterCol>
      <FilterCol>
        <Select
          placeholder="Loại sản phẩm"
          style={{ width: '100%' }}
          allowClear
          value={productType}
          onChange={setProductType}
          options={PRODUCT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </FilterCol>
      <FilterCol>
        <Select
          placeholder="Nhóm sản phẩm"
          style={{ width: '100%' }}
          allowClear
          value={productGroup}
          onChange={setProductGroup}
          options={PRODUCT_GROUP_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </FilterCol>
      <FilterCol>
        <Select
          placeholder="Đối tượng"
          style={{ width: '100%' }}
          allowClear
          value={subjectType}
          onChange={setSubjectType}
          options={SUBJECT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </FilterCol>
      <FilterCol>
        <Select
          placeholder="Trạng thái"
          style={{ width: '100%' }}
          allowClear
          value={status}
          onChange={setStatus}
          options={[
            { value: 'ACTIVE',   label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Vô hiệu hóa' },
          ]}
        />
      </FilterCol>
      <FilterCol minWidth={240}>
        <RangePicker style={{ width: '100%' }} placeholder={['Hiệu lực từ', 'Hiệu lực đến']} />
      </FilterCol>
    </FilterBar>
  );
};

export default ProductFilter;

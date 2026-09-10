'use client';

import React, { useState } from 'react';
import { Select, DatePicker, Popover, Checkbox, Button, Tooltip, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { FilterBar, FilterCol } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import {
  PRODUCT_CATALOG_OPTIONS,
  FISCAL_YEAR_OPTIONS,
  INDUSTRY_OPTIONS,
  CREATOR_OPTIONS,
  STATUS_OPTIONS,
  type IIndustryProductFilter,
  type IndustryProductStatus,
} from './types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const FILTER_CONFIG_OPTIONS = [
  { key: 'product', label: 'Sản phẩm' },
  { key: 'fiscalYear', label: 'Năm tài chính' },
  { key: 'industry', label: 'Ngành nghề' },
  { key: 'creator', label: 'Người tạo' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'approvalDate', label: 'Ngày duyệt' },
];

interface IndustryAnalysisFilterProps {
  loading?: boolean;
  onSearch: (filters: IIndustryProductFilter) => void;
  onReset: () => void;
}

const IndustryAnalysisFilter: React.FC<IndustryAnalysisFilterProps> = ({
  loading,
  onSearch,
  onReset,
}) => {
  const [productCode, setProductCode] = useState<string | undefined>();
  const [fiscalYear, setFiscalYear] = useState<number | undefined>();
  const [industryCode, setIndustryCode] = useState<string | undefined>();
  const [createdBy, setCreatedBy] = useState<string | undefined>();
  const [status, setStatus] = useState<IndustryProductStatus | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const [visibleFilters, setVisibleFilters] = useState<string[]>([
    'product',
    'fiscalYear',
    'industry',
    'creator',
    'status',
    'approvalDate',
  ]);

  const toggleFilter = (key: string, checked: boolean) => {
    if (checked) {
      setVisibleFilters((prev) => [...prev, key]);
    } else {
      setVisibleFilters((prev) => prev.filter((k) => k !== key));
      if (key === 'product') setProductCode(undefined);
      if (key === 'fiscalYear') setFiscalYear(undefined);
      if (key === 'industry') setIndustryCode(undefined);
      if (key === 'creator') setCreatedBy(undefined);
      if (key === 'status') setStatus(undefined);
      if (key === 'approvalDate') setDateRange(null);
    }
  };

  const handleSearch = () => {
    const approvalDateRange: [string, string] | undefined =
      dateRange && dateRange[0] && dateRange[1]
        ? [dateRange[0].format('DD/MM/YYYY'), dateRange[1].format('DD/MM/YYYY')]
        : undefined;

    onSearch({
      productCode,
      fiscalYear,
      industryCode,
      createdBy,
      status,
      approvalDateRange,
    });
  };

  const handleReset = () => {
    setProductCode(undefined);
    setFiscalYear(undefined);
    setIndustryCode(undefined);
    setCreatedBy(undefined);
    setStatus(undefined);
    setDateRange(null);
    onReset();
  };

  const popoverContent = (
    <div style={{ width: 190, padding: `${spacing[1]} 0` }}>
      <Text
        strong
        style={{
          fontSize: typography.fontSize.sm,
          display: 'block',
          marginBottom: spacing[2],
          borderBottom: `1px solid ${colors.border.split}`,
          paddingBottom: spacing[1],
        }}
      >
        Hiển thị các bộ lọc
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {FILTER_CONFIG_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.key}
            checked={visibleFilters.includes(opt.key)}
            onChange={(e) => toggleFilter(opt.key, e.target.checked)}
          >
            {opt.label}
          </Checkbox>
        ))}
      </div>
    </div>
  );

  return (
    <FilterBar
      inCard
      onSearch={handleSearch}
      onReset={handleReset}
      loading={loading}
      showAddFilter={false}
      extra={
        <Popover content={popoverContent} trigger="click" placement="bottomRight">
          <Tooltip title="Thêm hoặc bớt các ô tìm kiếm trên thanh bộ lọc">
            <Button
              icon={<FilterOutlined />}
              style={{ background: '#ffffff', borderColor: '#9fb3a9', color: '#18312a' }}
            >
              Thêm bộ lọc
            </Button>
          </Tooltip>
        </Popover>
      }
    >
      {/* 1. Combobox Sản phẩm (Mã - Tên) */}
      {visibleFilters.includes('product') && (
        <FilterCol minWidth={200}>
          <Select
            placeholder="Sản phẩm (Mã - Tên)"
            showSearch
            optionFilterProp="label"
            allowClear
            value={productCode}
            onChange={setProductCode}
            options={PRODUCT_CATALOG_OPTIONS.map((p) => ({
              value: p.value,
              label: p.label,
            }))}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}

      {/* 2. Combobox Năm tài chính */}
      {visibleFilters.includes('fiscalYear') && (
        <FilterCol minWidth={130}>
          <Select
            placeholder="Năm tài chính"
            allowClear
            value={fiscalYear}
            onChange={setFiscalYear}
            options={FISCAL_YEAR_OPTIONS}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}

      {/* 3. Combobox Ngành nghề (mã - tên) */}
      {visibleFilters.includes('industry') && (
        <FilterCol minWidth={200}>
          <Select
            placeholder="Ngành nghề (Mã - Tên)"
            showSearch
            optionFilterProp="label"
            allowClear
            value={industryCode}
            onChange={setIndustryCode}
            options={INDUSTRY_OPTIONS.map((ind) => ({
              value: ind.value,
              label: ind.label,
            }))}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}

      {/* 4. Combobox Người tạo (username - Họ và tên) */}
      {visibleFilters.includes('creator') && (
        <FilterCol minWidth={180}>
          <Select
            placeholder="Người tạo"
            showSearch
            optionFilterProp="label"
            allowClear
            value={createdBy}
            onChange={setCreatedBy}
            options={CREATOR_OPTIONS.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}

      {/* 5. Combobox Trạng thái */}
      {visibleFilters.includes('status') && (
        <FilterCol minWidth={140}>
          <Select
            placeholder="Trạng thái"
            allowClear
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}

      {/* 6. Ngày duyệt (từ ngày - đến ngày) */}
      {visibleFilters.includes('approvalDate') && (
        <FilterCol minWidth={220}>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
            placeholder={['Ngày duyệt từ', 'Đến ngày']}
            style={{ width: '100%' }}
          />
        </FilterCol>
      )}
    </FilterBar>
  );
};

export default IndustryAnalysisFilter;

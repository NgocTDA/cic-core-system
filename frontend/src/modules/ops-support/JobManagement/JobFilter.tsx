'use client';

import React, { useState } from 'react';
import { Select, Input, Popover, Checkbox, Button, Tooltip, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { FilterBar, FilterCol } from '@/components/ui';
import { useJobManagement } from './useJobManagement';

const { Text } = Typography;

const FILTER_OPTIONS = [
  { key: 'code', label: 'Mã Job' },
  { key: 'name', label: 'Tên Job' },
  { key: 'serviceCode', label: 'Mã dịch vụ' },
  { key: 'category', label: 'Loại Job' },
  { key: 'status', label: 'Trạng thái' },
];

const JobFilter: React.FC = () => {
  const {
    filterCode,
    filterName,
    filterServiceCode,
    filterStatus,
    filterCategory,
    setFilterCode,
    setFilterName,
    setFilterServiceCode,
    setFilterStatus,
    setFilterCategory,
    setSearchQuery,
  } = useJobManagement();

  const [visibleFilters, setVisibleFilters] = useState<string[]>([
    'code',
    'name',
    'serviceCode',
    'category',
    'status',
  ]);

  const toggleFilter = (key: string, checked: boolean) => {
    if (checked) {
      setVisibleFilters((prev) => [...prev, key]);
    } else {
      setVisibleFilters((prev) => prev.filter((k) => k !== key));
      // Reset filter value when hidden
      if (key === 'code') setFilterCode('');
      if (key === 'name') setFilterName('');
      if (key === 'serviceCode') setFilterServiceCode('');
      if (key === 'category') setFilterCategory('');
      if (key === 'status') setFilterStatus('');
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterCode('');
    setFilterName('');
    setFilterServiceCode('');
    setFilterStatus('');
    setFilterCategory('');
  };

  const popoverContent = (
    <div style={{ width: 190, padding: '4px 0' }}>
      <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
        Hiển thị các bộ lọc
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FILTER_OPTIONS.map((opt) => (
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
      onSearch={() => {}}
      onReset={handleReset}
      showAddFilter={false}
      extra={
        <Popover
          content={popoverContent}
          trigger="click"
          placement="bottomRight"
        >
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
      {visibleFilters.includes('code') && (
        <FilterCol minWidth={170}>
          <Input
            placeholder="Mã Job..."
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            allowClear
          />
        </FilterCol>
      )}

      {visibleFilters.includes('name') && (
        <FilterCol minWidth={190}>
          <Input
            placeholder="Tên Job..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            allowClear
          />
        </FilterCol>
      )}

      {visibleFilters.includes('serviceCode') && (
        <FilterCol minWidth={170}>
          <Input
            placeholder="Mã dịch vụ..."
            value={filterServiceCode}
            onChange={(e) => setFilterServiceCode(e.target.value)}
            allowClear
          />
        </FilterCol>
      )}

      {visibleFilters.includes('category') && (
        <FilterCol minWidth={170}>
          <Select
            placeholder="Loại Job"
            value={filterCategory || undefined}
            onChange={setFilterCategory}
            allowClear
            style={{ width: '100%' }}
            options={[
              { value: 'DATA_SYNC', label: 'Đồng bộ dữ liệu' },
              { value: 'REPORT', label: 'Sinh báo cáo' },
              { value: 'CLEANUP', label: 'Dọn dẹp & Lưu trữ' },
              { value: 'VALIDATION', label: 'Kiểm tra & Đối soát' },
              { value: 'BATCH', label: 'Xử lý lô / Batch' },
              { value: 'SPRING_BEAN', label: 'Spring Component' },
              { value: 'REST_API', label: 'REST API Endpoint' },
              { value: 'SQL_SCRIPT', label: 'SQL Procedure' },
            ]}
          />
        </FilterCol>
      )}

      {visibleFilters.includes('status') && (
        <FilterCol minWidth={140}>
          <Select
            placeholder="Trạng thái"
            value={filterStatus || undefined}
            onChange={setFilterStatus}
            allowClear
            style={{ width: '100%' }}
            options={[
              { value: 'ACTIVE', label: 'Hoạt động' },
              { value: 'INACTIVE', label: 'Ngừng hoạt động' },
            ]}
          />
        </FilterCol>
      )}
    </FilterBar>
  );
};

export default JobFilter;

'use client';

import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { FilterBar, FilterCol } from '@/components/ui';
import { useJobManagement } from './useJobManagement';

const JobFilter: React.FC = () => {
  const {
    searchQuery,
    filterStatus,
    filterCategory,
    filterOwner,
    filterPriority,
    filterRunStatus,
    setSearchQuery,
    setFilterStatus,
    setFilterCategory,
    setFilterOwner,
    setFilterPriority,
    setFilterRunStatus,
    jobs,
  } = useJobManagement();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    setSearchQuery('');
    setFilterStatus('');
    setFilterCategory('');
    setFilterOwner('');
    setFilterPriority('');
    setFilterRunStatus('');
  };

  const owners = [...new Set(jobs.map((j) => j.owner))];

  return (
    <FilterBar
      inCard
      onSearch={() => {}}
      onReset={handleReset}
      extra={
        <Button
          type="text"
          icon={<FilterOutlined />}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Ít hơn' : 'Chi tiết'}
        </Button>
      }
    >
      <FilterCol minWidth={200}>
        <Input
          placeholder="Tìm kiếm Mã, Tên Job"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </FilterCol>

      <FilterCol>
        <Select
          placeholder="Danh mục"
          value={filterCategory || undefined}
          onChange={setFilterCategory}
          allowClear
          options={[
            { value: 'DATA_SYNC', label: 'Đồng bộ dữ liệu' },
            { value: 'REPORT', label: 'Báo cáo' },
            { value: 'CLEANUP', label: 'Dọn dẹp' },
            { value: 'VALIDATION', label: 'Kiểm tra' },
            { value: 'BATCH', label: 'Xử lý hàng loạt' },
          ]}
        />
      </FilterCol>

      <FilterCol>
        <Select
          placeholder="Trạng thái"
          value={filterStatus || undefined}
          onChange={setFilterStatus}
          allowClear
          options={[
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Tạm dừng' },
            { value: 'ARCHIVED', label: 'Lưu trữ' },
          ]}
        />
      </FilterCol>

      <FilterCol>
        <Select
          placeholder="Chủ sở hữu"
          value={filterOwner || undefined}
          onChange={setFilterOwner}
          allowClear
          options={owners.map((owner) => ({
            value: owner,
            label: owner,
          }))}
        />
      </FilterCol>

      {showAdvanced && (
        <>
          <FilterCol>
            <Select
              placeholder="Độ ưu tiên"
              value={filterPriority || undefined}
              onChange={(val) => setFilterPriority(val as number | '')}
              allowClear
              options={[
                { value: 1, label: 'Level 1 - Cực kỳ cao' },
                { value: 2, label: 'Level 2 - Cao' },
                { value: 3, label: 'Level 3 - Bình thường' },
                { value: 4, label: 'Level 4 - Thấp' },
                { value: 5, label: 'Level 5 - Cực thấp' },
              ]}
            />
          </FilterCol>

          <FilterCol>
            <Select
              placeholder="Trạng thái chạy"
              value={filterRunStatus || undefined}
              onChange={setFilterRunStatus}
              allowClear
              options={[
                { value: 'RUNNING', label: 'Đang chạy' },
                { value: 'IDLE', label: 'Chờ' },
                { value: 'SCHEDULED', label: 'Đã lên lịch' },
                { value: 'FAILED', label: 'Thất bại' },
                { value: 'PAUSED', label: 'Tạm dừng' },
              ]}
            />
          </FilterCol>
        </>
      )}
    </FilterBar>
  );
};

export default JobFilter;

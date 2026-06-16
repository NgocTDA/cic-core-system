'use client';

import React from 'react';
import { Input, Select } from 'antd';
import { FilterBar, FilterCol } from '@/components/ui';
import type { JobFilters } from './useJobSimple';
import type { JobStatus, JobRunStatus } from './types';

interface JobFilterProps {
  draft: JobFilters;
  onKeyword: (v: string) => void;
  onStatus: (v?: JobStatus) => void;
  onRunStatus: (v?: JobRunStatus) => void;
  onSearch: () => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu hóa' },
];

const RUN_STATUS_OPTIONS = [
  { value: 'RUNNING', label: 'Đang chạy' },
  { value: 'IDLE', label: 'Chờ (Idle)' },
  { value: 'SCHEDULED', label: 'Đã đặt lịch' },
  { value: 'PAUSED', label: 'Tạm dừng' },
  { value: 'FAILED', label: 'Lỗi' },
];

const JobFilter: React.FC<JobFilterProps> = ({
  draft,
  onKeyword,
  onStatus,
  onRunStatus,
  onSearch,
  onReset,
}) => (
  <FilterBar onSearch={onSearch} onReset={onReset} showAddFilter={false}>
    <FilterCol minWidth={240}>
      <Input
        placeholder="Tìm theo mã hoặc tên job"
        allowClear
        value={draft.keyword}
        onChange={(e) => onKeyword(e.target.value)}
        onPressEnter={onSearch}
      />
    </FilterCol>
    <FilterCol>
      <Select
        placeholder="Trạng thái"
        allowClear
        style={{ width: '100%' }}
        value={draft.status}
        onChange={(v) => onStatus(v)}
        options={STATUS_OPTIONS}
      />
    </FilterCol>
    <FilterCol>
      <Select
        placeholder="Trạng thái chạy"
        allowClear
        style={{ width: '100%' }}
        value={draft.runStatus}
        onChange={(v) => onRunStatus(v)}
        options={RUN_STATUS_OPTIONS}
      />
    </FilterCol>
  </FilterBar>
);

export default JobFilter;

import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterBar, FilterCol } from '@/components/ui';

const { Option } = Select;

interface VariableFilterProps {
  onSearchChange: (text: string) => void;
  onStatusChange: (status: string | null) => void;
}

const VariableFilter: React.FC<VariableFilterProps> = ({
  onSearchChange,
  onStatusChange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<string | null>(null);

  const handleReset = () => {
    setSearchValue('');
    setStatusValue(null);
    onSearchChange('');
    onStatusChange(null);
  };

  return (
    <FilterBar inCard onSearch={() => {}} onReset={handleReset}>
        <FilterCol>
          <Input
            placeholder="Mã biến"
            prefix={<SearchOutlined />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </FilterCol>
        <FilterCol>
          <Input
            placeholder="Tên hiển thị"
            prefix={<SearchOutlined />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </FilterCol>
        <FilterCol>
          <Select
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            allowClear
            value={statusValue}
            onChange={(value) => {
              setStatusValue(value);
              onStatusChange(value);
            }}
            options={[
              { value: 'ACTIVE', label: 'Hoạt động' },
              { value: 'INACTIVE', label: 'Vô hiệu hóa' },
            ]}
          />
        </FilterCol>
    </FilterBar>
  );
};

export default VariableFilter;


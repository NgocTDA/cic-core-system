import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterBar, FilterCol } from '@/components/ui';
import type { ChannelType } from './TemplateTypes';

const { Option } = Select;

interface TemplateFilterProps {
  groups: string[];
  onSearchChange: (text: string) => void;
  onGroupChange: (group: string | null) => void;
  onChannelChange: (channel: ChannelType | null) => void;
  onStatusChange: (status: string | null) => void;
}

const channelLabels: Record<ChannelType, string> = {
  SMS: 'SMS',
  EMAIL: 'Email',
  IN_APP: 'In-app Push',
  WEB_PUSH: 'Web Push',
};

const TemplateFilter: React.FC<TemplateFilterProps> = ({ 
  groups, 
  onSearchChange, 
  onGroupChange,
  onChannelChange,
  onStatusChange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [groupValue, setGroupValue] = useState<string | null>(null);
  const [channelValue, setChannelValue] = useState<ChannelType | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);

  const handleReset = () => {
    setSearchValue('');
    setGroupValue(null);
    setChannelValue(null);
    setStatusValue(null);
    onSearchChange('');
    onGroupChange(null);
    onChannelChange(null);
    onStatusChange(null);
  };

  return (
    <FilterBar inCard onSearch={() => {}} onReset={handleReset}>
        <FilterCol minWidth={220}>
          <Input
            placeholder="Từ khóa (Mã mẫu, Tên mẫu)"
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
            placeholder="Nhóm nghiệp vụ"
            style={{ width: '100%' }}
            allowClear
            value={groupValue}
            onChange={(value) => {
              setGroupValue(value);
              onGroupChange(value);
            }}
          >
            {groups.map(g => <Option key={g} value={g}>{g}</Option>)}
          </Select>
        </FilterCol>
        <FilterCol>
          <Select
            placeholder="Kênh gửi"
            style={{ width: '100%' }}
            allowClear
            value={channelValue}
            onChange={(value) => {
              setChannelValue(value);
              onChannelChange(value);
            }}
          >
            {(Object.entries(channelLabels) as [ChannelType, string][]).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>
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

export default TemplateFilter;


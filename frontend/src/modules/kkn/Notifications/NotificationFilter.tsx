import React, { useState } from 'react';
import { Input, Select, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterBar, FilterCol } from '@/components/ui';

const { RangePicker } = DatePicker;

const NotificationFilter: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleReset = () => {
    setKeyword('');
    setType(undefined);
    setStatus(undefined);
  };

  return (
    <FilterBar onSearch={() => {}} onReset={handleReset}>
        <FilterCol minWidth={220}>
          <Input
            placeholder="Từ khóa (Mã, Tiêu đề)"
            prefix={<SearchOutlined />}
            size="middle"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            allowClear
          />
        </FilterCol>
        <FilterCol>
          <Select
            placeholder="Loại thông báo"
            style={{ width: '100%' }}
            size="middle"
            allowClear
            value={type}
            onChange={setType}
            options={[
              { value: 'SYSTEM', label: 'Hệ thống' },
              { value: 'WARNING', label: 'Cảnh báo' },
              { value: 'TASK', label: 'Nhắc việc' },
            ]}
          />
        </FilterCol>
        <FilterCol>
          <Select
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            size="middle"
            allowClear
            value={status}
            onChange={setStatus}
            options={[
              { value: 'UNREAD', label: 'Chưa đọc' },
              { value: 'READ', label: 'Đã đọc' },
            ]}
          />
        </FilterCol>
        <FilterCol minWidth={240}>
          <RangePicker style={{ width: '100%' }} size="middle" placeholder={['Từ ngày', 'Đến ngày']} />
        </FilterCol>
    </FilterBar>
  );
};

export default NotificationFilter;


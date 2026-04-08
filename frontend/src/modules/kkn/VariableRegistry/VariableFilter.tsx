import React, { useState } from 'react';
import { Card, Input, Select, Row, Col, Space, Button, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface VariableFilterProps {
  groups: string[];
  onSearchChange: (text: string) => void;
  onGroupChange: (group: string | null) => void;
  onStatusChange: (status: string | null) => void;
}

const VariableFilter: React.FC<VariableFilterProps> = ({ 
  groups, 
  onSearchChange, 
  onGroupChange,
  onStatusChange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [groupValue, setGroupValue] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);

  const handleReset = () => {
    setSearchValue('');
    setGroupValue(null);
    setStatusValue(null);
    onSearchChange('');
    onGroupChange(null);
    onStatusChange(null);
  };

  return (
    <Card bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 12]} wrap align="middle">
        <Col xs={24} sm={12} md={7} lg={6}>
          <Input
            placeholder="Từ khóa (Mã biến, Tên hiển thị)"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
          <Select
            placeholder="Lọc theo nhóm"
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
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
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
        </Col>
        <Col xs={24} sm={24} md={7} lg={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Tooltip title="Thêm bộ lọc">
              <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
            </Tooltip>
            <Tooltip title="Xóa bộ lọc">
              <Button icon={<ReloadOutlined />} onClick={handleReset} />
            </Tooltip>
            <Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default VariableFilter;


import React, { useState } from 'react';
import { Card, Input, Select, Row, Col, Space, Button, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

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
    <Card bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 12]} wrap align="middle">
        <Col xs={16} sm={8} md={5} lg={4}>
          <Input
            placeholder="Mã biến"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </Col>
        <Col xs={16} sm={8} md={5} lg={4}>
          <Input
            placeholder="Tên hiển thị"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </Col>
        <Col xs={16} sm={8} md={5} lg={4}>
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
        <Col xs={24} sm={24} md={10} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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


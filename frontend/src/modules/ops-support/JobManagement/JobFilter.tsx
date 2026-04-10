
import React, { useState } from 'react';
import { Card, Row, Col, Select, Input, Button, Space, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const JobFilter: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleReset = () => {
    setSearchValue('');
  };

  return (
    <Card bordered={false} style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
      <Row gutter={[16, 12]} wrap align="middle">
        <Col xs={24} sm={12} md={6} lg={6}>
          <Input
            placeholder="Tìm kiếm theo Mã Job, Tên Job..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            size="middle"
          />
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Select
            placeholder="Hệ thống nguồn"
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="CORE">Core Banking</Option>
            <Option value="CARD">Card System</Option>
            <Option value="EBANK">E-Banking</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Select
            placeholder="Loại tác vụ"
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="Import">Nhập dữ liệu</Option>
            <Option value="Export">Xuất dữ liệu</Option>
            <Option value="Sync">Đồng bộ</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Select
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            allowClear
            options={[
              { value: 'RUNNING', label: 'Đang chạy' },
              { value: 'IDLE', label: 'Chờ (Idle)' },
              { value: 'FAILED', label: 'Lỗi' },
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Tooltip title="Thêm bộ lọc">
              <Button icon={<FilterOutlined />}>Bộ lọc</Button>
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

export default JobFilter;

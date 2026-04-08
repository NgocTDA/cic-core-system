import React, { useState } from 'react';
import { Card, Input, Select, Row, Col, Space, Button, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
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
    <Card bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 12]} wrap align="middle">
        <Col xs={24} sm={12} md={6} lg={5}>
          <Input
            placeholder="Từ khóa (Mã mẫu, Tên mẫu)"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              onSearchChange(e.target.value);
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
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
        </Col>
        <Col xs={24} sm={12} md={4} lg={3}>
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
        </Col>
        <Col xs={24} sm={12} md={4} lg={3}>
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
        <Col xs={24} sm={24} md={6} lg={9} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default TemplateFilter;


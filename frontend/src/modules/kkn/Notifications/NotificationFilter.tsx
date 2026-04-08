import React, { useState } from 'react';
import { Row, Col, Input, Select, DatePicker, Button, Space, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

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
    <div style={{ marginBottom: 8 }}>
      <Row gutter={[16, 12]} wrap align="middle">
        {/* Filters — wrap to next line if needed */}
        <Col xs={24} sm={12} md={6} lg={6} xl={5}>
          <Input
            placeholder="Từ khóa (Mã, Tiêu đề)"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            size="middle"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={5} xl={4}>
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
        </Col>
        <Col xs={24} sm={12} md={4} lg={4} xl={4}>
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
        </Col>
        <Col xs={24} sm={12} md={5} lg={5} xl={5}>
          <RangePicker style={{ width: '100%' }} size="middle" placeholder={['Từ ngày', 'Đến ngày']} />
        </Col>

        {/* Action buttons — dock to the right */}
        <Col xs={24} sm={24} md={4} lg={4} xl={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Tooltip title="Thêm điều kiện lọc nâng cao">
              <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
            </Tooltip>
            <Tooltip title="Xóa tất cả bộ lọc">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              />
            </Tooltip>
            <Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationFilter;


import React, { useState } from 'react';
import { Form, Input, Row, Col, Button, Space, Divider, Table, Tag, Empty, Card, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';

interface ParameterConfigTabProps {
  form: FormInstance;
}

const ParameterConfigTab: React.FC<ParameterConfigTabProps> = ({ form }) => {
  const [parameters, setParameters] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const addParameter = () => {
    const newParam = {
      id: Date.now().toString(),
      key: '',
      type: 'string',
      required: false,
      defaultValue: '',
      description: '',
    };
    setParameters([...parameters, newParam]);
  };

  const removeParameter = (id: string) => {
    setParameters(parameters.filter(p => p.id !== id));
  };

  const columns = [
    {
      title: 'Tên tham số',
      dataIndex: 'key',
      width: 150,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 80,
      render: (required: boolean) => required ? <Tag color="red">Có</Tag> : <Tag>Không</Tag>,
    },
    {
      title: 'Giá trị mặc định',
      dataIndex: 'defaultValue',
      width: 120,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <DeleteOutlined
            style={{ color: '#ff4d4f', cursor: 'pointer' }}
            onClick={() => removeParameter(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Form.Item
              name={['inputSchema']}
              label="JSON Schema cho Input (tùy chọn)"
            >
              <Input.TextArea
                rows={6}
                placeholder={`{
  "type": "object",
  "properties": {
    "sourceTable": {"type": "string"},
    "filterDate": {"type": "string", "format": "date"}
  },
  "required": ["sourceTable"]
}`}
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card>
            <Form.Item
              name={['outputSchema']}
              label="JSON Schema cho Output (tùy chọn)"
            >
              <Input.TextArea
                rows={6}
                placeholder={`{
  "type": "object",
  "properties": {
    "recordsProcessed": {"type": "number"},
    "recordsFailed": {"type": "number"},
    "duration": {"type": "number"}
  }
}`}
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space style={{ marginBottom: '16px' }}>
            <strong>Tham số Runtime</strong>
            <Tooltip title="Những tham số sẽ được truyền khi chạy Job">
              <QuestionCircleOutlined />
            </Tooltip>
            <Button type="primary" icon={<PlusOutlined />} size="small" onClick={addParameter}>
              Thêm tham số
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          {parameters.length > 0 ? (
            <Table
              dataSource={parameters}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="Chưa có tham số nào" />
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Form.Item
            name={['parameters']}
            label="Tham số mặc định (JSON)"
          >
            <Input.TextArea
              rows={4}
              placeholder={`{
  "sourceTable": "CUSTOMER",
  "batchSize": 10000
}`}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ParameterConfigTab;

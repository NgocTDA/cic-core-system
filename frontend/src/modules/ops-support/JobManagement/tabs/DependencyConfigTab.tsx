import React, { useMemo } from 'react';
import { Form, Select, Row, Col, Card, Table, Tag, Empty, Alert, Typography, Tree } from 'antd';
import type { FormInstance } from 'antd';
import { mockJobs } from '../mockData';
import type { IJob } from '../types';

interface DependencyConfigTabProps {
  form: FormInstance;
}

const { Text, Paragraph } = Typography;

const DependencyConfigTab: React.FC<DependencyConfigTabProps> = ({ form }) => {
  const jobOptions = useMemo(() => {
    return mockJobs.map(job => ({
      label: `${job.name} (${job.code})`,
      value: job.id,
      description: job.description,
    }));
  }, []);

  const selectedDependencies = Form.useWatch(['dependsOn'], form) || [];

  const dependencyColumns = [
    {
      title: 'Mã Job',
      dataIndex: 'code',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = {
          ACTIVE: 'green',
          INACTIVE: 'default',
          ARCHIVED: 'red',
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 150,
    },
  ];

  const dependentJobs = selectedDependencies
    .map((jobId: string) => mockJobs.find(j => j.id === jobId))
    .filter(Boolean) as IJob[];

  const treeData = useMemo(() => {
    const buildDependencyTree = (jobId: string, visited = new Set<string>()): any => {
      if (visited.has(jobId)) return null;
      visited.add(jobId);

      const job = mockJobs.find(j => j.id === jobId);
      if (!job) return null;

      return {
        title: `${job.name} (${job.code})`,
        key: job.id,
        children: job.dependsOn.length > 0
          ? job.dependsOn
              .map(depId => buildDependencyTree(depId, new Set(visited)))
              .filter(Boolean)
          : [],
      };
    };

    if (selectedDependencies.length === 0) return [];

    return selectedDependencies
      .map((jobId: string) => buildDependencyTree(jobId))
      .filter(Boolean);
  }, [selectedDependencies]);

  return (
    <div style={{ padding: '24px 0' }}>
      <Alert
        message="Phụ thuộc Job"
        description="Khi một Job có phụ thuộc, nó chỉ chạy sau khi tất cả Job phụ thuộc hoàn thành thành công."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="dependsOn"
            label="Chọn Job phụ thuộc"
            rules={[{ message: 'Vui lòng chọn Job' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn một hoặc nhiều Job"
              options={jobOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
      </Row>

      {selectedDependencies.length > 0 && (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Card title="Job phụ thuộc đã chọn">
                <Table
                  columns={dependencyColumns}
                  dataSource={dependentJobs}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          {treeData.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Card title="Biểu đồ phụ thuộc">
                  <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                    Các Job mà Job hiện tại phụ thuộc vào (bao gồm cả phụ thuộc gián tiếp):
                  </Paragraph>
                  {treeData.length > 0 ? (
                    <Tree treeData={treeData} />
                  ) : (
                    <Empty description="Không có phụ thuộc" />
                  )}
                </Card>
              </Col>
            </Row>
          )}

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Card
                title="Cảnh báo"
                style={{
                  background: '#fff7e6',
                  borderColor: '#ffa940',
                }}
              >
                {selectedDependencies.some((id: string) =>
                  mockJobs.find(j => j.id === id)?.dependsOn.includes(
                    Form.useWatch(['id'], form)
                  )
                ) ? (
                  <Alert
                    message="Cảnh báo: Phát hiện chu kỳ phụ thuộc"
                    description="Một hoặc nhiều Job phụ thuộc của Job hiện tại lại phụ thuộc vào Job này. Điều này có thể gây ra vòng lặp vô hạn."
                    type="warning"
                    showIcon
                  />
                ) : (
                  <Text type="success">✓ Không phát hiện chu kỳ phụ thuộc</Text>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DependencyConfigTab;

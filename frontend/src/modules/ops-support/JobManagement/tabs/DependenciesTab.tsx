import React from 'react';
import { Table, Tag, Empty, Tree, Card, Alert, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { mockJobs } from '../mockData';
import type { IJob } from '../types';
import DependencyGraph from '../DependencyGraph';

interface DependenciesTabProps {
  job: IJob;
}

const DependenciesTab: React.FC<DependenciesTabProps> = ({ job }) => {
  const dependentJobs = job.dependsOn
    .map(jobId => mockJobs.find(j => j.id === jobId))
    .filter(Boolean) as IJob[];

  const buildDependencyTree = (jobId: string, visited = new Set<string>()): any => {
    if (visited.has(jobId)) return null;
    visited.add(jobId);

    const foundJob = mockJobs.find(j => j.id === jobId);
    if (!foundJob) return null;

    return {
      title: `${foundJob.name} (${foundJob.code})`,
      key: foundJob.id,
      children: foundJob.dependsOn.length > 0
        ? foundJob.dependsOn
            .map(depId => buildDependencyTree(depId, new Set(visited)))
            .filter(Boolean)
        : [],
    };
  };

  const dependencyTree = dependentJobs.length > 0
    ? job.dependsOn
        .map(jobId => buildDependencyTree(jobId))
        .filter(Boolean)
    : [];

  const columns: TableProps<IJob>['columns'] = [
    {
      title: 'Mã Job',
      dataIndex: 'code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 120,
      render: (category: string) => {
        const categoryMap: Record<string, string> = {
          DATA_SYNC: 'Đồng bộ',
          REPORT: 'Báo cáo',
          CLEANUP: 'Dọn dẹp',
          VALIDATION: 'Kiểm tra',
          BATCH: 'Xử lý',
        };
        return <Tag color="cyan">{categoryMap[category]}</Tag>;
      },
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
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Tỷ lệ thành công',
      dataIndex: 'successRate',
      width: 120,
      render: (rate: number) => `${rate}%`,
    },
  ];

  if (dependentJobs.length === 0) {
    return (
      <div style={{ padding: '24px 0' }}>
        <Empty description="Job này không phụ thuộc vào Job nào khác" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Alert */}
      <Alert
        message="Phụ thuộc Job"
        description={`Job này phụ thuộc vào ${dependentJobs.length} Job khác. Nó chỉ chạy sau khi tất cả những Job này hoàn thành thành công.`}
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Dependency Graph & Jobs Table */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <DependencyGraph jobId={job.id} height={300} />
        </Col>
        <Col xs={24} md={12}>
          <Card title="Job phụ thuộc">
            {dependentJobs.length > 0 ? (
              <Table
                columns={columns}
                dataSource={dependentJobs}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có Job phụ thuộc" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Dependency Tree */}
      <Card title="Cây phụ thuộc Chi tiết">
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Cây phụ thuộc hiển thị tất cả Job mà Job hiện tại phụ thuộc vào (bao gồm phụ thuộc gián tiếp):
        </p>
        {dependencyTree.length > 0 ? (
          <Tree treeData={dependencyTree} defaultExpandAll />
        ) : (
          <Empty description="Không có phụ thuộc" />
        )}
      </Card>
    </div>
  );
};

export default DependenciesTab;

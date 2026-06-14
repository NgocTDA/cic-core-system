'use client';

import React from 'react';
import { Card, Empty, Tree, Badge, Tag, Tooltip } from 'antd';
import type { TreeProps } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { mockJobs } from './mockData';
import type { IJob } from './types';
import { colors } from '@/design-system';

interface DependencyGraphProps {
  jobId?: string;
  height?: number;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ jobId, height = 400 }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return colors.success.base;
      case 'INACTIVE':
        return colors.warning.base;
      case 'ARCHIVED':
        return colors.neutral[400];
      default:
        return colors.primary[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleOutlined style={{ color: colors.success.base }} />;
      case 'INACTIVE':
        return <SyncOutlined style={{ color: colors.warning.base }} />;
      default:
        return <CloseCircleOutlined style={{ color: colors.neutral[400] }} />;
    }
  };

  const buildDependencyTree = (currentJobId: string, visited = new Set<string>()): TreeProps['treeData'] => {
    if (visited.has(currentJobId)) {
      return [];
    }

    const job = mockJobs.find(j => j.id === currentJobId);
    if (!job) return [];

    visited.add(currentJobId);

    const childrenJobs = mockJobs.filter(j => job.dependsOn.includes(j.id));

    return [
      {
        key: job.id,
        title: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getStatusIcon(job.status)}
            <strong>{job.name}</strong>
            <Tag color={getStatusColor(job.status)} style={{ borderRadius: '2px', fontSize: '11px' }}>
              {job.status}
            </Tag>
            <Tag style={{ fontSize: '11px' }}>Success: {job.successRate}%</Tag>
          </span>
        ),
        children: childrenJobs.map(child => ({
          key: child.id,
          title: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getStatusIcon(child.status)}
              <span>{child.name}</span>
              <Tag color={getStatusColor(child.status)} style={{ borderRadius: '2px', fontSize: '11px' }}>
                {child.status}
              </Tag>
            </span>
          ),
          children: buildDependencyTree(child.id, new Set(visited))?.map(item => ({ ...item })),
        })),
      },
    ];
  };

  const getReverseDependencies = (currentJobId: string): IJob[] => {
    return mockJobs.filter(job => job.dependsOn.includes(currentJobId));
  };

  if (!jobId) {
    return (
      <Card
        title="Biểu đồ phụ thuộc"
        style={{ height }}
      >
        <Empty description="Chọn một job để xem phụ thuộc" />
      </Card>
    );
  }

  const job = mockJobs.find(j => j.id === jobId);
  if (!job) {
    return (
      <Card title="Biểu đồ phụ thuộc">
        <Empty description="Job không tìm thấy" />
      </Card>
    );
  }

  const dependsOnJobs = mockJobs.filter(j => job.dependsOn.includes(j.id));
  const reverseDependencies = getReverseDependencies(jobId);

  return (
    <Card title="Biểu đồ phụ thuộc" style={{ height }}>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '12px' }}>Jobs phải chạy trước ({dependsOnJobs.length})</h4>
        {dependsOnJobs.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {dependsOnJobs.map(dep => (
              <Tooltip
                key={dep.id}
                title={`Mã: ${dep.code} | Trạng thái: ${dep.status} | Tỷ lệ: ${dep.successRate}%`}
              >
                <Badge
                  dot
                  color={getStatusColor(dep.status)}
                  style={{ cursor: 'pointer' }}
                >
                  <span
                    style={{
                      padding: '6px 12px',
                      background: colors.bg.subtle,
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {dep.name}
                  </span>
                </Badge>
              </Tooltip>
            ))}
          </div>
        ) : (
          <span style={{ color: colors.neutral[400], fontSize: '12px' }}>Không có phụ thuộc</span>
        )}
      </div>

      <div>
        <h4 style={{ marginBottom: '12px' }}>Jobs phụ thuộc vào job này ({reverseDependencies.length})</h4>
        {reverseDependencies.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {reverseDependencies.map(dep => (
              <Tooltip
                key={dep.id}
                title={`Mã: ${dep.code} | Trạng thái: ${dep.status} | Tỷ lệ: ${dep.successRate}%`}
              >
                <Badge
                  dot
                  color={getStatusColor(dep.status)}
                  style={{ cursor: 'pointer' }}
                >
                  <span
                    style={{
                      padding: '6px 12px',
                      background: colors.bg.page,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {dep.name}
                  </span>
                </Badge>
              </Tooltip>
            ))}
          </div>
        ) : (
          <span style={{ color: colors.neutral[400], fontSize: '12px' }}>Không có job phụ thuộc</span>
        )}
      </div>
    </Card>
  );
};

export default DependencyGraph;

'use client';

import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PauseCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { mockJobs, mockJobRuns } from './mockData';
import type { IJob } from './types';
import StatusOverview from './dashboard/StatusOverview';
import SuccessRateChart from './dashboard/SuccessRateChart';
import PerformanceMetrics from './dashboard/PerformanceMetrics';
import RecentRunsTimeline from './dashboard/RecentRunsTimeline';

const JobDashboard: React.FC = () => {
  useHeaderActions(
    {
      title: 'Dashboard Quản lý Job',
      actions: [],
    },
    []
  );

  const stats = useMemo(() => {
    const totalJobs = mockJobs.length;
    const activeJobs = mockJobs.filter(j => j.status === 'ACTIVE').length;
    const inactiveJobs = mockJobs.filter(j => j.status === 'INACTIVE').length;
    const archivedJobs = mockJobs.filter(j => j.status === 'ARCHIVED').length;

    const totalRuns = mockJobRuns.length;
    const successfulRuns = mockJobRuns.filter(r => r.status === 'SUCCESS').length;
    const failedRuns = mockJobRuns.filter(r => r.status === 'FAILED').length;
    const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;

    const avgDuration = totalRuns > 0
      ? Math.round(mockJobRuns.reduce((sum, r) => sum + (r.duration || 0), 0) / totalRuns)
      : 0;

    const totalRecordsProcessed = mockJobRuns.reduce((sum, r) => sum + (r.recordsProcessed || 0), 0);
    const avgRecordsPerRun = totalRuns > 0 ? Math.round(totalRecordsProcessed / totalRuns) : 0;

    return {
      totalJobs,
      activeJobs,
      inactiveJobs,
      archivedJobs,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate,
      avgDuration,
      totalRecordsProcessed,
      avgRecordsPerRun,
    };
  }, []);

  const topFailingJobs = useMemo(() => {
    return mockJobs
      .map(job => ({
        ...job,
        failureCount: mockJobRuns.filter(r => r.jobId === job.id && r.status === 'FAILED').length,
      }))
      .sort((a, b) => b.failureCount - a.failureCount)
      .slice(0, 5);
  }, []);

  const topPerformingJobs = useMemo(() => {
    return mockJobs
      .map(job => ({
        ...job,
        runsCount: mockJobRuns.filter(r => r.jobId === job.id).length,
      }))
      .sort((a, b) => b.runsCount - a.runsCount)
      .slice(0, 5);
  }, []);

  const failingJobsColumns = [
    {
      title: 'Mã Job',
      dataIndex: 'code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Số lần thất bại',
      dataIndex: 'failureCount',
      width: 120,
      render: (count: number) => <Tag color="red">{count}</Tag>,
    },
    {
      title: 'Tỷ lệ thành công',
      dataIndex: 'successRate',
      width: 120,
      render: (rate: number) => {
        const color = rate >= 80 ? 'green' : rate >= 60 ? 'orange' : 'red';
        return <Tag color={color}>{rate}%</Tag>;
      },
    },
  ];

  const performingJobsColumns = [
    {
      title: 'Mã Job',
      dataIndex: 'code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Số lần chạy',
      dataIndex: 'runsCount',
      width: 120,
      render: (count: number) => <Tag color="green">{count}</Tag>,
    },
    {
      title: 'Tỷ lệ thành công',
      dataIndex: 'successRate',
      width: 120,
      render: (rate: number) => {
        const color = rate >= 90 ? 'green' : rate >= 70 ? 'orange' : 'red';
        return <Tag color={color}>{rate}%</Tag>;
      },
    },
  ];

  return (
    <PageLayout>
      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Job"
              value={stats.totalJobs}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Job hoạt động"
              value={stats.activeJobs}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Job không hoạt động"
              value={stats.inactiveJobs}
              prefix={<PauseCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Job lưu trữ"
              value={stats.archivedJobs}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Execution Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lần chạy"
              value={stats.totalRuns}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chạy thành công"
              value={stats.successfulRuns}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chạy thất bại"
              value={stats.failedRuns}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ thành công"
              value={stats.successRate}
              suffix="%"
              valueStyle={{ color: stats.successRate >= 80 ? '#52c41a' : stats.successRate >= 60 ? '#faad14' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Overview & Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <StatusOverview stats={stats} />
        </Col>
        <Col xs={24} lg={12}>
          <SuccessRateChart stats={stats} />
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <PerformanceMetrics
            avgDuration={stats.avgDuration}
            avgRecordsPerRun={stats.avgRecordsPerRun}
            totalRecordsProcessed={stats.totalRecordsProcessed}
          />
        </Col>
      </Row>

      {/* Recent Runs */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <RecentRunsTimeline jobRuns={mockJobRuns.slice(0, 10)} />
        </Col>
      </Row>

      {/* Top Failing Jobs */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="Top 5 Job có lỗi nhiều nhất">
            {topFailingJobs.length > 0 ? (
              <Table
                columns={failingJobsColumns}
                dataSource={topFailingJobs}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có Job nào thất bại" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Top Performing Jobs */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Top 5 Job chạy nhiều nhất">
            {topPerformingJobs.length > 0 ? (
              <Table
                columns={performingJobsColumns}
                dataSource={topPerformingJobs}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có Job nào" />
            )}
          </Card>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default JobDashboard;

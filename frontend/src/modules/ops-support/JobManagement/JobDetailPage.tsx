'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Tabs, Button, Space, message, Row, Col, Statistic, Card, Tag, Empty } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PlayCircleOutlined, PauseCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { mockJobs } from './mockData';
import type { IJob } from './types';
import OverviewTab from './tabs/OverviewTab';
import HistoryTab from './tabs/HistoryTab';
import ConfigTab from './tabs/ConfigTab';
import DependenciesTab from './tabs/DependenciesTab';
import JobRunModal from './modals/JobRunModal';
import RunProgressDrawer from './modals/RunProgressDrawer';

const JobDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [runModalVisible, setRunModalVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (jobId) {
      const found = mockJobs.find(j => j.id === jobId);
      if (found) {
        setJob(found);
      } else {
        message.error('Job không tồn tại');
        router.push('/ops-support/job-management');
      }
    }
  }, [jobId, router]);

  useHeaderActions(
    {
      title: job ? `Chi tiết Job: ${job.name}` : 'Chi tiết Job',
      actions: [
        {
          key: 'back',
          label: 'Quay lại',
          icon: <ArrowLeftOutlined />,
          onClick: () => router.push('/ops-support/job-management'),
        },
      ],
    },
    [job?.name]
  );

  const handleRunJob = () => {
    setRunModalVisible(true);
  };

  const handleStopJob = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('Đã dừng Job thành công');
      setLoading(false);
      setIsRunning(false);
    }, 1000);
  };

  const handleEditJob = () => {
    router.push(`/ops-support/job-management/${jobId}/edit`);
  };

  const handleCloneJob = () => {
    if (job) {
      message.success(`Đã sao chép job: ${job.name}`);
      router.push(`/ops-support/job-management/create?cloneId=${jobId}`);
    }
  };

  const tabs = [
    {
      key: 'overview',
      label: 'Tổng quan',
      children: job ? <OverviewTab job={job} /> : <Empty />,
    },
    {
      key: 'history',
      label: 'Lịch sử chạy',
      children: job ? <HistoryTab jobId={jobId} /> : <Empty />,
    },
    {
      key: 'config',
      label: 'Cấu hình',
      children: job ? <ConfigTab job={job} /> : <Empty />,
    },
    {
      key: 'dependencies',
      label: 'Phụ thuộc',
      children: job ? <DependenciesTab job={job} /> : <Empty />,
    },
  ];

  if (!job) {
    return <PageLayout><Empty description="Đang tải..." /></PageLayout>;
  }

  return (
    <PageLayout>
      <Card>
        {/* Status & Quick Actions */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic
                    title="Trạng thái"
                    value={
                      <Tag color={job.status === 'ACTIVE' ? 'green' : 'default'}>
                        {job.status}
                      </Tag>
                    }
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Run Status"
                    value={
                      <Tag color={job.runStatus === 'IDLE' ? 'blue' : 'orange'}>
                        {job.runStatus}
                      </Tag>
                    }
                  />
                </Col>
                <Col span={6}>
                  <Statistic title="Tỷ lệ thành công" value={`${job.successRate}%`} />
                </Col>
                <Col span={6}>
                  <Statistic title="Thời gian trung bình" value={`${job.avgDuration}s`} />
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={handleRunJob}
                    loading={loading}
                  >
                    Chạy ngay
                  </Button>
                </Col>
                {isRunning && (
                  <Col>
                    <Button
                      danger
                      icon={<PauseCircleOutlined />}
                      onClick={handleStopJob}
                      loading={loading}
                    >
                      Dừng
                    </Button>
                  </Col>
                )}
                <Col>
                  <Button icon={<EditOutlined />} onClick={handleEditJob}>
                    Chỉnh sửa
                  </Button>
                </Col>
                <Col>
                  <Button icon={<CopyOutlined />} onClick={handleCloneJob}>
                    Nhân bản
                  </Button>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs items={tabs} />
      </Card>

      {/* Run Job Modal */}
      {job && (
        <JobRunModal
          visible={runModalVisible}
          job={job}
          onClose={() => setRunModalVisible(false)}
          onRun={(params) => {
            setRunModalVisible(false);
            setIsRunning(true);
            message.success('Job đã bắt đầu chạy');
          }}
        />
      )}

      {/* Run Progress Drawer */}
      {job && (
        <RunProgressDrawer
          visible={isRunning}
          jobName={job.name}
          jobCode={job.code}
          onClose={() => setIsRunning(false)}
          onStop={() => handleStopJob()}
        />
      )}
    </PageLayout>
  );
};

export default JobDetailPage;

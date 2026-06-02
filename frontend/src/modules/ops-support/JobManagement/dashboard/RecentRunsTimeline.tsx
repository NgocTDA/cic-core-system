import React from 'react';
import { Card, Table, Tag, Timeline, Row, Col, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { IJobRun } from '../types';
import { mockJobs } from '../mockData';

interface RecentRunsTimelineProps {
  jobRuns: IJobRun[];
}

const RecentRunsTimeline: React.FC<RecentRunsTimelineProps> = ({ jobRuns }) => {
  const statusIcons: Record<string, React.ReactNode> = {
    SUCCESS: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
    FAILED: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />,
    RUNNING: <SyncOutlined spin style={{ color: '#1890ff', fontSize: '16px' }} />,
    CANCELLED: <CloseCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />,
  };

  const statusColors: Record<string, string> = {
    SUCCESS: 'green',
    FAILED: 'red',
    RUNNING: 'blue',
    CANCELLED: 'orange',
  };

  const getJobName = (jobId: string) => {
    return mockJobs.find(j => j.id === jobId)?.name || jobId;
  };

  const getJobCode = (jobId: string) => {
    return mockJobs.find(j => j.id === jobId)?.code || jobId;
  };

  if (jobRuns.length === 0) {
    return (
      <Card title="Chạy gần đây">
        <Empty description="Không có chạy nào" />
      </Card>
    );
  }

  return (
    <Card title="Chạy gần đây (Timeline)">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Timeline
            items={jobRuns.map((run, idx) => ({
              dot: statusIcons[run.status] || statusIcons.CANCELLED,
              color:
                run.status === 'SUCCESS'
                  ? 'green'
                  : run.status === 'FAILED'
                    ? 'red'
                    : run.status === 'RUNNING'
                      ? 'blue'
                      : 'orange',
              children: (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{getJobName(run.jobId)}</span>
                    <span style={{ color: '#999', marginLeft: '8px', fontSize: '12px' }}>
                      ({getJobCode(run.jobId)})
                    </span>
                  </div>
                  <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                    {run.startTime}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Tag color={statusColors[run.status]}>{run.status}</Tag>
                    {run.duration && (
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {run.duration}s
                      </span>
                    )}
                    {run.recordsProcessed && (
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {run.recordsProcessed} bản ghi
                      </span>
                    )}
                  </div>
                </div>
              ),
            }))}
          />
        </Col>

        <Col xs={24} lg={12}>
          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 16px 0' }}>Phân tích nhanh</h4>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Thành công</span>
                <Tag color="green">{jobRuns.filter(r => r.status === 'SUCCESS').length}</Tag>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Thất bại</span>
                <Tag color="red">{jobRuns.filter(r => r.status === 'FAILED').length}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Đang chạy</span>
                <Tag color="blue">{jobRuns.filter(r => r.status === 'RUNNING').length}</Tag>
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                <strong>Job được chạy nhiều nhất:</strong>
              </div>
              {(() => {
                const jobCounts = jobRuns.reduce(
                  (acc, run) => {
                    acc[run.jobId] = (acc[run.jobId] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                );
                const topJob = Object.entries(jobCounts).sort((a, b) => b[1] - a[1])[0];
                return topJob ? (
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {getJobName(topJob[0])} ({topJob[1]} lần)
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default RecentRunsTimeline;

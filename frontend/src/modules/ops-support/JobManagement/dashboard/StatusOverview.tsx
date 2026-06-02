import React from 'react';
import { Card, Row, Col, Progress, Tag, Statistic } from 'antd';

interface StatusOverviewProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    inactiveJobs: number;
    archivedJobs: number;
  };
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ stats }) => {
  const getPercentage = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const activePercent = getPercentage(stats.activeJobs, stats.totalJobs);
  const inactivePercent = getPercentage(stats.inactiveJobs, stats.totalJobs);
  const archivedPercent = getPercentage(stats.archivedJobs, stats.totalJobs);

  return (
    <Card title="Phân bố trạng thái Job">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Job hoạt động</span>
              <Tag color="green">{activePercent}%</Tag>
            </div>
            <Progress percent={activePercent} strokeColor="#52c41a" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Job không hoạt động</span>
              <Tag color="orange">{inactivePercent}%</Tag>
            </div>
            <Progress percent={inactivePercent} strokeColor="#faad14" />
          </div>

          <div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Job lưu trữ</span>
              <Tag color="default">{archivedPercent}%</Tag>
            </div>
            <Progress percent={archivedPercent} strokeColor="#999" />
          </div>
        </Col>

        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
              {stats.totalJobs}
            </div>
            <div style={{ color: '#666', marginBottom: '24px' }}>Tổng Job</div>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic value={stats.activeJobs} title="Hoạt động" valueStyle={{ color: '#52c41a', fontSize: '20px' }} />
              </Col>
              <Col span={8}>
                <Statistic value={stats.inactiveJobs} title="Không hoạt động" valueStyle={{ color: '#faad14', fontSize: '20px' }} />
              </Col>
              <Col span={8}>
                <Statistic value={stats.archivedJobs} title="Lưu trữ" valueStyle={{ color: '#999', fontSize: '20px' }} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default StatusOverview;

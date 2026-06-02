import React from 'react';
import { Card, Row, Col, Progress, Statistic, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface SuccessRateChartProps {
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    successRate: number;
  };
}

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ stats }) => {
  const successPercent = stats.successRate;
  const failPercent = 100 - stats.successRate;

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return '#52c41a';
    if (rate >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const getStatusText = (rate: number) => {
    if (rate >= 90) return 'Tuyệt vời';
    if (rate >= 70) return 'Tốt';
    if (rate >= 50) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <Card title="Tỷ lệ thành công & Xu hướng">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                {/* Success arc */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={getStatusColor(stats.successRate)}
                  strokeWidth="8"
                  strokeDasharray={`${(successPercent / 100) * 565.5} 565.5`}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: getStatusColor(stats.successRate) }}>
                  {stats.successRate}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Thành công</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', color: getStatusColor(stats.successRate), fontWeight: 'bold' }}>
              {getStatusText(stats.successRate)}
            </div>
          </div>
        </Col>

        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Statistic
                title="Tổng lần chạy"
                value={stats.totalRuns}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={24}>
              <Statistic
                title="Chạy thành công"
                value={stats.successfulRuns}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={24}>
              <Statistic
                title="Chạy thất bại"
                value={stats.failedRuns}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<CloseCircleOutlined />}
              />
            </Col>
          </Row>

          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Thành công</span>
              <Tag color="green">{successPercent}%</Tag>
            </div>
            <div style={{ background: '#f0f0f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  background: '#52c41a',
                  height: '100%',
                  width: `${successPercent}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>

            <div style={{ marginTop: '16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Thất bại</span>
              <Tag color="red">{failPercent}%</Tag>
            </div>
            <div style={{ background: '#f0f0f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  background: '#ff4d4f',
                  height: '100%',
                  width: `${failPercent}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SuccessRateChart;

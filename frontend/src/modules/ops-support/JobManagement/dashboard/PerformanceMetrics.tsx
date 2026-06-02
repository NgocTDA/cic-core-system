import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ClockCircleOutlined, DatabaseOutlined } from '@ant-design/icons';

interface PerformanceMetricsProps {
  avgDuration: number;
  avgRecordsPerRun: number;
  totalRecordsProcessed: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  avgDuration,
  avgRecordsPerRun,
  totalRecordsProcessed,
}) => {
  const throughput = avgDuration > 0 ? Math.round(avgRecordsPerRun / avgDuration) : 0;

  return (
    <Card title="Hiệu suất & Thông lượng">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <div style={{ padding: '16px', background: '#f0f7ff', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
              {avgDuration}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>Giây trung bình</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Thời lượng chạy</div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div style={{ padding: '16px', background: '#f6ffed', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
              {avgRecordsPerRun}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>Bản ghi/lần</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Trung bình xử lý</div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div style={{ padding: '16px', background: '#fffbe6', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14', marginBottom: '8px' }}>
              {throughput}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>Bản ghi/giây</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Thông lượng</div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div style={{ padding: '16px', background: '#f9f0ff', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1', marginBottom: '8px' }}>
              {totalRecordsProcessed.toLocaleString()}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>Tổng bản ghi</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Đã xử lý</div>
          </div>
        </Col>
      </Row>

      {/* Detailed Metrics */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 16px 0' }}>Chỉ số hiệu suất</h4>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Thời lượng trung bình</span>
              <span style={{ fontWeight: 'bold' }}>{avgDuration}s</span>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Bản ghi/lần</span>
              <span style={{ fontWeight: 'bold' }}>{avgRecordsPerRun}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Thông lượng</span>
              <span style={{ fontWeight: 'bold', color: '#faad14' }}>{throughput} bản ghi/s</span>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 16px 0' }}>Phân tích dữ liệu</h4>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Tổng bản ghi xử lý</span>
              <span style={{ fontWeight: 'bold' }}>{totalRecordsProcessed.toLocaleString()}</span>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Trung bình/lần</span>
              <span style={{ fontWeight: 'bold' }}>{avgRecordsPerRun}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Mục tiêu/ngày</span>
              <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{(avgRecordsPerRun * 24).toLocaleString()}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PerformanceMetrics;

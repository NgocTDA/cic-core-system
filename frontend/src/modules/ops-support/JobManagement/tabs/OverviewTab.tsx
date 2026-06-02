import React from 'react';
import { Row, Col, Statistic, Card, Divider, Descriptions, Tag, Space, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { IJob } from '../types';

interface OverviewTabProps {
  job: IJob;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ job }) => {
  const categoryMap: Record<string, string> = {
    DATA_SYNC: 'Đồng bộ dữ liệu',
    REPORT: 'Báo cáo',
    CLEANUP: 'Dọn dẹp',
    VALIDATION: 'Kiểm tra',
    BATCH: 'Xử lý hàng loạt',
  };

  const priorityColors: Record<number, string> = {
    1: 'red',
    2: 'orange',
    3: 'blue',
    4: 'green',
    5: 'default',
  };

  const priorityLabels: Record<number, string> = {
    1: 'Rất cao',
    2: 'Cao',
    3: 'Trung bình',
    4: 'Thấp',
    5: 'Rất thấp',
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Statistic
            title="Tổng chạy"
            value={job.successCount + job.failureCount}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Statistic
            title="Thành công"
            value={job.successCount}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Statistic
            title="Thất bại"
            value={job.failureCount}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<CloseCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Statistic title="Tỷ lệ thành công" value={job.successRate} suffix="%" />
        </Col>
      </Row>

      {/* Success Rate Progress */}
      <Card style={{ marginBottom: '24px' }}>
        <h3>Tỷ lệ thành công</h3>
        <Progress
          type="circle"
          percent={job.successRate}
          strokeColor={job.successRate >= 90 ? '#52c41a' : job.successRate >= 70 ? '#faad14' : '#ff4d4f'}
        />
      </Card>

      {/* Job Details */}
      <Card title="Thông tin chi tiết">
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Mã Job">
            <Tag color="blue">{job.code}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            <Tag color="cyan">{categoryMap[job.category]}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">{job.description}</Descriptions.Item>
          <Descriptions.Item label="Chủ sở hữu">{job.owner}</Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={job.status === 'ACTIVE' ? 'green' : 'default'}>{job.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Độ ưu tiên">
            <Tag color={priorityColors[job.priority]}>
              {priorityLabels[job.priority]} ({job.priority})
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Phiên bản">{job.version}</Descriptions.Item>
          <Descriptions.Item label="Thời gian chạy trung bình">
            {job.avgDuration} giây
          </Descriptions.Item>

          <Descriptions.Item label="Thẻ (Tags)">
            <Space>
              {job.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Timeout">{job.timeout} giây</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Schedule Info */}
      <Divider />
      <Card title="Lịch biểu">
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Loại lịch biểu">
            <Tag color="blue">{job.schedule.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Múi giờ">{job.schedule.timezone}</Descriptions.Item>

          {job.schedule.type === 'SCHEDULED' && job.schedule.expression && (
            <Descriptions.Item label="Biểu thức CRON" span={2}>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '2px' }}>
                {job.schedule.expression}
              </code>
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Lần chạy cuối">
            {job.schedule.lastRunTime || 'Chưa chạy'}
          </Descriptions.Item>
          <Descriptions.Item label="Lần chạy kế tiếp">
            {job.schedule.nextRunTime || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Retry Policy */}
      <Divider />
      <Card title="Chính sách thử lại">
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Số lần thử tối đa">
            {job.retryPolicy.maxRetries}
          </Descriptions.Item>
          <Descriptions.Item label="Độ trễ khởi tạo">
            {job.retryPolicy.delayMs} ms
          </Descriptions.Item>
          <Descriptions.Item label="Hệ số Exponential">
            {job.retryPolicy.backoffMultiplier}x
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Audit Info */}
      <Divider />
      <Card title="Thông tin kiểm toán">
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Tạo bởi">{job.createdBy}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{job.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Sửa bởi">{job.updatedBy}</Descriptions.Item>
          <Descriptions.Item label="Ngày sửa">{job.updatedAt}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OverviewTab;

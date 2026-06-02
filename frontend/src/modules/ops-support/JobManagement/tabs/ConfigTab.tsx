import React from 'react';
import { Card, Descriptions, Tag, Divider, Row, Col, Table, Empty } from 'antd';
import type { IJob } from '../types';

interface ConfigTabProps {
  job: IJob;
}

const ConfigTab: React.FC<ConfigTabProps> = ({ job }) => {
  const categoryMap: Record<string, string> = {
    DATA_SYNC: 'Đồng bộ dữ liệu',
    REPORT: 'Báo cáo',
    CLEANUP: 'Dọn dẹp',
    VALIDATION: 'Kiểm tra',
    BATCH: 'Xử lý hàng loạt',
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Basic Config */}
      <Card title="Cấu hình cơ bản" style={{ marginBottom: '24px' }}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Mã Job">{job.code}</Descriptions.Item>
          <Descriptions.Item label="Tên Job">{job.name}</Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            <Tag color="cyan">{categoryMap[job.category]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Chủ sở hữu">{job.owner}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Schedule Config */}
      <Card title="Cấu hình lịch biểu" style={{ marginBottom: '24px' }}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Loại lịch biểu">
            <Tag color="blue">{job.schedule.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Múi giờ">
            {job.schedule.timezone || 'UTC'}
          </Descriptions.Item>
          {job.schedule.expression && (
            <Descriptions.Item label="CRON Expression" span={2}>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '2px' }}>
                {job.schedule.expression}
              </code>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Thời gian chạy kế tiếp">
            {job.schedule.nextRunTime || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Lần chạy cuối">
            {job.schedule.lastRunTime || 'Chưa chạy'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Retry Policy */}
      <Card title="Chính sách thử lại" style={{ marginBottom: '24px' }}>
        <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="Số lần thử tối đa">
            {job.retryPolicy.maxRetries}
          </Descriptions.Item>
          <Descriptions.Item label="Độ trễ khởi tạo">
            {job.retryPolicy.delayMs} ms
          </Descriptions.Item>
          <Descriptions.Item label="Hệ số Exponential Backoff">
            {job.retryPolicy.backoffMultiplier}x
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Input/Output Schema */}
      <Card title="Input/Output Schema" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4>Input Schema</h4>
            {job.inputSchema ? (
              <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                {JSON.stringify(job.inputSchema, null, 2)}
              </pre>
            ) : (
              <Empty description="Không có schema" />
            )}
          </Col>
          <Col span={12}>
            <h4>Output Schema</h4>
            {job.outputSchema ? (
              <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                {JSON.stringify(job.outputSchema, null, 2)}
              </pre>
            ) : (
              <Empty description="Không có schema" />
            )}
          </Col>
        </Row>
      </Card>

      {/* Parameters */}
      <Card title="Tham số mặc định" style={{ marginBottom: '24px' }}>
        {job.parameters ? (
          <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
            {JSON.stringify(job.parameters, null, 2)}
          </pre>
        ) : (
          <Empty description="Không có tham số" />
        )}
      </Card>

      {/* Notification Config */}
      {job.notificationConfig && (
        <Card title="Cấu hình thông báo" style={{ marginBottom: '24px' }}>
          <Divider orientation="left">Khi chạy thành công</Divider>
          {job.notificationConfig.onSuccess ? (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Template">
                {job.notificationConfig.onSuccess.templateCode}
              </Descriptions.Item>
              <Descriptions.Item label="Kênh">
                {job.notificationConfig.onSuccess.channels.join(', ')}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="Chưa cấu hình" />
          )}

          <Divider orientation="left">Khi chạy thất bại</Divider>
          {job.notificationConfig.onFailure ? (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Template">
                {job.notificationConfig.onFailure.templateCode}
              </Descriptions.Item>
              <Descriptions.Item label="Kênh">
                {job.notificationConfig.onFailure.channels.join(', ')}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="Chưa cấu hình" />
          )}
        </Card>
      )}
    </div>
  );
};

export default ConfigTab;

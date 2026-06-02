import React from 'react';
import { Form, Input, Select, Row, Col, InputNumber, TimePicker, Space, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { IJobSchedule } from '../types';

interface ScheduleConfigTabProps {
  form: FormInstance;
}

const ScheduleConfigTab: React.FC<ScheduleConfigTabProps> = ({ form }) => {
  const scheduleTypeOptions = [
    { value: 'MANUAL', label: 'Chạy thủ công' },
    { value: 'SCHEDULED', label: 'Theo lịch trình' },
    { value: 'ONCE', label: 'Chạy một lần' },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name={['schedule', 'type']}
            label="Loại lịch biểu"
            rules={[{ required: true, message: 'Vui lòng chọn loại lịch biểu' }]}
          >
            <Select placeholder="Chọn loại lịch biểu" options={scheduleTypeOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.schedule?.type !== currentValues.schedule?.type
        }
      >
        {({ getFieldValue }) => {
          const scheduleType = getFieldValue(['schedule', 'type']);

          if (scheduleType === 'SCHEDULED') {
            return (
              <>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name={['schedule', 'expression']}
                      label={
                        <Space>
                          Biểu thức Cron
                          <Tooltip title="VD: 0 0 * * * (mỗi ngày lúc 00:00), 0 0 * * 0 (mỗi Chủ nhật)">
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                      rules={[{ required: true, message: 'Vui lòng nhập biểu thức Cron' }]}
                    >
                      <Input placeholder="0 0 * * *" style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name={['schedule', 'timezone']}
                      label="Múi giờ"
                      initialValue="Asia/Ho_Chi_Minh"
                    >
                      <Select
                        options={[
                          { value: 'Asia/Ho_Chi_Minh', label: 'Hà Nội (ICT UTC+7)' },
                          { value: 'Asia/Bangkok', label: 'Bangkok (ICT UTC+7)' },
                          { value: 'UTC', label: 'UTC' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div style={{ padding: '12px 16px', background: '#f0f5ff', borderRadius: '4px' }}>
                      <Form.Item name={['schedule', 'nextRunTime']} label="Lần chạy kế tiếp dự kiến">
                        <Input disabled value={new Date().toLocaleString('vi-VN')} />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </>
            );
          }

          if (scheduleType === 'ONCE') {
            return (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    name={['schedule', 'nextRunTime']}
                    label="Thời gian chạy"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian chạy' }]}
                  >
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
              </Row>
            );
          }

          return null;
        }}
      </Form.Item>

      <Form.Item noStyle shouldUpdate={true}>
        {({ getFieldValue }) => {
          const scheduleType = getFieldValue(['schedule', 'type']);
          const expression = getFieldValue(['schedule', 'expression']);

          return (
            scheduleType && (
              <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                  <div style={{ padding: '16px', background: '#e6f7ff', borderRadius: '4px', border: '1px solid #91d5ff' }}>
                    <strong>Cấu hình hiện tại:</strong>
                    <div style={{ marginTop: '8px' }}>
                      {scheduleType === 'MANUAL' && <Tag>Chạy thủ công qua giao diện</Tag>}
                      {scheduleType === 'SCHEDULED' && expression && (
                        <>
                          <Tag>Cron: {expression}</Tag>
                          <Tag style={{ marginLeft: '8px' }}>Múi giờ: {getFieldValue(['schedule', 'timezone'])}</Tag>
                        </>
                      )}
                      {scheduleType === 'ONCE' && <Tag>Chạy một lần vào: {getFieldValue(['schedule', 'nextRunTime'])}</Tag>}
                    </div>
                  </div>
                </Col>
              </Row>
            )
          );
        }}
      </Form.Item>

      <Form.Item
        name={['retryPolicy', 'maxRetries']}
        label="Số lần thử lại tối đa"
        initialValue={3}
        rules={[{ required: true, message: 'Vui lòng nhập số lần thử lại' }]}
      >
        <InputNumber min={0} max={10} />
      </Form.Item>

      <Form.Item
        name={['retryPolicy', 'delayMs']}
        label="Độ trễ giữa các lần thử (ms)"
        initialValue={1000}
        rules={[{ required: true, message: 'Vui lòng nhập độ trễ' }]}
      >
        <InputNumber min={0} step={1000} />
      </Form.Item>

      <Form.Item
        name={['retryPolicy', 'backoffMultiplier']}
        label="Hệ số tăng trưởng Exponential"
        initialValue={1.5}
        rules={[{ required: true, message: 'Vui lòng nhập hệ số' }]}
      >
        <InputNumber min={1} step={0.1} />
      </Form.Item>
    </div>
  );
};

export default ScheduleConfigTab;

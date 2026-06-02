import React, { useMemo } from 'react';
import { Form, Row, Col, Card, Select, Table, Switch, Tag, Empty, Divider, Typography, Space } from 'antd';
import type { FormInstance } from 'antd';
import { mockTemplates } from '@/modules/kkn/NotificationTemplate/mockData';
import type { ChannelType, INotificationTemplate } from '@/modules/kkn/NotificationTemplate/TemplateTypes';

interface NotificationConfigTabProps {
  form: FormInstance;
}

const { Text } = Typography;

const JOB_RUN_FIELDS = [
  { label: 'Tên job', value: 'job.name' },
  { label: 'Mã job', value: 'job.code' },
  { label: 'Thời gian chạy (giây)', value: 'run.duration' },
  { label: 'Trạng thái', value: 'run.status' },
  { label: 'Lỗi chi tiết', value: 'run.errorDetail' },
  { label: 'Số bản ghi xử lý', value: 'run.recordsProcessed' },
  { label: 'Số bản ghi lỗi', value: 'run.recordsFailed' },
  { label: 'Thời điểm bắt đầu', value: 'run.startTime' },
  { label: 'Thời điểm kết thúc', value: 'run.endTime' },
];

const NotificationConfigTab: React.FC<NotificationConfigTabProps> = ({ form }) => {
  const templateOptions = mockTemplates.map(t => ({
    label: `${t.name} (${t.code})`,
    value: t.id,
    channels: t.channels,
    template: t,
  }));

  const SuccessNotificationSection = () => {
    const selectedTemplateId = form.getFieldValue(['notificationConfig', 'onSuccess', 'templateId']);
    const selectedTemplate = mockTemplates.find(t => t.id === selectedTemplateId);

    const variableColumns = selectedTemplate ? getVariableColumns(selectedTemplate) : [];

    return (
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <Form.Item
                name={['notificationConfig', 'onSuccess', 'enabled']}
                label="Bật thông báo khi Job chạy thành công"
                valuePropName="checked"
                initialValue={false}
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.notificationConfig?.onSuccess?.enabled !==
            currentValues.notificationConfig?.onSuccess?.enabled
          }
        >
          {({ getFieldValue }) => {
            const enabled = getFieldValue(['notificationConfig', 'onSuccess', 'enabled']);
            if (!enabled) return null;

            return (
              <>
                <Divider />
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name={['notificationConfig', 'onSuccess', 'templateId']}
                      label="Chọn template thông báo"
                      rules={[{ required: true, message: 'Vui lòng chọn template' }]}
                    >
                      <Select
                        placeholder="Chọn template"
                        options={templateOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['notificationConfig', 'onSuccess', 'channels']}
                      label="Kênh gửi"
                      rules={[{ required: true, message: 'Vui lòng chọn kênh' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn kênh gửi"
                        options={[
                          { label: 'Email', value: 'EMAIL' },
                          { label: 'SMS', value: 'SMS' },
                          { label: 'In-app Push', value: 'IN_APP' },
                          { label: 'Web Push', value: 'WEB_PUSH' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {selectedTemplate && (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Text strong>Ánh xạ biến</Text>
                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                          - Gắn các biến từ template với dữ liệu Job
                        </Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        {variableColumns.length > 0 ? (
                          <Table
                            columns={variableColumns}
                            dataSource={getVariablesFromTemplate(selectedTemplate)}
                            rowKey="name"
                            pagination={false}
                            size="small"
                          />
                        ) : (
                          <Empty description="Template này không có biến" />
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </>
            );
          }}
        </Form.Item>
      </Card>
    );
  };

  const FailureNotificationSection = () => {
    const selectedTemplateId = form.getFieldValue(['notificationConfig', 'onFailure', 'templateId']);
    const selectedTemplate = mockTemplates.find(t => t.id === selectedTemplateId);
    const variableColumns = selectedTemplate ? getVariableColumns(selectedTemplate) : [];

    return (
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <Form.Item
                name={['notificationConfig', 'onFailure', 'enabled']}
                label="Bật thông báo khi Job chạy thất bại"
                valuePropName="checked"
                initialValue={false}
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.notificationConfig?.onFailure?.enabled !==
            currentValues.notificationConfig?.onFailure?.enabled
          }
        >
          {({ getFieldValue }) => {
            const enabled = getFieldValue(['notificationConfig', 'onFailure', 'enabled']);
            if (!enabled) return null;

            return (
              <>
                <Divider />
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name={['notificationConfig', 'onFailure', 'templateId']}
                      label="Chọn template thông báo"
                      rules={[{ required: true, message: 'Vui lòng chọn template' }]}
                    >
                      <Select
                        placeholder="Chọn template"
                        options={templateOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['notificationConfig', 'onFailure', 'channels']}
                      label="Kênh gửi"
                      rules={[{ required: true, message: 'Vui lòng chọn kênh' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn kênh gửi"
                        options={[
                          { label: 'Email', value: 'EMAIL' },
                          { label: 'SMS', value: 'SMS' },
                          { label: 'In-app Push', value: 'IN_APP' },
                          { label: 'Web Push', value: 'WEB_PUSH' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {selectedTemplate && (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Text strong>Ánh xạ biến</Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        {variableColumns.length > 0 ? (
                          <Table
                            columns={variableColumns}
                            dataSource={getVariablesFromTemplate(selectedTemplate)}
                            rowKey="name"
                            pagination={false}
                            size="small"
                          />
                        ) : (
                          <Empty description="Template này không có biến" />
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </>
            );
          }}
        </Form.Item>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h3>Khi chạy thành công</h3>
          <SuccessNotificationSection />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <h3>Khi chạy thất bại</h3>
          <FailureNotificationSection />
        </Col>
      </Row>
    </div>
  );
};

function getVariablesFromTemplate(template: INotificationTemplate) {
  const variables: any[] = [];
  const content = template.contentMap[template.languages[0]];
  if (!content) return variables;

  const allText = Object.values(content)
    .map((ch: any) => (ch.body || '') + (ch.subject || ''))
    .join(' ');

  const variableMatches = allText.match(/\{\{([^}]+)\}\}/g) || [];
  const uniqueVars = new Set(variableMatches.map(v => v.replace(/[{}]/g, '')));

  return Array.from(uniqueVars).map(name => ({ name }));
}

function getVariableColumns(template: INotificationTemplate) {
  return [
    {
      title: 'Biến trong template',
      dataIndex: 'name',
      width: 180,
      render: (text: string) => <Tag color="cyan">{'{{' + text + '}}'}</Tag>,
    },
    {
      title: 'Ánh xạ đến',
      width: 250,
      render: () => (
        <Select
          placeholder="Chọn trường từ Job"
          style={{ width: '100%' }}
          options={JOB_RUN_FIELDS}
          size="small"
        />
      ),
    },
  ];
}

export default NotificationConfigTab;

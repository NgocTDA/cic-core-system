
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, Select, Row, Col, Typography, Card, Divider, Switch, InputNumber, Button, Space, message } from 'antd';
import { SettingOutlined, ScheduleOutlined, BellOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { MOCK_JOBS, Job } from './mockData';
import useHeaderActions from './../../../hooks/useHeaderActions';

const { Title, Text } = Typography;

const JobFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode && id) {
      const job = MOCK_JOBS.find(j => j.id === id);
      if (job) {
        form.setFieldsValue({
          name: job.name,
          id: job.id,
          system: job.system,
          type: job.type,
          priority: job.priority,
          recurrence: 'daily',
          retry: 3,
          timeout: 120,
          concurrency: 5,
          emailNotify: true,
          alertChannel: 'EMAIL'
        });
      }
    }
  }, [id, isEditMode, form]);

  const handleSubmit = (values: any) => {
    console.log('Saving job:', values);
    message.success(isEditMode ? 'Cập nhật cấu hình Job thành công' : 'Thiết lập Job mới thành công');
    router.push('/ops-support/job-management');
  };

  const handleCancel = () => {
    router.push('/ops-support/job-management');
  };

  // Register Header Actions
  useHeaderActions({
    title: isEditMode ? `Chỉnh sửa cấu hình: ${id}` : 'Thiết lập Job mới',
    actions: [
      {
        key: 'cancel',
        label: 'Hủy bỏ',
        onClick: handleCancel
      },
      {
        key: 'save',
        label: isEditMode ? 'Cập nhật' : 'Lưu thiết lập',
        type: 'primary',
        icon: <SaveOutlined />,
        onClick: () => form.submit()
      }
    ]
  }, [isEditMode, id]);

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: 'Medium',
          recurrence: 'daily',
          retry: 3,
          timeout: 60,
          concurrency: 1,
          emailNotify: false,
          system: 'CORE',
          type: 'Import'
        }}
      >
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <Row gutter={48}>
            {/* LEFT COLUMN: BASIC INFO */}
            <Col span={14}>
              <Divider orientation="left" style={{ marginTop: 0 }}>
                <Space><SettingOutlined /> Thông tin chung</Space>
              </Divider>
              
              <Row gutter={16}>
                <Col span={isEditMode ? 16 : 24}>
                  <Form.Item name="name" label="Tên Job nghiệp vụ" rules={[{ required: true, message: 'Vui lòng nhập tên Job' }]}>
                    <Input placeholder="VD: Đối soát giao dịch ATM cuối ngày" size="large" />
                  </Form.Item>
                </Col>
                {isEditMode && (
                  <Col span={8}>
                    <Form.Item name="id" label="Mã định danh (ID)">
                      <Input disabled style={{ fontFamily: 'monospace' }} size="large" />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="system" label="Hệ thống nguồn" rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'CORE', label: 'Core Banking' },
                      { value: 'CARD', label: 'Card System' },
                      { value: 'E-BANK', label: 'E-Banking' },
                    ]} size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="type" label="Loại tác vụ" rules={[{ required: true }]}>
                    <Select options={[
                      { value: 'Import', label: 'Nhập dữ liệu' },
                      { value: 'Export', label: 'Xuất dữ liệu' },
                      { value: 'Sync', label: 'Đồng bộ' },
                      { value: 'Report', label: 'Báo cáo' },
                    ]} size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="priority" label="Độ ưu tiên">
                    <Select options={[
                      { value: 'High', label: 'Cao (High)' },
                      { value: 'Medium', label: 'Thường (Medium)' },
                      { value: 'Low', label: 'Thấp (Low)' },
                    ]} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <Space><ScheduleOutlined /> Lịch trình thực hiện</Space>
              </Divider>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item name="recurrence" label="Chu kỳ chạy">
                    <Select options={[
                      { value: 'hourly', label: 'Hàng giờ (Hourly)' },
                      { value: 'daily', label: 'Hàng ngày (Daily)' },
                      { value: 'weekly', label: 'Hàng tuần (Weekly)' },
                      { value: 'monthly', label: 'Hàng tháng (Monthly)' },
                      { value: 'custom', label: 'Cron Expression' },
                    ]} size="large" />
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item 
                    noStyle 
                    shouldUpdate={(prev, curr) => prev.recurrence !== curr.recurrence}
                  >
                    {({ getFieldValue }) => {
                      const mode = getFieldValue('recurrence');
                      return mode === 'custom' ? (
                        <Form.Item name="cron" label="Cron Expression" rules={[{ required: true }]}>
                          <Input placeholder="0 0 * * *" style={{ fontFamily: 'monospace' }} size="large" />
                        </Form.Item>
                      ) : (
                        <Form.Item label="Thời gian chạy dự kiến">
                          <Input disabled value={getFieldValue('recurrence') === 'daily' ? '00:00 hàng ngày' : '--:--'} size="large" />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* RIGHT COLUMN: PARAMETERS & ALERTS */}
            <Col span={10}>
              <Divider orientation="left" style={{ marginTop: 0 }}>
                <Space><SettingOutlined /> Tham số vận hành</Space>
              </Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="timeout" label="Timeout tối đa (phút)">
                    <InputNumber min={1} style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="retry" label="Số lần thử lại khi lỗi">
                    <InputNumber min={0} style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="concurrency" label="Luồng xử lý song song (Concurrency)">
                <InputNumber min={1} max={50} style={{ width: '100%' }} size="large" />
              </Form.Item>

              <Divider orientation="left">
                <Space><BellOutlined /> Cảnh báo & Thông báo</Space>
              </Divider>

              <div style={{ background: '#fafafa', padding: '16px 20px', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Form.Item name="emailNotify" label="Bật thông báo khi Job thất bại" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item 
                  noStyle 
                  shouldUpdate={(prev, curr) => prev.emailNotify !== curr.emailNotify}
                >
                  {({ getFieldValue }) => getFieldValue('emailNotify') ? (
                    <Form.Item name="alertChannel" label="Kênh nhận cảnh báo">
                      <Select options={[
                        { value: 'EMAIL', label: 'Email' },
                        { value: 'TELEGRAM', label: 'Telegram Bot' },
                        { value: 'SMS', label: 'SMS' },
                      ]} />
                    </Form.Item>
                  ) : null}
                </Form.Item>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  * Hệ thống sẽ tự động gửi thông báo tới quản trị viên nếu Job vượt quá số lần thử lại cho phép.
                </Text>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '24px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button onClick={handleCancel} size="large">Hủy bỏ</Button>
              <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => form.submit()}>
                {isEditMode ? 'Cập nhật Job' : 'Tạo mới Job'}
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default JobFormPage;

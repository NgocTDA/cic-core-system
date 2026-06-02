import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space, Divider, Alert, Empty } from 'antd';
import type { IJob } from '../types';

interface JobRunModalProps {
  visible: boolean;
  job: IJob;
  onClose: () => void;
  onRun: (parameters: Record<string, any>) => void;
}

const JobRunModal: React.FC<JobRunModalProps> = ({ visible, job, onClose, onRun }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onRun(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Chạy Job: ${job.name}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Chạy
        </Button>,
      ]}
      width={600}
    >
      <Alert
        message={`Chạy Job: ${job.code}`}
        description={job.description}
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={job.parameters || {}}
      >
        {/* Job Info */}
        <Form.Item label="Mã Job">
          <Input value={job.code} disabled />
        </Form.Item>

        <Form.Item label="Timeout (giây)">
          <InputNumber
            disabled
            value={job.timeout}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Divider />

        {/* Parameters */}
        {job.parameters && Object.keys(job.parameters).length > 0 ? (
          <>
            <h4>Tham số (có thể ghi đè)</h4>
            {Object.entries(job.parameters).map(([key, value]) => (
              <Form.Item
                key={key}
                name={key}
                label={key}
                initialValue={value}
              >
                {typeof value === 'number' ? (
                  <InputNumber style={{ width: '100%' }} />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </>
        ) : (
          <>
            <h4>Tham số</h4>
            <Empty description="Job này không có tham số runtime" />
          </>
        )}

        <Divider />

        {/* Additional Options */}
        <Form.Item
          name="dryRun"
          label="Dry Run (chỉ kiểm tra, không thực thi)"
          valuePropName="checked"
        >
          <input type="checkbox" />
        </Form.Item>

        <Form.Item
          name="notifyOnCompletion"
          label="Gửi thông báo khi hoàn thành"
          valuePropName="checked"
          initialValue={true}
        >
          <input type="checkbox" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobRunModal;

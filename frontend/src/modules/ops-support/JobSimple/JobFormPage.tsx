'use client';

import React, { useEffect, useState } from 'react';
import { App, Form, Input, Select, Row, Col, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { PageLayout, SectionCard } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { spacing } from '@/design-system';
import CronScheduler from './CronScheduler';
import { getJobById, saveJobToStore } from './useJobSimple';
import { DEFAULT_CRON, DEFAULT_TIMEZONE, isValidCron } from './cronLocale';
import type { JobStatus } from './types';

const LIST_PATH = '/ops-support/jobs';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu hóa' },
];

interface JobFormPageProps {
  mode: 'create' | 'edit';
}

interface JobFormFields {
  code: string;
  name: string;
  description?: string;
  maxRetries: number;
  status: JobStatus;
}

const JobFormPageInner: React.FC<JobFormPageProps> = ({ mode }) => {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm<JobFormFields>();

  const isEdit = mode === 'edit';
  const jobId = isEdit ? String(params?.id ?? '') : undefined;

  const [cron, setCron] = useState<string>(DEFAULT_CRON);
  const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);
  const [jobName, setJobName] = useState<string>('');
  const [cronError, setCronError] = useState<string>('');

  const handleCronChange = (val: string) => {
    setCron(val);
    if (cronError) setCronError('');
  };

  useEffect(() => {
    if (isEdit && jobId) {
      const job = getJobById(jobId);
      if (job) {
        form.setFieldsValue({
          code: job.code,
          name: job.name,
          description: job.description,
          maxRetries: job.maxRetries,
          status: job.status,
        });
        setCron(job.cron);
        setTimezone(job.timezone);
        setJobName(job.name);
      } else {
        message.error('Job không tồn tại');
        router.push(LIST_PATH);
      }
    } else {
      form.setFieldsValue({ status: 'ACTIVE', maxRetries: 3 });
    }
  }, [isEdit, jobId, form, message, router]);

  const handleSubmit = async () => {
    if (!isValidCron(cron)) {
      setCronError('Lịch chạy không hợp lệ — vui lòng chọn hoặc nhập biểu thức cron đúng.');
      message.error('Lịch chạy không hợp lệ');
      return;
    }
    try {
      const values = await form.validateFields();
      saveJobToStore(
        {
          code: values.code,
          name: values.name,
          description: values.description,
          maxRetries: values.maxRetries,
          status: values.status,
          cron,
          timezone,
        },
        jobId,
      );
      message.success(isEdit ? 'Cập nhật job thành công' : 'Thêm job mới thành công');
      router.push(LIST_PATH);
    } catch {
      message.error('Vui lòng kiểm tra lại các trường bắt buộc');
    }
  };

  useHeaderActions(
    {
      title: isEdit ? `Chỉnh sửa job${jobName ? `: ${jobName}` : ''}` : 'Thêm job mới',
      actions: [
        { key: 'back', label: 'Quay lại', icon: <ArrowLeftOutlined />, onClick: () => router.push(LIST_PATH) },
        { key: 'save', label: isEdit ? 'Cập nhật' : 'Lưu', type: 'primary', icon: <SaveOutlined />, onClick: handleSubmit },
      ],
    },
    [isEdit, jobName, cron, timezone, cronError],
  );

  return (
    <PageLayout>
      <SectionCard title="Thông tin job">
        <Form form={form} layout="vertical" requiredMark style={{ paddingTop: spacing[2] }}>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="code"
                label="Mã job"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã job' },
                  { pattern: /^[A-Z0-9_]+$/, message: 'Chỉ gồm chữ in hoa, số và dấu gạch dưới' },
                ]}
              >
                <Input placeholder="VD: SYNC_CUSTOMER_DB" disabled={isEdit} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item name="name" label="Tên job" rules={[{ required: true, message: 'Vui lòng nhập tên job' }]}>
                <Input placeholder="VD: Đồng bộ dữ liệu khách hàng" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn về job" />
          </Form.Item>

          <Form.Item label="Lịch chạy" required>
            <CronScheduler
              cron={cron}
              timezone={timezone}
              onCronChange={handleCronChange}
              onTimezoneChange={setTimezone}
              errorText={cronError}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="maxRetries"
                label="Số lần thử lại khi thất bại"
                tooltip="Số lần hệ thống tự chạy lại job nếu lần chạy bị lỗi"
                rules={[{ required: true, message: 'Vui lòng nhập số lần thử lại' }]}
              >
                <InputNumber min={0} max={10} style={{ width: '100%' }} suffix="lần" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </SectionCard>
    </PageLayout>
  );
};

const JobFormPage: React.FC<JobFormPageProps> = ({ mode }) => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <JobFormPageInner mode={mode} />
  </App>
);

export default JobFormPage;

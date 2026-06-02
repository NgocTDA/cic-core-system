'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Tabs, Button, Space, message, Card } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { mockJobs } from './mockData';
import type { IJob } from './types';
import BasicInfoTab from './tabs/BasicInfoTab';
import ScheduleConfigTab from './tabs/ScheduleConfigTab';
import ParameterConfigTab from './tabs/ParameterConfigTab';
import NotificationConfigTab from './tabs/NotificationConfigTab';
import DependencyConfigTab from './tabs/DependencyConfigTab';

const JobFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string | undefined;
  const isEditMode = !!jobId;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<IJob | null>(null);

  useEffect(() => {
    if (isEditMode && jobId) {
      const found = mockJobs.find(j => j.id === jobId);
      if (found) {
        setJob(found);
        form.setFieldsValue(found);
      } else {
        message.error('Job không tồn tại');
        router.push('/ops-support/job-management');
      }
    }
  }, [jobId, isEditMode, form, router]);

  useHeaderActions(
    {
      title: isEditMode ? `Chỉnh sửa Job: ${job?.name || ''}` : 'Thiết lập Job mới',
      actions: [
        {
          key: 'back',
          label: 'Quay lại',
          icon: <ArrowLeftOutlined />,
          onClick: () => router.push('/ops-support/job-management'),
        },
      ],
    },
    [isEditMode, job?.name]
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      message.success(
        isEditMode
          ? 'Cập nhật cấu hình Job thành công'
          : 'Thiết lập Job mới thành công'
      );

      router.push('/ops-support/job-management');
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi lưu Job');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      key: 'basic',
      label: 'Thông tin cơ bản',
      children: <BasicInfoTab form={form} isEditMode={isEditMode} />,
    },
    {
      key: 'schedule',
      label: 'Lịch biểu & Thời gian',
      children: <ScheduleConfigTab form={form} />,
    },
    {
      key: 'parameters',
      label: 'Tham số & Dữ liệu',
      children: <ParameterConfigTab form={form} />,
    },
    {
      key: 'notification',
      label: 'Thông báo',
      children: <NotificationConfigTab form={form} />,
    },
    {
      key: 'dependency',
      label: 'Phụ thuộc',
      children: <DependencyConfigTab form={form} />,
    },
  ];

  return (
    <PageLayout>
      <Card>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ marginBottom: 24 }}
        >
          <Tabs items={tabs} />

          <Space style={{ marginTop: 24 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSubmit}
            >
              {isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button onClick={() => router.push('/ops-support/job-management')}>
              Hủy
            </Button>
          </Space>
        </Form>
      </Card>
    </PageLayout>
  );
};

export default JobFormPage;

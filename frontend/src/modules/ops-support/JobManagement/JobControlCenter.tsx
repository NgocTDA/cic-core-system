
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Space, Button, Typography, message } from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import { useJobManagement } from './useJobManagement';
import JobFilter from './JobFilter';
import JobList from './JobList';
import { Job } from './mockData';
import useHeaderActions from './../../../hooks/useHeaderActions';

const { Text } = Typography;

const JobControlCenter: React.FC = () => {
    const router = useRouter();
    const {
        filteredJobs,
        runJob
    } = useJobManagement();

    const handleAddJob = () => {
        router.push('/ops-support/job-management/create');
    };

    const handleEditJob = (job: Job) => {
        router.push(`/ops-support/job-management/${job.id}/edit`);
    };

    const handleRowClick = (job: Job) => {
        router.push(`/ops-support/job-management/${job.id}`);
    };

    const handleRefresh = () => {
        message.loading('Đang làm mới dữ liệu...', 1);
    };

    // Register Header Actions
    useHeaderActions({
        title: 'Quản lý Job định kỳ',
        actions: [
            {
                key: 'refresh',
                label: 'Làm mới',
                icon: <ReloadOutlined />,
                onClick: handleRefresh
            },
            {
                key: 'add',
                label: 'Thiết lập job mới',
                type: 'primary',
                icon: <PlusOutlined />,
                onClick: handleAddJob
            }
        ]
    }, []);

    return (
        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Filter Card */}
            <JobFilter />

            {/* Main Table Card */}
            <Card
                bordered={false}
                style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 8, 
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' 
                }}
                styles={{ 
                    body: { padding: '0 20px 20px' },
                    header: { borderBottom: 'none', padding: '16px 20px 0' }
                }}
                title={
                    <Space size="small">
                        <Text strong style={{ fontSize: 13, color: '#8c8c8c' }}>
                            DANH SÁCH TÁC VỤ ({filteredJobs.length})
                        </Text>
                    </Space>
                }
            >
                <JobList 
                    data={filteredJobs} 
                    onRowClick={handleRowClick} 
                    onRun={runJob}
                    onEdit={handleEditJob}
                />
            </Card>
        </div>
    );
};

export default JobControlCenter;

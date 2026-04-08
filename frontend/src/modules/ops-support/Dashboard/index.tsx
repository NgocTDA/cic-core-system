'use client';

import React from 'react';
import { Typography, Card, Result, Button } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

const OpsSupportDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Result
                    icon={<ToolOutlined style={{ color: '#722ed1', fontSize: 64 }} />}
                    title="Dashboard Hỗ trợ vận hành"
                    subTitle="Phân hệ hỗ trợ tác nghiệp đang trong giai đoạn thiết lập."
                    extra={
                        <Link href="/">
                            <Button type="primary">Quay lại Landing Page</Button>
                        </Link>
                    }
                />
                <div style={{ marginTop: 24, textAlign: 'left', padding: '0 40px' }}>
                    <Title level={4}>Các tính năng dự kiến:</Title>
                    <ul>
                        <li>Quản lý yêu cầu hỗ trợ (Support Tickets)</li>
                        <li>Giám sát hiệu năng hệ thống (Monitoring)</li>
                        <li>Công cụ vận hành và xử lý sự cố</li>
                        <li>Quản lý thông báo và cảnh báo hệ thống</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default OpsSupportDashboard;

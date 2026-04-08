'use client';

import React from 'react';
import { Typography, Card, Result, Button } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

const DataGovernanceDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Result
                    icon={<SafetyOutlined style={{ color: '#13c2c2', fontSize: 64 }} />}
                    title="Dashboard Quản trị dữ liệu"
                    subTitle="Nền tảng quản trị dữ liệu tập trung (Data Governance Platform)."
                    extra={
                        <Link href="/">
                            <Button type="primary">Quay lại Landing Page</Button>
                        </Link>
                    }
                />
                <div style={{ marginTop: 24, textAlign: 'left', padding: '0 40px' }}>
                    <Title level={4}>Các tính năng dự kiến:</Title>
                    <ul>
                        <li>Quản trị Metadata và Data Dictionary</li>
                        <li>Chính sách bảo mật và quyền truy cập dữ liệu</li>
                        <li>Giám sát dòng chảy dữ liệu (Data Lineage)</li>
                        <li>Quản lý Master Data (MDM)</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default DataGovernanceDashboard;

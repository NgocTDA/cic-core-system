'use client';

import React from 'react';
import { Typography, Card, Result, Button } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

const AnalyticsReportingDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Result
                    icon={<PieChartOutlined style={{ color: '#eb2f96', fontSize: 64 }} />}
                    title="Dashboard Báo cáo & Thống kê"
                    subTitle="Hệ thống báo cáo BI đang được cấu hình."
                    extra={
                        <Link href="/">
                            <Button type="primary">Quay lại Landing Page</Button>
                        </Link>
                    }
                />
                <div style={{ marginTop: 24, textAlign: 'left', padding: '0 40px' }}>
                    <Title level={4}>Các tính năng dự kiến:</Title>
                    <ul>
                        <li>Báo cáo thông tin tín dụng quốc gia</li>
                        <li>Phân tích tăng trưởng và rủi ro</li>
                        <li>Công cụ tạo báo cáo tùy chỉnh (Ad-hoc)</li>
                        <li>Xuất bản và phân quyền xem báo cáo</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsReportingDashboard;

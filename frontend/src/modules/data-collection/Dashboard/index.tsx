'use client';

import React from 'react';
import { Typography, Card, Result, Button } from 'antd';
import { BuildOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const DataCollectionDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Result
                    icon={<BuildOutlined style={{ color: '#1890ff', fontSize: 64 }} />}
                    title="Dashboard Thu thập & Xử lý dữ liệu"
                    subTitle="Phân hệ đang trong quá trình phát triển nội dung nghiệp vụ."
                    extra={
                        <Link href="/">
                            <Button type="primary">Quay lại Landing Page</Button>
                        </Link>
                    }
                />
                <div style={{ marginTop: 24, textAlign: 'left', padding: '0 40px' }}>
                    <Title level={4}>Các tính năng dự kiến:</Title>
                    <ul>
                        <li>Tự động thu thập dữ liệu từ các nguồn (API, DB, File)</li>
                        <li>Trình xử lý dữ liệu (ETL Pipeline)</li>
                        <li>Kiểm soát chất lượng dữ liệu đầu vào</li>
                        <li>Theo dõi trạng thái thu thập thời gian thực</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default DataCollectionDashboard;

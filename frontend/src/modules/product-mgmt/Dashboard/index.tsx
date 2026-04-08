'use client';

import React from 'react';
import { Typography, Card, Result, Button } from 'antd';
import { BoxPlotOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

const ProductMgmtDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Result
                    icon={<BoxPlotOutlined style={{ color: '#52c41a', fontSize: 64 }} />}
                    title="Dashboard Quản lý & Tạo lập sản phẩm"
                    subTitle="Phân hệ đang được xây dựng."
                    extra={
                        <Link href="/">
                            <Button type="primary">Quay lại Landing Page</Button>
                        </Link>
                    }
                />
                <div style={{ marginTop: 24, textAlign: 'left', padding: '0 40px' }}>
                    <Title level={4}>Các tính năng dự kiến:</Title>
                    <ul>
                        <li>Danh mục sản phẩm thông tin tín dụng</li>
                        <li>Quy trình tạo lập sản phẩm mới</li>
                        <li>Quản lý phiên bản và cấu hình sản phẩm</li>
                        <li>Định giá và phân phối sản phẩm</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default ProductMgmtDashboard;

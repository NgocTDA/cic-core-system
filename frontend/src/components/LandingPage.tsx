'use client';

import React from 'react';
import { Typography, Row, Col, Card, Button, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useSubSystem } from '../context/SubSystemContext';
import { SUB_SYSTEMS } from '../config/navigation';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const LandingPage: React.FC = () => {
    const { setActiveSubSystem } = useSubSystem();
    const router = useRouter();

    const handleEnterSubSystem = (id: string, path: string) => {
        setActiveSubSystem(id);
        router.push(path);
    };

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            background: `linear-gradient(rgba(0, 21, 41, 0.7), rgba(0, 21, 41, 0.8)), url('/system_landing_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 24px',
            overflowX: 'hidden',
            overflowY: 'auto'
        }}>
            <div style={{
                margin: '0 auto',
                padding: '40px 0',
                width: '100%',
                maxWidth: 1200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 'fit-content',
                flexShrink: 0
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 800, padding: '0 24px' }}>
                    <Title style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 12 }}>
                        CIC CORE SYSTEM
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 'clamp(14px, 1.5vw, 16px)' }}>
                        Nền tảng quản trị và vận hành hệ thống thông tin tín dụng tập trung.
                        Vui lòng chọn phân hệ để bắt đầu làm việc.
                    </Text>
                </div>

                <div style={{ width: '100%' }}>
                    <Row gutter={[24, 24]}>
                        {SUB_SYSTEMS.map((sys) => (
                            <Col xs={24} sm={12} lg={8} key={sys.id}>
                                <Card
                                    hoverable
                                    onClick={() => handleEnterSubSystem(sys.id, sys.menuItems[0].path || '#')}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        height: '100%',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                    styles={{ body: { padding: '32px' } }}
                                    className="landing-card"
                                >
                                    <div style={{ marginBottom: 24 }}>
                                        <div style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '12px',
                                            background: `${sys.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 28,
                                            color: sys.color,
                                            marginBottom: 16
                                        }}>
                                            {sys.icon}
                                        </div>
                                        <Title level={4} style={{ color: '#fff', margin: 0 }}>
                                            {sys.name}
                                        </Title>
                                    </div>

                                    <Text style={{
                                        color: 'rgba(255, 255, 255, 0.45)',
                                        display: 'block',
                                        marginBottom: 16,
                                        fontSize: '14px'
                                    }}>
                                        Ứng dụng nghiệp vụ hỗ trợ {sys.name.toLowerCase()} cho người dùng hệ thống.
                                    </Text>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: sys.color,
                                        fontWeight: 600,
                                        gap: 8,
                                        marginTop: 'auto'
                                    }}>
                                        Khám phá ngay <ArrowRightOutlined />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            <style jsx global>{`
                .landing-card:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.2) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

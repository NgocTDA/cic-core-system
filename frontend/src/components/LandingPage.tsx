'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useSubSystem } from '../context/SubSystemContext';
import { SUB_SYSTEMS } from '../config/navigation';
import { useRouter } from 'next/navigation';
import { colors, typography } from '../design-system';

const { Title, Text } = Typography;

// ─── Subsystem metadata: unique descriptions & feature highlights ───
const SUBSYSTEM_META: Record<string, { description: string; features: string[] }> = {
    'kkn': {
        description: 'Quản lý kênh trao đổi dữ liệu với các TCTD, đồng bộ và tổng hợp thông tin tín dụng.',
        features: [],
    },
    'data-collection': {
        description: 'Thu thập, kiểm tra, xử lý và chuẩn hoá dữ liệu từ các tổ chức tín dụng.',
        features: [],
    },
    'product-mgmt': {
        description: 'Tạo lập và quản lý sản phẩm thông tin tín dụng, phục vụ hỏi & trả lời tin.',
        features: [],
    },
    'ops-support': {
        description: 'Quản trị người dùng, phân quyền, cấu hình hệ thống và giám sát chất lượng.',
        features: [],
    },
    'analytics-reporting': {
        description: 'Tổng hợp báo cáo nghiệp vụ, thống kê theo kỳ và tạo báo cáo tuỳ chỉnh.',
        features: [],
    },
    'data-governance': {
        description: 'Quản trị tài sản dữ liệu, thuật ngữ nghiệp vụ và Data Lineage toàn hệ thống.',
        features: [],
    },
    'web-portal': {
        description: 'Cổng giao tiếp điện tử dành cho các TCTD gửi báo cáo tín dụng và đối chiếu thông tin cân đối.',
        features: ['Gửi thông tin cân đối', 'Menu ngang 3 cấp', 'Đối soát trạng thái tệp'],
    },
};

// ─── Count top-level menu items (excluding dashboard) for badge ───
function countMenuItems(menuItems: typeof SUB_SYSTEMS[0]['menuItems']): number {
    return menuItems.filter(m => m.key && !m.key.includes('dashboard')).length;
}

const LandingPage: React.FC = () => {
    const { setActiveSubSystem } = useSubSystem();
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger staggered entrance after mount
        const timer = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    const handleEnterSubSystem = (id: string, path: string) => {
        setActiveSubSystem(id);
        router.push(path);
    };

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            background: colors.bg.page,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'relative',
        }}>
            {/* ─── Subtle accent gradient at top ─── */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '400px',
                background: `linear-gradient(180deg, ${colors.primary[50]} 0%, rgba(255,255,255,0) 100%)`,
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            {/* ─── Header section ─── */}
            <div style={{
                margin: '0 auto',
                padding: '64px 24px 32px',
                width: '100%',
                maxWidth: 1280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 'fit-content',
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: 48,
                    maxWidth: 800,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {/* <div style={{
                        display: 'inline-block',
                        padding: '6px 20px',
                        borderRadius: '100px',
                        background: colors.primary[50],
                        border: `1px solid ${colors.primary[100]}`,
                        marginBottom: 20,
                    }}>
                        <Text style={{ color: colors.primary[500], fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
                            CREDIT INFORMATION CENTER
                        </Text>
                    </div> */}
                    <Title style={{
                        color: colors.text.primary,
                        fontSize: 'clamp(32px, 4.5vw, 48px)',
                        fontWeight: 800,
                        marginBottom: 16,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                    }}>
                        CIC CORE SYSTEM
                    </Title>
                    <Text style={{
                        color: colors.text.secondary,
                        fontSize: 'clamp(16px, 1.6vw, 18px)',
                        lineHeight: 1.6,
                        fontWeight: 450,
                    }}>
                        Nền tảng quản trị và vận hành hệ thống thông tin tín dụng tập trung
                    </Text>
                </div>

                {/* ─── Card Grid ─── */}
                <div style={{ width: '100%' }}>
                    <Row gutter={[24, 24]}>
                        {SUB_SYSTEMS.map((sys, index) => {
                            const meta = SUBSYSTEM_META[sys.id];
                            const menuCount = countMenuItems(sys.menuItems);
                            return (
                                <Col xs={24} sm={12} lg={8} key={sys.id}>
                                    <Card
                                        hoverable
                                        onClick={() => handleEnterSubSystem(sys.id, sys.menuItems[0].path || '#')}
                                        style={{
                                            background: '#ffffff',
                                            border: `1px solid ${colors.border.split}`,
                                            borderRadius: '20px',
                                            height: '100%',
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                            cursor: 'pointer',
                                            opacity: visible ? 1 : 0,
                                            transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                            transitionDelay: `${index * 60}ms`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                                        }}
                                        styles={{ body: { padding: '32px 32px 28px' } }}
                                        className="landing-card"
                                    >
                                        {/* Accent line at top */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: `linear-gradient(90deg, transparent, ${sys.color}, transparent)`,
                                            opacity: 0.7,
                                        }} />

                                        {/* Icon + Menu count row */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            marginBottom: 20,
                                        }}>
                                            <div style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '16px',
                                                background: `${sys.color}10`,
                                                border: `1px solid ${sys.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 28,
                                                color: sys.color,
                                                transition: 'all 0.3s ease',
                                            }} className="landing-card-icon">
                                                {sys.icon}
                                            </div>
                                            <div style={{
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                background: colors.neutral[50],
                                                border: `1px solid ${colors.neutral[200]}`,
                                            }}>
                                                <Text style={{
                                                    color: colors.text.secondary,
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                }}>
                                                    {menuCount} nhóm chức năng
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Title level={4} style={{
                                            color: colors.text.primary,
                                            margin: '0 0 10px',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                        }}>
                                            {sys.name}
                                        </Title>

                                        {/* Description */}
                                        <Text style={{
                                            color: colors.text.secondary,
                                            display: 'block',
                                            marginBottom: 20,
                                            fontSize: '14px',
                                            lineHeight: 1.6,
                                            minHeight: '44px',
                                        }}>
                                            {meta?.description || `Ứng dụng nghiệp vụ hỗ trợ ${sys.name.toLowerCase()} cho hệ thống.`}
                                        </Text>

                                        {/* Feature tags */}
                                        {meta?.features && (
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                marginBottom: 24,
                                            }}>
                                                {meta.features.map((f) => (
                                                    <span key={f} style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '8px',
                                                        background: `${sys.color}08`,
                                                        border: `1px solid ${sys.color}15`,
                                                        color: `${sys.color}`,
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                    }}>
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: 16,
                                            borderTop: `1px solid ${colors.border.split}`,
                                            marginTop: 'auto',
                                        }}>
                                            <span style={{
                                                color: sys.color,
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                            }}>
                                                Truy cập <ArrowRightOutlined className="landing-arrow" style={{ fontSize: 12, transition: 'transform 0.25s ease' }} />
                                            </span>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>

                {/* ─── Footer info ─── */}
                <div style={{
                    marginTop: 64,
                    paddingBottom: 40,
                    textAlign: 'center',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.8s ease 0.6s',
                }}>
                    <Text style={{
                        color: colors.text.tertiary,
                        fontSize: '13px',
                    }}>
                        © {new Date().getFullYear()} Trung tâm Thông tin tín dụng Quốc gia Việt Nam (CIC) — v1.0.0
                    </Text>
                </div>
            </div>

            <style jsx global>{`
                .landing-card:hover {
                    transform: translateY(-8px) !important;
                    background: #ffffff !important;
                    border-color: ${colors.primary[200]} !important;
                    box-shadow:
                        0 20px 40px rgba(0, 0, 0, 0.08),
                        0 0 0 1px ${colors.primary[50]} inset !important;
                }
                .landing-card:hover .landing-card-icon {
                    transform: scale(1.1);
                    background: ${colors.primary[50]};
                }
                .landing-card:hover .landing-arrow {
                    transform: translateX(6px);
                }
                .landing-card:active {
                    transform: translateY(-3px) scale(0.985) !important;
                    transition-duration: 0.1s !important;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

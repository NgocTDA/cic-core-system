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
        features: ['Kênh trao đổi', 'Nhật ký dữ liệu', 'Tổng hợp M5/XHTD'],
    },
    'data-collection': {
        description: 'Thu thập, kiểm tra, xử lý và chuẩn hoá dữ liệu từ các tổ chức tín dụng.',
        features: ['Tiếp nhận dữ liệu', 'Quản lý mã CIC', 'Kho dữ liệu'],
    },
    'product-mgmt': {
        description: 'Tạo lập và quản lý sản phẩm thông tin tín dụng, phục vụ hỏi & trả lời tin.',
        features: ['Sản phẩm định kỳ', 'Hỏi tin KH', 'Bài viết cảnh báo'],
    },
    'ops-support': {
        description: 'Quản trị người dùng, phân quyền, cấu hình hệ thống và giám sát chất lượng.',
        features: ['Người dùng & Quyền', 'Mẫu thông báo', 'Cấu hình hệ thống'],
    },
    'analytics-reporting': {
        description: 'Tổng hợp báo cáo nghiệp vụ, thống kê theo kỳ và tạo báo cáo tuỳ chỉnh.',
        features: ['Báo cáo nghiệp vụ', 'Thống kê TCTD', 'Lịch định kỳ'],
    },
    'data-governance': {
        description: 'Quản trị tài sản dữ liệu, thuật ngữ nghiệp vụ và Data Lineage toàn hệ thống.',
        features: ['Tài sản dữ liệu', 'Thuật ngữ NV', 'Data Lineage'],
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
            background: `linear-gradient(160deg, rgba(0, 12, 30, 0.82), rgba(0, 21, 41, 0.88)), url('/system_landing_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
            overflowY: 'auto',
        }}>
            {/* ─── Header section ─── */}
            <div style={{
                margin: '0 auto',
                padding: '48px 24px 16px',
                width: '100%',
                maxWidth: 1280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 'fit-content',
                flexShrink: 0
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: 40,
                    maxWidth: 800,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 20px',
                        borderRadius: '100px',
                        background: 'rgba(22, 119, 255, 0.12)',
                        border: '1px solid rgba(22, 119, 255, 0.2)',
                        marginBottom: 20,
                    }}>
                        <Text style={{ color: colors.primary[400], fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
                            CREDIT INFORMATION CENTER
                        </Text>
                    </div>
                    <Title style={{
                        color: '#fff',
                        fontSize: 'clamp(30px, 4vw, 44px)',
                        fontWeight: 800,
                        marginBottom: 12,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                    }}>
                        CIC CORE SYSTEM
                    </Title>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: 'clamp(15px, 1.5vw, 17px)',
                        lineHeight: 1.6,
                    }}>
                        Nền tảng quản trị và vận hành hệ thống thông tin tín dụng tập trung
                    </Text>
                </div>

                {/* ─── Card Grid ─── */}
                <div style={{ width: '100%' }}>
                    <Row gutter={[20, 20]}>
                        {SUB_SYSTEMS.map((sys, index) => {
                            const meta = SUBSYSTEM_META[sys.id];
                            const menuCount = countMenuItems(sys.menuItems);
                            return (
                                <Col xs={24} sm={12} lg={8} key={sys.id}>
                                    <Card
                                        hoverable
                                        onClick={() => handleEnterSubSystem(sys.id, sys.menuItems[0].path || '#')}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.04)',
                                            backdropFilter: 'blur(16px)',
                                            border: '1px solid rgba(255, 255, 255, 0.07)',
                                            borderRadius: '16px',
                                            height: '100%',
                                            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                            cursor: 'pointer',
                                            opacity: visible ? 1 : 0,
                                            transform: visible ? 'translateY(0)' : 'translateY(24px)',
                                            transitionDelay: `${index * 70}ms`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                        styles={{ body: { padding: '28px 28px 24px' } }}
                                        className="landing-card"
                                    >
                                        {/* Accent line at top */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, transparent, ${sys.color}, transparent)`,
                                            opacity: 0.5,
                                        }} />

                                        {/* Icon + Menu count row */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            marginBottom: 16,
                                        }}>
                                            <div style={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: '14px',
                                                background: `${sys.color}15`,
                                                border: `1px solid ${sys.color}25`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 26,
                                                color: sys.color,
                                                transition: 'all 0.3s ease',
                                            }} className="landing-card-icon">
                                                {sys.icon}
                                            </div>
                                            <div style={{
                                                padding: '4px 10px',
                                                borderRadius: '100px',
                                                background: 'rgba(255, 255, 255, 0.06)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}>
                                                <Text style={{
                                                    color: 'rgba(255, 255, 255, 0.4)',
                                                    fontSize: '11px',
                                                    fontWeight: 500,
                                                }}>
                                                    {menuCount} nhóm chức năng
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Title level={4} style={{
                                            color: '#fff',
                                            margin: '0 0 8px',
                                            fontSize: '17px',
                                            fontWeight: 700,
                                        }}>
                                            {sys.name}
                                        </Title>

                                        {/* Description */}
                                        <Text style={{
                                            color: 'rgba(255, 255, 255, 0.4)',
                                            display: 'block',
                                            marginBottom: 16,
                                            fontSize: '13px',
                                            lineHeight: 1.6,
                                            minHeight: '42px',
                                        }}>
                                            {meta?.description || `Ứng dụng nghiệp vụ hỗ trợ ${sys.name.toLowerCase()} cho hệ thống.`}
                                        </Text>

                                        {/* Feature tags */}
                                        {meta?.features && (
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '6px',
                                                marginBottom: 18,
                                            }}>
                                                {meta.features.map((f) => (
                                                    <span key={f} style={{
                                                        padding: '3px 10px',
                                                        borderRadius: '6px',
                                                        background: `${sys.color}10`,
                                                        border: `1px solid ${sys.color}18`,
                                                        color: `${sys.color}`,
                                                        fontSize: '11px',
                                                        fontWeight: 500,
                                                        opacity: 0.8,
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
                                            paddingTop: 14,
                                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                            marginTop: 'auto',
                                        }}>
                                            <span style={{
                                                color: sys.color,
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                            }}>
                                                Truy cập <ArrowRightOutlined className="landing-arrow" style={{ fontSize: 11, transition: 'transform 0.25s ease' }} />
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
                    marginTop: 48,
                    paddingBottom: 32,
                    textAlign: 'center',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.8s ease 0.6s',
                }}>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '12px',
                    }}>
                        © {new Date().getFullYear()} Trung tâm Thông tin tín dụng Quốc gia Việt Nam (CIC) — v1.0.0
                    </Text>
                </div>
            </div>

            <style jsx global>{`
                .landing-card:hover {
                    transform: translateY(-6px) !important;
                    background: rgba(255, 255, 255, 0.07) !important;
                    border-color: rgba(255, 255, 255, 0.15) !important;
                    box-shadow:
                        0 20px 40px rgba(0, 0, 0, 0.35),
                        0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
                }
                .landing-card:hover .landing-card-icon {
                    transform: scale(1.08);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.06);
                }
                .landing-card:hover .landing-arrow {
                    transform: translateX(4px);
                }
                .landing-card:active {
                    transform: translateY(-2px) scale(0.99) !important;
                    transition-duration: 0.1s !important;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

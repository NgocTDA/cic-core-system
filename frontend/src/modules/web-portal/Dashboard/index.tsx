'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Space, Typography, Tag } from 'antd';
import {
  ArrowRightOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  PhoneOutlined,
  AppleOutlined,
  AndroidOutlined,
  RightOutlined,
  LoginOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Text, Title, Paragraph } = Typography;

// ─── Credit Score Display (large animated number) ────────────────────────────
const CreditScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1400;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayed(end);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s < 300) return 'var(--error)';
    if (s < 550) return '#fa8c16';
    if (s < 700) return 'var(--warning)';
    if (s < 850) return 'var(--success)';
    return 'var(--success-ink)';
  };

  const getScoreLabel = (s: number) => {
    if (s < 300) return 'Rất thấp';
    if (s < 550) return 'Thấp';
    if (s < 700) return 'Trung bình';
    if (s < 850) return 'Tốt';
    return 'Xuất sắc';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      padding: '8px 0 4px',
    }}>
      {/* Big score number */}
      <div style={{
        width: 130,
        height: 130,
        borderRadius: '50%',
        border: `6px solid ${scoreColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${scoreColor}08`,
        boxShadow: `0 0 0 3px ${scoreColor}20`,
        transition: 'all 0.3s',
      }}>
        <span style={{
          fontSize: 48,
          fontWeight: 800,
          color: scoreColor,
          lineHeight: 1,
          fontFamily: 'var(--font-sans, inherit)',
          letterSpacing: '-2px',
        }}>
          {displayed}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: scoreColor,
          letterSpacing: '0.04em',
          marginTop: 2,
        }}>
          {getScoreLabel(score)}
        </span>
      </div>

      {/* Score range bar */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          height: 6,
          borderRadius: 9999,
          background: 'var(--color-neutral-200)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${(score / 1000) * 100}%`,
            background: `linear-gradient(90deg, var(--error) 0%, var(--warning) 40%, var(--success) 100%)`,
            borderRadius: 9999,
            transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>0</span>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>1.000</span>
        </div>
      </div>

      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Ngày chấm điểm: 24/9/2025
      </span>
    </div>
  );
};

// ─── USP Item ────────────────────────────────────────────────────────────────
const UspItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: `var(--primary)14`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      fontSize: 16,
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <Text strong style={{ fontSize: 14, color: 'var(--text)', display: 'block' }}>{title}</Text>
      <Text style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</Text>
    </div>
  </div>
);

// ─── Service Card ─────────────────────────────────────────────────────────────
interface ServiceCardProps {
  num: string;
  category: string;
  title: string;
  desc: string;
  bullets: string[];
}
const ServiceCard: React.FC<ServiceCardProps> = ({ num, category, title, desc, bullets }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 24px',
    boxShadow: 'var(--elevation-1)',
    border: `1px solid var(--color-neutral-100)`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'all 0.25s',
  }}
    className="service-card"
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-neutral-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 13,
        color: 'var(--text-muted)',
      }}>
        {num}
      </div>
      <Tag color="blue" style={{ borderRadius: 9999, fontWeight: 600, fontSize: 10, margin: 0 }}>
        {category}
      </Tag>
    </div>
    <Title level={5} style={{ margin: 0, color: 'var(--text)', fontSize: 16 }}>{title}</Title>
    <Text style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{desc}</Text>
    <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b}</li>
      ))}
    </ul>
  </div>
);

// ─── Action Banner Card ───────────────────────────────────────────────────────
interface ActionBannerProps {
  tabs: string[];
  activeTab: string;
  heading: string;
  stats: { value: string; label: string }[];
  gradient: string;
}
const ActionBanner: React.FC<ActionBannerProps> = ({ tabs, activeTab, heading, stats, gradient }) => (
  <div style={{
    background: gradient,
    borderRadius: 'var(--radius-lg)',
    padding: '32px 28px',
    color: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Subtle pattern overlay */}
    <div style={{
      position: 'absolute',
      top: -40,
      right: -40,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
      pointerEvents: 'none',
    }} />

    {/* Tab pills */}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tabs.map(tab => (
        <div key={tab} style={{
          padding: '4px 14px',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 600,
          background: tab === activeTab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
          color: tab === activeTab ? '#184c37' : 'rgba(255,255,255,0.85)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {tab !== activeTab && <RightOutlined style={{ fontSize: 9 }} />}
          {tab}
        </div>
      ))}
    </div>

    {/* Heading */}
    <Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 800, lineHeight: 1.3, fontSize: 18 }}>
      {heading}
    </Title>

    {/* Stats */}
    <Row gutter={12}>
      {stats.map((s, i) => (
        <Col span={12} key={i}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            backdropFilter: 'blur(4px)',
          }}>
            <Text strong style={{ color: '#fff', fontSize: 20, display: 'block', fontWeight: 800 }}>{s.value}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{s.label}</Text>
          </div>
        </Col>
      ))}
    </Row>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PortalDashboard: React.FC = () => {
  const partners = [
    'Co-opBank', 'Vietcombank', 'BIDV', 'HD SAISON', 'VPBank',
    'TPBank', 'Agribank', 'MB Bank', 'Techcombank', 'SHB',
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO BANNER
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, var(--primary-subtle) 0%, #eef4ff 50%, ${'#d8fae5'}60 100%)`,
        padding: '60px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 320, height: 320,
          borderRadius: '50%', background: `${'#b6f0ce'}30`, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 200, height: 200,
          borderRadius: '50%', background: `${'#7ce2aa'}20`, pointerEvents: 'none',
        }} />

        <Row gutter={[40, 40]} align="middle">
          {/* Left: Text content */}
          <Col xs={24} lg={13}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>

              {/* Badge TCTD */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: `var(--primary)15`,
                border: `1px solid ${'#b6f0ce'}`,
                borderRadius: 9999,
                padding: '4px 14px',
                width: 'fit-content',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-hover)', letterSpacing: '0.04em' }}>
                  CỔNG ĐIỆN TỬ DÀNH CHO TỔ CHỨC TÍN DỤNG
                </span>
              </div>

              <div>
                <Title style={{
                  margin: '0 0 8px',
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1.25,
                  fontFamily: 'var(--font-sans, inherit)',
                }}>
                  Trung tâm Thông tin tín dụng CIC:{' '}
                  <span style={{ color: 'var(--primary-hover)' }}>Cầu nối Tín dụng Quốc gia</span>
                </Title>
                <Text style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Cổng gửi và khai thác báo cáo tín dụng dành cho các Tổ chức Tín dụng thành viên CIC.
                </Text>
              </div>

              <Space direction="vertical" size={16}>
                <UspItem
                  icon={<DatabaseOutlined />}
                  title="Kho dữ liệu lớn"
                  desc="Thu thập và xử lý thông tin tín dụng từ hơn 1.200 tổ chức tài chính trên toàn quốc."
                />
                <UspItem
                  icon={<CheckCircleOutlined />}
                  title="Đo lường Uy tín"
                  desc="Cung cấp Báo cáo và Điểm Tín dụng để đánh giá độ tin cậy, khả năng trả nợ."
                />
                <UspItem
                  icon={<ApartmentOutlined />}
                  title="Cầu nối Thị trường"
                  desc="Kết nối người vay và tổ chức tín dụng, giảm thiểu rủi ro và tăng khả năng tiếp cận vốn."
                />
              </Space>

              <Space size={12} wrap>
                <Link href="/auth/login">
                  <Button
                    type="primary"
                    size="large"
                    icon={<LoginOutlined />}
                    style={{
                      borderRadius: 9999,
                      fontWeight: 700,
                      paddingInline: 32,
                      height: 46,
                      fontSize: 15,
                      background: 'var(--primary-hover)',
                      borderColor: 'var(--primary-hover)',
                      boxShadow: `0 4px 14px var(--primary)40`,
                    }}
                  >
                    Đăng nhập Portal
                  </Button>
                </Link>
                <Button
                  size="large"
                  style={{
                    borderRadius: 9999,
                    fontWeight: 600,
                    paddingInline: 24,
                    height: 46,
                    borderColor: '#7ce2aa',
                    color: 'var(--primary-hover)',
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </Space>
            </Space>
          </Col>

          {/* Right: Stat chips + Credit Score */}
          <Col xs={24} lg={11}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              position: 'relative',
            }}>
              {/* Stat chips row */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { value: '+130 TRIỆU', label: 'Hồ sơ Tín dụng' },
                  { value: '+1.200', label: 'Tổ chức Tài chính' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 20px',
                    boxShadow: 'var(--elevation-2)',
                    textAlign: 'center',
                    minWidth: 130,
                  }}>
                    <Text strong style={{ fontSize: 20, color: 'var(--primary-hover)', display: 'block', fontWeight: 800 }}>
                      {s.value}
                    </Text>
                    <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</Text>
                  </div>
                ))}
              </div>

              {/* Credit Score Card */}
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 28px',
                boxShadow: 'var(--elevation-3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                maxWidth: 300,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--success)',
                  }} />
                  <Text strong style={{ fontSize: 11, color: 'var(--primary-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Đánh giá điểm tín dụng
                  </Text>
                </div>
                <Text style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  Điểm tín dụng của khách hàng cao hơn 65% tất cả khách hàng cá nhân được chấm điểm trong cơ sở dữ liệu CIC.
                </Text>
                <CreditScoreDisplay score={821} />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — DỊCH VỤ CIC
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#f8f9ff',
        padding: '64px 80px',
      }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Text style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 12,
          }}>
            DỊCH VỤ THÔNG TIN TÍN DỤNG CỦA CIC
          </Text>
          <Title level={2} style={{ margin: '0 0 12px', fontWeight: 800, color: 'var(--text)', fontSize: 32 }}>
            Minh bạch dữ liệu – Quyết định an toàn
          </Title>
          <Paragraph style={{
            color: 'var(--text-muted)',
            fontSize: 14,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Các nhóm giải pháp được thiết kế tương ứng với hành trình của từng đối tượng sử dụng nhằm đảm bảo mọi quyết định tín dụng đều dựa trên dữ liệu chính xác và thời gian thực.
          </Paragraph>
        </div>

        {/* 4 Service Cards */}
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} xl={6}>
            <ServiceCard
              num="01"
              category="CÁ NHÂN"
              title="Báo cáo Tín dụng & Quản lý Uy tín"
              desc="Dịch vụ giúp bạn chủ động kiểm soát lịch sử tín dụng, cải thiện điểm số và chứng minh năng lực tài chính trước các tổ chức cho vay."
              bullets={[
                'Báo cáo tín dụng chi tiết, chuẩn hóa theo CIC',
                'Điểm tín dụng cập nhật theo thời gian thực',
                'Khuyến nghị nâng cao xếp hạng uy tín',
              ]}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ServiceCard
              num="02"
              category="CÁ NHÂN & DOANH NGHIỆP"
              title="Tra cứu nợ & kết nối nhu cầu vốn"
              desc="Xác thực nghĩa vụ tài chính nhanh chóng, loại bỏ vướng mắc khi vay vốn và kết nối trực tiếp tới TCTD phù hợp."
              bullets={[
                'Kiểm tra nợ quá hạn, dư nợ hiện hữu',
                'Đăng ký nhu cầu vay và nhận tư vấn tức thì',
                'Bảo mật dữ liệu nhiều lớp, chuẩn NHNN',
              ]}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ServiceCard
              num="03"
              category="TỔ CHỨC TÀI CHÍNH"
              title="Giải pháp cho Tổ chức Tài chính"
              desc="Hệ thống dữ liệu tập trung hỗ trợ thẩm định chuẩn xác, cảnh báo sớm rủi ro và tối ưu danh mục tín dụng."
              bullets={[
                'Chấm điểm tín dụng doanh nghiệp và cá nhân',
                'Tập hợp tín hiệu cảnh báo sớm',
                'Giao diện quản trị linh hoạt, dễ tích hợp',
              ]}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <ServiceCard
              num="04"
              category="DOANH NGHIỆP"
              title="Giải pháp cho Doanh nghiệp"
              desc="Xếp hạng tín dụng chính thức giúp doanh nghiệp nâng hạng tín nhiệm, mở rộng hạn mức và thương thảo ưu đãi vốn."
              bullets={[
                'Xếp hạng tín dụng độc lập, khách quan',
                'Gia tăng độ tin cậy trong đàm phán',
                'Hồ sơ số hóa phục vụ gọi vốn và M&A',
              ]}
            />
          </Col>
        </Row>

        {/* CTA row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 36 }}>
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: 9999, fontWeight: 700, paddingInline: 28, height: 44 }}
          >
            Thông tin tín dụng
          </Button>
          <Button
            size="large"
            style={{
              borderRadius: 9999, fontWeight: 600, paddingInline: 24, height: 44,
              borderColor: 'var(--color-primary-400)', color: 'var(--primary-hover)',
            }}
          >
            Xếp hạng tín dụng
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — ACTION BANNERS (2 cột gradient)
      ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: '48px 80px', background: '#ffffff' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <ActionBanner
              tabs={['Dành cho TCTD', 'Đăng nhập Portal']}
              activeTab="Đăng nhập Portal"
              heading="CỔNG GỬI VÀ KHAI THÁC BÁO CÁO TÍN DỤNG"
              stats={[
                { value: '+1.200 TCTD', label: 'Thành viên kết nối' },
                { value: '100%', label: 'Hệ thống trực tuyến 24/7' },
              ]}
              gradient={`linear-gradient(135deg, ${'#184c37'} 0%, ${'#0f2f22'} 100%)`}
            />
          </Col>
          <Col xs={24} md={12}>
            <ActionBanner
              tabs={['Hỗ trợ kỹ thuật', 'Liên hệ CIC']}
              activeTab="Liên hệ CIC"
              heading="HỖ TRỢ VẬN HÀNH & TƯ VẤN NGHIỆP VỤ 24/7"
              stats={[
                { value: '1800 585891', label: 'Hotline miễn phí' },
                { value: 'T2–T6', label: '8h–17h làm việc' },
              ]}
              gradient={`linear-gradient(135deg, #0050b3 0%, #003a87 50%, #002766 100%)`}
            />
          </Col>
        </Row>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — ĐỐI TÁC CHIẾN LƯỢC
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#f8f9ff',
        padding: '56px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Text style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 12,
          }}>
            ĐỐI TÁC CHIẾN LƯỢC
          </Text>
          <Title level={2} style={{ margin: '0 0 12px', fontWeight: 800, color: 'var(--text)', fontSize: 28 }}>
            Nền tảng tín dụng quốc gia được tin dùng
          </Title>
          <Paragraph style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Hệ thống CIC hiện kết nối đồng bộ với toàn bộ tổ chức tín dụng thuộc Ngân hàng Nhà nước.
          </Paragraph>
        </div>

        {/* Partner pills — scrollable row */}
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {partners.map(name => (
            <div key={name} style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 24px',
              boxShadow: 'var(--elevation-1)',
              border: `1px solid var(--color-neutral-100)`,
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--text)',
              cursor: 'default',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
              className="partner-pill"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — APP DOWNLOAD BANNER
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(90deg, ${'#133e2d'} 0%, ${'#0f2f22'} 100%)`,
        padding: '24px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div>
          <Text strong style={{ color: '#ffffff', fontSize: 17, display: 'block', fontWeight: 700 }}>
            Tải ứng dụng CIC Credit Info
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            Quản lý tín dụng mọi lúc mọi nơi
          </Text>
        </div>
        <Space size={12}>
          {[
            { icon: <AppleOutlined />, label: 'App Store' },
            { icon: <AndroidOutlined />, label: 'Google Play' },
          ].map(({ icon, label }) => (
            <Button
              key={label}
              size="large"
              icon={icon}
              style={{
                borderRadius: 9999,
                fontWeight: 700,
                paddingInline: 20,
                height: 40,
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                color: '#ffffff',
              }}
            >
              {label}
            </Button>
          ))}
        </Space>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — BRAND VALUE
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#ffffff',
        padding: '64px 80px',
      }}>
        <Row gutter={[48, 32]} align="middle">
          {/* Left: brand description */}
          <Col xs={24} md={12}>
            <div style={{
              background: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              border: `1px solid var(--color-neutral-100)`,
            }}>
              <Title level={3} style={{ margin: '0 0 16px', fontWeight: 800, color: 'var(--text)', fontSize: 22 }}>
                CIC – Hơn cả một trung tâm thông tin
              </Title>
              <Paragraph style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                CIC là nền tảng thông tin tín dụng quốc gia, góp phần thúc đẩy tính minh bạch và an toàn cho thị trường tài chính Việt Nam. Với vai trò kết nối và cung cấp thông tin tín dụng, CIC hỗ trợ hiệu quả cho cả khách hàng vay và các tổ chức tín dụng trong quá trình tiếp cận và quản lý nguồn vốn.
              </Paragraph>
            </div>
          </Col>

          {/* Right: 2 audience cards */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {[
                {
                  title: 'Khách hàng cá nhân',
                  desc: 'Chủ động theo dõi báo cáo, cải thiện điểm tín dụng và nhận tư vấn phù hợp để tiếp cận các gói vay mong muốn.',
                  icon: <CheckCircleOutlined />,
                  color: 'var(--success)',
                },
                {
                  title: 'Tổ chức tín dụng',
                  desc: 'Tận dụng kho dữ liệu tập trung, công cụ cảnh báo sớm và chấm điểm tín dụng nhằm giảm thiểu rủi ro và tối ưu danh mục.',
                  icon: <ApartmentOutlined />,
                  color: 'var(--primary)',
                },
              ].map(card => (
                <div key={card.title} style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  border: `1px solid var(--color-neutral-100)`,
                  boxShadow: 'var(--elevation-1)',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  transition: 'all 0.2s',
                }}
                  className="brand-value-card"
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-lg)',
                    background: `${card.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    fontSize: 18,
                    flexShrink: 0,
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 15, color: 'var(--text)', display: 'block', marginBottom: 4 }}>
                      {card.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {card.desc}
                    </Text>
                  </div>
                  <ArrowRightOutlined style={{ color: 'var(--text-subtle)', marginTop: 10, flexShrink: 0 }} className="brand-arrow" />
                </div>
              ))}
            </Space>
          </Col>
        </Row>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER — THÔNG TIN LIÊN HỆ CIC
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{
        background: `linear-gradient(135deg, #1a2b5e 0%, #0f1d45 100%)`,
        padding: '48px 80px 32px',
        color: '#ffffff',
      }}>
        <Row gutter={[40, 40]}>
          {/* Logo + giới thiệu */}
          <Col xs={24} md={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: `linear-gradient(135deg, var(--color-primary-400), var(--primary-hover))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15, color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
              }}>
                CIC
              </div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ color: '#ff6b6b', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  NGÂN HÀNG NHÀ NƯỚC VIỆT NAM
                </div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 13 }}>
                  TRUNG TÂM THÔNG TIN TÍN DỤNG QUỐC GIA VIỆT NAM
                </div>
              </div>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.7, display: 'block', maxWidth: 340 }}>
              CIC là nền tảng thông tin tín dụng quốc gia, kết nối hơn 1.200 tổ chức tài chính, cung cấp dữ liệu tín dụng chính xác và an toàn cho thị trường tài chính Việt Nam.
            </Text>
          </Col>

          {/* Thông tin liên hệ */}
          <Col xs={24} md={8}>
            <Text strong style={{ color: '#ffffff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 20 }}>
              THÔNG TIN LIÊN HỆ
            </Text>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              {[
                {
                  icon: <PhoneOutlined />,
                  lines: ['Tổng đài miễn phí: 1800 585891', '+ 024.32939015 · + 024.33515102'],
                },
                {
                  icon: <MailOutlined />,
                  lines: ['htkh@creditinfo.org.vn'],
                },
                {
                  icon: <EnvironmentOutlined />,
                  lines: ['Số 45 Lý Thường Kiệt, P. Cửa Nam, Hà Nội', 'CN: Tầng L1-01+02, TTTM Pearl Center, TP.HCM'],
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.8)', fontSize: 14, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    {item.lines.map((line, j) => (
                      <div key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </Space>
          </Col>

          {/* Links nhanh */}
          <Col xs={24} md={6}>
            <Text strong style={{ color: '#ffffff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 20 }}>
              LIÊN KẾT
            </Text>
            <Space direction="vertical" size={10}>
              {[
                { label: 'Đăng nhập Portal', href: '/login', icon: <LoginOutlined /> },
                { label: 'Hướng dẫn sử dụng', href: '#', icon: <FileProtectOutlined /> },
                { label: 'Gửi yêu cầu hỗ trợ', href: '#', icon: <CustomerServiceOutlined /> },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'rgba(255,255,255,0.7)', fontSize: 13,
                  transition: 'color 0.2s',
                }}
                  className="footer-link"
                >
                  <span style={{ fontSize: 12, color: '#7ce2aa' }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>
        </Row>

        {/* Divider + copyright */}
        <div style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            © {new Date().getFullYear()} Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC) – Ngân hàng Nhà nước Việt Nam
          </Text>
          <Space size={20}>
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Sơ đồ trang'].map(t => (
              <Link key={t} href="#" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{t}</Link>
            ))}
          </Space>
        </div>
      </footer>

      {/* ─── Global styles ─── */}
      <style jsx global>{`
        .service-card:hover {
          box-shadow: ${'var(--elevation-3)'} !important;
          border-color: ${'#b6f0ce'} !important;
          transform: translateY(-2px);
        }
        .partner-pill:hover {
          box-shadow: var(--elevation-1) !important;
          border-color: ${'#b6f0ce'} !important;
          color: var(--primary-hover) !important;
        }
        .brand-value-card:hover {
          box-shadow: var(--elevation-2) !important;
          border-color: ${'#b6f0ce'} !important;
        }
        .brand-value-card:hover .brand-arrow {
          color: var(--primary) !important;
          transform: translateX(4px);
        }
        .footer-link:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default PortalDashboard;

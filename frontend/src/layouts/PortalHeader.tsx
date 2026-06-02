'use client';

import React from 'react';
import { Space, Typography, Avatar, Badge, Dropdown, message } from 'antd';
import {
  BellOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  GlobalOutlined,
  DownOutlined
} from '@ant-design/icons';
import { colors, shadows } from '../design-system';

const { Text } = Typography;

interface PortalHeaderProps {
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ currentLang = 'VI', onLangChange }) => {
  const userMenu = {
    items: [
      { key: 'profile', label: 'Thông tin tài khoản', icon: <UserOutlined /> },
      { key: 'settings', label: 'Cài đặt cổng dịch vụ' },
      { type: 'divider' as const },
      { key: 'logout', label: 'Đăng xuất', danger: true }
    ],
    onClick: ({ key }: { key: string }) => {
      message.info(`Đang chuyển hướng chức năng: ${key}`);
    }
  };

  const langMenu = {
    items: [
      { key: 'VI', label: 'Tiếng Việt (VI)' },
      { key: 'EN', label: 'English (EN)' }
    ],
    onClick: ({ key }: { key: string }) => {
      if (onLangChange) onLangChange(key);
      else message.success(`Đã chuyển đổi sang ngôn ngữ: ${key}`);
    }
  };

  return (
    <header style={{
      background: '#ffffff',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 70,
      borderBottom: `1px solid ${colors.border.split}`,
      boxShadow: shadows.xs,
      position: 'relative',
      zIndex: 10,
      userSelect: 'none'
    }}>
      {/* ─── CỤM LOGO VÀ THƯƠNG HIỆU ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Logo Shield cách điệu của CIC */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0, 80, 179, 0.25)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: -0.5,
          border: '2px solid #ffffff'
        }}>
          CIC
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <Text style={{
            color: '#e53e3e',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            NGÂN HÀNG NHÀ NƯỚC VIỆT NAM
          </Text>
          <Text style={{
            color: colors.subsystem.portal,
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '-0.01em'
          }}>
            TRUNG TÂM THÔNG TIN TÍN DỤNG QUỐC GIA VIỆT NAM (CIC)
          </Text>
        </div>
      </div>

      {/* ─── CỤM TIỆN ÍCH PHẢI ─────────────────────────────────────────────── */}
      <Space size={20} align="center">
        
        {/* Chọn ngôn ngữ */}
        <Dropdown menu={langMenu} trigger={['click']} placement="bottomRight">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            background: colors.neutral[100],
            fontSize: 12,
            fontWeight: 600,
            color: colors.text.secondary
          }}>
            <GlobalOutlined style={{ fontSize: 14 }} />
            <span>{currentLang}</span>
            <DownOutlined style={{ fontSize: 9 }} />
          </div>
        </Dropdown>

        {/* Chuông thông báo */}
        <Badge dot offset={[-2, 2]} color={colors.error.base}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: colors.neutral[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: colors.text.secondary,
            transition: 'all 0.2s'
          }}
          className="header-icon-btn"
          onClick={() => message.info('Không có thông báo mới')}
          >
            <BellOutlined style={{ fontSize: 18 }} />
          </div>
        </Badge>

        {/* Nút Hỗ trợ ? */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: colors.neutral[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: colors.text.secondary,
          transition: 'all 0.2s'
        }}
        className="header-icon-btn"
        onClick={() => message.info('Đang tải tài liệu hướng dẫn vận hành Portal')}
        >
          <QuestionCircleOutlined style={{ fontSize: 18 }} />
        </div>

        {/* Cụm Hotline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          padding: '6px 14px',
          borderRadius: 20,
          color: '#e53e3e',
          fontWeight: 700,
          fontSize: 13
        }}>
          <PhoneOutlined />
          <span>1800585891</span>
        </div>

        {/* Thông tin tài khoản người dùng */}
        <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
          <Space style={{ cursor: 'pointer', paddingLeft: 4 }} size={8}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ backgroundColor: colors.subsystem.portal }} 
              size={36}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: colors.text.primary }}>Nguyễn Văn A</span>
              <span style={{ fontSize: 10, color: colors.text.secondary }}>Cán bộ gửi — BIDV</span>
            </div>
            <DownOutlined style={{ fontSize: 10, color: colors.text.secondary }} />
          </Space>
        </Dropdown>
      </Space>

      <style jsx global>{`
        .header-icon-btn:hover {
          background-color: ${colors.neutral[200]} !important;
          color: ${colors.text.primary} !important;
        }
      `}</style>
    </header>
  );
};

export default PortalHeader;

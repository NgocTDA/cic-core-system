import React from 'react';
import { Layout, Button, Space, Typography, Avatar, Badge, Tooltip, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  PlusOutlined,
  SettingOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHeaderContext } from '../context/HeaderContext';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Tổng quan hệ thống',
  '/kkn-dashboard': 'Dashboard',
  '/notification-template': 'Quản lý mẫu thông báo',
  '/notifications': 'Thông báo hệ thống',
  '/variable-registry': 'Danh mục biến dùng chung',
  '/analytics': 'Phân tích & Thống kê',
  '/projects': 'Danh sách dự án',
  '/settings': 'Cài đặt hệ thống',
};

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onCollapse, isMobile }) => {
  const pathname = usePathname();
  const { pageActions, pageTitle } = useHeaderContext();

  const getPageTitle = () => {
    const path = pathname || '/';
    const matchedPath = Object.keys(ROUTE_TITLES).find(p => path.startsWith(p) && p !== '/') || (path === '/' ? '/' : '');
    return ROUTE_TITLES[matchedPath] || 'CIC Core System';
  };

  // Page-set title takes priority over route-based title
  const displayTitle = pageTitle || getPageTitle();

  // Find the "Thêm mới" action registered by the current page
  const addAction = pageActions.find(a => a.key === 'add');

  // Common actions for all data-table pages
  const hasTableActions = pageActions.length > 0;

  return (
    <Header style={{
      background: '#fff',
      padding: isMobile ? '0 8px' : '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 64,
      lineHeight: '64px',
      boxShadow: '0 2px 8px #f0f1f2',
      zIndex: 1
    }}>
      <Space size="middle">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        {!isMobile && (
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            {displayTitle}
          </Title>
        )}
      </Space>

      <Space size="small">
        {/* Page-specific "Thêm mới" button — only rendered if a page registers one */}
        {addAction && !isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addAction.onClick}
          >
            {addAction.label}
          </Button>
        )}

        {/* Common table actions — rendered whenever a page has registered actions */}
        {hasTableActions && !isMobile && (
          <>
            <Tooltip title="Cấu hình hiển thị cột">
              <Button
                icon={<SettingOutlined />}
                onClick={() => message.info('Tính năng đang phát triển')}
              >
                Cấu hình hiển thị
              </Button>
            </Tooltip>
            <Tooltip title="Xuất dữ liệu ra file Excel">
              <Button
                icon={<FileExcelOutlined />}
                onClick={() => message.info('Tính năng đang phát triển')}
                style={{ color: '#389e0d', borderColor: '#389e0d' }}
              >
                Xuất Excel
              </Button>
            </Tooltip>
          </>
        )}

        {/* Mobile: collapse extra actions into the Add button */}
        {addAction && isMobile && (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={addAction.onClick}
          />
        )}

        {/* Always visible: notification bell */}
        <Link href="/notifications" style={{ color: 'inherit' }}>
          <Badge dot offset={[-2, 5]}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
        </Link>

        {/* Always visible: user avatar */}
        <Space size="small" style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
          {!isMobile && <span style={{ fontWeight: 500 }}>Admin</span>}
        </Space>
      </Space>
    </Header>
  );
};

export default AppHeader;


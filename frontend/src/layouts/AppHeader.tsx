import React from 'react';
import { Layout, Button, Space, Typography, Avatar, Badge, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHeaderContext } from '../context/HeaderContext';
import { colors, layout, radius, shadows, size, spacing, typography, zIndex } from '../design-system';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Tổng quan hệ thống',
  '/kkn-dashboard': 'Dashboard kênh kết nối',
  '/ops-support/notification-template': 'Quản lý mẫu thông báo',
  '/ops-support/notifications': 'Tra cứu thông báo',
  '/ops-support/variable-registry': 'Danh mục biến thông báo',
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

  const visibleActions = pageActions.filter((action) => !action.hidden);
  const primaryAction = visibleActions.find((action) => action.key === 'add' || action.type === 'primary');
  const secondaryActions = visibleActions.filter((action) => action !== primaryAction);
  const headerActionGap = Number.parseInt(isMobile ? spacing[1] : spacing[3], 10);
  const userInfoGap = Number.parseInt(spacing[2], 10);

  return (
    <Header style={{
      background: colors.bg.container,
      padding: isMobile ? '0 8px' : '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: layout.headerHeight,
      lineHeight: 'normal',
      boxShadow: shadows.sm,
      position: 'relative',
      zIndex: zIndex.raised,
    }}>
      <Space size="middle">
        {isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{ fontSize: '16px', width: layout.headerHeight, height: layout.headerHeight }}
          />
        )}
        {!isMobile && (
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            {displayTitle}
          </Title>
        )}
      </Space>

      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: headerActionGap,
        }}
      >
        {/* Page-specific primary button */}
        {primaryAction && !isMobile && (
          <Button
            type="primary"
            icon={primaryAction.icon || <PlusOutlined />}
            onClick={primaryAction.onClick}
            danger={primaryAction.danger}
            ghost={primaryAction.ghost}
          >
            {primaryAction.label}
          </Button>
        )}

        {secondaryActions.map((action) => (
          !isMobile ? (
            <Tooltip key={action.key} title={action.label}>
              <Button
                type={action.type === 'primary' ? 'default' : action.type}
                icon={action.icon}
                onClick={action.onClick}
                danger={action.danger}
                ghost={action.ghost}
              >
                {action.label}
              </Button>
            </Tooltip>
          ) : null
        ))}

        {/* Mobile: show primary action as icon button */}
        {primaryAction && isMobile && (
          <Button
            type="primary"
            shape="circle"
            icon={primaryAction.icon || <PlusOutlined />}
            onClick={primaryAction.onClick}
            danger={primaryAction.danger}
            ghost={primaryAction.ghost}
          />
        )}

        {/* Always visible: notification bell */}
        <Link
          href="/ops-support/notifications"
          aria-label="Thông báo"
          style={{
            color: 'inherit',
            width: size.lg,
            height: size.lg,
            borderRadius: radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[2],
            lineHeight: 1,
          }}
        >
          <Badge dot offset={[-2, 5]} style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: size.md,
                height: size.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              <BellOutlined style={{ fontSize: typography.fontSize.lg, cursor: 'pointer', display: 'block' }} />
            </span>
          </Badge>
        </Link>

        {/* Always visible: user avatar */}
        <Space size={userInfoGap} align="center" style={{ cursor: 'pointer', paddingLeft: spacing[1], height: size.lg }}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: colors.primary[500] }} />
          {!isMobile && <span style={{ fontWeight: 500 }}>Admin</span>}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;


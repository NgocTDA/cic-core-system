'use client';

import React from 'react';
import { Menu, ConfigProvider } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUB_SYSTEMS, MenuItem } from '../config/navigation';
import { colors, radius } from '../design-system';

const PortalMenu: React.FC = () => {
  const pathname = usePathname();

  // Tìm phân hệ Web Portal trong hệ thống navigation
  const portalSubsystem = SUB_SYSTEMS.find(sys => sys.id === 'web-portal');
  const menuItems = portalSubsystem ? portalSubsystem.menuItems : [];

  // Đệ quy chuyển đổi MenuItem thành định dạng Menu của Ant Design hỗ trợ 3 cấp
  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map(item => {
      if (item.type === 'divider') {
        return { type: 'divider', key: item.key };
      }

      // Nhãn của Menu Item
      const label = (
        <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.01em' }}>
          {item.label}
        </span>
      );

      // Nếu có menu con (cấp 2 hoặc cấp 3)
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: label,
          children: renderMenuItems(item.children),
        };
      }

      // Menu lá (cấp cuối) có chứa đường dẫn liên kết
      return {
        key: item.path || item.key,
        icon: item.icon,
        label: item.path && item.path !== '#'
          ? <Link href={item.path}>{label}</Link>
          : label,
      };
    });
  };

  const menuData = renderMenuItems(menuItems);

  // Lựa chọn active key dựa trên đường dẫn hiện tại
  const selectedKeys = pathname ? [pathname] : [];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemSelectedColor: colors.subsystem.portal,
            horizontalItemHoverColor: colors.subsystem.portal,
            itemHoverColor: colors.subsystem.portal,
            itemSelectedColor: colors.subsystem.portal,
            popupBg: '#ffffff',
          },
        },
      }}
    >
      <nav style={{
        background: '#f8fafc',
        borderBottom: `1px solid ${colors.border.split}`,
        padding: '0 24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        zIndex: 9
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={menuData}
            style={{
              background: 'transparent',
              borderBottom: 'none',
              height: 48,
              lineHeight: '48px',
            }}
            popupClassName="portal-submenu-popup"
          />
        </div>

        {/* Custom CSS để tinh chỉnh giao diện menu đa cấp chuẩn Premium */}
        <style jsx global>{`
          .portal-submenu-popup .ant-menu-submenu-title {
            border-radius: ${radius.md} !important;
          }
          .portal-submenu-popup .ant-menu-item {
            border-radius: ${radius.md} !important;
            margin: 4px 0 !important;
          }
          .portal-submenu-popup .ant-menu-item-selected {
            background-color: ${colors.primary[50]} !important;
            color: ${colors.subsystem.portal} !important;
            font-weight: 600 !important;
          }
        `}</style>
      </nav>
    </ConfigProvider>
  );
};

export default PortalMenu;

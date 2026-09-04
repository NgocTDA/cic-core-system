import React from 'react';
import { Layout, Menu, Typography, Badge, ConfigProvider, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSubSystem } from '../context/SubSystemContext';
import { findMenuPathMatch, SHARED_MENU, MenuItem } from '../config/navigation';
import SubSystemSwitcher from '../components/SubSystemSwitcher';
import { useMenuBadges } from '../hooks/useMenuBadges';
import { colors, typography, zIndex } from '../design-system';

const { Sider } = Layout;
const { Text } = Typography;

const BADGE_COLOR: Record<string, string> = {
  purple: colors.subsystem.ops,
  teal:   colors.subsystem.governance,
  orange: colors.subsystem.kkn,
  gray:   colors.neutral[500],
};

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onCollapse, isMobile }) => {
  const pathname = usePathname();
  const { activeSubSystem } = useSubSystem();
  const badgeCounts = useMenuBadges();
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const routeMatch = findMenuPathMatch(pathname);
  const selectedMenuPath = routeMatch?.matchedPath || pathname || '/';

  const getParentKeys = React.useCallback((items: MenuItem[], targetPath: string): string[] => {
    for (const item of items) {
      if (item.path === targetPath) {
        return [];
      }
      if (item.children) {
        const parents = getParentKeys(item.children, targetPath);
        if (parents !== null && (parents.length > 0 || item.children.some(c => c.path === targetPath))) {
          return [item.key, ...parents];
        }
      }
    }
    return [];
  }, []);

  React.useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else if (selectedMenuPath) {
      const allMenuItems = [...activeSubSystem.menuItems, ...SHARED_MENU];
      const parents = getParentKeys(allMenuItems, selectedMenuPath);
      if (parents.length > 0) {
        setOpenKeys(prev => {
          const isAlreadyOpen = parents.every(p => prev.includes(p));
          if (isAlreadyOpen) return prev;
          return Array.from(new Set([...prev, ...parents]));
        });
      }
    }
  }, [selectedMenuPath, activeSubSystem, collapsed, getParentKeys]);

  const onOpenChange = (keys: string[]) => {
    if (collapsed) {
      setOpenKeys(keys);
      return;
    }

    const rootSubmenuKeys = [
      ...activeSubSystem.menuItems.filter(i => i.children).map(i => i.key),
      ...SHARED_MENU.filter(i => i.children).map(i => i.key),
    ];

    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map(item => {
      if (item.type === 'divider') {
        return {
          type: 'divider',
          key: item.key || Math.random().toString(),
          label: !collapsed && (
            <Text
              style={{
                color: colors.sidebar.textSecond,
                fontSize: typography.fontSize.xs,
                padding: '8px 16px',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {item.label}
            </Text>
          ),
        };
      }

      const dynamicCount = item.badgeDynamic ? (badgeCounts as any)[item.badgeDynamic] : null;
      const hasBadge = item.badge || (dynamicCount !== null && dynamicCount !== undefined);

      const labelContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontWeight: item.highlight ? typography.fontWeight.semibold : typography.fontWeight.regular }}>
            {item.label}
          </span>
          {hasBadge && !collapsed && (
            <Badge
              count={dynamicCount !== null ? dynamicCount : item.badge}
              style={{
                backgroundColor: item.badgeColor ? (BADGE_COLOR[item.badgeColor] ?? colors.error.base) : colors.error.base,
                fontSize: 10,
                minWidth: 16,
                height: 16,
                lineHeight: '16px',
              }}
            />
          )}
        </div>
      );

      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: labelContent,
          children: renderMenuItems(item.children),
        };
      }

      return {
        key: item.path || item.key,
        icon: item.icon,
        label: item.path && item.path !== '#'
          ? <Link href={item.path}>{labelContent}</Link>
          : labelContent,
      };
    });
  };

  const activeMenu = [
    ...renderMenuItems(activeSubSystem.menuItems),
    ...(SHARED_MENU.length > 0
      ? [{ type: 'divider' as const, key: 'shared-divider' }, ...renderMenuItems(SHARED_MENU)]
      : []),
  ];

  return (
    <Sider
      theme="dark"
      width={256}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: colors.sidebar.bg,
        height: '100vh',
        position: isMobile ? 'static' : 'sticky',
        top: 0,
        left: 0,
        zIndex: zIndex.sticky,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <SubSystemSwitcher mode="header" collapsed={collapsed} />
          {/* ConfigProvider scoped — selected item theo phong cách Hướng A (Left Indicator Bar + Subtle Tint) */}
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  darkItemSelectedBg: colors.sidebar.selectedBg,
                  darkItemSelectedColor: colors.text.inverse,
                  darkItemHoverBg: colors.sidebar.hoverBg,
                  darkItemHoverColor: colors.text.inverse,
                  darkItemColor: colors.sidebar.textSecond,
                },
              },
            }}
          >
            <div className="cic-sidebar-menu-wrapper">
              <Menu
                theme="dark"
                mode="inline"
                inlineCollapsed={collapsed}
                selectedKeys={[selectedMenuPath]}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={activeMenu}
                style={{ background: colors.sidebar.bg, borderRight: 0 }}
              />
            </div>
            <style jsx global>{`
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item-selected {
                position: relative;
                background-color: ${colors.sidebar.selectedBg} !important;
                font-weight: 600;
              }
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item-selected::before {
                content: '';
                position: absolute;
                left: 0;
                top: 6px;
                bottom: 6px;
                width: 3.5px;
                background-color: ${activeSubSystem.color};
                border-radius: 0 4px 4px 0;
              }
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item-selected .anticon {
                color: ${activeSubSystem.color} !important;
              }
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item-selected a {
                color: #ffffff !important;
              }
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item,
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-submenu-title {
                transition: background-color 150ms ease, color 150ms ease !important;
              }
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-item:hover,
              .cic-sidebar-menu-wrapper .ant-menu-dark .ant-menu-submenu-title:hover {
                background-color: ${colors.sidebar.hoverBg} !important;
                color: #ffffff !important;
              }
            `}</style>
          </ConfigProvider>
        </div>

        {/* Version Info Footer */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px 24px',
            borderTop: `1px solid ${colors.sidebar.divider}`,
            background: colors.sidebar.bgDeep,
            display: 'flex',
            flexDirection: collapsed ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: collapsed ? '12px' : '0px',
          }}
        >
          {collapsed ? (
            <>
              <Button
                type="text"
                icon={<RightOutlined style={{ color: colors.sidebar.textSecond }} />}
                onClick={() => onCollapse(!collapsed)}
                style={{ padding: 0, height: 'auto' }}
              />
              <Text style={{ color: colors.sidebar.textSecond, fontSize: 10 }}>v1.1</Text>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ color: colors.sidebar.text, fontSize: 12 }}>CIC Core System</Text>
                <Text style={{ color: colors.sidebar.textSecond, fontSize: 10 }}>Phiên bản 1.1.0-alpha</Text>
              </div>
              <Button
                type="text"
                icon={<LeftOutlined style={{ color: colors.sidebar.textSecond }} />}
                onClick={() => onCollapse(!collapsed)}
                style={{ padding: 0, height: 'auto' }}
              />
            </>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AppSidebar;

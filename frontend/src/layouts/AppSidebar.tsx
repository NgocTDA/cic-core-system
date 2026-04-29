import React from 'react';
import { Layout, Menu, Typography, Badge, ConfigProvider } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSubSystem } from '../context/SubSystemContext';
import { SHARED_MENU, MenuItem } from '../config/navigation';
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

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, isMobile }) => {
  const pathname = usePathname();
  const { activeSubSystem } = useSubSystem();
  const badgeCounts = useMenuBadges();
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  const getParentKeys = (items: MenuItem[], targetPath: string): string[] => {
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
  };

  React.useEffect(() => {
    if (pathname && !collapsed) {
      const allMenuItems = [...activeSubSystem.menuItems, ...SHARED_MENU];
      const parents = getParentKeys(allMenuItems, pathname);
      if (parents.length > 0) {
        setOpenKeys(prev => {
          const isAlreadyOpen = parents.every(p => prev.includes(p));
          if (isAlreadyOpen) return prev;
          return Array.from(new Set([...prev, ...parents]));
        });
      }
    }
  }, [pathname, activeSubSystem, collapsed]);

  const onOpenChange = (keys: string[]) => {
    if (collapsed) return;

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
          {/* ConfigProvider scoped — selected item màu theo subsystem đang active */}
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  darkItemSelectedBg: activeSubSystem.color,
                  darkItemSelectedColor: colors.text.inverse,
                },
              },
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname || '/']}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              items={activeMenu}
              style={{ background: colors.sidebar.bg, borderRight: 0 }}
            />
          </ConfigProvider>
        </div>

        {/* Version Info Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${colors.sidebar.divider}`,
            textAlign: collapsed ? 'center' : 'left',
            background: colors.sidebar.bgDeep,
          }}
        >
          {collapsed ? (
            <Text style={{ color: colors.sidebar.textSecond, fontSize: 10 }}>v1.1</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: colors.sidebar.text, fontSize: 12 }}>CIC Core System</Text>
              <Text style={{ color: colors.sidebar.textSecond, fontSize: 10 }}>Phiên bản 1.1.0-alpha</Text>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AppSidebar;

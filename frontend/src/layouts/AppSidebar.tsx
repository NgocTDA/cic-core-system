import React from 'react';
import { Layout, Menu, Typography, Badge } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSubSystem } from '../context/SubSystemContext';
import { SHARED_MENU, MenuItem } from '../config/navigation';
import SubSystemSwitcher from '../components/SubSystemSwitcher';
import { useMenuBadges } from '../hooks/useMenuBadges';

const { Sider } = Layout;
const { Text } = Typography;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, isMobile }) => {
  const pathname = usePathname();
  const { activeSubSystem } = useSubSystem();
  const badgeCounts = useMenuBadges();

  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map(item => {
      if (item.type === 'divider') {
        return {
          type: 'divider',
          key: item.key || Math.random().toString(),
          label: !collapsed && <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 11, padding: '8px 16px', display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Text>
        };
      }

      const dynamicCount = item.badgeDynamic ? (badgeCounts as any)[item.badgeDynamic] : null;
      const hasBadge = item.badge || (dynamicCount !== null && dynamicCount !== undefined);

      const labelContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontWeight: item.highlight ? 600 : 400 }}>{item.label}</span>
          {hasBadge && !collapsed && (
            <Badge 
              count={dynamicCount !== null ? dynamicCount : item.badge} 
              style={{ 
                backgroundColor: item.badgeColor === 'purple' ? '#722ed1' : 
                               item.badgeColor === 'teal' ? '#13c2c2' : 
                               item.badgeColor === 'orange' ? '#fa8c16' :
                               item.badgeColor === 'gray' ? '#8c8c8c' : '#f5222d',
                fontSize: 10,
                minWidth: 16,
                height: 16,
                lineHeight: '16px'
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
          children: renderMenuItems(item.children)
        };
      }
      
      return {
        key: item.path || item.key,
        icon: item.icon,
        label: item.path && item.path !== '#' ? <Link href={item.path}>{labelContent}</Link> : labelContent,
      };
    });
  };

  const activeMenu = [
    ...renderMenuItems(activeSubSystem.menuItems),
    { type: 'divider', key: 'shared-divider' },
    ...renderMenuItems(SHARED_MENU)
  ];

  return (
    <Sider
      theme="dark"
      width={256}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: '#2e3035',
        height: '100vh',
        position: isMobile ? 'static' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <SubSystemSwitcher mode="header" collapsed={collapsed} />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname || '/']}
            items={activeMenu}
            style={{ background: '#2e3035', borderRight: 0 }}
          />
        </div>

        {/* Version Info Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: collapsed ? 'center' : 'left',
          background: '#1f2024'
        }}>
          {collapsed ? (
            <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 10 }}>v1.1</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12 }}>CIC Core System</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 10 }}>Phiên bản 1.1.0-alpha</Text>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AppSidebar;


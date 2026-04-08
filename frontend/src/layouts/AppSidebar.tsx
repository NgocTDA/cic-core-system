import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSubSystem } from '../context/SubSystemContext';
import { SHARED_MENU } from '../config/navigation';
import SubSystemSwitcher from '../components/SubSystemSwitcher';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, isMobile }) => {
  const pathname = usePathname();
  const { activeSubSystem } = useSubSystem();

  const renderMenuItems = (items: any[]): any[] => {
    return items.map(item => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenuItems(item.children)
        };
      }
      return {
        key: item.path || item.key,
        icon: item.icon,
        label: item.path && item.path !== '#' ? <Link href={item.path}>{item.label}</Link> : item.label,
      };
    });
  };

  const activeMenu = [
    ...renderMenuItems(activeSubSystem.menuItems),
    { type: 'divider' },
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


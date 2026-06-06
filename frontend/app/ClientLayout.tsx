'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Drawer, ConfigProvider } from 'antd';
import AppHeader from '@/layouts/AppHeader';
import AppSidebar from '@/layouts/AppSidebar';
import { useIsMobile } from '@/hooks/useIsMobile';
import { HeaderProvider } from '@/context/HeaderContext';
import { SubSystemProvider } from '@/context/SubSystemContext';
import { RoleProvider } from '@/context/RoleContext';
import { usePathname } from 'next/navigation';
import CommandPalette from '@/components/CommandPalette';
import viVN_ from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { antdTheme, colors } from '@/design-system';

const { Content } = Layout;

// Handing potential ESM/CJS interop for AntD locale
const baseLocale = (viVN_ as any).default || viVN_;
const viVN = {
    ...baseLocale,
    Pagination: {
        ...baseLocale.Pagination,
        jump_to: 'Đến trang',
        page: '',
    },
};

dayjs.locale('vi');

interface MainLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-collapse sidebar on mobile
    useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        }
    }, [isMobile]);

    const handleToggleCollapse = (val: boolean) => {
        setCollapsed(val);
    };

    if (!mounted) {
        return <div style={{ minHeight: '100vh', background: colors.bg.page }}>{children}</div>;
    }

    const isLandingPage = pathname === '/';
    const isPortalPage = pathname?.startsWith('/web-portal');

    return (
        <ConfigProvider
            locale={viVN}
            theme={antdTheme}
        >
            <SubSystemProvider>
                <RoleProvider>
                    <HeaderProvider>
                        <CommandPalette />
                        {isLandingPage || isPortalPage ? (
                            <div style={{ height: '100vh', overflow: 'hidden' }}>
                                {children}
                            </div>
                        ) : (
                            <Layout style={{ height: '100vh', overflow: 'hidden', background: colors.bg.page }}>
                                {isMobile ? (
                                    <Drawer
                                        placement="left"
                                        closable={false}
                                        onClose={() => setCollapsed(true)}
                                        open={!collapsed}
                                        styles={{ body: { padding: 0 } }}
                                        width={256}
                                    >
                                        <AppSidebar
                                            collapsed={false}
                                            onCollapse={handleToggleCollapse}
                                            isMobile={true}
                                        />
                                    </Drawer>
                                ) : (
                                    <AppSidebar
                                        collapsed={collapsed}
                                        onCollapse={handleToggleCollapse}
                                        isMobile={false}
                                    />
                                )}

                                <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <AppHeader
                                        collapsed={collapsed}
                                        onCollapse={handleToggleCollapse}
                                        isMobile={isMobile}
                                    />
                                    <Content style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isMobile ? 'auto' : 'hidden', background: colors.bg.page }}>
                                        {children}
                                    </Content>
                                </Layout>
                            </Layout>
                        )}
                    </HeaderProvider>
                </RoleProvider>
            </SubSystemProvider>
        </ConfigProvider>
    );
};

export default ClientLayout;

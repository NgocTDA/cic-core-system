'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Drawer, ConfigProvider } from 'antd';
import AppHeader from '@/layouts/AppHeader';
import AppSidebar from '@/layouts/AppSidebar';
import { useIsMobile } from '@/hooks/useIsMobile';
import { HeaderProvider } from '@/context/HeaderContext';
import { SubSystemProvider } from '@/context/SubSystemContext';
import { usePathname } from 'next/navigation';
import viVN_ from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const { Content } = Layout;

// Handing potential ESM/CJS interop for AntD locale
const baseLocale = (viVN_ as any).default || viVN_;
const viVN = {
    ...baseLocale,
    Pagination: {
        ...baseLocale.Pagination,
        jump_to: 'Đi tới',
        page: 'Trang',
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
        return <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>{children}</div>;
    }

    const isLandingPage = pathname === '/';

    return (
        <ConfigProvider
            locale={viVN}
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: 6,
                    controlHeight: 32,
                },
                components: {
                    Menu: {
                        darkItemSelectedBg: '#fa8c16',
                        darkItemSelectedColor: '#ffffff',
                    }
                }
            }}
        >
            <SubSystemProvider>
                <HeaderProvider>
                    {isLandingPage ? (
                        <div style={{ height: '100vh', overflow: 'hidden' }}>
                            {children}
                        </div>
                    ) : (
                        <Layout style={{ height: '100vh', overflow: 'hidden', background: '#f5f5f5' }}>
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
                                <Content style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isMobile ? 'auto' : 'hidden', transition: 'all 0.2s', background: '#f5f7fa' }}>
                                    {children}
                                </Content>
                            </Layout>
                        </Layout>
                    )}
                </HeaderProvider>
            </SubSystemProvider>
        </ConfigProvider>
    );
};

export default ClientLayout;

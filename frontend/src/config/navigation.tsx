import React from 'react';
import {
    DashboardOutlined,
    ApiOutlined,
    FolderOutlined,
    TableOutlined,
    FileTextOutlined,
    BellOutlined,
    BarChartOutlined,
    ProjectOutlined,
    SettingOutlined,
    DollarOutlined,
    TeamOutlined
} from '@ant-design/icons';

export interface MenuItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    path?: string;
}

export interface SubSystem {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    menuItems: MenuItem[];
}

export const SUB_SYSTEMS: SubSystem[] = [
    {
        id: 'kkn',
        name: 'Kênh kết nối (KKN)',
        icon: <ApiOutlined />,
        color: '#fa8c16',
        menuItems: [
            { key: 'kkn-dashboard', label: 'Dashboard KKN', icon: <DashboardOutlined />, path: '/kkn-dashboard' },
            {
                key: 'template-management',
                label: 'Quản lý mẫu',
                icon: <FolderOutlined />,
                children: [
                    { key: 'variable-registry', label: 'Danh mục biến', icon: <TableOutlined />, path: '/variable-registry' },
                    { key: 'notification-template', label: 'Mẫu thông báo', icon: <FileTextOutlined />, path: '/notification-template' },
                ]
            },
            { key: 'notifications', label: 'Thông báo', icon: <BellOutlined />, path: '/notifications' },
        ]
    },
    {
        id: 'data-collection',
        name: 'Thu thập, xử lý dữ liệu',
        icon: <TableOutlined />,
        color: '#1890ff',
        menuItems: [
            { key: 'data-collection-dashboard', label: 'Dashboard Thu thập', icon: <DashboardOutlined />, path: '/data-collection/dashboard' },
        ]
    },
    {
        id: 'product-mgmt',
        name: 'Quản lý, tạo lập sản phẩm',
        icon: <FolderOutlined />,
        color: '#52c41a',
        menuItems: [
            { key: 'product-mgmt-dashboard', label: 'Dashboard Sản phẩm', icon: <DashboardOutlined />, path: '/product-mgmt/dashboard' },
        ]
    },
    {
        id: 'ops-support',
        name: 'Hỗ trợ vận hành',
        icon: <TeamOutlined />,
        color: '#722ed1',
        menuItems: [
            { key: 'ops-support-dashboard', label: 'Dashboard Vận hành', icon: <DashboardOutlined />, path: '/ops-support/dashboard' },
        ]
    },
    {
        id: 'analytics-reporting',
        name: 'Báo cáo thống kê',
        icon: <BarChartOutlined />,
        color: '#eb2f96',
        menuItems: [
            { key: 'analytics-reporting-dashboard', label: 'Dashboard Báo cáo', icon: <DashboardOutlined />, path: '/analytics-reporting/dashboard' },
        ]
    },
    {
        id: 'data-governance',
        name: 'Quản trị dữ liệu',
        icon: <SettingOutlined />,
        color: '#13c2c2',
        menuItems: [
            { key: 'data-governance-dashboard', label: 'Dashboard Quản trị', icon: <DashboardOutlined />, path: '/data-governance/dashboard' },
        ]
    }
];

export const SHARED_MENU: MenuItem[] = [
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Phân tích chung', path: '/analytics' },
    { key: 'projects', icon: <ProjectOutlined />, label: 'Quản lý dự án', path: '/projects' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống', path: '/settings' },
];

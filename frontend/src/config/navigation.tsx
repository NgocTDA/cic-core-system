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
    TeamOutlined,
    SearchOutlined,
    DatabaseOutlined,
    UnorderedListOutlined,
    PlusOutlined,
    ClockCircleOutlined,
    UserOutlined,
    AuditOutlined,
    SwapOutlined,
    ExclamationCircleOutlined,
    CloudServerOutlined,
    AimOutlined,
    BranchesOutlined,
    ThunderboltOutlined,
    BookOutlined,
    CheckSquareOutlined,
    WarningOutlined,
    DownloadOutlined,
    ClusterOutlined,
    MergeCellsOutlined,
    ShareAltOutlined,
    GroupOutlined,
    TagOutlined
} from '@ant-design/icons';

export interface MenuItem {
    key: string;
    label: string;
    labelEn?: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    path?: string;
    type?: 'divider';
    badge?: string;
    badgeColor?: string;
    badgeDynamic?: string;
    highlight?: boolean;
    fnCode?: string;
    role?: string;
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
            { 
                key: 'job-management', 
                label: 'Quản lý Job', 
                icon: <ProjectOutlined />, 
                path: '/ops-support/job-management' 
            },
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
            {
                key: 'dashboard',
                label: 'Tổng quan',
                icon: <DashboardOutlined />,
                path: '/dashboard',
            },
            {
                key: 'search',
                label: 'Tìm kiếm toàn cục',
                icon: <SearchOutlined />,
                path: '/search',
                badge: 'Ctrl+K'
            },
            {
                type: 'divider',
                key: 'divider-assets',
                label: 'Tài sản dữ liệu'
            },
            {
                key: 't1',
                label: 'Tài sản dữ liệu',
                labelEn: 'Data Assets',
                icon: <DatabaseOutlined />,
                badge: 'T1',
                badgeColor: 'purple',
                children: [
                    {
                        key: 't1-list',
                        label: 'Danh sách tài sản',
                        path: '/assets',
                        fnCode: 'T1.4',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't1-new',
                        label: 'Đăng ký tài sản mới',
                        path: '/assets/new',
                        fnCode: 'T1.1',
                        icon: <PlusOutlined />,
                        highlight: true
                    },
                    {
                        key: 't1-pending',
                        label: 'Chờ phê duyệt',
                        path: '/assets?status=pending_review',
                        fnCode: 'T1.1 / T1.2',
                        icon: <ClockCircleOutlined />,
                        badgeDynamic: 'pendingCount'
                    },
                    {
                        key: 't1-my-assets',
                        label: 'Tài sản của tôi',
                        path: '/assets?owner=me',
                        fnCode: 'T1.7',
                        icon: <UserOutlined />
                    }
                ]
            },
            {
                key: 't2a',
                label: 'Tài sản nghiệp vụ',
                labelEn: 'Business Assets',
                icon: <AuditOutlined />,
                badge: 'T2A',
                badgeColor: 'teal',
                children: [
                    {
                        key: 't2a-list',
                        label: 'Danh sách BA',
                        path: '/assets?type=business',
                        fnCode: 'T2A.5',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't2a-mapping',
                        label: 'BA ↔ TA Mapping',
                        path: '/assets/mapping',
                        fnCode: 'T2A.4',
                        icon: <SwapOutlined />,
                        highlight: true
                    },
                    {
                        key: 't2a-unmapped',
                        label: 'Chưa có mapping',
                        path: '/assets?type=business&mapped=false',
                        fnCode: 'T2A.4',
                        icon: <ExclamationCircleOutlined />,
                        badgeDynamic: 'unmappedBACount'
                    }
                ]
            },
            {
                key: 't2b',
                label: 'Tài sản kỹ thuật',
                labelEn: 'Technical Assets',
                icon: <CloudServerOutlined />,
                badge: 'T2B',
                badgeColor: 'teal',
                children: [
                    {
                        key: 't2b-list',
                        label: 'Danh sách TA',
                        path: '/assets?type=technical',
                        fnCode: 'T2B.1',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't2b-discovery',
                        label: 'Auto-discovery',
                        path: '/discovery',
                        fnCode: 'T2B.2',
                        icon: <AimOutlined />,
                        badgeDynamic: 'newDiscoveryCount'
                    },
                    {
                        key: 't2b-schema',
                        label: 'Thay đổi schema',
                        path: '/assets/schema-changes',
                        fnCode: 'T2B.4',
                        icon: <BranchesOutlined />,
                        badgeDynamic: 'pendingSchemaCount'
                    },
                    {
                        key: 't2b-impact',
                        label: 'Phân tích tác động',
                        path: '/assets/impact',
                        fnCode: 'T2B.5',
                        icon: <ThunderboltOutlined />
                    }
                ]
            },
            {
                type: 'divider',
                key: 'divider-glossary',
                label: 'Định nghĩa & Quy tắc'
            },
            {
                key: 't3a',
                label: 'Thuật ngữ NV',
                labelEn: 'Business Glossary',
                icon: <BookOutlined />,
                badge: 'T3A',
                badgeColor: 'orange',
                children: [
                    {
                        key: 't3a-browse',
                        label: 'Tra cứu thuật ngữ',
                        path: '/glossary',
                        fnCode: 'T3A.5',
                        icon: <SearchOutlined />
                    },
                    {
                        key: 't3a-new',
                        label: 'Tạo thuật ngữ mới',
                        path: '/glossary/new',
                        fnCode: 'T3A.1',
                        icon: <PlusOutlined />,
                        highlight: true
                    },
                    {
                        key: 't3a-review',
                        label: 'Phê duyệt',
                        path: '/glossary/review',
                        fnCode: 'T3A.3',
                        icon: <CheckSquareOutlined />,
                        badgeDynamic: 'pendingTermCount'
                    },
                    {
                        key: 't3a-needs-review',
                        label: 'Cần review (> 1 năm)',
                        path: '/glossary?stale=true',
                        fnCode: 'T3A.2',
                        icon: <WarningOutlined />,
                        badgeDynamic: 'staleTermCount'
                    },
                    {
                        key: 't3a-export',
                        label: 'Xuất Glossary',
                        path: '/glossary/export',
                        fnCode: 'T3A.7',
                        icon: <DownloadOutlined />
                    }
                ]
            },
            {
                type: 'divider',
                key: 'divider-tools',
                label: 'Công cụ'
            },
            {
                key: 'mx',
                label: 'Liên kết & Lineage',
                labelEn: 'Linking & Lineage',
                icon: <ClusterOutlined />,
                badge: 'MX',
                badgeColor: 'gray',
                children: [
                    {
                        key: 'mx-lineage',
                        label: 'Data Lineage',
                        path: '/lineage',
                        fnCode: 'MX.1',
                        icon: <MergeCellsOutlined />
                    },
                    {
                        key: 'mx-relations',
                        label: 'Sơ đồ quan hệ',
                        path: '/relations',
                        fnCode: 'MX.2',
                        icon: <ShareAltOutlined />
                    }
                ]
            },
            {
                type: 'divider',
                key: 'divider-admin',
                label: 'Danh mục hệ thống'
            },
            {
                key: 'admin',
                label: 'Quản trị hệ thống',
                icon: <SettingOutlined />,
                role: 'admin',
                children: [
                    {
                        key: 'admin-domains',
                        label: 'Quản lý Domain',
                        path: '/admin/domains',
                        fnCode: 'T4',
                        icon: <GroupOutlined />
                    },
                    {
                        key: 'admin-users',
                        label: 'Người dùng & Phân quyền',
                        path: '/admin/users',
                        fnCode: 'T6: Ownership',
                        icon: <TeamOutlined />
                    },
                    {
                        key: 'admin-connections',
                        label: 'Kết nối Data Source',
                        path: '/admin/connections',
                        fnCode: 'T2B.2',
                        icon: <ApiOutlined />
                    },
                    {
                        key: 'admin-codelists',
                        label: 'Bảng mã danh mục',
                        path: '/admin/codelists',
                        fnCode: 'T7: DQ Rules',
                        icon: <TagOutlined />
                    }
                ]
            }
        ]
    }
];

export const SHARED_MENU: MenuItem[] = [
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Phân tích chung', path: '/analytics' },
    { key: 'projects', icon: <ProjectOutlined />, label: 'Quản lý dự án', path: '/projects' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống', path: '/settings' },
];

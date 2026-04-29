import React from 'react';
import { colors } from '../design-system';
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
        color: colors.subsystem.kkn,
        menuItems: [
            { key: 'kkn-dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/kkn-dashboard' },
        ]
    },
    {
        id: 'data-collection',
        name: 'Thu thập, xử lý dữ liệu',
        icon: <TableOutlined />,
        color: colors.subsystem.collection,
        menuItems: [
            { key: 'data-collection-dashboard', label: 'Dashboard Thu thập', icon: <DashboardOutlined />, path: '/data-collection/dashboard' },
        ]
    },
    {
        id: 'product-mgmt',
        name: 'Quản lý, tạo lập sản phẩm',
        icon: <FolderOutlined />,
        color: colors.subsystem.product,
        menuItems: [
            { key: 'product-mgmt-dashboard', label: 'Dashboard Sản phẩm', icon: <DashboardOutlined />, path: '/product-mgmt/dashboard' },
        ]
    },
    {
        id: 'ops-support',
        name: 'Hỗ trợ vận hành',
        icon: <TeamOutlined />,
        color: colors.subsystem.ops,
        menuItems: [
            { key: 'ops-support-dashboard', label: 'Dashboard Vận hành', icon: <DashboardOutlined />, path: '/ops-support/dashboard' },
            {
                key: 'job-management',
                label: 'Quản lý Job',
                icon: <ProjectOutlined />,
                path: '/ops-support/job-management'
            },
            {
                key: 'template-management',
                label: 'Quản lý thông báo',
                icon: <FolderOutlined />,
                children: [
                    { key: 'notifications', label: 'Tra cứu thông báo', icon: <BellOutlined />, path: '/ops-support/notifications' },
                    { key: 'notification-template', label: 'Mẫu thông báo', icon: <FileTextOutlined />, path: '/ops-support/notification-template' },
                    { key: 'variable-registry', label: 'Biến thông báo', icon: <TableOutlined />, path: '/ops-support/variable-registry' },
                ]
            },
        ]
    },
    {
        id: 'analytics-reporting',
        name: 'Báo cáo thống kê',
        icon: <BarChartOutlined />,
        color: colors.subsystem.analytics,
        menuItems: [
            { key: 'analytics-reporting-dashboard', label: 'Dashboard Báo cáo', icon: <DashboardOutlined />, path: '/analytics-reporting/dashboard' },
        ]
    },
    {
        id: 'data-governance',
        name: 'Quản trị dữ liệu',
        icon: <SettingOutlined />,
        color: colors.subsystem.governance,
        menuItems: [
            {
                key: 'dashboard',
                label: 'Tổng quan',
                icon: <DashboardOutlined />,
                path: '/data-governance/dashboard',
            },
            {
                key: 'search',
                label: 'Tìm kiếm toàn cục',
                icon: <SearchOutlined />,
                path: '/data-governance/search',
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
                        path: '/data-governance/assets',
                        fnCode: 'T1.4',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't1-new',
                        label: 'Đăng ký tài sản mới',
                        path: '/data-governance/assets/new',
                        fnCode: 'T1.1',
                        icon: <PlusOutlined />,
                        highlight: true
                    },
                    {
                        key: 't1-pending',
                        label: 'Chờ phê duyệt',
                        path: '/data-governance/assets?status=pending_review',
                        fnCode: 'T1.1 / T1.2',
                        icon: <ClockCircleOutlined />,
                        badgeDynamic: 'pendingCount'
                    },
                    {
                        key: 't1-my-assets',
                        label: 'Tài sản của tôi',
                        path: '/data-governance/assets?owner=me',
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
                        path: '/data-governance/assets?type=business',
                        fnCode: 'T2A.5',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't2a-mapping',
                        label: 'BA ↔ TA Mapping',
                        path: '/data-governance/assets/mapping',
                        fnCode: 'T2A.4',
                        icon: <SwapOutlined />,
                        highlight: true
                    },
                    {
                        key: 't2a-unmapped',
                        label: 'Chưa có mapping',
                        path: '/data-governance/assets?type=business&mapped=false',
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
                        path: '/data-governance/assets?type=technical',
                        fnCode: 'T2B.1',
                        icon: <UnorderedListOutlined />
                    },
                    {
                        key: 't2b-discovery',
                        label: 'Auto-discovery',
                        path: '/data-governance/discovery',
                        fnCode: 'T2B.2',
                        icon: <AimOutlined />,
                        badgeDynamic: 'newDiscoveryCount'
                    },
                    {
                        key: 't2b-schema',
                        label: 'Thay đổi schema',
                        path: '/data-governance/assets/schema-changes',
                        fnCode: 'T2B.4',
                        icon: <BranchesOutlined />,
                        badgeDynamic: 'pendingSchemaCount'
                    },
                    {
                        key: 't2b-impact',
                        label: 'Phân tích tác động',
                        path: '/data-governance/assets/impact',
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
                        path: '/data-governance/glossary',
                        fnCode: 'T3A.5',
                        icon: <SearchOutlined />
                    },
                    {
                        key: 't3a-new',
                        label: 'Tạo thuật ngữ mới',
                        path: '/data-governance/glossary/new',
                        fnCode: 'T3A.1',
                        icon: <PlusOutlined />,
                        highlight: true
                    },
                    {
                        key: 't3a-review',
                        label: 'Phê duyệt',
                        path: '/data-governance/glossary/review',
                        fnCode: 'T3A.3',
                        icon: <CheckSquareOutlined />,
                        badgeDynamic: 'pendingTermCount'
                    },
                    {
                        key: 't3a-needs-review',
                        label: 'Cần review (> 1 năm)',
                        path: '/data-governance/glossary?stale=true',
                        fnCode: 'T3A.2',
                        icon: <WarningOutlined />,
                        badgeDynamic: 'staleTermCount'
                    },
                    {
                        key: 't3a-export',
                        label: 'Xuất Glossary',
                        path: '/data-governance/glossary/export',
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
                        path: '/data-governance/lineage',
                        fnCode: 'MX.1',
                        icon: <MergeCellsOutlined />
                    },
                    {
                        key: 'mx-relations',
                        label: 'Sơ đồ quan hệ',
                        path: '/data-governance/relations',
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
                        path: '/data-governance/admin/domains',
                        fnCode: 'T4',
                        icon: <GroupOutlined />
                    },
                    {
                        key: 'admin-users',
                        label: 'Người dùng & Phân quyền',
                        path: '/data-governance/admin/users',
                        fnCode: 'T6: Ownership',
                        icon: <TeamOutlined />
                    },
                    {
                        key: 'admin-connections',
                        label: 'Kết nối Data Source',
                        path: '/data-governance/admin/connections',
                        fnCode: 'T2B.2',
                        icon: <ApiOutlined />
                    },
                    {
                        key: 'admin-codelists',
                        label: 'Bảng mã danh mục',
                        path: '/data-governance/admin/codelists',
                        fnCode: 'T7: DQ Rules',
                        icon: <TagOutlined />
                    }
                ]
            }
        ]
    }
];

export const SHARED_MENU: MenuItem[] = [];

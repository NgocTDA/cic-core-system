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
    TagOutlined,
    LinkOutlined,
    SyncOutlined,
    FileSyncOutlined,
    ReconciliationOutlined,
    SafetyOutlined,
    PieChartOutlined,
    ScheduleOutlined,
    ContainerOutlined,
    FormOutlined,
    SolutionOutlined,
    MonitorOutlined,
    RobotOutlined,
    NodeIndexOutlined,
    FundOutlined,
    CalendarOutlined,
    KeyOutlined,
    IdcardOutlined,
    FileDoneOutlined,
    MessageOutlined,
    AppstoreOutlined,
    SafetyCertificateOutlined,
    ExceptionOutlined,
    HistoryOutlined,
    EditOutlined,
    LayoutOutlined,
    BgColorsOutlined,
    FontColorsOutlined,
    ColumnHeightOutlined,
    InteractionOutlined,
    BuildOutlined,
    GlobalOutlined,
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
            {
                key: 'kkn-channel-mgmt',
                label: 'Quản lý kênh trao đổi dữ liệu',
                icon: <LinkOutlined />,
                children: [
                    { key: 'kkn-channel-setup', label: 'Thiết lập kênh', path: '/kkn/channel-setup' },
                    { key: 'kkn-conn-config', label: 'Cấu hình kết nối', path: '/kkn/connection-config' },
                    { key: 'kkn-reg-notify', label: 'Thông báo kết quả đăng ký kết nối', path: '/kkn/registration-notify' },
                ]
            },
            { key: 'kkn-data-log', label: 'Nhật ký trao đổi dữ liệu', icon: <HistoryOutlined />, path: '/kkn/data-log' },
            { key: 'kkn-sync-freq', label: 'Thiết lập tần suất tổng hợp dữ liệu', icon: <SyncOutlined />, path: '/kkn/sync-frequency' },
            { key: 'kkn-data-mgmt', label: 'Quản lý dữ liệu trao đổi', icon: <DatabaseOutlined />, path: '/kkn/data-management' },
            { key: 'kkn-report', label: 'Báo cáo khai thác kênh', icon: <PieChartOutlined />, path: '/kkn/reports' },
            {
                key: 'kkn-aggregation',
                label: 'Tổng hợp dữ liệu',
                icon: <MergeCellsOutlined />,
                children: [
                    { key: 'kkn-agg-m5', label: 'Dữ liệu cho M5', path: '/kkn/aggregation/m5' },
                    { key: 'kkn-agg-xhtd', label: 'Dữ liệu cho XHTD', path: '/kkn/aggregation/xhtd' },
                    { key: 'kkn-agg-cdtd', label: 'Dữ liệu cho CĐTD', path: '/kkn/aggregation/cdtd' },
                ]
            },
        ]
    },
    {
        id: 'data-collection',
        name: 'Thu thập, xử lý dữ liệu',
        icon: <TableOutlined />,
        color: colors.subsystem.collection,
        menuItems: [
            { key: 'data-collection-dashboard', label: 'Dashboard Thu thập', icon: <DashboardOutlined />, path: '/data-collection/dashboard' },
            {
                key: 'dc-collection',
                label: 'Thu thập dữ liệu',
                icon: <DownloadOutlined />,
                children: [
                    { key: 'dc-receive', label: 'Tệp có cấu trúc', path: '/data-collection/receive' },
                    { key: 'dc-proc-unstructured', label: 'Tệp phi cấu trúc', path: '/data-collection/process/unstructured' },
                    { key: 'dc-proc-manual', label: 'Tệp thu thập thủ công', path: '/data-collection/process/manual' },
                    { key: 'dc-compare', label: 'Đối chiếu file gửi đủ định kỳ', path: '/data-collection/compare' },
                ]
            },
            {
                key: 'dc-processing',
                label: 'Xử lý dữ liệu',
                icon: <FileSyncOutlined />,
                children: [
                    { key: 'dc-proc-fixed', label: 'XLDL định kỳ có cấu trúc xác định', path: '/data-collection/process/fixed' },
                    { key: 'dc-proc-unknown', label: 'XLDL định kỳ có cấu trúc chưa xác định', path: '/data-collection/process/unknown' },
                    { key: 'dc-proc-legal', label: 'XLDL hồ sơ pháp lý', path: '/data-collection/process/legal' },
                    { key: 'dc-proc-error', label: 'XLDL hồ sơ lỗi, chờ xem xét', path: '/data-collection/process/error' },
                    { key: 'dc-proc-adjust', label: 'XLDL tệp báo cáo điều chỉnh (tệp C, tệp E)', path: '/data-collection/process/adjust-files' },
                ]
            },
            {
                key: 'dc-cic-code',
                label: 'Quản lý mã CIC',
                icon: <IdcardOutlined />,
                children: [
                    { key: 'dc-cic-search', label: 'Tra cứu mã CIC', path: '/data-collection/cic/search' },
                    { key: 'dc-cic-adjust', label: 'Điều chỉnh mã CIC', path: '/data-collection/cic/adjust' },
                ]
            },
            {
                key: 'dc-adjustment',
                label: 'Quản lý điều chỉnh dữ liệu',
                icon: <EditOutlined />,
                children: [
                    { key: 'dc-adj-detect', label: 'Nhận diện hồ sơ tất toán, đóng thẻ', path: '/data-collection/adjust/detect' },
                    { key: 'dc-adj-suspect', label: 'Xử lý dữ liệu nghi ngờ sai lệch', path: '/data-collection/adjust/suspect' },
                    { key: 'dc-adj-request', label: 'Yêu cầu điều chỉnh dữ liệu', path: '/data-collection/adjust/request' },
                    { key: 'dc-adj-plan', label: 'Phương án điều chỉnh dữ liệu', path: '/data-collection/adjust/plan' },
                ]
            },
            {
                key: 'dc-warehouse',
                label: 'Kho dữ liệu',
                icon: <ContainerOutlined />,
                children: [
                    { key: 'dc-wh-search', label: 'Tra cứu dữ liệu', path: '/data-collection/warehouse/search' },
                    { key: 'dc-wh-control', label: 'Kiểm soát dữ liệu', path: '/data-collection/warehouse/control' },
                ]
            },
            {
                key: 'dc-aggregation',
                label: 'Tổng hợp dữ liệu',
                icon: <MergeCellsOutlined />,
                children: [
                    { key: 'dc-agg-job', label: 'Job tổng hợp dữ liệu', path: '/data-collection/aggregation/jobs' },
                    { key: 'dc-agg-search', label: 'Tra cứu dữ liệu sau tổng hợp', path: '/data-collection/aggregation/search' },
                ]
            },
            {
                key: 'dc-reconciliation',
                label: 'Tra soát, Đối soát',
                icon: <ReconciliationOutlined />,
                children: [
                    { key: 'dc-recon-data', label: 'Đối soát dữ liệu', path: '/data-collection/reconciliation/data' },
                    { key: 'dc-recon-request', label: 'Yêu cầu tra soát', path: '/data-collection/reconciliation/request' },
                ]
            },
            {
                key: 'dc-indicator-mgmt',
                label: 'Quản lý chỉ tiêu, mẫu tệp',
                icon: <UnorderedListOutlined />,
                children: [
                    { key: 'dc-ind-list', label: 'Quản lý chỉ tiêu', path: '/data-collection/indicators' },
                    { key: 'dc-tpl-list', label: 'Quản lý mẫu tệp', path: '/data-collection/templates' },
                    { key: 'dc-rule-ind', label: 'Quy tắc kiểm tra chỉ tiêu', path: '/data-collection/rules/indicators' },
                    { key: 'dc-rule-file', label: 'Quy tắc kiểm tra tệp', path: '/data-collection/rules/files' },
                    { key: 'dc-rule-type', label: 'Quản lý loại quy tắc', path: '/data-collection/rules/types' },
                ]
            },
            {
                key: 'dc-exchange-rate',
                label: 'Quản lý tỷ giá tiền tệ',
                icon: <DollarOutlined />,
                children: [
                    { key: 'dc-ex-search', label: 'Tra cứu tỷ giá', path: '/data-collection/exchange-rate/search' },
                    { key: 'dc-ex-config', label: 'Cấu hình nguồn đồng bộ tỷ giá', path: '/data-collection/exchange-rate/config' },
                ]
            },
            { key: 'dc-legal-verify', label: 'Xác thực thông tin pháp lý với C06', icon: <SafetyCertificateOutlined />, path: '/data-collection/legal-verify' },
            { key: 'dc-signing-auth', label: 'Quản lý thẩm quyền ký', icon: <SafetyOutlined />, path: '/data-collection/signing-authority' },
            { key: 'dc-product-check', label: 'Kiểm tra dữ liệu phục vụ tạo lập sản phẩm TTTD', icon: <CheckSquareOutlined />, path: '/data-collection/product-check' },
            { key: 'dc-balance-verify', label: 'Đối chiếu thông tin cân đối', icon: <ReconciliationOutlined />, path: '/data-collection/balance-verify' },
        ]
    },
    {
        id: 'product-mgmt',
        name: 'Quản lý, tạo lập sản phẩm',
        icon: <FolderOutlined />,
        color: colors.subsystem.product,
        menuItems: [
            { key: 'product-mgmt-dashboard', label: 'Dashboard Sản phẩm', icon: <DashboardOutlined />, path: '/product-mgmt/dashboard' },
            {
                key: 'pm-catalog',
                label: 'Quản lý danh mục',
                icon: <ContainerOutlined />,
                children: [
                    { key: 'pm-ind-catalog', label: 'Danh mục chỉ tiêu sản phẩm', path: '/product-mgmt/catalog/indicators' },
                    { key: 'pm-tpl-catalog', label: 'Danh mục mẫu sản phẩm', path: '/product-mgmt/catalog/templates' },
                    { key: 'pm-prod-catalog', label: 'Danh mục sản phẩm', path: '/product-mgmt/catalog/products' },
                    { key: 'pm-type-catalog', label: 'Danh mục Loại sản phẩm', path: '/product-mgmt/catalog/types' },
                ]
            },
            {
                key: 'pm-rules',
                label: 'Cấu hình các quy tắc',
                icon: <SettingOutlined />,
                children: [
                    { key: 'pm-rule-cic', label: 'Quy tắc xác định mã CIC', path: '/product-mgmt/rules/cic-code' },
                    { key: 'pm-rule-confirm', label: 'Quy tắc YCHT cần xác nhận của CTTT', path: '/product-mgmt/rules/owner-confirm' },
                    { key: 'pm-rule-change', label: 'Quy tắc kiểm tra KH cần đổi mã sản phẩm', path: '/product-mgmt/rules/product-change' },
                    { key: 'pm-rule-create', label: 'Quy tắc kiểm tra tạo lập sản phẩm', path: '/product-mgmt/rules/creation' },
                    { key: 'pm-block-info', label: 'Chặn cung cấp thông tin', path: '/product-mgmt/rules/blocking' },
                ]
            },
            {
                key: 'pm-data-agg',
                label: 'Tổng hợp dữ liệu phục vụ tạo lập sản phẩm',
                icon: <MergeCellsOutlined />,
                children: [
                    { key: 'pm-agg-job', label: 'Thiết lập Job tổng hợp dữ liệu định kỳ', path: '/product-mgmt/aggregation/jobs' },
                    { key: 'pm-agg-rules', label: 'Quy tắc kiểm tra dữ liệu tổng hợp', path: '/product-mgmt/aggregation/rules' },
                    { key: 'pm-agg-search', label: 'Tra cứu dữ liệu tổng hợp', path: '/product-mgmt/aggregation/search' },
                ]
            },
            { key: 'pm-background', label: 'Các chức năng hệ thống chạy ngầm', icon: <RobotOutlined />, path: '/product-mgmt/background-jobs' },
            {
                key: 'pm-periodic',
                label: 'Sản phẩm định kỳ',
                icon: <FileDoneOutlined />,
                children: [
                    { key: 'pm-periodic-reg', label: 'Đăng ký khai thác báo cáo định kỳ', path: '/product-mgmt/periodic/register' },
                    { key: 'pm-periodic-list', label: 'Danh sách sản phẩm định kỳ', path: '/product-mgmt/periodic/list' },
                    { key: 'pm-periodic-log', label: 'Nhật ký tra cứu sản phẩm định kỳ', path: '/product-mgmt/periodic/log' },
                    { key: 'pm-periodic-integ', label: 'Tích hợp hệ thống khác', path: '/product-mgmt/periodic/integration' },
                    { key: 'pm-periodic-revoke', label: 'Thu hồi sản phẩm định kỳ', path: '/product-mgmt/periodic/revoke' },
                ]
            },
            {
                key: 'pm-inquiry',
                label: 'Hỏi và trả lời tin khách hàng',
                icon: <MessageOutlined />,
                children: [
                    { key: 'pm-inq-reg', label: 'Quản lý yêu cầu đăng ký khai thác của TCTD', path: '/product-mgmt/inquiry/register' },
                    { key: 'pm-inq-suspect', label: 'Danh sách đối tượng gán tạm mã CIC', path: '/product-mgmt/inquiry/suspect-cic' },
                    { key: 'pm-inq-list', label: 'Danh sách yêu cầu hỏi tin SP truyền thống', path: '/product-mgmt/inquiry/list' },
                    { key: 'pm-inq-batch', label: 'Hỏi tin sản phẩm theo lô', path: '/product-mgmt/inquiry/batch' },
                ]
            },
            {
                key: 'pm-confirmation',
                label: 'Quản lý yêu cầu xác nhận của CTTT',
                icon: <CheckSquareOutlined />,
                children: [
                    { key: 'pm-conf-list', label: 'Danh sách yêu cầu hỏi tin cần xác nhận', path: '/product-mgmt/confirmation/list' },
                    { key: 'pm-conf-declare', label: 'Khai báo xác nhận của CTTT', path: '/product-mgmt/confirmation/declare' },
                ]
            },
            {
                key: 'pm-rework',
                label: 'Kiểm soát và tạo lập lại sản phẩm',
                icon: <SyncOutlined />,
                children: [
                    { key: 'pm-rework-suspect', label: 'Quản lý dữ liệu nghi ngờ sai sót', path: '/product-mgmt/rework/suspect' },
                    { key: 'pm-rework-search', label: 'Tra cứu dữ liệu cần tạo lập lại', path: '/product-mgmt/rework/search' },
                    { key: 'pm-rework-agg', label: 'Tổng hợp nội dung SP đã bị thu hồi', path: '/product-mgmt/rework/aggregation' },
                    { key: 'pm-rework-list', label: 'Danh sách SP định kỳ tạo lập lại', path: '/product-mgmt/rework/list' },
                ]
            },
            {
                key: 'pm-articles',
                label: 'Bài viết phân tích, cảnh báo',
                icon: <FormOutlined />,
                children: [
                    { key: 'pm-art-upload', label: 'Quản lý file upload', path: '/product-mgmt/articles/upload' },
                    { key: 'pm-art-list', label: 'Quản lý bài viết, phân tích cảnh báo', path: '/product-mgmt/articles' },
                    { key: 'pm-art-pub', label: 'Hệ thống đăng bài/ẩn bài và tích hợp Web SBV', path: '/product-mgmt/articles/publish' },
                ]
            },
            {
                key: 'pm-sbv',
                label: 'Tiếp nhận, tạo lập, cung cấp SP đặc thù SBV',
                icon: <SafetyOutlined />,
                children: [
                    { key: 'pm-sbv-req', label: 'Danh sách yêu cầu khai thác SP đặc thù', path: '/product-mgmt/sbv/requests' },
                    { key: 'pm-sbv-create', label: 'Tạo lập báo cáo', path: '/product-mgmt/sbv/creation' },
                    { key: 'pm-sbv-ind', label: 'Danh sách yêu cầu cung cấp chỉ tiêu', path: '/product-mgmt/sbv/indicators' },
                ]
            },
            {
                key: 'pm-m5',
                label: 'Tổng hợp dữ liệu cho hệ thống M5',
                icon: <ShareAltOutlined />,
                children: [
                    { key: 'pm-m5-check', label: 'Nhận và kiểm tra yêu cầu từ M5', path: '/product-mgmt/m5/check' },
                    { key: 'pm-m5-agg', label: 'Tổng hợp dữ liệu', path: '/product-mgmt/m5/aggregation' },
                    { key: 'pm-m5-send', label: 'Gửi dữ liệu sang hệ thống M5', path: '/product-mgmt/m5/send' },
                ]
            },
            { key: 'pm-post-audit', label: 'Hậu kiểm sau trả lời tin', icon: <AuditOutlined />, path: '/product-mgmt/post-audit' },
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
                key: 'ops-users',
                label: 'Người dùng & Phân quyền',
                icon: <IdcardOutlined />,
                children: [
                    { key: 'ops-users-list', label: 'Quản lý người sử dụng', path: '/ops-support/users' },
                    { key: 'ops-roles', label: 'Quản lý nhóm quyền', path: '/ops-support/roles' },
                    { key: 'ops-user-groups', label: 'Quản lý nhóm người sử dụng', path: '/ops-support/user-groups' },
                ]
            },
            { key: 'ops-contract', label: 'Quản lý hợp đồng', icon: <SolutionOutlined />, path: '/ops-support/contracts' },
            {
                key: 'ops-assignment',
                label: 'Quản lý phân công',
                icon: <NodeIndexOutlined />,
                children: [
                    { key: 'ops-assign-auto', label: 'Phân công tự động', path: '/ops-support/assignment/auto' },
                    { key: 'ops-assign-staff', label: 'Cán bộ phụ trách Tập đoàn, TCT', path: '/ops-support/assignment/staff' },
                ]
            },
            {
                key: 'ops-function',
                label: 'Quản lý chức năng',
                icon: <AppstoreOutlined />,
                children: [
                    { key: 'ops-func-cat', label: 'Quản lý danh mục', path: '/ops-support/functions/categories' },
                    { key: 'ops-func-list', label: 'Quản lý chức năng', path: '/ops-support/functions' },
                    { key: 'job-management', label: 'Quản lý job', icon: <ProjectOutlined />, path: '/ops-support/job-management' },
                ]
            },
            {
                key: 'template-management',
                label: 'Tra cứu & Cấu hình thông báo',
                icon: <BellOutlined />,
                children: [
                    { key: 'notifications', label: 'Tra cứu thông báo', path: '/ops-support/notifications' },
                    { key: 'notifications-core', label: 'Tra cứu thông báo (Core)', path: '/ops-support/notifications-core' },
                    { key: 'notification-template', label: 'Mẫu thông báo', path: '/ops-support/notification-template' },
                    { key: 'variable-registry', label: 'Biến thông báo', path: '/ops-support/variable-registry' },
                ]
            },
            {
                key: 'ops-quality',
                label: 'Đánh giá chất lượng báo cáo TTTD',
                icon: <FundOutlined />,
                children: [
                    { key: 'ops-qual-list', label: 'Danh sách đánh giá', path: '/ops-support/quality/list' },
                    { key: 'ops-qual-result', label: 'Kết quả đánh giá', path: '/ops-support/quality/results' },
                    { key: 'ops-qual-cfg', label: 'Quản lý chỉ tiêu, công thức', path: '/ops-support/quality/config' },
                ]
            },
            {
                key: 'ops-monitoring',
                label: 'Giám sát TCTN, QTDND',
                icon: <MonitorOutlined />,
                children: [
                    { key: 'ops-mon-list', label: 'Danh sách giám sát', path: '/ops-support/monitoring/list' },
                    { key: 'ops-mon-result', label: 'Kết quả giám sát', path: '/ops-support/monitoring/results' },
                    { key: 'ops-mon-cfg', label: 'Quản lý chỉ tiêu giám sát', path: '/ops-support/monitoring/config' },
                ]
            },
            {
                key: 'ops-feedback',
                label: 'Tra soát và phản hồi thông tin',
                icon: <SwapOutlined />,
                children: [
                    { key: 'ops-fb-ext', label: 'Đơn vị bên ngoài đến CIC', path: '/ops-support/feedback/external' },
                    { key: 'ops-fb-int', label: 'CIC đến đơn vị bên ngoài', path: '/ops-support/feedback/internal' },
                ]
            },
            {
                key: 'ops-config',
                label: 'Cấu hình hệ thống',
                icon: <SettingOutlined />,
                children: [
                    { key: 'ops-cfg-policy', label: 'Chính sách tài khoản', icon: <KeyOutlined />, path: '/ops-support/config/policy' },
                    { key: 'ops-cfg-params', label: 'Cấu hình tham số hệ thống', path: '/ops-support/config/parameters' },
                    { key: 'ops-cfg-workday', label: 'Cấu hình ngày làm việc', icon: <CalendarOutlined />, path: '/ops-support/config/workdays' },
                    { key: 'ops-cfg-errors', label: 'Quản lý mã lỗi', path: '/ops-support/config/error-codes' },
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
            {
                key: 'ar-business',
                label: 'Báo cáo nghiệp vụ',
                icon: <PieChartOutlined />,
                children: [
                    { key: 'ar-biz-collection', label: 'Báo cáo tình hình thu thập dữ liệu', path: '/analytics-reporting/business/collection' },
                    { key: 'ar-biz-product', label: 'Báo cáo tình hình tạo lập & cung cấp sản phẩm', path: '/analytics-reporting/business/products' },
                    { key: 'ar-biz-channel', label: 'Báo cáo khai thác kênh kết nối', path: '/analytics-reporting/business/channels' },
                    { key: 'ar-biz-quality', label: 'Báo cáo chất lượng dữ liệu', path: '/analytics-reporting/business/quality' },
                ]
            },
            {
                key: 'ar-adhoc',
                label: 'Báo cáo theo yêu cầu',
                icon: <ScheduleOutlined />,
                children: [
                    { key: 'ar-adhoc-create', label: 'Tạo báo cáo tùy chỉnh', path: '/analytics-reporting/adhoc/create' },
                    { key: 'ar-adhoc-list', label: 'Danh sách báo cáo đã tạo', path: '/analytics-reporting/adhoc/list' },
                    { key: 'ar-adhoc-history', label: 'Lịch sử xuất báo cáo', path: '/analytics-reporting/adhoc/history' },
                ]
            },
            {
                key: 'ar-statistics',
                label: 'Thống kê',
                icon: <BarChartOutlined />,
                children: [
                    { key: 'ar-stat-unit', label: 'Thống kê theo TCTD / đơn vị báo cáo', path: '/analytics-reporting/statistics/units' },
                    { key: 'ar-stat-period', label: 'Thống kê theo kỳ', path: '/analytics-reporting/statistics/periods' },
                    { key: 'ar-stat-products', label: 'Thống kê sản phẩm TTTD đã cung cấp', path: '/analytics-reporting/statistics/products' },
                ]
            },
            {
                key: 'ar-templates',
                label: 'Quản lý mẫu báo cáo',
                icon: <FileTextOutlined />,
                children: [
                    { key: 'ar-tpl-list', label: 'Danh mục mẫu báo cáo', path: '/analytics-reporting/templates' },
                    { key: 'ar-tpl-params', label: 'Cấu hình tham số báo cáo', path: '/analytics-reporting/templates/parameters' },
                ]
            },
            {
                key: 'ar-schedule',
                label: 'Lịch báo cáo định kỳ',
                icon: <CalendarOutlined />,
                children: [
                    { key: 'ar-sched-list', label: 'Cấu hình lịch chạy', path: '/analytics-reporting/schedules' },
                    { key: 'ar-sched-results', label: 'Kết quả chạy báo cáo', path: '/analytics-reporting/schedules/results' },
                ]
            },
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
    },
    {
        id: 'web-portal',
        name: 'Web Portal (TCTD)',
        icon: <GlobalOutlined />,
        color: colors.subsystem.portal,
        menuItems: [
            { key: 'web-portal-dashboard', label: 'TRANG CHỦ', icon: <DashboardOutlined />, path: '/web-portal/dashboard' },
            {
                key: 'web-portal-send',
                label: 'GỬI BÁO CÁO TÍN DỤNG',
                icon: <CloudServerOutlined />,
                children: [
                    {
                        key: 'web-portal-send-balance-group',
                        label: 'Thông tin cân đối',
                        icon: <ReconciliationOutlined />,
                        children: [
                            { key: 'web-portal-send-balance', label: 'Gửi thông tin cân đối', path: '/web-portal/send-balance' },
                        ]
                    },
                    {
                        key: 'web-portal-send-periodic-group',
                        label: 'Báo cáo định kỳ',
                        icon: <FileDoneOutlined />,
                        children: [
                            { key: 'web-portal-send-periodic', label: 'Gửi báo cáo định kỳ', path: '/web-portal/send-periodic' },
                            { key: 'web-portal-search-periodic', label: 'Tra cứu báo cáo đã nộp', path: '/web-portal/search-periodic' },
                        ]
                    }
                ]
            },
            {
                key: 'web-portal-exploit',
                label: 'KHAI THÁC BÁO CÁO',
                icon: <SearchOutlined />,
                children: [
                    {
                        key: 'web-portal-exploit-search',
                        label: 'Khai thác TTTD',
                        icon: <SearchOutlined />,
                        children: [
                            { key: 'web-portal-search-credit', label: 'Tra cứu TTTD khách hàng', path: '/web-portal/search-credit' },
                            { key: 'web-portal-batch-inquiry', label: 'Hỏi tin khách hàng theo lô', path: '/web-portal/batch-inquiry' },
                        ]
                    },
                    {
                        key: 'web-portal-exploit-reports',
                        label: 'Báo cáo tổng hợp',
                        icon: <BarChartOutlined />,
                        children: [
                            { key: 'web-portal-risk-warnings', label: 'Cảnh báo rủi ro tín dụng', path: '/web-portal/risk-warnings' },
                            { key: 'web-portal-industry-reports', label: 'Báo cáo tổng hợp ngành', path: '/web-portal/industry-reports' },
                        ]
                    }
                ]
            },
            {
                key: 'web-portal-products',
                label: 'DANH MỤC SẢN PHẨM',
                icon: <FolderOutlined />,
                children: [
                    {
                        key: 'web-portal-products-traditional',
                        label: 'Sản phẩm truyền thống',
                        icon: <FileTextOutlined />,
                        children: [
                            { key: 'web-portal-products-indiv', label: 'Báo cáo tín dụng cá nhân', path: '/web-portal/products/individual' },
                            { key: 'web-portal-products-corp', label: 'Báo cáo tín dụng doanh nghiệp', path: '/web-portal/products/corporate' },
                        ]
                    },
                    {
                        key: 'web-portal-products-value',
                        label: 'Sản phẩm giá trị gia tăng',
                        icon: <DollarOutlined />,
                        children: [
                            { key: 'web-portal-products-score', label: 'Báo cáo điểm số tín dụng', path: '/web-portal/products/score' },
                            { key: 'web-portal-products-rating', label: 'Báo cáo xếp hạng tín dụng', path: '/web-portal/products/rating' },
                        ]
                    }
                ]
            },
            { key: 'web-portal-templates', label: 'HỖ TRỢ/ TƯ VẤN', icon: <TeamOutlined />, path: '/web-portal/support' }
        ]
    }
];

export const SHARED_MENU: MenuItem[] = [];

export const DESIGN_SYSTEM_SUB: SubSystem = {
    id: 'design-system',
    name: 'Design System',
    icon: <BuildOutlined />,
    color: colors.subsystem.design,
    menuItems: [
        { key: 'ds-overview', label: 'Tổng quan', icon: <DashboardOutlined />, path: '/design-system' },
        { key: 'ds-layout-explorer', label: 'Layout hệ thống', icon: <LayoutOutlined />, path: '/design-system/layout-explorer' },
        {
            key: 'ds-layout',
            label: 'Layout & Structure',
            icon: <ContainerOutlined />,
            children: [
                { key: 'ds-page-layout', label: 'PageLayout', path: '/design-system/layout/page-layout' },
                { key: 'ds-section-card', label: 'SectionCard', path: '/design-system/layout/section-card' },
                { key: 'ds-filter-bar', label: 'FilterBar', path: '/design-system/layout/filter-bar' },
            ],
        },
        {
            key: 'ds-data-display',
            label: 'Hiển thị dữ liệu',
            icon: <TableOutlined />,
            children: [
                { key: 'ds-status-tag', label: 'StatusTag', path: '/design-system/data-display/status-tag' },
                { key: 'ds-status-bar', label: 'StatusSummaryBar', path: '/design-system/data-display/status-summary-bar' },
                { key: 'ds-action-menu', label: 'ActionMenu', path: '/design-system/data-display/action-menu' },
                { key: 'ds-code-text', label: 'CodeText', path: '/design-system/data-display/code-text' },
                { key: 'ds-table', label: 'Table & Pagination', path: '/design-system/data-display/table' },
            ],
        },
        {
            key: 'ds-form',
            label: 'Form & Nhập liệu',
            icon: <FormOutlined />,
            children: [
                { key: 'ds-textbox', label: 'Textbox / Input', path: '/design-system/form/textbox' },
                { key: 'ds-number', label: 'Input Number', path: '/design-system/form/input-number' },
                { key: 'ds-textarea', label: 'TextArea', path: '/design-system/form/textarea' },
                { key: 'ds-select', label: 'Select / Dropdown', path: '/design-system/form/select' },
                { key: 'ds-datepicker', label: 'DatePicker', path: '/design-system/form/date-picker' },
                { key: 'ds-checkbox', label: 'Checkbox', path: '/design-system/form/checkbox' },
                { key: 'ds-radio', label: 'Radio Button', path: '/design-system/form/radio' },
                { key: 'ds-switch', label: 'Switch', path: '/design-system/form/switch' },
                { key: 'ds-slider', label: 'Slider', path: '/design-system/form/slider' },
                { key: 'ds-upload', label: 'Upload', path: '/design-system/form/upload' },
                { key: 'ds-form-full', label: 'Form mẫu đầy đủ', path: '/design-system/form/full-form' },
            ],
        },
        {
            key: 'ds-button',
            label: 'Button',
            icon: <InteractionOutlined />,
            children: [
                { key: 'ds-btn-variants', label: 'Kiểu & trạng thái', path: '/design-system/button/variants' },
                { key: 'ds-btn-patterns', label: 'Pattern thao tác', path: '/design-system/button/patterns' },
            ],
        },
        {
            key: 'ds-feedback',
            label: 'Feedback & Overlay',
            icon: <BellOutlined />,
            children: [
                { key: 'ds-modal', label: 'Modal & Drawer', path: '/design-system/feedback/modal' },
                { key: 'ds-notification', label: 'Notification / Message', path: '/design-system/feedback/notification' },
                { key: 'ds-alert', label: 'Alert', path: '/design-system/feedback/alert' },
            ],
        },
        {
            key: 'ds-dashboard',
            label: 'Dashboard Components',
            icon: <BarChartOutlined />,
            children: [
                { key: 'ds-stat-card', label: 'StatCard', path: '/design-system/dashboard/stat-card' },
                { key: 'ds-chart-bar', label: 'Biểu đồ cột', path: '/design-system/dashboard/chart-bar' },
                { key: 'ds-chart-line', label: 'Biểu đồ đường', path: '/design-system/dashboard/chart-line' },
                { key: 'ds-chart-pie', label: 'Biểu đồ tròn / Donut', path: '/design-system/dashboard/chart-pie' },
                { key: 'ds-chart-gauge', label: 'Gauge', path: '/design-system/dashboard/chart-gauge' },
                { key: 'ds-chart-dual', label: 'Dual Axis', path: '/design-system/dashboard/chart-dual-axis' },
            ],
        },
        {
            key: 'ds-tokens',
            label: 'Design Tokens',
            icon: <TagOutlined />,
            children: [
                { key: 'ds-colors', label: 'Màu sắc', path: '/design-system/tokens/colors' },
                { key: 'ds-typography', label: 'Typography', path: '/design-system/tokens/typography' },
                { key: 'ds-spacing', label: 'Spacing', path: '/design-system/tokens/spacing' },
                { key: 'ds-shadows', label: 'Shadows & Radius', path: '/design-system/tokens/shadows' },
            ],
        },
    ],
};

SUB_SYSTEMS.push(DESIGN_SYSTEM_SUB);

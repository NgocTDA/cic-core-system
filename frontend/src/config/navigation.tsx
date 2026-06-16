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
            { key: 'data-collection-dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/data-collection/dashboard' },
            {
                key: 'dc-collection',
                label: 'Thu thập dữ liệu',
                icon: <DownloadOutlined />,
                children: [
                    { key: 'dc-coll-structured-known', label: 'Tệp có cấu trúc xác định', path: '/data-collection/collect/structured-known' },
                    { key: 'dc-coll-structured-unknown', label: 'Tệp có cấu trúc chưa xác định', path: '/data-collection/collect/structured-unknown' },
                    { key: 'dc-coll-unstructured', label: 'Tệp phi cấu trúc', path: '/data-collection/collect/unstructured' },
                    { key: 'dc-coll-manual', label: 'Thu thập thủ công', path: '/data-collection/collect/manual' },
                    { key: 'dc-coll-compare', label: 'Đối chiếu file gửi đủ định kỳ', path: '/data-collection/collect/compare' },
                    { key: 'dc-coll-balance', label: 'Thông tin cân đối', path: '/data-collection/collect/balance' },
                ]
            },
            {
                key: 'dc-processing',
                label: 'Xử lý dữ liệu',
                icon: <FileSyncOutlined />,
                children: [
                    { key: 'dc-proc-structured-known', label: 'XLDL định kỳ có cấu trúc xác định', path: '/data-collection/process/structured-known' },
                    { key: 'dc-proc-structured-unknown', label: 'XLDL định kỳ có cấu trúc chưa xác định', path: '/data-collection/process/structured-unknown' },
                    { key: 'dc-proc-unstructured', label: 'XLDL phi cấu trúc', path: '/data-collection/process/unstructured' },
                    { key: 'dc-proc-legal', label: 'XLDL hồ sơ pháp lý', path: '/data-collection/process/legal' },
                    { key: 'dc-proc-error', label: 'XLDL hồ sơ lỗi, chờ xem xét', path: '/data-collection/process/error' },
                    { key: 'dc-proc-adjust', label: 'XLDL tệp báo cáo điều chỉnh', path: '/data-collection/process/adjust' },
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
                    { key: 'dc-wh-pending', label: 'Tra cứu kho xem xét', path: '/data-collection/warehouse/pending' },
                    { key: 'dc-wh-standard', label: 'Tra cứu kho chuẩn', path: '/data-collection/warehouse/standard' },
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
                key: 'dc-indicators',
                label: 'Quản lý chỉ tiêu, mẫu tệp',
                icon: <UnorderedListOutlined />,
                children: [
                    { key: 'dc-ind-list', label: 'Quản lý chỉ tiêu', path: '/data-collection/indicators/list' },
                    { key: 'dc-ind-templates', label: 'Quản lý mẫu tệp', path: '/data-collection/indicators/templates' },
                    { key: 'dc-ind-rules-ind', label: 'Quy tắc kiểm tra chỉ tiêu', path: '/data-collection/indicators/rules-ind' },
                    { key: 'dc-ind-rules-file', label: 'Quy tắc kiểm tra tệp', path: '/data-collection/indicators/rules-file' },
                    { key: 'dc-ind-rule-types', label: 'Quản lý loại quy tắc', path: '/data-collection/indicators/rule-types' },
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
            {
                key: 'dc-legal-verify',
                label: 'Xác thực thông tin pháp lý với C06',
                icon: <SafetyCertificateOutlined />,
                children: [
                    { key: 'dc-legal-verified', label: 'Danh sách đã xác thực', path: '/data-collection/legal-verify/verified' },
                    { key: 'dc-legal-pending', label: 'Danh sách chờ xác thực', path: '/data-collection/legal-verify/pending' },
                ]
            },
            {
                key: 'dc-signing-auth',
                label: 'Quản lý thẩm quyền ký',
                icon: <SafetyOutlined />,
                path: '/data-collection/signing-authority'
            },
            {
                key: 'dc-product-check',
                label: 'Kiểm tra dữ liệu phục vụ tạo lập sản phẩm TTTD',
                icon: <CheckSquareOutlined />,
                path: '/data-collection/product-check'
            },
            {
                key: 'dc-balance-reconciliation',
                label: 'Quản lý đối chiếu thông tin cân đối',
                icon: <ReconciliationOutlined />,
                children: [
                    { key: 'dc-balance-mgmt', label: 'Quản lý thông tin cân đối', path: '/data-collection/balance/management' },
                    { key: 'dc-balance-compare', label: 'Đối chiếu thông tin cân đối với số liệu tổng hợp cùng kỳ báo cáo', path: '/data-collection/balance/compare-summary' },
                ]
            },
            {
                key: 'dc-suspect-data-control',
                label: 'Quản lý dữ liệu nghi ngờ (KSDL)',
                icon: <WarningOutlined />,
                children: [
                    { key: 'dc-suspect-criteria', label: 'Cấu hình các tiêu chí và quy tắc kiểm soát chất lượng dữ liệu', path: '/data-collection/suspect/criteria' },
                    { key: 'dc-suspect-list', label: 'Quản lý dữ liệu nghi ngờ', path: '/data-collection/suspect/list' },
                ]
            }
        ]
    },
    {
        id: 'product-mgmt',
        name: 'Quản lý, tạo lập sản phẩm',
        icon: <FolderOutlined />,
        color: colors.subsystem.product,
        menuItems: [
            { key: 'product-mgmt-dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/product-mgmt/dashboard' },
            {
                key: 'pm-catalog',
                label: 'Quản lý danh mục',
                icon: <ContainerOutlined />,
                children: [
                    { key: 'pm-catalog-ind', label: 'Danh mục chỉ tiêu sản phẩm', path: '/product-mgmt/catalog/indicators' },
                    { key: 'pm-catalog-templates', label: 'Danh mục mẫu sản phẩm (mẫu báo cáo đầu ra)', path: '/product-mgmt/catalog/templates' },
                    { key: 'pm-catalog-products', label: 'Danh mục sản phẩm', path: '/product-mgmt/catalog/products' },
                    { key: 'pm-catalog-types', label: 'Danh mục Loại sản phẩm', path: '/product-mgmt/catalog/types' },
                ]
            },
            {
                key: 'pm-periodic',
                label: 'Sản phẩm định kỳ',
                icon: <FileDoneOutlined />,
                children: [
                    { key: 'pm-periodic-list', label: 'Danh sách sản phẩm định kỳ', path: '/product-mgmt/periodic/list' },
                    { key: 'pm-periodic-log', label: 'Nhật ký tra cứu sản phẩm định kỳ', path: '/product-mgmt/periodic/log' },
                    { key: 'pm-periodic-hide-cust', label: 'Quản lý ẩn khách hàng trong file sản phẩm', path: '/product-mgmt/periodic/hide-customers' },
                    { key: 'pm-periodic-adjusted-data', label: 'Quản lý dữ liệu sau điều chỉnh', path: '/product-mgmt/periodic/adjusted-data' },
                    { key: 'pm-periodic-r18-rebuild', label: 'Quản lý dữ liệu R18 tổng hợp lại', path: '/product-mgmt/periodic/r18-rebuild' },
                    { key: 'pm-periodic-r18-impacted', label: 'Quản lý dữ liệu ảnh hưởng R18 đã gửi', path: '/product-mgmt/periodic/r18-impacted' },
                ]
            },
            {
                key: 'pm-articles',
                label: 'Bài viết phân tích, cảnh báo',
                icon: <FormOutlined />,
                children: [
                    { key: 'pm-art-upload', label: 'Quản lý file upload', path: '/product-mgmt/articles/upload' },
                    { key: 'pm-art-list', label: 'Quản lý bài viết, phân tích cảnh báo', path: '/product-mgmt/articles/list' },
                    { key: 'pm-art-publish', label: 'Hệ thống đăng bài/ẩn bài và tích hợp đăng bài trên web SBV', path: '/product-mgmt/articles/publish' },
                ]
            },
            {
                key: 'pm-m5',
                label: 'Tổng hợp dữ liệu cho hệ thống M5',
                icon: <ShareAltOutlined />,
                children: [
                    { key: 'pm-m5-requests', label: 'Danh sách yêu cầu từ hệ thống M5', path: '/product-mgmt/m5/requests' },
                    { key: 'pm-m5-sent-data', label: 'Tra cứu dữ liệu đã gửi hệ thống M5', path: '/product-mgmt/m5/sent-data' },
                ]
            },
            {
                key: 'pm-aggregation',
                label: 'Tổng hợp dữ liệu phục vụ tạo lập sản phẩm',
                icon: <MergeCellsOutlined />,
                children: [
                    { key: 'pm-agg-check', label: 'Kiểm tra dữ liệu phục vụ TLSP', path: '/product-mgmt/aggregation/check' },
                    { key: 'pm-agg-rules', label: 'Quy tắc kiểm tra dữ liệu tổng hợp phục vụ tạo lập sản phẩm', path: '/product-mgmt/aggregation/rules' },
                    { key: 'pm-agg-job-setup', label: 'Thiết lập Job tổng hợp dữ liệu định kỳ phục vụ tạo lập sản phẩm', path: '/product-mgmt/aggregation/job-setup' },
                    { key: 'pm-agg-search', label: 'Tra cứu dữ liệu tổng hợp phục vụ tạo lập sản phẩm', path: '/product-mgmt/aggregation/search' },
                ]
            },
            {
                key: 'pm-register-exploitation',
                label: 'Quản lý đăng ký khai thác sản phẩm',
                icon: <SolutionOutlined />,
                children: [
                    { key: 'pm-reg-requests', label: 'Danh sách yêu cầu đăng ký', path: '/product-mgmt/register/requests' },
                    { key: 'pm-reg-build-adhoc', label: 'Xây dựng SP theo yêu cầu', path: '/product-mgmt/register/build-adhoc' },
                ]
            },
            {
                key: 'pm-products-adhoc',
                label: 'Quản lý sản phẩm theo yêu cầu',
                icon: <ProjectOutlined />,
                children: [
                    { key: 'pm-adhoc-list', label: 'Danh sách SP theo yêu cầu', path: '/product-mgmt/adhoc/list' },
                    { key: 'pm-adhoc-inquiries', label: 'Danh sách hỏi tin SP theo yêu cầu', path: '/product-mgmt/adhoc/inquiries' },
                    { key: 'pm-adhoc-provided', label: 'SP theo yêu cầu đã cung cấp', path: '/product-mgmt/adhoc/provided' },
                ]
            },
            {
                key: 'pm-instant-inquiry',
                label: 'Hỏi và trả lời tin tức thời',
                icon: <MessageOutlined />,
                children: [
                    { key: 'pm-instant-tickets', label: 'Danh sách phiếu hỏi tin', path: '/product-mgmt/instant/tickets' },
                    { key: 'pm-instant-provided', label: 'Danh sách sản phẩm đã cung cấp', path: '/product-mgmt/instant/provided' },
                    { key: 'pm-instant-log', label: 'Nhật ký hỏi tin sản phẩm', path: '/product-mgmt/instant/log' },
                ]
            },
            {
                key: 'pm-batch-inquiry',
                label: 'Hỏi và trả lời tin theo lô',
                icon: <TableOutlined />,
                children: [
                    { key: 'pm-batch-inquiries', label: 'Danh sách hỏi tin', path: '/product-mgmt/batch/inquiries' },
                    { key: 'pm-batch-responses', label: 'Danh sách bản trả lời tin', path: '/product-mgmt/batch/responses' },
                ]
            },
            {
                key: 'pm-rating-inquiry',
                label: 'Hỏi tin Xếp hạng tín dụng',
                icon: <FundOutlined />,
                children: [
                    { key: 'pm-rating-cust', label: 'Danh sách hỏi tin khách hàng', path: '/product-mgmt/rating/customer' },
                    { key: 'pm-rating-bulk', label: 'Danh sách hỏi tin số lượng lớn', path: '/product-mgmt/rating/bulk' },
                    { key: 'pm-rating-owner-confirm', label: 'Khai báo xác nhận của chủ thể thông tin', path: '/product-mgmt/rating/owner-confirm' },
                ]
            },
            {
                key: 'pm-foreign-inquiry',
                label: 'Hỏi tin doanh nghiệp nước ngoài',
                icon: <GlobalOutlined />,
                children: [
                    { key: 'pm-foreign-inquiries', label: 'Danh sách hỏi tin doanh nghiệp nước ngoài', path: '/product-mgmt/foreign/inquiries' },
                    { key: 'pm-foreign-cic-code-req', label: 'Danh sách khách hàng yêu cầu cấp mã CIC', path: '/product-mgmt/foreign/cic-code-requests' },
                    { key: 'pm-foreign-reports', label: 'Báo cáo cung cấp bởi hãng thông tin quốc tế', path: '/product-mgmt/foreign/reports' },
                ]
            },
            {
                key: 'pm-suspect-cic',
                label: 'Quản lý mã CIC nghi ngờ',
                icon: <IdcardOutlined />,
                children: [
                    { key: 'pm-suspect-cic-rules', label: 'Cấu hình quy tắc xác định mã CIC', path: '/product-mgmt/suspect-cic/rules' },
                    { key: 'pm-suspect-cic-list', label: 'Danh sách mã CIC nghi ngờ', path: '/product-mgmt/suspect-cic/list' },
                ]
            },
            {
                key: 'pm-recreation',
                label: 'Kiểm soát và tạo lập lại sản phẩm (sau cung cấp)',
                icon: <SyncOutlined />,
                children: [
                    { key: 'pm-recreate-suspect', label: 'Quản lý dữ liệu nghi ngờ sai sót (sau cung cấp)', path: '/product-mgmt/recreate/suspect' },
                    { key: 'pm-recreate-needed', label: 'Tra cứu dữ liệu cần tạo lập lại sản phẩm', path: '/product-mgmt/recreate/needed' },
                    { key: 'pm-recreate-action', label: 'Tạo lập lại sản phẩm (sau cung cấp)', path: '/product-mgmt/recreate/action' },
                ]
            },
            {
                key: 'pm-standardization',
                label: 'Danh sách yêu cầu chuẩn hóa dữ liệu (Điều chỉnh dữ liệu)',
                icon: <CheckSquareOutlined />,
                children: [
                    { key: 'pm-std-legal', label: 'Yêu cầu chuẩn hóa thông tin pháp lý', path: '/product-mgmt/standardize/legal' },
                    { key: 'pm-std-credit', label: 'Yêu cầu chuẩn hóa thông tin tín dụng', path: '/product-mgmt/standardize/credit' },
                ]
            },
            {
                key: 'pm-bulk-results',
                label: 'Kết quả xử lý hàng loạt',
                icon: <UnorderedListOutlined />,
                path: '/product-mgmt/bulk-results'
            },
            {
                key: 'pm-rules-config',
                label: 'Cấu hình quy tắc',
                icon: <SettingOutlined />,
                children: [
                    { key: 'pm-rules-reply-time', label: 'Cấu hình thời gian trả lời tin', path: '/product-mgmt/rules/reply-time' },
                    { key: 'pm-rules-feedback-deadline', label: 'Cấu hình thời hạn phản hồi sản phẩm  - dành cho đơn vị hỏi tin', path: '/product-mgmt/rules/feedback-deadline' },
                    { key: 'pm-rules-creation-check', label: 'Cấu hình quy tắc kiểm tra dữ liệu tạo lập sản phẩm', path: '/product-mgmt/rules/creation-check' },
                    { key: 'pm-rules-auto-provision', label: 'Cấu hình sản phẩm cung cấp tự động', path: '/product-mgmt/rules/auto-provision' },
                    { key: 'pm-rules-block-provision', label: 'Chặn cung cấp thông tin', path: '/product-mgmt/rules/block-provision' },
                    { key: 'pm-rules-freeze-tctd', label: 'Đóng băng TCTD', path: '/product-mgmt/rules/freeze-tctd' },
                    { key: 'pm-rules-file-template', label: 'Cấu hình mẫu file hỏi tin', path: '/product-mgmt/rules/file-template' },
                    { key: 'pm-rules-recreate-deadline', label: 'Cấu hình thời hạn tạo lập lại sản phẩm', path: '/product-mgmt/rules/recreate-deadline' },
                    { key: 'pm-rules-recreate-confirm-deadline', label: 'Cấu hình thời hạn xác nhận tạo lập lại sản phẩm - dành cho đơn vị hỏi tin', path: '/product-mgmt/rules/recreate-confirm-deadline' },
                ]
            }
        ]
    },
    {
        id: 'ops-support',
        name: 'Hỗ trợ vận hành',
        icon: <TeamOutlined />,
        color: colors.subsystem.ops,
        menuItems: [
            { key: 'ops-support-dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/ops-support/dashboard' },
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
                    { key: 'ops-assign-criteria', label: 'Thiết lập tiêu chí phân công', path: '/ops-support/assignment/criteria' },
                    { key: 'ops-assign-staff', label: 'Cán bộ phụ trách Tập đoàn, TCT', path: '/ops-support/assignment/staff' },
                ]
            },
            {
                key: 'ops-system-admin',
                label: 'Quản trị hệ thống',
                icon: <SettingOutlined />,
                children: [
                    { key: 'ops-admin-catalog', label: 'Quản lý danh mục', path: '/ops-support/system/categories' },
                    { key: 'ops-admin-functions', label: 'Quản lý chức năng', path: '/ops-support/system/functions' },
                    { key: 'ops-admin-jobs', label: 'Quản lý job', path: '/ops-support/job-management' },
                    { key: 'ops-admin-jobs-simple', label: 'Quản lý Job (đơn giản)', path: '/ops-support/jobs' },
                    { key: 'ops-admin-errors', label: 'Quản lý mã lỗi', path: '/ops-support/system/error-codes' },
                ]
            },
            {
                key: 'ops-notifications',
                label: 'Quản lý thông báo',
                icon: <BellOutlined />,
                children: [
                    { key: 'ops-notify-search', label: 'Tra cứu thông báo', path: '/ops-support/notifications' },
                    { key: 'ops-notify-templates', label: 'Quản lý mẫu thông báo', path: '/ops-support/notification-template' },
                    { key: 'ops-notify-variables', label: 'Quản lý biến thông báo', path: '/ops-support/variable-registry' },
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
                key: 'ops-config',
                label: 'Cấu hình hệ thống',
                icon: <SettingOutlined />,
                children: [
                    { key: 'ops-cfg-policy', label: 'Chính sách tài khoản', path: '/ops-support/config/policy' },
                    { key: 'ops-cfg-params', label: 'Cấu hình tham số hệ thống', path: '/ops-support/config/parameters' },
                    { key: 'ops-cfg-workday', label: 'Cấu hình ngày làm việc', path: '/ops-support/config/workdays' },
                ]
            },
            {
                key: 'ops-investigation',
                label: 'Quản lý tra soát',
                icon: <SwapOutlined />,
                children: [
                    { key: 'ops-invest-to-credit', label: 'Tra soát gửi TCTD', path: '/ops-support/investigation/send-tctd' },
                    { key: 'ops-invest-from-credit', label: 'Tra soát từ TCTD', path: '/ops-support/investigation/receive-tctd' },
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
                key: 'dg-metadata-mgmt',
                label: 'Quản trị siêu dữ liệu',
                icon: <DatabaseOutlined />,
                children: [
                    { key: 'dg-meta-search', label: 'Tra cứu thông tin đặc tính dữ liệu (metadata)', path: '/data-governance/metadata/search' },
                    { key: 'dg-meta-update', label: 'Cập nhật thông tin về đặc tính dữ liệu', path: '/data-governance/metadata/update' },
                ]
            },
            {
                key: 'dg-business-assets',
                label: 'Quản lý tài sản nghiệp vụ',
                icon: <AuditOutlined />,
                children: [
                    { key: 'dg-biz-search', label: 'Tra cứu danh sách thông tin tài sản nghiệp vụ cần quản trị', path: '/data-governance/business/search' },
                    { key: 'dg-biz-config', label: 'Cấu hình thông tin thuộc tính của tài sản nghiệp vụ cần quản trị', path: '/data-governance/business/config' },
                    { key: 'dg-biz-config-search', label: 'Tra cứu thông tin cấu hình thông tin thuộc tính của tài sản nghiệp vụ cần quản trị', path: '/data-governance/business/config-search' },
                    { key: 'dg-biz-exploit', label: 'Tra cứu/Khai thác thông tin quản trị dữ liệu về tài sản nghiệp vụ', path: '/data-governance/business/exploit' },
                ]
            },
            {
                key: 'dg-technical-assets',
                label: 'Quản lý tài sản kỹ thuật',
                icon: <CloudServerOutlined />,
                children: [
                    { key: 'dg-tech-update', label: 'Cập nhật thông tin giá trị về tài sản kỹ thuật', path: '/data-governance/technical/update' },
                    { key: 'dg-tech-exploit', label: 'Tra cứu/khai thác thông tin quản trị dữ liệu về tài sản kỹ thuật', path: '/data-governance/technical/exploit' },
                    { key: 'dg-tech-both-exploit', label: 'Tra cứu/Khai thác thông tin quản trị dữ liệu về tài sản nghiệp vụ và tài sản kỹ thuật', path: '/data-governance/technical/both-exploit' },
                ]
            },
            {
                key: 'dg-lineage-mgmt',
                label: 'Quản lý lineage (dòng dữ liệu)',
                icon: <ClusterOutlined />,
                children: [
                    { key: 'dg-lineage-track-list', label: 'Quản lý danh sách thông tin loại dữ liệu cần theo dõi dòng dữ liệu', path: '/data-governance/lineage/track-list' },
                    { key: 'dg-lineage-search-list', label: 'Tra cứu danh sách thông tin loại dữ liệu cần theo dõi dòng dữ liệu', path: '/data-governance/lineage/search-list' },
                    { key: 'dg-lineage-schema-exploit', label: 'Tra cứu/Khai thác lược đồ về luồng dữ liệu', path: '/data-governance/lineage/schema-exploit' },
                ]
            },
            {
                key: 'dg-quality-mgmt',
                label: 'Quản lý chất lượng dữ liệu (Data Quality Management)',
                icon: <CheckSquareOutlined />,
                children: [
                    { key: 'dg-qual-criteria', label: 'Bộ tiêu chí đánh giá chất lượng dữ liệu', path: '/data-governance/quality/criteria' },
                    { key: 'dg-qual-rules-biz', label: 'Quy tắc về chất lượng tài sản nghiệp vụ', path: '/data-governance/quality/rules-business' },
                    { key: 'dg-qual-rules-tech', label: 'Quy tắc về chất lượng tài sản kỹ thuật', path: '/data-governance/quality/rules-technical' },
                    { key: 'dg-qual-thresholds', label: 'Ngưỡng đánh giá chất lượng dữ liệu', path: '/data-governance/quality/thresholds' },
                    { key: 'dg-qual-rules-mgmt', label: 'Quy tắc quản lý chất lượng dữ liệu', path: '/data-governance/quality/rules-mgmt' },
                    { key: 'dg-qual-eval-issues', label: 'Đánh giá và xử lý các vấn đề về chất lượng dữ liệu', path: '/data-governance/quality/eval-issues' },
                    { key: 'dg-qual-warn-thresholds', label: 'Thông báo cảnh báo vượt ngưỡng', path: '/data-governance/quality/warning-thresholds' },
                    { key: 'dg-qual-investigate-thresholds', label: 'Tra soát, xử lý dữ liệu vượt ngưỡng', path: '/data-governance/quality/investigate-thresholds' },
                ]
            },
            {
                key: 'dg-sync-config',
                label: 'Cấu hình thời gian đồng bộ từ dữ liệu tác nghiệp về vùng dữ liệu phục vụ công tác quản trị dữ liệu',
                icon: <SyncOutlined />,
                children: [
                    { key: 'dg-sync-time-config', label: 'Cấu hình thời gian đồng bộ dữ liệu phục vụ công tác quản trị dữ liệu', path: '/data-governance/sync/time-config' }
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
            {
                key: 'web-portal-home',
                label: 'Trang chủ',
                icon: <DashboardOutlined />,
                path: '/web-portal/dashboard'
            },
            {
                key: 'web-portal-report-delivery',
                label: 'Gửi báo cáo',
                icon: <CloudServerOutlined />,
                children: [
                    {
                        key: 'web-portal-report-delivery-send',
                        label: 'Gửi báo cáo',
                        path: '/web-portal/report-delivery/send'
                    },
                    {
                        key: 'web-portal-report-delivery-search',
                        label: 'Tra cứu báo cáo đã gửi',
                        path: '/web-portal/report-delivery/search'
                    },
                    {
                        key: 'web-portal-send-balance-new',
                        label: 'Gửi thông tin cân đối',
                        path: '/web-portal/send-balance/new'
                    },
                    {
                        key: 'web-portal-send-balance',
                        label: 'Tra cứu thông tin cân đối',
                        path: '/web-portal/send-balance'
                    }
                ]
            },
            {
                key: 'web-portal-catalog-mgmt',
                label: 'Đăng ký khai thác',
                icon: <BookOutlined />,
                children: [
                    {
                        key: 'web-portal-catalog-mgmt-search',
                        label: 'Tra cứu catalogue sản phẩm',
                        path: '/web-portal/catalog-mgmt/search'
                    },
                    {
                        key: 'web-portal-catalog-mgmt-cic-search',
                        label: 'Tra cứu mã CIC',
                        path: '/web-portal/catalog-mgmt/cic-search'
                    },
                    {
                        key: 'web-portal-catalog-mgmt-register',
                        label: 'Đăng ký nhu cầu khai thác báo cáo',
                        path: '/web-portal/catalog-mgmt/register'
                    }
                ]
            },
            {
                key: 'web-portal-exploitation',
                label: 'Khai thác sản phẩm',
                icon: <FileTextOutlined />,
                children: [
                    {
                        key: 'web-portal-exploitation-request',
                        label: 'Sản phẩm theo yêu cầu',
                        children: [
                            {
                                key: 'web-portal-exploitation-request-register',
                                label: 'Đăng ký SP theo yêu cầu',
                                path: '/web-portal/exploitation/request/register'
                            },
                            {
                                key: 'web-portal-exploitation-request-inquiry',
                                label: 'Hỏi tin SP theo yêu cầu',
                                path: '/web-portal/exploitation/request/inquiry'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-exploitation-customer',
                        label: 'Hỏi tin khách hàng',
                        children: [
                            {
                                key: 'web-portal-exploitation-customer-instant',
                                label: 'Hỏi trả lời tin tức thời',
                                children: [
                                    {
                                        key: 'web-portal-exploitation-customer-instant-inquiry',
                                        label: 'Hỏi tin khách hàng',
                                        path: '/web-portal/exploitation/customer/instant/inquiry'
                                    },
                                    {
                                        key: 'web-portal-exploitation-customer-instant-response',
                                        label: 'Trả lời tin khách hàng',
                                        path: '/web-portal/exploitation/customer/instant/response'
                                    },
                                    {
                                        key: 'web-portal-exploitation-customer-instant-history',
                                        label: 'Lịch sử hỏi tin',
                                        path: '/web-portal/exploitation/customer/instant/history'
                                    }
                                ]
                            },
                            {
                                key: 'web-portal-exploitation-customer-batch',
                                label: 'Hỏi trả lời tin theo lô',
                                children: [
                                    {
                                        key: 'web-portal-exploitation-customer-batch-inquiry',
                                        label: 'Hỏi tin theo lô',
                                        path: '/web-portal/exploitation/customer/batch/inquiry'
                                    },
                                    {
                                        key: 'web-portal-exploitation-customer-batch-response',
                                        label: 'Trả lời tin theo lô',
                                        path: '/web-portal/exploitation/customer/batch/response'
                                    },
                                    {
                                        key: 'web-portal-exploitation-customer-batch-history',
                                        label: 'Lịch sử hỏi tin',
                                        path: '/web-portal/exploitation/customer/batch/history'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'web-portal-exploitation-foreign',
                        label: 'Hỏi tin doanh nghiệp nước ngoài',
                        children: [
                            {
                                key: 'web-portal-exploitation-foreign-inquiry',
                                label: 'Hỏi tin doanh nghiệp nước ngoài',
                                path: '/web-portal/exploitation/foreign/inquiry'
                            },
                            {
                                key: 'web-portal-exploitation-foreign-responses',
                                label: 'Danh sách bản trả lời tin',
                                path: '/web-portal/exploitation/foreign/responses'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-exploitation-rating',
                        label: 'Hỏi tin xếp hạng tín dụng',
                        children: [
                            {
                                key: 'web-portal-exploitation-rating-customer',
                                label: 'Hỏi tin khách hàng',
                                path: '/web-portal/exploitation/rating/customer'
                            },
                            {
                                key: 'web-portal-exploitation-rating-batch',
                                label: 'Hỏi tin theo lô',
                                path: '/web-portal/exploitation/rating/batch'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-exploitation-periodic',
                        label: 'Khai thác sản phẩm định kỳ',
                        children: [
                            {
                                key: 'web-portal-exploitation-periodic-search',
                                label: 'Tra cứu sản phẩm định kỳ',
                                path: '/web-portal/exploitation/periodic/search'
                            },
                            {
                                key: 'web-portal-exploitation-periodic-adjust',
                                label: 'Tra cứu công văn điều chỉnh sản phẩm định kỳ',
                                path: '/web-portal/exploitation/periodic/adjust'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-analytics',
                        label: 'Bài viết phân tích, cảnh báo',
                        children: [
                            {
                                key: 'web-portal-analytics-r52',
                                label: 'Bài viết phân tích, cảnh báo',
                                path: '/web-portal/analytics/r52'
                            }
                        ]
                    }
                ]
            },
            {
                key: 'web-portal-support',
                label: 'Hỗ trợ/ Tư vấn',
                icon: <TeamOutlined />,
                path: '/web-portal/support'
            },
            {
                key: 'web-portal-billing-investigation-parent',
                label: 'Hóa đơn & Tra soát',
                icon: <DollarOutlined />,
                children: [
                    {
                        key: 'web-portal-billing',
                        label: 'Thanh toán & Hóa đơn',
                        children: [
                            {
                                key: 'web-portal-billing-invoices',
                                label: 'Tra cứu hóa đơn',
                                path: '/web-portal/billing/invoices'
                            },
                            {
                                key: 'web-portal-billing-stats',
                                label: 'Thống kê số lượng hỏi tin',
                                path: '/web-portal/billing/stats'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-investigation',
                        label: 'Quản lý tra soát',
                        children: [
                            {
                                key: 'web-portal-investigation-from-cic',
                                label: 'Tra soát nhận từ CIC',
                                path: '/web-portal/investigation/from-cic'
                            },
                            {
                                key: 'web-portal-investigation-to-cic',
                                label: 'Tra soát gửi CIC',
                                path: '/web-portal/investigation/to-cic'
                            }
                        ]
                    }
                ]
            },
            {
                key: 'web-portal-admin-parent',
                label: 'Quản trị',
                icon: <SettingOutlined />,
                children: [
                    {
                        key: 'web-portal-account-mgmt',
                        label: 'Quản trị tài khoản',
                        children: [
                            {
                                key: 'web-portal-account-mgmt-list',
                                label: 'Danh sách tài khoản ngoài CIC',
                                path: '/web-portal/account-mgmt/list'
                            },
                            {
                                key: 'web-portal-account-mgmt-permissions',
                                label: 'Phân quyền tài khoản ngoài CIC',
                                path: '/web-portal/account-mgmt/permissions'
                            }
                        ]
                    },
                    {
                        key: 'web-portal-cms',
                        label: 'Quản lý tin tức (CMS)',
                        children: [
                            {
                                key: 'web-portal-cms-news',
                                label: 'Quản lý tin tức',
                                path: '/web-portal/cms/news'
                            },
                            {
                                key: 'web-portal-cms-contacts',
                                label: 'Quản lý thông tin liên hệ',
                                path: '/web-portal/cms/contacts'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'tools',
        name: 'Công cụ nội bộ',
        icon: <AppstoreOutlined />,
        color: colors.subsystem.tools,
        menuItems: [
            {
                key: 'tools-ui-doc-generator',
                label: 'Sinh tài liệu giao diện',
                icon: <RobotOutlined />,
                path: '/tools/ui-doc-generator',
            },
        ],
    }
];

export const SHARED_MENU: MenuItem[] = [];

/* export */ const DESIGN_SYSTEM_SUB: SubSystem = {
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
                { key: 'ds-column-settings', label: 'Cài đặt hiển thị', path: '/design-system/data-display/column-settings' },
                { key: 'ds-audit-log', label: 'Lịch sử thay đổi', path: '/design-system/data-display/audit-log' },
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
                { key: 'ds-spacing', label: 'Spacing & Radius', path: '/design-system/tokens/spacing' },
                { key: 'ds-shadows', label: 'Shadows & Transitions', path: '/design-system/tokens/shadows' },
            ],
        },
    ],
};

SUB_SYSTEMS.push(DESIGN_SYSTEM_SUB);

export interface MenuPathMatch {
    subSystem: SubSystem;
    item: MenuItem;
    matchedPath: string;
}

const isPathMatch = (pathname: string, menuPath: string) => {
    if (menuPath === '/') {
        return pathname === '/';
    }

    return pathname === menuPath || pathname.startsWith(`${menuPath}/`);
};

const collectPathMatches = (
    items: MenuItem[],
    pathname: string,
    subSystem: SubSystem,
    matches: MenuPathMatch[]
) => {
    items.forEach(item => {
        if (item.path && item.path !== '#' && isPathMatch(pathname, item.path)) {
            matches.push({
                subSystem,
                item,
                matchedPath: item.path,
            });
        }

        if (item.children) {
            collectPathMatches(item.children, pathname, subSystem, matches);
        }
    });
};

export const findMenuPathMatch = (pathname: string | null | undefined): MenuPathMatch | undefined => {
    if (!pathname) return undefined;

    const matches: MenuPathMatch[] = [];

    SUB_SYSTEMS.forEach(subSystem => {
        collectPathMatches(subSystem.menuItems, pathname, subSystem, matches);
    });

    return matches.sort((a, b) => b.matchedPath.length - a.matchedPath.length)[0];
};

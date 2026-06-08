'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Collapse, Tag, Tooltip, Typography, Space, Spin, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { CodeText } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const INITIAL_COUNT = 8;
const LOAD_MORE     = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldChange { field: string; value: string; }

interface AuditRow {
    key: string;
    stt: number;
    thoiGian: string;
    nguoiCapNhat: string;
    hanhDong: 'CREATE' | 'UPDATE' | 'DELETE';
    giaTriCu: FieldChange[];
    giaTriMoi: FieldChange[];
    diaChiIP: string;
    moTa: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_STYLE: Record<string, { color: string; bg: string; label: string }> = {
    CREATE: { color: colors.success.base, bg: colors.success.light, label: 'Thêm mới' },
    UPDATE: { color: colors.warning.base, bg: colors.warning.light, label: 'Cập nhật' },
    DELETE: { color: colors.error.base,   bg: colors.error.light,   label: 'Xóa'      },
};

// Sorted newest first
const MOCK_DATA: AuditRow[] = [
    {
        key: '1', stt: 1, thoiGian: '08/06/2026 14:32', nguoiCapNhat: 'jdoe', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Phạm vi', value: 'Nhóm A, Nhóm B' }],
        giaTriMoi: [{ field: 'Phạm vi', value: 'Nhóm A, Nhóm B, Nhóm C' }],
        diaChiIP: '10.0.1.45', moTa: 'Chỉnh sửa phạm vi áp dụng — bổ sung Nhóm C vào danh sách được phân quyền',
    },
    {
        key: '2', stt: 2, thoiGian: '05/06/2026 09:15', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Trạng thái', value: 'Tạm dừng' }, { field: 'Ngày hiệu lực', value: '01/06/2026' }],
        giaTriMoi: [{ field: 'Trạng thái', value: 'Hoạt động' }, { field: 'Ngày hiệu lực', value: '05/06/2026' }],
        diaChiIP: '10.0.1.12', moTa: 'Kích hoạt lại sau kỳ bảo trì hệ thống định kỳ tháng 6',
    },
    {
        key: '3', stt: 3, thoiGian: '01/06/2026 11:00', nguoiCapNhat: 'jdoe', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên nhóm', value: 'Nhóm người dùng nội bộ' }, { field: 'Loại', value: 'Internal' }, { field: 'Trạng thái', value: 'Hoạt động' }],
        diaChiIP: '10.0.1.45', moTa: 'Tạo mới nhóm người sử dụng nội bộ cho phòng ban Kế hoạch',
    },
    {
        key: '4', stt: 4, thoiGian: '28/05/2026 16:45', nguoiCapNhat: 'ntrang', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Mô tả', value: 'Mô tả cũ ngắn' }],
        giaTriMoi: [{ field: 'Mô tả', value: 'Mô tả chi tiết hơn về chức năng và phạm vi sử dụng của nhóm này trong hệ thống CIC' }],
        diaChiIP: '10.0.2.88', moTa: 'Cập nhật mô tả nhóm theo yêu cầu của phòng quản lý',
    },
    {
        key: '5', stt: 5, thoiGian: '20/05/2026 10:30', nguoiCapNhat: 'admin', hanhDong: 'DELETE',
        giaTriCu: [{ field: 'Tên nhóm', value: 'Nhóm thử nghiệm Beta' }, { field: 'Trạng thái', value: 'Tạm dừng' }],
        giaTriMoi: [],
        diaChiIP: '10.0.1.12', moTa: 'Xóa nhóm thử nghiệm sau khi hoàn thành giai đoạn UAT',
    },
    {
        key: '6', stt: 6, thoiGian: '15/05/2026 08:20', nguoiCapNhat: 'ntrang', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Quyền hạn', value: 'Xem, Sửa' }],
        giaTriMoi: [{ field: 'Quyền hạn', value: 'Xem, Sửa, Xóa' }],
        diaChiIP: '', moTa: 'Bổ sung quyền Xóa cho nhóm theo đề nghị trưởng bộ phận',
    },
    {
        key: '7', stt: 7, thoiGian: '10/05/2026 14:00', nguoiCapNhat: 'jdoe', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên chính sách', value: 'Chính sách truy cập API' }, { field: 'Phạm vi', value: 'Toàn hệ thống' }],
        diaChiIP: '10.0.1.45', moTa: 'Khởi tạo chính sách truy cập API mới theo tiêu chuẩn bảo mật ISO 27001',
    },
    {
        key: '8', stt: 8, thoiGian: '05/05/2026 11:30', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Ngày hết hạn', value: '31/05/2026' }],
        giaTriMoi: [{ field: 'Ngày hết hạn', value: '31/12/2026' }],
        diaChiIP: '10.0.1.12', moTa: 'Gia hạn hiệu lực đến cuối năm 2026',
    },
    {
        key: '9', stt: 9, thoiGian: '01/05/2026 09:00', nguoiCapNhat: 'ntrang', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Người phụ trách', value: 'Nguyễn Văn A' }],
        giaTriMoi: [{ field: 'Người phụ trách', value: 'Trần Thị B' }],
        diaChiIP: '10.0.2.33', moTa: 'Chuyển giao phụ trách nhóm do nhân sự luân chuyển công tác',
    },
    {
        key: '10', stt: 10, thoiGian: '25/04/2026 15:00', nguoiCapNhat: 'jdoe', hanhDong: 'DELETE',
        giaTriCu: [{ field: 'Tên', value: 'Policy cũ 2023' }, { field: 'Phiên bản', value: 'v1.2' }],
        giaTriMoi: [],
        diaChiIP: '', moTa: 'Xóa chính sách cũ đã hết hiệu lực và được thay thế bởi phiên bản v2.0',
    },
    {
        key: '11', stt: 11, thoiGian: '20/04/2026 10:45', nguoiCapNhat: 'admin', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên vai trò', value: 'Kiểm toán viên' }, { field: 'Quyền hạn', value: 'Chỉ đọc' }],
        diaChiIP: '10.0.1.12', moTa: 'Tạo mới vai trò Kiểm toán viên phục vụ kiểm tra nội bộ quý II',
    },
    {
        key: '12', stt: 12, thoiGian: '15/04/2026 14:20', nguoiCapNhat: 'ntrang', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Giới hạn phiên', value: '30 phút' }],
        giaTriMoi: [{ field: 'Giới hạn phiên', value: '60 phút' }],
        diaChiIP: '10.0.2.88', moTa: 'Nâng thời gian phiên đăng nhập theo phản hồi người dùng',
    },
    {
        key: '13', stt: 13, thoiGian: '10/04/2026 09:30', nguoiCapNhat: 'jdoe', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Email thông báo', value: 'old@company.vn' }, { field: 'SĐT', value: '0901000001' }],
        giaTriMoi: [{ field: 'Email thông báo', value: 'new@company.vn' }, { field: 'SĐT', value: '0901000002' }],
        diaChiIP: '10.0.1.45', moTa: 'Cập nhật thông tin liên hệ đầu mối phụ trách',
    },
    {
        key: '14', stt: 14, thoiGian: '05/04/2026 16:00', nguoiCapNhat: 'admin', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên cấu hình', value: 'Config môi trường Production' }],
        diaChiIP: '10.0.1.12', moTa: 'Khởi tạo cấu hình cho môi trường Production trước khi go-live',
    },
    {
        key: '15', stt: 15, thoiGian: '01/04/2026 08:00', nguoiCapNhat: 'ntrang', hanhDong: 'DELETE',
        giaTriCu: [{ field: 'Tên', value: 'Cấu hình staging cũ' }],
        giaTriMoi: [],
        diaChiIP: '10.0.2.33', moTa: 'Xóa cấu hình staging sau khi nâng cấp lên phiên bản mới',
    },
    {
        key: '16', stt: 16, thoiGian: '20/03/2026 11:00', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Ngưỡng cảnh báo', value: '80%' }],
        giaTriMoi: [{ field: 'Ngưỡng cảnh báo', value: '90%' }],
        diaChiIP: '10.0.1.12', moTa: 'Điều chỉnh ngưỡng cảnh báo theo kết quả phân tích hiệu năng tháng 3',
    },
    {
        key: '17', stt: 17, thoiGian: '10/03/2026 14:15', nguoiCapNhat: 'jdoe', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên template', value: 'Template báo cáo tháng' }, { field: 'Loại', value: 'Định kỳ' }],
        diaChiIP: '10.0.1.45', moTa: 'Khởi tạo template báo cáo tháng cho nhóm kiểm toán nội bộ',
    },
    {
        key: '18', stt: 18, thoiGian: '28/02/2026 09:30', nguoiCapNhat: 'ntrang', hanhDong: 'DELETE',
        giaTriCu: [{ field: 'Tên', value: 'Template cũ Q4/2025' }],
        giaTriMoi: [],
        diaChiIP: '', moTa: 'Xóa template cũ sau khi chuyển sang hệ thống báo cáo mới',
    },
    {
        key: '19', stt: 19, thoiGian: '15/02/2026 16:00', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Chu kỳ làm mới', value: '24 giờ' }],
        giaTriMoi: [{ field: 'Chu kỳ làm mới', value: '12 giờ' }],
        diaChiIP: '10.0.1.12', moTa: 'Rút ngắn chu kỳ làm mới cache để tăng tính thời gian thực của dữ liệu',
    },
    {
        key: '20', stt: 20, thoiGian: '05/02/2026 10:00', nguoiCapNhat: 'jdoe', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Phiên bản', value: 'v2.1.0' }],
        giaTriMoi: [{ field: 'Phiên bản', value: 'v2.2.0' }],
        diaChiIP: '10.0.1.45', moTa: 'Nâng cấp phiên bản module xử lý dữ liệu lên v2.2.0',
    },
    {
        key: '21', stt: 21, thoiGian: '20/01/2026 13:30', nguoiCapNhat: 'ntrang', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [{ field: 'Tên nhóm', value: 'Nhóm Vận hành 2026' }, { field: 'Số thành viên', value: '12' }],
        diaChiIP: '10.0.2.88', moTa: 'Tạo nhóm vận hành cho năm 2026 theo cơ cấu tổ chức mới',
    },
    {
        key: '22', stt: 22, thoiGian: '10/01/2026 08:45', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Chính sách mật khẩu', value: '8 ký tự' }],
        giaTriMoi: [{ field: 'Chính sách mật khẩu', value: '12 ký tự + ký tự đặc biệt' }],
        diaChiIP: '10.0.1.12', moTa: 'Nâng cấp chính sách mật khẩu theo yêu cầu bảo mật năm 2026',
    },
];

const USER_FILTERS = Array.from(new Set(MOCK_DATA.map(r => r.nguoiCapNhat)))
    .map(u => ({ text: u, value: u }));

// ─── Sub-components ───────────────────────────────────────────────────────────

const TruncatedCell: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return <span style={{ color: colors.text.tertiary }}>—</span>;
    return (
        <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{text}</span>} placement="topLeft">
            <div style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                cursor: 'pointer',
                wordBreak: 'break-word',
                lineHeight: 1.5,
            } as React.CSSProperties}>
                {text}
            </div>
        </Tooltip>
    );
};

const renderChanges = (changes: FieldChange[]) => {
    if (!changes.length) return <span style={{ color: colors.text.tertiary }}>—</span>;
    const text = changes.map(c => `${c.field}: ${c.value}`).join('\n');
    return <TruncatedCell text={text} />;
};

// ─── Component ────────────────────────────────────────────────────────────────

const AuditLogDemo: React.FC = () => {
    const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
    const [loadingMore,  setLoadingMore]  = useState(false);

    const wrapperRef  = useRef<HTMLDivElement>(null);
    const loadingRef  = useRef(false);
    const hasMoreRef  = useRef(displayCount < MOCK_DATA.length);

    // Keep hasMoreRef in sync with state
    useEffect(() => { hasMoreRef.current = displayCount < MOCK_DATA.length; }, [displayCount]);

    useHeaderActions({ title: 'Lịch sử thay đổi' }, []);

    const handleScroll = useCallback(() => {
        if (loadingRef.current || !hasMoreRef.current) return;
        const body = wrapperRef.current?.querySelector<HTMLElement>('.ant-table-body');
        if (!body) return;
        if (body.scrollTop + body.clientHeight >= body.scrollHeight - 50) {
            loadingRef.current = true;
            setLoadingMore(true);
            setTimeout(() => {
                setDisplayCount(prev => Math.min(prev + LOAD_MORE, MOCK_DATA.length));
                setLoadingMore(false);
                loadingRef.current = false;
            }, 600);
        }
    }, []);

    useEffect(() => {
        const body = wrapperRef.current?.querySelector<HTMLElement>('.ant-table-body');
        if (!body) return;
        body.addEventListener('scroll', handleScroll);
        return () => body.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleReset = () => {
        setDisplayCount(INITIAL_COUNT);
        const body = wrapperRef.current?.querySelector<HTMLElement>('.ant-table-body');
        if (body) body.scrollTop = 0;
    };

    const displayedData = MOCK_DATA.slice(0, displayCount);
    const hasMore       = displayCount < MOCK_DATA.length;

    return (
        <ComponentShowcase
            name="Lịch sử thay đổi"
            group="data-display"
            description="Audit log dạng collapsible, nhúng trong trang chi tiết. Bảng cao cố định 250px — scroll dọc tự động tải thêm bản ghi khi gần cuối. Chỉ hiển thị các trường thực sự thay đổi."
            behaviors={[
                'Collapse mở/thu — click header toggle; badge hiện tổng số bản ghi trong CSDL',
                'Bảng cao tối đa 250px, scroll dọc bên trong; cuộn đến cách cuối 50px → tự động tải thêm 5 bản ghi',
                'Khi đang tải thêm: Spin hiển thị bên dưới bảng; khi hết dữ liệu: hiển thị text thông báo',
                'Hành động: tag xanh lá (Thêm mới) / cam (Cập nhật) / đỏ (Xóa) — màu từ design tokens',
                'Giá trị cũ/mới chỉ hiển thị các trường thực sự thay đổi (CREATE → Giá trị cũ = "—")',
                'Ô dài: tối đa 2 dòng — hover Tooltip để xem toàn bộ nội dung',
                'Column filter: Người cập nhật (multi) và Hành động (multi) — áp dụng trên dữ liệu đã tải',
            ]}
            wide
            demoMinHeight={380}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        style={{ width: '100%' }}
                    >
                        Đặt lại (về 8 bản ghi)
                    </Button>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                        Reset scroll về đầu, ẩn lại các bản ghi đã tải thêm.
                    </Text>
                </Space>
            }
            code={`// Infinite scroll: gắn listener vào .ant-table-body bên trong wrapper ref
const wrapperRef = useRef(null);
const loadingRef = useRef(false);

const handleScroll = useCallback(() => {
  if (loadingRef.current || !hasMore) return;
  const body = wrapperRef.current?.querySelector('.ant-table-body');
  if (!body) return;
  if (body.scrollTop + body.clientHeight >= body.scrollHeight - 50) {
    loadingRef.current = true;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + LOAD_MORE, total));
      setLoadingMore(false);
      loadingRef.current = false;
    }, 600);
  }
}, [hasMore]);

useEffect(() => {
  const body = wrapperRef.current?.querySelector('.ant-table-body');
  if (!body) return;
  body.addEventListener('scroll', handleScroll);
  return () => body.removeEventListener('scroll', handleScroll);
}, [handleScroll]);

// Collapse + Table
<Collapse items={[{
  key: 'audit',
  label: <><Text strong>Lịch sử thay đổi</Text><Tag>{total}</Tag></>,
  styles: { body: { padding: 0 } },
  children: (
    <>
      <div ref={wrapperRef}>
        <Table dataSource={data.slice(0, displayCount)} pagination={false}
          scroll={{ x: 1000, y: 250 }} />
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        {loadingMore ? <Spin size="small" /> : !hasMore && <Text>Đã hiển thị toàn bộ</Text>}
      </div>
    </>
  ),
}]} />`}
        >
            <Collapse
                expandIconPosition="start"
                defaultActiveKey={['audit']}
                style={{
                    background: colors.bg.container,
                    border: `1px solid ${colors.border.split}`,
                    borderRadius: radius.lg,
                }}
                items={[{
                    key: 'audit',
                    label: (
                        <Space size={8}>
                            <Text strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                                Lịch sử thay đổi
                            </Text>
                            <Tag style={{
                                background: colors.primary[50],
                                color: colors.primary[500],
                                border: 'none',
                                fontSize: typography.fontSize.xs,
                                lineHeight: '18px',
                                margin: 0,
                            }}>
                                {MOCK_DATA.length}
                            </Tag>
                        </Space>
                    ),
                    style: { background: colors.bg.subtle },
                    styles: { body: { padding: 0 } },
                    children: (
                        <>
                            <div ref={wrapperRef}>
                                <Table<AuditRow>
                                    dataSource={displayedData}
                                    rowKey="key"
                                    size="small"
                                    pagination={false}
                                    scroll={{ x: 1000, y: 250 }}
                                    columns={[
                                        {
                                            title: 'STT', dataIndex: 'stt', key: 'stt',
                                            width: 55, align: 'center', fixed: 'left',
                                        },
                                        {
                                            title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian',
                                            width: 130, align: 'center',
                                        },
                                        {
                                            title: 'Người cập nhật', dataIndex: 'nguoiCapNhat', key: 'nguoiCapNhat',
                                            width: 155,
                                            filters: USER_FILTERS,
                                            onFilter: (value, record) => record.nguoiCapNhat === value,
                                            filterMultiple: true,
                                        },
                                        {
                                            title: 'Hành động', dataIndex: 'hanhDong', key: 'hanhDong',
                                            width: 110, align: 'center',
                                            filters: [
                                                { text: 'Thêm mới', value: 'CREATE' },
                                                { text: 'Cập nhật', value: 'UPDATE' },
                                                { text: 'Xóa',      value: 'DELETE' },
                                            ],
                                            onFilter: (value, record) => record.hanhDong === value,
                                            filterMultiple: true,
                                            render: (v: string) => {
                                                const s = ACTION_STYLE[v];
                                                return (
                                                    <Tag style={{
                                                        color: s.color, background: s.bg, border: 'none',
                                                        fontSize: typography.fontSize.xs, margin: 0,
                                                    }}>
                                                        {s.label}
                                                    </Tag>
                                                );
                                            },
                                        },
                                        {
                                            title: 'Giá trị cũ', dataIndex: 'giaTriCu', key: 'giaTriCu',
                                            width: 180,
                                            render: (v: FieldChange[]) => renderChanges(v),
                                        },
                                        {
                                            title: 'Giá trị mới', dataIndex: 'giaTriMoi', key: 'giaTriMoi',
                                            width: 180,
                                            render: (v: FieldChange[]) => renderChanges(v),
                                        },
                                        {
                                            title: 'Địa chỉ IP', dataIndex: 'diaChiIP', key: 'diaChiIP',
                                            width: 120, align: 'center',
                                            render: (v: string) => v
                                                ? <CodeText>{v}</CodeText>
                                                : <span style={{ color: colors.text.tertiary }}>—</span>,
                                        },
                                        {
                                            title: 'Mô tả', dataIndex: 'moTa', key: 'moTa',
                                            minWidth: 200,
                                            render: (v: string) => <TruncatedCell text={v} />,
                                        },
                                    ]}
                                />
                            </div>

                            {/* Load-more indicator */}
                            <div style={{
                                textAlign: 'center',
                                padding: `${spacing[2]} 0`,
                                borderTop: `1px solid ${colors.border.split}`,
                                minHeight: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: spacing[2],
                            }}>
                                {loadingMore ? (
                                    <>
                                        <Spin size="small" />
                                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                                            Đang tải thêm…
                                        </Text>
                                    </>
                                ) : !hasMore ? (
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                                        Đã hiển thị toàn bộ {MOCK_DATA.length} lịch sử
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                                        Đang hiển thị {displayCount}/{MOCK_DATA.length} — cuộn xuống để tải thêm
                                    </Text>
                                )}
                            </div>
                        </>
                    ),
                }]}
            />
        </ComponentShowcase>
    );
};

export default AuditLogDemo;

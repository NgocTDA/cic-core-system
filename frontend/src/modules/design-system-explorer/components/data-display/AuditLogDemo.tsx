'use client';

import React, { useState } from 'react';
import { Table, Collapse, Tag, Tooltip, Typography, Space, Switch } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { SectionCard, CodeText, tablePagination } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

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

// Sorted newest first (thoiGian format: DD/MM/YYYY HH:mm)
const MOCK_DATA: AuditRow[] = [
    {
        key: '1', stt: 1, thoiGian: '08/06/2026 14:32', nguoiCapNhat: 'jdoe', hanhDong: 'UPDATE',
        giaTriCu: [{ field: 'Phạm vi', value: 'Nhóm A, Nhóm B' }],
        giaTriMoi: [{ field: 'Phạm vi', value: 'Nhóm A, Nhóm B, Nhóm C' }],
        diaChiIP: '10.0.1.45', moTa: 'Chỉnh sửa phạm vi áp dụng — bổ sung Nhóm C vào danh sách được phân quyền',
    },
    {
        key: '2', stt: 2, thoiGian: '05/06/2026 09:15', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [
            { field: 'Trạng thái', value: 'Tạm dừng' },
            { field: 'Ngày hiệu lực', value: '01/06/2026' },
        ],
        giaTriMoi: [
            { field: 'Trạng thái', value: 'Hoạt động' },
            { field: 'Ngày hiệu lực', value: '05/06/2026' },
        ],
        diaChiIP: '10.0.1.12', moTa: 'Kích hoạt lại sau kỳ bảo trì hệ thống định kỳ tháng 6',
    },
    {
        key: '3', stt: 3, thoiGian: '01/06/2026 11:00', nguoiCapNhat: 'jdoe', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [
            { field: 'Tên nhóm', value: 'Nhóm người dùng nội bộ' },
            { field: 'Loại', value: 'Internal' },
            { field: 'Trạng thái', value: 'Hoạt động' },
        ],
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
        giaTriCu: [
            { field: 'Tên nhóm', value: 'Nhóm thử nghiệm Beta' },
            { field: 'Trạng thái', value: 'Tạm dừng' },
        ],
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
        giaTriMoi: [
            { field: 'Tên chính sách', value: 'Chính sách truy cập API' },
            { field: 'Phạm vi', value: 'Toàn hệ thống' },
        ],
        diaChiIP: '10.0.1.45', moTa: 'Khởi tạo chính sách truy cập API mới theo tiêu chuẩn bảo mật ISO 27001',
    },
    {
        key: '8', stt: 8, thoiGian: '05/05/2026 11:30', nguoiCapNhat: 'admin', hanhDong: 'UPDATE',
        giaTriCu: [
            { field: 'Ngày hết hạn', value: '31/05/2026' },
            { field: 'Trạng thái', value: 'Hoạt động' },
        ],
        giaTriMoi: [
            { field: 'Ngày hết hạn', value: '31/12/2026' },
            { field: 'Trạng thái', value: 'Hoạt động' },
        ],
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
        giaTriCu: [
            { field: 'Tên', value: 'Policy cũ 2023' },
            { field: 'Phiên bản', value: 'v1.2' },
        ],
        giaTriMoi: [],
        diaChiIP: '', moTa: 'Xóa chính sách cũ đã hết hiệu lực và được thay thế bởi phiên bản v2.0',
    },
    {
        key: '11', stt: 11, thoiGian: '20/04/2026 10:45', nguoiCapNhat: 'admin', hanhDong: 'CREATE',
        giaTriCu: [],
        giaTriMoi: [
            { field: 'Tên vai trò', value: 'Kiểm toán viên' },
            { field: 'Quyền hạn', value: 'Chỉ đọc' },
        ],
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
        giaTriCu: [
            { field: 'Email thông báo', value: 'old@company.vn' },
            { field: 'SĐT', value: '0901000001' },
        ],
        giaTriMoi: [
            { field: 'Email thông báo', value: 'new@company.vn' },
            { field: 'SĐT', value: '0901000002' },
        ],
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
    const [collapsed, setCollapsed] = useState(false);

    useHeaderActions({ title: 'Lịch sử thay đổi' }, []);

    return (
        <ComponentShowcase
            name="Lịch sử thay đổi"
            group="data-display"
            description="Pattern hiển thị audit log dưới dạng collapsible panel, nhúng trong trang chi tiết. Hiển thị chỉ các trường thực sự thay đổi; ô dài tự clip 2 dòng — hover để xem đầy đủ."
            behaviors={[
                'Collapse mở/thu — click header panel toggle; badge số lượng trong tiêu đề',
                'Hành động: tag xanh lá (Thêm mới) / cam (Cập nhật) / đỏ (Xóa) — màu từ design tokens',
                'Giá trị cũ/mới chỉ hiển thị các trường thực sự thay đổi (CREATE → cột Giá trị cũ = "—"; DELETE → Giá trị mới = "—")',
                'Ô dài: tối đa 2 dòng, tràn hiển thị "..." — hover Tooltip để xem toàn bộ nội dung',
                'Địa chỉ IP dùng CodeText (monospace); ô rỗng hiển thị "—"',
                'Danh sách sắp xếp mới nhất lên đầu',
            ]}
            wide
            demoMinHeight={420}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: typography.fontSize.sm }}>Mặc định thu gọn</Text>
                        <Switch checked={collapsed} onChange={setCollapsed} size="small" />
                    </div>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                        Thay đổi sẽ reset về trạng thái mặc định.
                    </Text>
                </Space>
            }
            code={`// TruncatedCell: line-clamp 2 dòng + Tooltip hover
const TruncatedCell = ({ text }) => (
  <Tooltip title={text} placement="topLeft">
    <div style={{ display: '-webkit-box', WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'pointer' }}>
      {text}
    </div>
  </Tooltip>
);

// Giá trị thay đổi theo từng trường
interface FieldChange { field: string; value: string; }
const renderChanges = (changes: FieldChange[]) => {
  if (!changes.length) return '—';
  return <TruncatedCell text={changes.map(c => \`\${c.field}: \${c.value}\`).join('\\n')} />;
};

// Action tag dùng design tokens
const ACTION_STYLE = {
  CREATE: { color: colors.success.base, bg: colors.success.light, label: 'Thêm mới' },
  UPDATE: { color: colors.warning.base, bg: colors.warning.light, label: 'Cập nhật' },
  DELETE: { color: colors.error.base,   bg: colors.error.light,   label: 'Xóa'      },
};

// Collapse layout (AntD v5 items API)
<Collapse expandIconPosition="start" defaultActiveKey={['audit']}
  style={{ border: \`1px solid \${colors.border.split}\`, borderRadius: radius.lg }}
  items={[{
    key: 'audit',
    label: <Space size={8}><Text strong>Lịch sử thay đổi</Text><Tag>{data.length}</Tag></Space>,
    style: { background: colors.bg.subtle },
    styles: { body: { padding: 0 } },
    children: <Table columns={columns} dataSource={sortedData} pagination={tablePagination({ pageSize: 5 })} />,
  }]}
/>`}
        >
            <Collapse
                key={String(collapsed)}
                expandIconPosition="start"
                defaultActiveKey={collapsed ? [] : ['audit']}
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
                        <Table<AuditRow>
                            dataSource={MOCK_DATA}
                            rowKey="key"
                            size="small"
                            scroll={{ x: 1000 }}
                            pagination={tablePagination({ pageSize: 5 })}
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
                                    width: 130,
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
                    ),
                }]}
            />
        </ComponentShowcase>
    );
};

export default AuditLogDemo;

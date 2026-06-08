'use client';

import React, { useState, useRef } from 'react';
import { Table, Input, Select, Popover, Button, Checkbox, Divider, Typography, Space } from 'antd';
import { SettingOutlined, HolderOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { FilterBar, FilterCol, SectionCard, StatusTag, tablePagination } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColOption    { key: string; label: string; disabled: boolean; }
interface FilterField  { key: string; label: string; mandatory: boolean; }
interface DataRow {
    key: string; stt: number; tenTep: string; maDauMoi: string; loaiFile: string;
    nghiepVu: string; soLuong: number; duNo: number; trangThai: string;
    ngayGui: string; nguonDuLieu: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMN_OPTIONS: ColOption[] = [
    { key: 'stt',         label: 'STT',            disabled: true  },
    { key: 'tenTep',      label: 'Tên tệp',        disabled: true  },
    { key: 'maDauMoi',    label: 'Mã đầu mối',    disabled: true  },
    { key: 'loaiFile',    label: 'Loại file',      disabled: false },
    { key: 'nghiepVu',    label: 'Nghiệp vụ',     disabled: false },
    { key: 'soLuong',     label: 'Số lượng KH',    disabled: false },
    { key: 'duNo',        label: 'Dư nợ',          disabled: false },
    { key: 'trangThai',   label: 'Trạng thái',     disabled: false },
    { key: 'ngayGui',     label: 'Ngày gửi',       disabled: false },
    { key: 'nguonDuLieu', label: 'Nguồn dữ liệu', disabled: false },
];

const DEFAULT_ORDER   = COLUMN_OPTIONS.map(c => c.key);
const DEFAULT_VISIBLE = COLUMN_OPTIONS.map(c => c.key);

const FILTER_FIELDS: FilterField[] = [
    { key: 'tenTep',      label: 'Tên tệp',        mandatory: true  },
    { key: 'loaiFile',    label: 'Loại file',      mandatory: true  },
    { key: 'maDauMoi',    label: 'Mã đầu mối',    mandatory: false },
    { key: 'nghiepVu',    label: 'Nghiệp vụ',     mandatory: false },
    { key: 'trangThai',   label: 'Trạng thái',     mandatory: false },
    { key: 'nguonDuLieu', label: 'Nguồn dữ liệu', mandatory: false },
];
const DEFAULT_ACTIVE_FILTERS = FILTER_FIELDS.filter(f => f.mandatory).map(f => f.key);

const FILE_TYPE_OPTIONS = [
    { value: 'D10', label: 'D10 — Thông tin KH'  },
    { value: 'D31', label: 'D31 — Thẻ tín dụng'  },
    { value: 'D35', label: 'D35 — Tiêu dùng'      },
    { value: 'D40', label: 'D40 — Cho vay DN'     },
    { value: 'DKQ', label: 'DKQ — Kết quả xử lý' },
];

const MOCK_DATA: DataRow[] = [
    { key:'1', stt:1, tenTep:'D403135800120250831.001.JSON', maDauMoi:'31358001', loaiFile:'D40', nghiepVu:'CHO VAY',       soLuong:1245, duNo:45_600_000_000, trangThai:'ACTIVE',   ngayGui:'31/08/2025', nguonDuLieu:'VCB' },
    { key:'2', stt:2, tenTep:'D313135800120250831.001.JSON', maDauMoi:'31358001', loaiFile:'D31', nghiepVu:'THẺ TÍN DỤNG', soLuong: 876, duNo:12_300_000_000, trangThai:'PENDING',  ngayGui:'31/08/2025', nguonDuLieu:'VCB' },
    { key:'3', stt:3, tenTep:'D103135800120250831.001.JSON', maDauMoi:'31358001', loaiFile:'D10', nghiepVu:'THÔNG TIN KH', soLuong:3102, duNo:             0, trangThai:'APPROVED', ngayGui:'31/08/2025', nguonDuLieu:'VCB' },
    { key:'4', stt:4, tenTep:'D353135800120250831.001.JSON', maDauMoi:'31358001', loaiFile:'D35', nghiepVu:'TIÊU DÙNG',    soLuong: 421, duNo: 8_750_000_000, trangThai:'ACTIVE',   ngayGui:'30/08/2025', nguonDuLieu:'VCB' },
    { key:'5', stt:5, tenTep:'DKQ3135800120250831.001.JSON', maDauMoi:'31358001', loaiFile:'DKQ', nghiepVu:'KẾT QUẢ',     soLuong:   0, duNo:             0, trangThai:'APPROVED', ngayGui:'31/08/2025', nguonDuLieu:'VCB' },
    { key:'6', stt:6, tenTep:'D403135800220250831.001.JSON', maDauMoi:'31358002', loaiFile:'D40', nghiepVu:'CHO VAY',       soLuong: 988, duNo:32_100_000_000, trangThai:'PENDING',  ngayGui:'31/08/2025', nguonDuLieu:'TCB' },
    { key:'7', stt:7, tenTep:'D313135800220250831.001.JSON', maDauMoi:'31358002', loaiFile:'D31', nghiepVu:'THẺ TÍN DỤNG', soLuong: 654, duNo: 9_400_000_000, trangThai:'ACTIVE',   ngayGui:'30/08/2025', nguonDuLieu:'TCB' },
    { key:'8', stt:8, tenTep:'D353135800220250831.001.JSON', maDauMoi:'31358002', loaiFile:'D35', nghiepVu:'TIÊU DÙNG',    soLuong: 312, duNo: 5_200_000_000, trangThai:'APPROVED', ngayGui:'30/08/2025', nguonDuLieu:'TCB' },
];

// Base column definitions — onHeaderCell injected dynamically in component
const COLUMN_DEFS: Record<string, any> = {
    stt:         { title: 'STT',           dataIndex: 'stt',         key: 'stt',         width: 60,  align: 'center', fixed: 'left' },
    tenTep:      { title: 'Tên tệp',       dataIndex: 'tenTep',      key: 'tenTep',      ellipsis: true, minWidth: 220 },
    maDauMoi:    { title: 'Mã đầu mối',   dataIndex: 'maDauMoi',    key: 'maDauMoi',    width: 110, align: 'center' },
    loaiFile:    { title: 'Loại file',     dataIndex: 'loaiFile',    key: 'loaiFile',    width: 90,  align: 'center' },
    nghiepVu:    { title: 'Nghiệp vụ',    dataIndex: 'nghiepVu',    key: 'nghiepVu',    width: 140 },
    soLuong:     { title: 'Số lượng KH',  dataIndex: 'soLuong',     key: 'soLuong',     width: 120, align: 'right',
        render: (v: number) => v.toLocaleString('vi-VN') },
    duNo:        { title: 'Dư nợ (VNĐ)',  dataIndex: 'duNo',        key: 'duNo',        width: 150, align: 'right',
        render: (v: number) => v > 0 ? v.toLocaleString('vi-VN') : '—' },
    trangThai:   { title: 'Trạng thái',    dataIndex: 'trangThai',   key: 'trangThai',   width: 120, align: 'center',
        render: (v: string) => <StatusTag status={v} /> },
    ngayGui:     { title: 'Ngày gửi',      dataIndex: 'ngayGui',     key: 'ngayGui',     width: 110, align: 'center' },
    nguonDuLieu: { title: 'Nguồn DL',      dataIndex: 'nguonDuLieu', key: 'nguonDuLieu', width: 100, align: 'center' },
};

const FIXED_KEYS = new Set(['stt', 'tenTep', 'maDauMoi']);

// ─── Component ────────────────────────────────────────────────────────────────

const ColumnSettingsDemo: React.FC = () => {
    // Dynamic filter values (pending apply)
    const [filterValues,  setFilterValues]  = useState<Record<string, string>>({});
    // Applied filter (drives table data)
    const [activeFilter,  setActiveFilter]  = useState<Record<string, string>>({});
    const [filterLoading, setFilterLoading] = useState(false);

    // Which filter fields are shown in the FilterBar
    const [activeFilterFields, setActiveFilterFields] = useState<string[]>(DEFAULT_ACTIVE_FILTERS);
    const [addFilterOpen, setAddFilterOpen] = useState(false);

    // Column settings
    const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_ORDER);
    const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE);
    const [colSearch,   setColSearch]   = useState('');
    const [dragOver,    setDragOver]    = useState<string | null>(null);
    const dragKey = useRef<string | null>(null);

    // Header drag highlight
    const [headerDragOver, setHeaderDragOver] = useState<string | null>(null);

    useHeaderActions({ title: 'Cài đặt hiển thị' }, []);

    // ── Filter handlers ──────────────────────────────────────────────────────

    const setVal = (key: string, val: string | undefined) =>
        setFilterValues(prev => val !== undefined ? { ...prev, [key]: val } : (({ [key]: _, ...rest }) => rest)(prev));

    const handleSearch = () => {
        setFilterLoading(true);
        setTimeout(() => { setActiveFilter({ ...filterValues }); setFilterLoading(false); }, 600);
    };

    const handleReset = () => { setFilterValues({}); setActiveFilter({}); };

    const filteredData = MOCK_DATA.filter(r => {
        if (activeFilter.tenTep      && !r.tenTep.toLowerCase().includes(activeFilter.tenTep.toLowerCase())) return false;
        if (activeFilter.loaiFile    && r.loaiFile    !== activeFilter.loaiFile)    return false;
        if (activeFilter.maDauMoi    && !r.maDauMoi.includes(activeFilter.maDauMoi)) return false;
        if (activeFilter.nghiepVu    && !r.nghiepVu.toLowerCase().includes(activeFilter.nghiepVu.toLowerCase())) return false;
        if (activeFilter.trangThai   && r.trangThai   !== activeFilter.trangThai)   return false;
        if (activeFilter.nguonDuLieu && r.nguonDuLieu !== activeFilter.nguonDuLieu) return false;
        return true;
    });

    // ── Column settings handlers ─────────────────────────────────────────────

    const handleReorder = (srcKey: string, tgtKey: string) => {
        if (srcKey === tgtKey) return;
        if (COLUMN_OPTIONS.find(c => c.key === srcKey)?.disabled) return;
        if (COLUMN_OPTIONS.find(c => c.key === tgtKey)?.disabled) return;
        setColumnOrder(prev => {
            const next = [...prev];
            const [item] = next.splice(next.indexOf(srcKey), 1);
            next.splice(next.indexOf(tgtKey), 0, item);
            return next;
        });
    };

    const toggleCol = (key: string, checked: boolean) =>
        setVisibleCols(prev => checked ? [...prev, key] : prev.filter(k => k !== key));

    const selectAll   = () => setVisibleCols(COLUMN_OPTIONS.map(c => c.key));
    const deselectAll = () => setVisibleCols(COLUMN_OPTIONS.filter(c => c.disabled).map(c => c.key));

    const handleResetAll = () => {
        setColumnOrder(DEFAULT_ORDER);
        setVisibleCols(DEFAULT_VISIBLE);
        setColSearch('');
        setActiveFilterFields(DEFAULT_ACTIVE_FILTERS);
        handleReset();
    };

    // ── Table columns with header drag ───────────────────────────────────────

    const tableColumns = columnOrder
        .filter(k => visibleCols.includes(k))
        .map(k => {
            const isFixed = FIXED_KEYS.has(k);
            return {
                ...COLUMN_DEFS[k],
                onHeaderCell: () => {
                    if (isFixed) return {};
                    return {
                        draggable: true,
                        style: {
                            cursor: 'grab',
                            backgroundColor: headerDragOver === k ? colors.primary[50]  : undefined,
                            borderLeft:      headerDragOver === k ? `2px dashed ${colors.primary[400]}` : undefined,
                            transition: 'background-color 0.15s',
                        },
                        onDragStart: (e: React.DragEvent) => { e.dataTransfer.setData('text/plain', k); },
                        onDragOver:  (e: React.DragEvent) => { e.preventDefault(); setHeaderDragOver(k); },
                        onDragLeave: () => setHeaderDragOver(null),
                        onDrop:      (e: React.DragEvent) => {
                            const src = e.dataTransfer.getData('text/plain');
                            if (src && src !== k && !FIXED_KEYS.has(src)) handleReorder(src, k);
                            setHeaderDragOver(null);
                        },
                        onDragEnd:   () => setHeaderDragOver(null),
                    };
                },
            };
        });

    // ── Popover: add filter fields ───────────────────────────────────────────

    const addFilterContent = (
        <div style={{ width: 220 }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: spacing[3] }}>
                Chọn trường tìm kiếm
            </Text>
            {FILTER_FIELDS.map(field => (
                <div key={field.key} style={{ padding: '4px 0' }}>
                    <Checkbox
                        checked={activeFilterFields.includes(field.key)}
                        disabled={field.mandatory}
                        onChange={e => {
                            const checked = e.target.checked;
                            setActiveFilterFields(prev => checked ? [...prev, field.key] : prev.filter(k => k !== field.key));
                            if (!checked) {
                                setFilterValues(prev => { const n = { ...prev }; delete n[field.key]; return n; });
                                setActiveFilter (prev => { const n = { ...prev }; delete n[field.key]; return n; });
                            }
                        }}
                    >
                        <Text style={{ fontSize: typography.fontSize.sm }}>
                            {field.label}
                            {field.mandatory && (
                                <Text style={{ color: colors.text.tertiary, fontSize: 10, marginLeft: 4 }}>(mặc định)</Text>
                            )}
                        </Text>
                    </Checkbox>
                </div>
            ))}
        </div>
    );

    // ── Popover: column visibility / reorder ─────────────────────────────────

    const filteredOptions = COLUMN_OPTIONS
        .slice()
        .sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key))
        .filter(o => o.label.toLowerCase().includes(colSearch.toLowerCase()));

    const settingsContent = (
        <div style={{ width: 280 }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: spacing[3] }}>
                Cài đặt hiển thị
            </Text>
            <Input
                size="small"
                placeholder="Tìm kiếm trường thông tin"
                value={colSearch}
                onChange={e => setColSearch(e.target.value)}
                allowClear
                style={{ marginBottom: spacing[2] }}
            />
            <Divider style={{ margin: `${spacing[2]} 0` }} />
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {filteredOptions.map(opt => {
                    const isOver = dragOver === opt.key;
                    return (
                        <div
                            key={opt.key}
                            draggable={!opt.disabled}
                            onDragStart={() => { dragKey.current = opt.key; }}
                            onDragOver={e => { e.preventDefault(); setDragOver(opt.key); }}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={() => {
                                if (dragKey.current) handleReorder(dragKey.current, opt.key);
                                setDragOver(null);
                                dragKey.current = null;
                            }}
                            onDragEnd={() => { setDragOver(null); dragKey.current = null; }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: spacing[2],
                                padding: '5px 8px', borderRadius: radius.sm,
                                cursor:  opt.disabled ? 'default' : 'grab',
                                opacity: opt.disabled ? 0.6 : 1,
                                borderLeft:  isOver ? `2px dashed ${colors.primary[400]}` : '2px solid transparent',
                                background:  isOver ? colors.primary[50] : 'transparent',
                                transition: 'background 0.15s, border-color 0.15s',
                            }}
                        >
                            {!opt.disabled
                                ? <HolderOutlined style={{ color: colors.text.tertiary, fontSize: 13, flexShrink: 0 }} />
                                : <span style={{ width: 13, flexShrink: 0 }} />
                            }
                            <Checkbox
                                checked={visibleCols.includes(opt.key)}
                                disabled={opt.disabled}
                                onChange={e => toggleCol(opt.key, e.target.checked)}
                            >
                                <Text style={{ fontSize: typography.fontSize.sm }}>{opt.label}</Text>
                            </Checkbox>
                        </div>
                    );
                })}
            </div>
            <Divider style={{ margin: `${spacing[2]} 0` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                    Đã chọn {visibleCols.length}/{COLUMN_OPTIONS.length}
                </Text>
                <Space size={8}>
                    <Button size="small" onClick={deselectAll}>Bỏ chọn</Button>
                    <Button size="small" type="primary" onClick={selectAll}>Chọn tất cả</Button>
                </Space>
            </div>
        </div>
    );

    // ── Render filter inputs ─────────────────────────────────────────────────

    const renderFilterInput = (key: string) => {
        switch (key) {
            case 'tenTep':
                return (
                    <FilterCol key="tenTep">
                        <Input placeholder="Tên tệp" value={filterValues.tenTep ?? ''}
                            onChange={e => setVal('tenTep', e.target.value || undefined)}
                            onPressEnter={handleSearch} allowClear />
                    </FilterCol>
                );
            case 'loaiFile':
                return (
                    <FilterCol key="loaiFile">
                        <Select placeholder="Loại file" value={filterValues.loaiFile}
                            onChange={v => setVal('loaiFile', v)} allowClear
                            style={{ width: '100%' }} options={FILE_TYPE_OPTIONS} />
                    </FilterCol>
                );
            case 'maDauMoi':
                return (
                    <FilterCol key="maDauMoi">
                        <Input placeholder="Mã đầu mối" value={filterValues.maDauMoi ?? ''}
                            onChange={e => setVal('maDauMoi', e.target.value || undefined)}
                            onPressEnter={handleSearch} allowClear />
                    </FilterCol>
                );
            case 'nghiepVu':
                return (
                    <FilterCol key="nghiepVu">
                        <Input placeholder="Nghiệp vụ" value={filterValues.nghiepVu ?? ''}
                            onChange={e => setVal('nghiepVu', e.target.value || undefined)}
                            onPressEnter={handleSearch} allowClear />
                    </FilterCol>
                );
            case 'trangThai':
                return (
                    <FilterCol key="trangThai">
                        <Select placeholder="Trạng thái" value={filterValues.trangThai}
                            onChange={v => setVal('trangThai', v)} allowClear
                            style={{ width: '100%' }}
                            options={[
                                { value: 'ACTIVE',   label: 'Hoạt động' },
                                { value: 'PENDING',  label: 'Chờ duyệt' },
                                { value: 'APPROVED', label: 'Đã duyệt'  },
                            ]} />
                    </FilterCol>
                );
            case 'nguonDuLieu':
                return (
                    <FilterCol key="nguonDuLieu">
                        <Select placeholder="Nguồn dữ liệu" value={filterValues.nguonDuLieu}
                            onChange={v => setVal('nguonDuLieu', v)} allowClear
                            style={{ width: '100%' }}
                            options={[{ value: 'VCB', label: 'VCB' }, { value: 'TCB', label: 'TCB' }]} />
                    </FilterCol>
                );
            default:
                return null;
        }
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <ComponentShowcase
            name="Cài đặt hiển thị"
            group="data-display"
            description="Pattern tùy chỉnh bảng dữ liệu: ẩn/hiện cột, reorder cột (cả qua Popover lẫn kéo header), và thêm/bớt trường tìm kiếm động. Không dùng thư viện ngoài — toàn bộ dựa vào HTML5 drag events."
            behaviors={[
                '"Thêm bộ lọc" mở popup chọn/bỏ chọn trường tìm kiếm; trường mặc định không thể tắt',
                'Lọc theo nhiều trường: tên tệp, loại file, mã đầu mối, nghiệp vụ, trạng thái, nguồn DL',
                'Kéo header cột để sắp xếp lại thứ tự (non-mandatory; highlight header khi drag over)',
                'Mandatory columns (STT, Tên tệp, Mã đầu mối): header không kéo được, checkbox disabled, drag handle ẩn',
                'Popover "Cài đặt hiển thị": drag handle ≡ reorder + checkbox ẩn/hiện cột + search cột',
                '"Bỏ chọn" ẩn cột non-mandatory; "Chọn tất cả" hiện lại tất cả 10 cột',
                'Bảng cập nhật ngay lập tức — không cần nhấn Apply',
            ]}
            wide
            demoMinHeight={480}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button size="small" icon={<ReloadOutlined />} onClick={handleResetAll} style={{ width: '100%' }}>
                        Đặt lại tất cả
                    </Button>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                        Khôi phục cột, visibility, bộ lọc về mặc định.
                    </Text>
                </Space>
            }
            code={`// State
const [columnOrder, setColumnOrder] = useState(cols.map(c => c.key));
const [visibleCols, setVisibleCols] = useState(cols.map(c => c.key));
const [activeFilterFields, setActiveFilterFields] = useState(['tenTep', 'loaiFile']);

// Drag header reorder — injected via onHeaderCell
onHeaderCell: () => ({
  draggable: true,
  style: { cursor: 'grab', backgroundColor: headerDragOver === k ? colors.primary[50] : undefined },
  onDragStart: (e) => e.dataTransfer.setData('text/plain', colKey),
  onDragOver:  (e) => { e.preventDefault(); setHeaderDragOver(colKey); },
  onDrop:      (e) => { handleReorder(e.dataTransfer.getData('text/plain'), colKey); setHeaderDragOver(null); },
})

// "Thêm bộ lọc" custom button via FilterBar extra prop
<FilterBar onSearch={handleSearch} onReset={handleReset} inCard showAddFilter={false}
  extra={
    <Popover content={addFilterContent} trigger="click" open={addFilterOpen} onOpenChange={setAddFilterOpen}>
      <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
    </Popover>
  }>
  {FILTER_FIELDS.filter(f => activeFilterFields.includes(f.key)).map(f => renderFilterInput(f.key))}
</FilterBar>

// Column settings popover (in SectionCard extra)
<SectionCard title="Danh sách tệp" count={filteredData.length}
  extra={<Popover content={settingsContent} trigger="click"><Button icon={<SettingOutlined />}>Cài đặt hiển thị</Button></Popover>}>
  <Table columns={tableColumns} dataSource={filteredData} pagination={tablePagination()} />
</SectionCard>`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <FilterBar
                    onSearch={handleSearch}
                    onReset={handleReset}
                    loading={filterLoading}
                    inCard
                    showAddFilter={false}
                    extra={
                        <Popover
                            content={addFilterContent}
                            trigger="click"
                            open={addFilterOpen}
                            onOpenChange={setAddFilterOpen}
                            placement="bottomLeft"
                            arrow={false}
                        >
                            <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
                        </Popover>
                    }
                >
                    {FILTER_FIELDS
                        .filter(f => activeFilterFields.includes(f.key))
                        .map(f => renderFilterInput(f.key))
                    }
                </FilterBar>

                <SectionCard
                    title="Danh sách tệp"
                    count={filteredData.length}
                    extra={
                        <Popover
                            content={settingsContent}
                            trigger="click"
                            placement="bottomRight"
                            arrow={false}
                        >
                            <Button size="small" icon={<SettingOutlined />}>
                                Cài đặt hiển thị
                            </Button>
                        </Popover>
                    }
                >
                    <Table<DataRow>
                        dataSource={filteredData}
                        columns={tableColumns}
                        rowKey="key"
                        size="small"
                        scroll={{ x: 900 }}
                        pagination={tablePagination({ pageSize: 10 })}
                    />
                </SectionCard>
            </div>
        </ComponentShowcase>
    );
};

export default ColumnSettingsDemo;

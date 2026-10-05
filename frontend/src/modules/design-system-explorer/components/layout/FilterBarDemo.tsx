'use client';

import React, { useState } from 'react';
import { Input, Select, DatePicker, Typography, Tag, Switch } from 'antd';
import { FilterBar, FilterCol, SectionCard, StatusTag } from '@/components/ui';
import { typography, spacing } from '@/modules/design-system-explorer/tokens';
import ComponentShowcase from '../../ComponentShowcase';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const FilterBarDemo: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [inCard, setInCard]   = useState(true);
    const [searched, setSearch] = useState(false);

    useHeaderActions({ title: 'FilterBar & FilterCol' }, []);

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setSearch(true); }, 900);
    };

    const handleReset = () => setSearch(false);

    return (
        <ComponentShowcase
            name="FilterBar & FilterCol"
            group="layout"
            description="Thanh lọc chuẩn dùng trên mọi page danh sách. FilterBar bọc các FilterCol, tự động dock nút Tìm kiếm + Reset về bên phải. inCard={true} bọc toàn bộ trong Ant Design Card."
            behaviors={[
                'FilterCol: flex-item, có minWidth/maxWidth để responsive',
                'FilterBar tự thêm nút Tìm kiếm và Reset — không cần tự tạo',
                'onSearch: callback khi click Tìm kiếm hoặc Enter',
                'onReset: callback khi click Reset',
                'loading: disable + spinner trong lúc tìm',
                'inCard=true: bọc trong Card với shadow — dùng cho hầu hết page list',
                'extra: slot thêm nút phụ (Thêm mới, Xuất Excel) bên cạnh Tìm kiếm',
            ]}
            wide
            code={`import { FilterBar, FilterCol } from '@/components/ui';

<FilterBar onSearch={handleSearch} onReset={handleReset} loading={loading} inCard>
  <FilterCol>
    <Input placeholder="Mã CIC / Tên khách hàng" allowClear />
  </FilterCol>
  <FilterCol>
    <Select placeholder="Trạng thái" allowClear style={{ width: '100%' }}
      options={STATUS_OPTIONS} />
  </FilterCol>
  <FilterCol minWidth={240}>
    <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
  </FilterCol>
</FilterBar>`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-20)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-20)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                        <Switch checked={inCard} onChange={setInCard} size="small" />
                        <Text style={{ fontSize: '12px' }}>inCard</Text>
                    </div>
                </div>

                {/* Live demo */}
                <FilterBar
                    onSearch={handleSearch}
                    onReset={handleReset}
                    loading={loading}
                    inCard={inCard}
                >
                    <FilterCol>
                        <Input placeholder="Mã CIC / Họ tên khách hàng" allowClear />
                    </FilterCol>
                    <FilterCol>
                        <Select
                            placeholder="Trạng thái"
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                                { value: 'ACTIVE',   label: 'Hoạt động' },
                                { value: 'PENDING',  label: 'Chờ duyệt' },
                                { value: 'INACTIVE', label: 'Vô hiệu' },
                            ]}
                        />
                    </FilterCol>
                    <FilterCol minWidth={240}>
                        <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </FilterCol>
                </FilterBar>

                {searched && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                        <Tag color="success">Đã tìm kiếm</Tag>
                        <Text style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                            (onSearch callback được gọi)
                        </Text>
                    </div>
                )}

                {/* Props */}
                <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 'var(--spacing-16)' }}>
                    <Text style={{ fontSize: '12px', fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: 'var(--spacing-8)' }}>
                        FilterBar Props
                    </Text>
                    {[
                        { prop: 'onSearch?', type: '() => void', desc: 'Callback khi nhấn Tìm kiếm' },
                        { prop: 'onReset?', type: '() => void', desc: 'Callback khi nhấn Reset' },
                        { prop: 'loading?', type: 'boolean', desc: 'Hiện spinner, disable nút Tìm kiếm' },
                        { prop: 'inCard?', type: 'boolean', desc: 'Bọc trong Ant Design Card với shadow' },
                        { prop: 'extra?', type: 'ReactNode', desc: 'Nút phụ bên cạnh Tìm kiếm (Export, v.v.)' },
                    ].map(({ prop, type, desc }) => (
                        <div key={prop} style={{ display: 'flex', gap: 'var(--spacing-12)', alignItems: 'baseline', marginBottom: 'var(--spacing-4)' }}>
                            <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--primary)', minWidth: 100 }}>{prop}</code>
                            <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: 'var(--text-subtle)', minWidth: 120 }}>{type}</code>
                            <Text style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default FilterBarDemo;

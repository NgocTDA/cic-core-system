'use client';

import React, { useState } from 'react';
import { Form, Select, Typography, Space, Tag, Spin } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const SHORT_OPTIONS = [
    { value: 'kkn',        label: 'Kênh kết nối' },
    { value: 'collection', label: 'Thu thập dữ liệu' },
    { value: 'product',    label: 'Quản lý sản phẩm' },
    { value: 'ops',        label: 'Hỗ trợ vận hành' },
    { value: 'analytics',  label: 'Báo cáo thống kê' },
    { value: 'governance', label: 'Quản trị dữ liệu' },
];

const MANY_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
    value: `tctd_${i + 1}`,
    label: `Tổ chức tín dụng ${String.fromCharCode(65 + (i % 26))}${i + 1} - ${['Ngân hàng', 'Công ty tài chính', 'Quỹ tín dụng'][i % 3]}`,
}));

const StatusOptions = [
    { value: 'ACTIVE',    label: 'Hoạt động' },
    { value: 'INACTIVE',  label: 'Vô hiệu hóa' },
    { value: 'PENDING',   label: 'Chờ duyệt' },
    { value: 'REJECTED',  label: 'Từ chối' },
];

const SelectDemo: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useHeaderActions({ title: 'Select / Dropdown' }, []);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const filteredMany = MANY_OPTIONS.filter(o =>
        o.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <ComponentShowcase
            name="Select / Dropdown"
            group="form"
            description="Dropdown chọn một hoặc nhiều giá trị. Khi danh sách > 10 items bắt buộc có tìm kiếm nội bộ. Hỗ trợ debounce 300ms khi gọi API."
            behaviors={[
                'Danh sách < 10 items: không cần search',
                'Danh sách ≥ 10 items: bắt buộc có search filter trong dropdown',
                'Debounce 300ms trước khi gọi API tìm kiếm',
                'Loading spinner bên trong dropdown khi đang tải',
                '"Không tìm thấy dữ liệu" khi không có kết quả',
                'Multi-select: hiển thị "item 1 + N items" khi chọn nhiều',
                'Hỗ trợ chuột và bàn phím (mũi tên, Enter, Esc)',
                'Toàn bộ vùng control đều mở dropdown khi click',
            ]}
            code={`import { Select } from 'antd';

// Single select (< 10 options, không cần search)
<Select placeholder="Chọn phân hệ" style={{ width: '100%' }}>
  {options.map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
</Select>

// Single select với search (>= 10 options)
<Select
  showSearch
  placeholder="Tìm kiếm TCTD"
  filterOption={false}
  onSearch={debounce(fetchOptions, 300)}
  notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy dữ liệu'}
  options={options}
  style={{ width: '100%' }}
/>

// Multi-select
<Select
  mode="multiple"
  maxTagCount="responsive"
  placeholder="Chọn trạng thái"
  options={StatusOptions}
  style={{ width: '100%' }}
/>`}
            demoMinHeight={400}
        >
            <Form layout="vertical" style={{ maxWidth: 480 }}>
                {/* Short list - no search */}
                <Form.Item
                    name="subsystem"
                    label={<><Text>Phân hệ</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                    rules={[{ required: true, message: 'Vui lòng chọn phân hệ' }]}
                >
                    <Select
                        placeholder="Chọn phân hệ"
                        options={SHORT_OPTIONS}
                        style={{ width: '100%' }}
                        allowClear
                    />
                </Form.Item>

                {/* Long list - with search + debounce loading */}
                <Form.Item
                    name="tctd"
                    label={<><Text>Tổ chức tín dụng (≥ 10 items → bắt buộc search)</Text></>}
                >
                    <Select
                        showSearch
                        placeholder="Tìm kiếm tổ chức tín dụng..."
                        filterOption={false}
                        onSearch={handleSearch}
                        notFoundContent={
                            loading
                                ? <div style={{ textAlign: 'center', padding: spacing[3] }}><Spin size="small" /></div>
                                : <Text style={{ color: colors.text.secondary, padding: spacing[3], display: 'block', textAlign: 'center' }}>Không tìm thấy dữ liệu</Text>
                        }
                        options={filteredMany}
                        style={{ width: '100%' }}
                        allowClear
                        loading={loading}
                    />
                </Form.Item>

                {/* Multi select */}
                <Form.Item name="statuses" label="Trạng thái (multi-select)">
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="Chọn trạng thái (có thể chọn nhiều)"
                        options={StatusOptions}
                        style={{ width: '100%' }}
                        allowClear
                    />
                </Form.Item>

                {/* Multi select responsive tag display */}
                <div
                    style={{
                        padding: spacing[3],
                        background: colors.bg.subtle,
                        borderRadius: 6,
                        border: `1px solid ${colors.border.split}`,
                    }}
                >
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block', marginBottom: spacing[2] }}>
                        Multi-select: chọn nhiều items → hiển thị maxTagCount="responsive"
                    </Text>
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        defaultValue={['tctd_1', 'tctd_2', 'tctd_3', 'tctd_4', 'tctd_5']}
                        options={MANY_OPTIONS.slice(0, 10)}
                        style={{ width: '100%' }}
                    />
                </div>
            </Form>
        </ComponentShowcase>
    );
};

export default SelectDemo;

'use client';

import React from 'react';
import { Space, Typography, Table } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { CodeText, tablePagination } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const MOCK_VARS = [
    { id: 1, varName: '{{ho_ten_kh}}',       type: 'STRING', description: 'Họ và tên khách hàng' },
    { id: 2, varName: '{{ma_cic}}',           type: 'STRING', description: 'Mã CIC của khách hàng' },
    { id: 3, varName: '{{ngay_hieu_luc}}',    type: 'DATE',   description: 'Ngày hiệu lực hợp đồng' },
    { id: 4, varName: '{{so_du_no_hien_tai}}',type: 'NUMBER', description: 'Số dư nợ hiện tại (VNĐ)' },
    { id: 5, varName: '{{trang_thai_kh}}',    type: 'ENUM',   description: 'Trạng thái KH (ACTIVE / INACTIVE)' },
];

const columns = [
    { title: 'STT',         dataIndex: 'id',          width: 60,  align: 'center' as const },
    { title: 'Tên biến',    dataIndex: 'varName',     render: (v: string) => <CodeText>{v}</CodeText> },
    { title: 'Kiểu dữ liệu', dataIndex: 'type',       width: 110, render: (v: string) => <CodeText>{v}</CodeText> },
    { title: 'Mô tả',       dataIndex: 'description', ellipsis: true },
];

const CodeTextDemo: React.FC = () => {
    useHeaderActions({ title: 'CodeText' }, []);

    return (
        <ComponentShowcase
            name="CodeText"
            group="data-display"
            description="Inline code display cho tên biến, mã kỹ thuật, giá trị enum. Dùng monospace font với nền xám nhạt để phân biệt với text thường."
            behaviors={[
                'Hiển thị với font monospace (JetBrains Mono / Fira Code)',
                'Nền xám nhạt và padding nhỏ giúp dễ phân biệt trong văn bản',
                'Inline — dùng trong cả text đoạn và trong table cell',
                'Không wrap — luôn hiển thị trên một dòng',
                'Dùng cho: tên biến, mã kỹ thuật, query, code snippet ngắn',
            ]}
            code={`import { CodeText } from '@/components/ui';

// Inline trong văn bản
<p>Biến <CodeText>{'{{ho_ten_kh}}'}</CodeText> là họ tên khách hàng.</p>

// Trong table cell
{ title: 'Tên biến', render: (v) => <CodeText>{v}</CodeText> }`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
                {/* Inline usage */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, display: 'block', marginBottom: spacing[2] }}>
                        Dùng inline trong văn bản
                    </Text>
                    <Text style={{ color: colors.text.primary, lineHeight: 1.8 }}>
                        Biến <CodeText>{'{{ho_ten_kh}}'}</CodeText> lưu họ tên khách hàng.
                        Sử dụng kết hợp với <CodeText>{'{{ma_cic}}'}</CodeText> để tra cứu thông tin tín dụng.
                        Kiểu dữ liệu trả về là <CodeText>STRING</CodeText>.
                    </Text>
                </div>

                {/* In table */}
                <div>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, display: 'block', marginBottom: spacing[2] }}>
                        Dùng trong table cell
                    </Text>
                    <Table
                        dataSource={MOCK_VARS}
                        columns={columns}
                        rowKey="id"
                        size="small"
                        pagination={false}
                    />
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default CodeTextDemo;

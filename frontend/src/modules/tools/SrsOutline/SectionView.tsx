'use client';

import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { colors, radius, spacing, typography } from '@/design-system';
import type { OutlineSection, OutlineTable } from '@/types/srs';

const { Text } = Typography;

// Ô trống của mẫu — hiện dấu gạch mờ để phân biệt với ô có nội dung.
const EMPTY_CELL = <Text style={{ color: colors.text.tertiary }}>—</Text>;

interface TablePreviewProps {
    table: OutlineTable;
    usable: number;
}

// Xem trước một bảng của đề cương: đúng bộ cột, đúng tỉ lệ bề rộng (twips → %).
const TablePreview: React.FC<TablePreviewProps> = ({ table, usable }) => {
    const { headers, widths, labels, rows, label } = table;

    const columns = headers.map((h, i) => ({
        title: h,
        dataIndex: `c${i}`,
        key: `c${i}`,
        // Bề rộng tương đối đúng như bản Word, để nhìn ra ngay cột nào hẹp/rộng.
        width: `${((widths[i] / usable) * 100).toFixed(1)}%`,
        render: (v: string | undefined) => (v ? <Text style={{ fontSize: 12 }}>{v}</Text> : EMPTY_CELL),
    }));

    // Bảng key-value: cột đầu là nhãn cố định. Bảng thường: toàn hàng trống.
    const dataSource = labels
        ? labels.map((l, i) => ({ key: i, c0: l }))
        : Array.from({ length: rows }, (_, i) => ({ key: i }));

    return (
        <div style={{ marginBottom: spacing[3] }}>
            {label && (
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: spacing[1] }}>
                    {label}
                </Text>
            )}
            <Table
                size="small"
                bordered
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
                {headers.length} cột · {dataSource.length} hàng mẫu · tổng bề rộng {usable} twips
            </Text>
        </div>
    );
};

interface SectionViewProps {
    section: OutlineSection;
    /** h4 = mục cấp chức năng (Word đậm) · h5 = mục trong khối Tính năng (Word nghiêng) */
    level: 'h4' | 'h5';
    usable: number;
    diagramMark: string;
}

const SectionView: React.FC<SectionViewProps> = ({ section, level, usable, diagramMark }) => {
    const isH4 = level === 'h4';
    // Phản chiếu thang độ của bản Word (README §6): H4 đậm, H5 nghiêng.
    const headingStyle: React.CSSProperties = {
        fontSize: isH4 ? typography.fontSize.base : typography.fontSize.sm,
        fontWeight: isH4 ? 600 : 400,
        fontStyle: isH4 ? 'normal' : 'italic',
        color: isH4 ? colors.text.primary : colors.text.secondary,
    };

    // note_md (hướng dẫn cho bản Confluence) ưu tiên hơn note của bản Word.
    const note = section.noteMd ?? section.note;

    return (
        <div
            style={{
                marginBottom: spacing[4],
                paddingLeft: isH4 ? 0 : spacing[3],
                borderLeft: isH4 ? 'none' : `2px solid ${colors.border.split}`,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
                <span style={headingStyle}>{section.name}</span>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {isH4 ? 'Heading 4' : 'Heading 5'}
                </Text>
                {section.diagram && (
                    <Tag icon={<PictureOutlined />} color={colors.subsystem.tools} style={{ marginInlineEnd: 0 }}>
                        Sơ đồ trình tự
                    </Tag>
                )}
            </div>

            {note && (
                <div
                    style={{
                        background: colors.bg.subtle,
                        borderRadius: radius.md,
                        padding: `${spacing[2]} ${spacing[3]}`,
                        marginBottom: spacing[2],
                        fontSize: 12,
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                    }}
                >
                    {note}
                </div>
            )}

            {section.diagram && (
                <Text
                    code
                    style={{ fontSize: 11, display: 'inline-block', marginBottom: spacing[2] }}
                >
                    {diagramMark}
                </Text>
            )}

            {section.tables?.map((t, i) => (
                <TablePreview key={i} table={t} usable={usable} />
            ))}
        </div>
    );
};

export default SectionView;

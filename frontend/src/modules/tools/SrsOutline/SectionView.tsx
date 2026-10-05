'use client';

import { SUBSYSTEM_COLORS } from '@/config/subsystems';

import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import type { OutlineSection, OutlineTable } from '@/types/srs';

const { Text } = Typography;

// Ô trống của mẫu — hiện dấu gạch mờ để phân biệt với ô có nội dung.
const EMPTY_CELL = <Text style={{ color: 'var(--text-subtle)' }}>—</Text>;

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
        <div style={{ marginBottom: 'var(--spacing-12)' }}>
            {label && (
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 'var(--spacing-4)' }}>
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
        fontSize: isH4 ? '14px' : '12px',
        fontWeight: isH4 ? 600 : 400,
        fontStyle: isH4 ? 'normal' : 'italic',
        color: isH4 ? 'var(--text)' : 'var(--text-muted)',
    };

    // note_md (hướng dẫn cho bản Confluence) ưu tiên hơn note của bản Word.
    const note = section.noteMd ?? section.note;

    return (
        <div
            style={{
                marginBottom: 'var(--spacing-16)',
                paddingLeft: isH4 ? 0 : 'var(--spacing-12)',
                borderLeft: isH4 ? 'none' : `2px solid var(--color-neutral-100)`,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-4)' }}>
                <span style={headingStyle}>{section.name}</span>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {isH4 ? 'Heading 4' : 'Heading 5'}
                </Text>
                {section.diagram && (
                    <Tag icon={<PictureOutlined />} color={SUBSYSTEM_COLORS.tools} style={{ marginInlineEnd: 0 }}>
                        Sơ đồ trình tự
                    </Tag>
                )}
            </div>

            {note && (
                <div
                    style={{
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: `var(--spacing-8) var(--spacing-12)`,
                        marginBottom: 'var(--spacing-8)',
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                    }}
                >
                    {note}
                </div>
            )}

            {section.diagram && (
                <Text
                    code
                    style={{ fontSize: 11, display: 'inline-block', marginBottom: 'var(--spacing-8)' }}
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

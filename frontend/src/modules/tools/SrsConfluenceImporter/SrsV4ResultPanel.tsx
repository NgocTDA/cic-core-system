'use client';

import React, { useState } from 'react';
import { Tabs, Table, Tag, Button, Space, Typography, Card, Alert, Tooltip, Collapse, message } from 'antd';
import {
    CopyOutlined,
    FileWordOutlined,
    LockOutlined,
    CloudUploadOutlined,
    CheckOutlined,
    FileTextOutlined,
    BranchesOutlined,
    SafetyCertificateOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { colors, spacing } from '@/design-system';
import { tablePagination } from '@/components/ui';
import type { SrsV4DocData, SrsV4Feature } from '@/types/srsV4';
import { buildSrsV4Markdown } from './buildSrsV4Markdown';

const { Text, Paragraph, Title } = Typography;

interface SrsV4ResultPanelProps {
    data: SrsV4DocData;
    onDownloadDocx: () => void;
    downloadingDocx: boolean;
}

export const SrsV4ResultPanel: React.FC<SrsV4ResultPanelProps> = ({
    data,
    onDownloadDocx,
    downloadingDocx,
}) => {
    const [copied, setCopied] = useState(false);
    const markdown = buildSrsV4Markdown(data);

    const handleCopyMarkdown = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(markdown);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = markdown;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            setCopied(true);
            message.success('Đã sao chép Markdown v4.0 vào bộ nhớ tạm!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            message.error('Không sao chép được. Hãy chọn toàn bộ ở Tab Xem trước Markdown để copy thủ công.');
        }
    };

    const gen = data.general || ({} as any);

    // Columns for General Tables
    const traceabilityCols = [
        { title: 'Mã UC', dataIndex: 'maUc', key: 'maUc', render: (v: string) => <Text code>{v}</Text> },
        { title: 'Tên UC', dataIndex: 'tenUc', key: 'tenUc' },
        { title: 'Tính năng đáp ứng', dataIndex: 'tinhNangDapUng', key: 'tinhNangDapUng', render: (v: string) => <Text code>{v}</Text> },
        { title: 'Vai trò', dataIndex: 'vaiTro', key: 'vaiTro', render: (v: string) => <Tag color={v === 'Chính' ? 'blue' : 'default'}>{v}</Tag> },
        { title: 'Mức đáp ứng', dataIndex: 'mucDapUng', key: 'mucDapUng' },
        { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
    ];

    const brCols = [
        { title: 'Mã BR', dataIndex: 'maBr', key: 'maBr', render: (v: string) => <Tag color="red">{v}</Tag> },
        { title: 'Nội dung quy tắc', dataIndex: 'noiDung', key: 'noiDung' },
        { title: 'Áp dụng cho', dataIndex: 'apDungCho', key: 'apDungCho' },
        { title: 'Mã thông báo', dataIndex: 'maThongBao', key: 'maThongBao', render: (v: string) => <Text code>{v}</Text> },
    ];

    const dataClassCols = [
        { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60 },
        { title: 'Trường dữ liệu', dataIndex: 'truongDuLieu', key: 'truongDuLieu', render: (v: string) => <Text strong>{v}</Text> },
        { title: 'Phân loại', dataIndex: 'phanLoai', key: 'phanLoai', render: (v: string) => <Tag color="orange">{v}</Tag> },
        { title: 'Quy tắc che', dataIndex: 'quyTacChe', key: 'quyTacChe' },
        { title: 'Ghi nhật ký', dataIndex: 'ghiNhatKy', key: 'ghiNhatKy' },
        { title: 'Thời hạn lưu', dataIndex: 'thoiHanLuu', key: 'thoiHanLuu' },
    ];

    // Render 1 Khối Tính năng FEAT
    const renderFeatureItem = (feat: SrsV4Feature, index: number) => {
        const mainFlowCols = [
            { title: 'Bước', dataIndex: 'step', key: 'step', width: 60 },
            { title: 'Tác nhân', dataIndex: 'actor', key: 'actor', render: (v: string) => <Tag color="purple">{v}</Tag> },
            { title: 'Hành động', dataIndex: 'action', key: 'action' },
            { title: 'Phản hồi hệ thống', dataIndex: 'result', key: 'result' },
        ];

        const uiCompCols = [
            { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60 },
            { title: 'Tên thành phần', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
            { title: 'Loại control', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
            { title: 'Bắt buộc', dataIndex: 'required', key: 'required', render: (v: string) => <Tag color={v === 'Có' ? 'red' : 'default'}>{v}</Tag> },
            { title: 'Giới hạn', dataIndex: 'limit', key: 'limit' },
            { title: 'Mô tả ràng buộc', dataIndex: 'validation', key: 'validation' },
        ];

        const msgCols = [
            { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60 },
            { title: 'Mã thông báo', dataIndex: 'maThongBao', key: 'maThongBao', render: (v: string) => <Tag color="magenta">{v}</Tag> },
            { title: 'Loại', dataIndex: 'loai', key: 'loai' },
            { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
            { title: 'Điều kiện phát sinh', dataIndex: 'dieuKien', key: 'dieuKien' },
        ];

        const acCols = [
            { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60 },
            { title: 'Tiêu chí chấp nhận', dataIndex: 'tieuChi', key: 'tieuChi' },
            { title: 'Mã BR', dataIndex: 'maBr', key: 'maBr', render: (v: string) => <Tag color="red">{v}</Tag> },
        ];

        return (
            <Card
                key={feat.maFeat || index}
                title={<Space><Tag color="geekblue">{feat.maFeat}</Tag> <Text strong>{feat.tenFeat}</Text></Space>}
                style={{ marginBottom: spacing[3] }}
            >
                <Paragraph>{feat.moTaYeuCau}</Paragraph>

                <Tabs
                    type="card"
                    size="small"
                    items={[
                        {
                            key: 'flow',
                            label: 'Luồng xử lý',
                            children: (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Luồng xử lý chính:</Text>
                                    <Table size="small" dataSource={feat.luongChinh} columns={mainFlowCols} pagination={false} rowKey="step" />
                                </Space>
                            ),
                        },
                        {
                            key: 'components',
                            label: 'Thành phần giao diện',
                            children: <Table size="small" dataSource={feat.thanhPhanGiaoDien} columns={uiCompCols} pagination={tablePagination({ pageSize: 10 })} rowKey="stt" />,
                        },
                        {
                            key: 'messages',
                            label: 'Thông báo',
                            children: <Table size="small" dataSource={feat.thongBao} columns={msgCols} pagination={false} rowKey="stt" />,
                        },
                        {
                            key: 'ac',
                            label: 'Tiêu chí chấp nhận',
                            children: <Table size="small" dataSource={feat.tieuChiChapNhan} columns={acCols} pagination={false} rowKey="stt" />,
                        },
                    ]}
                />
            </Card>
        );
    };

    return (
        <Card
            title={
                <Space>
                    <FileTextOutlined style={{ color: colors.subsystem.tools }} />
                    <span>Đặc tả SRS v4.0 · <Text code>{gen.maChucNang}</Text> {gen.tenChucNang}</span>
                    <Tag color="volcano">{data.profile}</Tag>
                </Space>
            }
            extra={
                <Space wrap>
                    <Button icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopyMarkdown}>
                        {copied ? 'Đã chép' : 'Sao chép Markdown'}
                    </Button>
                    <Button
                        type="primary"
                        icon={<FileWordOutlined />}
                        loading={downloadingDocx}
                        onClick={onDownloadDocx}
                    >
                        Tải Word (.docx)
                    </Button>
                    <Tooltip title="Tính năng tạm khóa: Yêu cầu PAT có quyền chỉnh sửa (Edit) trang Confluence của bạn">
                        <Button disabled icon={<LockOutlined />}>
                            Cập nhật Confluence
                        </Button>
                    </Tooltip>
                </Space>
            }
        >
            <Tabs
                defaultActiveKey="general"
                items={[
                    {
                        key: 'general',
                        label: '1. Tổng quan Chức năng (FUNC)',
                        children: (
                            <Space direction="vertical" size={parseInt(spacing[4], 10)} style={{ width: '100%' }}>
                                {/* General Info Grid */}
                                <Card size="small" title="Mô tả chung">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                                        <div><Text type="secondary">Mã chức năng:</Text> <Text strong code>{gen.maChucNang}</Text></div>
                                        <div><Text type="secondary">Nhóm chức năng:</Text> <Text strong code>{gen.nhomChucNang}</Text></div>
                                        <div><Text type="secondary">Tác nhân chính:</Text> <Tag color="blue">{gen.tacNhanChinh}</Tag></div>
                                        <div><Text type="secondary">Vị trí chức năng:</Text> <Text>{gen.viTriChucNang}</Text></div>
                                    </div>
                                    <div style={{ marginTop: spacing[2] }}>
                                        <Text type="secondary">Mô tả chức năng:</Text>
                                        <Paragraph style={{ marginBottom: 0 }}>{gen.moTa}</Paragraph>
                                    </div>
                                </Card>

                                {/* Requirement Traceability */}
                                <Card size="small" title="Truy vết yêu cầu (Use Cases)">
                                    <Table size="small" dataSource={data.traceability} columns={traceabilityCols} pagination={false} rowKey="maUc" />
                                </Card>

                                {/* Business Rules */}
                                <Card size="small" title="Quy tắc nghiệp vụ (BR)">
                                    <Table size="small" dataSource={data.businessRules} columns={brCols} pagination={false} rowKey="maBr" />
                                </Card>
                            </Space>
                        ),
                    },
                    {
                        key: 'features',
                        label: `2. Danh sách Tính năng (${(data.features || []).length} FEAT)`,
                        children: (
                            <div>
                                {(data.features || []).map((feat, idx) => renderFeatureItem(feat, idx))}
                            </div>
                        ),
                    },
                    {
                        key: 'data',
                        label: '3. Dữ liệu & Phân loại',
                        children: (
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Card size="small" title="Phân loại dữ liệu nhạy cảm">
                                    <Table size="small" dataSource={data.dataClassification} columns={dataClassCols} pagination={false} rowKey="stt" />
                                </Card>

                                <Card size="small" title="Vấn đề còn mở">
                                    {(data.openQuestions || []).map((q, i) => (
                                        <Alert key={i} type="info" message={q.topic} description={q.content} style={{ marginBottom: spacing[2] }} />
                                    ))}
                                </Card>
                            </Space>
                        ),
                    },
                    {
                        key: 'markdown',
                        label: '4. Xem trước Markdown',
                        children: (
                            <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: spacing[3], borderRadius: 6, maxHeight: 500, overflow: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{markdown}</pre>
                            </div>
                        ),
                    },
                ]}
            />
        </Card>
    );
};

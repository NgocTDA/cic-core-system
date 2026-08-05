'use client';

import React from 'react';
import { Button, Input, Select, Space, Tag, Modal, Form, message, Tooltip } from 'antd';
import { KeyOutlined, CheckCircleFilled, CloudDownloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { colors, spacing } from '@/design-system';
import type { SrsV4Profile } from '@/types/srsV4';
import type { ProviderInfo } from '../UIDocGenerator/types';

interface MetadataHeaderBarProps {
    pat: string;
    fullname: string;
    onOpenPatModal: () => void;
    onClearPat: () => void;

    providers: ProviderInfo[];
    providerId: string;
    onSelectProvider: (id: string) => void;

    profile: SrsV4Profile;
    onChangeProfile: (p: SrsV4Profile) => void;

    link: string;
    onChangeLink: (val: string) => void;
    onFetch: () => void;
    fetching: boolean;

    phanHe: string;
    onChangePhanHe: (val: string) => void;

    maChucNang: string;
    onChangeMaChucNang: (val: string) => void;

    tenChucNang: string;
    onChangeTenChucNang: (val: string) => void;

    nhomChucNang: string;
    onChangeNhomChucNang: (val: string) => void;

    useCases: string;
    onChangeUseCases: (val: string) => void;

    onGenerate: () => void;
    generating: boolean;
    hasSource: boolean;
}

const SUBSYSTEM_OPTIONS = [
    { value: 'KENH', label: 'KENH — Kênh kết nối' },
    { value: 'XLDL', label: 'XLDL — Thu thập xử lý dữ liệu' },
    { value: 'KSDL', label: 'KSDL — Kiểm soát & quản trị CSDL' },
    { value: 'QLSP', label: 'QLSP — Tạo lập sản phẩm dịch vụ' },
    { value: 'HTVH', label: 'HTVH — Hỗ trợ vận hành, tác nghiệp' },
    { value: 'BCTK', label: 'BCTK — Báo cáo thống kê' },
    { value: 'QTDL', label: 'QTDL — Quản trị dữ liệu' },
];

export const MetadataHeaderBar: React.FC<MetadataHeaderBarProps> = ({
    pat,
    fullname,
    onOpenPatModal,
    onClearPat,
    providers,
    providerId,
    onSelectProvider,
    profile,
    onChangeProfile,
    link,
    onChangeLink,
    onFetch,
    fetching,
    phanHe,
    onChangePhanHe,
    maChucNang,
    onChangeMaChucNang,
    tenChucNang,
    onChangeTenChucNang,
    nhomChucNang,
    onChangeNhomChucNang,
    useCases,
    onChangeUseCases,
    onGenerate,
    generating,
    hasSource,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[3],
                background: colors.bg.container,
                padding: spacing[3],
                borderRadius: 8,
                border: `1px solid ${colors.border.subtle}`,
            }}
        >
            {/* Top Bar: Compact Settings */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing[2] }}>
                <Space wrap>
                    {/* PAT Status */}
                    {pat ? (
                        <Space wrap>
                            <Tag icon={<CheckCircleFilled />} color={colors.success.base}>
                                PAT Confluence{fullname ? ` · ${fullname}` : ''}
                            </Tag>
                            <Button size="small" icon={<KeyOutlined />} onClick={onOpenPatModal}>
                                Đổi PAT
                            </Button>
                        </Space>
                    ) : (
                        <Button size="small" icon={<KeyOutlined />} onClick={onOpenPatModal}>
                            Cấu hình PAT
                        </Button>
                    )}

                    {/* Provider Select */}
                    <Select
                        size="small"
                        style={{ width: 180 }}
                        value={providerId}
                        onChange={onSelectProvider}
                        options={providers.map((p) => ({
                            value: p.id,
                            label: `${p.label} (${p.type})`,
                        }))}
                        placeholder="Chọn AI Provider"
                    />
                </Space>

                {/* Profile Select */}
                <Space wrap>
                    <span style={{ fontSize: 12, fontWeight: 500, color: colors.text.secondary }}>Loại đặc tả (Profile):</span>
                    <Select
                        size="small"
                        style={{ width: 160 }}
                        value={profile}
                        onChange={onChangeProfile}
                        options={[
                            { value: 'UI', label: 'UI — Có giao diện' },
                            { value: 'TICHHOP', label: 'TICHHOP — Tích hợp API' },
                            { value: 'JOB', label: 'JOB — Bắt buộc định kỳ' },
                            { value: 'PHANTICH', label: 'PHANTICH — Báo cáo' },
                            { value: 'DANHMUC', label: 'DANHMUC — Rút gọn' },
                        ]}
                    />
                </Space>
            </div>

            {/* Middle Row: Confluence Fetch Input */}
            <div style={{ display: 'flex', gap: spacing[2] }}>
                <Input
                    value={link}
                    onChange={(e) => onChangeLink(e.target.value)}
                    placeholder="Nhập Link Confluence hoặc Page ID (ví dụ: https://wiki.../pages/12345 hoặc 12345)"
                    onPressEnter={onFetch}
                />
                <Button icon={<CloudDownloadOutlined />} type="primary" onClick={onFetch} loading={fetching}>
                    Kéo dữ liệu
                </Button>
            </div>

            {/* Bottom Row: Editable Registry Context Codes */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: spacing[2],
                    paddingTop: spacing[2],
                    borderTop: `1px dashed ${colors.border.subtle}`,
                }}
            >
                <div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 2 }}>Phân hệ</div>
                    <Select
                        size="small"
                        style={{ width: '100%' }}
                        value={phanHe}
                        onChange={onChangePhanHe}
                        options={SUBSYSTEM_OPTIONS}
                    />
                </div>

                <div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 2 }}>Mã Chức năng (FUNC)</div>
                    <Input
                        size="small"
                        value={maChucNang}
                        onChange={(e) => onChangeMaChucNang(e.target.value)}
                        placeholder="FUNC-QLSP-047"
                    />
                </div>

                <div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 2 }}>Tên Chức năng</div>
                    <Input
                        size="small"
                        value={tenChucNang}
                        onChange={(e) => onChangeTenChucNang(e.target.value)}
                        placeholder="Quản lý sản phẩm"
                    />
                </div>

                <div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 2 }}>Nhóm Chức năng (GRP)</div>
                    <Input
                        size="small"
                        value={nhomChucNang}
                        onChange={(e) => onChangeNhomChucNang(e.target.value)}
                        placeholder="GRP-QLSP-01"
                    />
                </div>

                <div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 2 }}>Mã Use Cases</div>
                    <Input
                        size="small"
                        value={useCases}
                        onChange={(e) => onChangeUseCases(e.target.value)}
                        placeholder="UC-0778, UC-0779"
                    />
                </div>
            </div>

            {/* Run AI Button */}
            <div style={{ textAlign: 'right', marginTop: spacing[1] }}>
                <Button
                    type="primary"
                    size="large"
                    disabled={!hasSource}
                    loading={generating}
                    onClick={onGenerate}
                    style={{ background: colors.subsystem.tools, borderColor: colors.subsystem.tools }}
                >
                    ⚡ Phân tích & Sinh SRS v4.0 theo Mã đã chốt
                </Button>
            </div>
        </div>
    );
};

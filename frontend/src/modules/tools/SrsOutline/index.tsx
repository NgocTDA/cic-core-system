'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Descriptions, Empty, Radio, Space, Spin, Table, Tag, Typography } from 'antd';
import { BranchesOutlined, FileTextOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import { fetchOutlineMeta, fetchOutlineProfile } from '@/services/srsService';
import type { OutlineMeta, OutlineProfileResponse, ProfileId } from '@/types/srs';
import SectionView from './SectionView';

const { Text, Paragraph } = Typography;

/**
 * Trang CHỈ ĐỌC hiển thị đề cương đặc tả chức năng v3.x.
 *
 * Nguồn: /api/srs/outline → config/outline.json, vốn được SINH RA từ
 * `srs/tools/outline.py`. Trang này không sửa được gì — mục đích là đối chiếu
 * bằng mắt rằng đề cương web đang dùng đúng bằng bản của pipeline.
 */
const SrsOutline: React.FC = () => {
    const isMobile = useIsMobile();

    const [meta, setMeta] = useState<OutlineMeta | null>(null);
    const [profileId, setProfileId] = useState<ProfileId | null>(null);
    const [data, setData] = useState<OutlineProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useHeaderActions({ title: 'Đề cương đặc tả chức năng' }, []);

    useEffect(() => {
        fetchOutlineMeta()
            .then((m) => {
                setMeta(m);
                setProfileId(m.profiles[0]?.id ?? null);
            })
            .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được đề cương.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!profileId) return;
        setData(null);
        fetchOutlineProfile(profileId)
            .then(setData)
            .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được loại chức năng.'));
    }, [profileId]);

    if (error) {
        return (
            <PageLayout>
                <Alert
                    type="error"
                    showIcon
                    message="Không đọc được đề cương"
                    description={
                        <>
                            <Paragraph style={{ marginBottom: spacing[2] }}>{error}</Paragraph>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Sinh lại bằng <Text code>python tools/export_outline_json.py</Text> trong repo
                                srs, rồi chép kết quả vào <Text code>frontend/config/outline.json</Text>.
                            </Text>
                        </>
                    }
                />
            </PageLayout>
        );
    }

    if (loading || !meta) {
        return (
            <PageLayout>
                <div style={{ textAlign: 'center', padding: spacing[10] }}>
                    <Spin />
                </div>
            </PageLayout>
        );
    }

    const profile = data?.profile;
    const totalSections = profile
        ? profile.before.length + profile.features.length + profile.after.length
        : 0;

    return (
        <PageLayout>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '340px 1fr',
                    gap: spacing[4],
                    alignItems: 'start',
                }}
            >
                {/* LEFT — chọn loại + metadata */}
                <Space direction="vertical" size={parseInt(spacing[4], 10)} style={{ width: '100%' }}>
                    <SectionCard title="Loại chức năng">
                        <Radio.Group
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value as ProfileId)}
                            style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}
                        >
                            {meta.profiles.map((p) => (
                                <Radio key={p.id} value={p.id} style={{ alignItems: 'flex-start' }}>
                                    <div>
                                        <Text strong style={{ fontSize: 13 }}>
                                            {p.id}
                                        </Text>
                                        {p.requireDiagram && (
                                            <Tag
                                                color={colors.subsystem.tools}
                                                style={{ marginInlineStart: spacing[2] }}
                                            >
                                                bắt buộc sơ đồ
                                            </Tag>
                                        )}
                                        {p.variantOf && (
                                            <Tag style={{ marginInlineStart: spacing[2] }}>
                                                biến thể của {p.variantOf}
                                            </Tag>
                                        )}
                                        <div style={{ fontSize: 12, color: colors.text.secondary }}>{p.ten}</div>
                                    </div>
                                </Radio>
                            ))}
                        </Radio.Group>
                    </SectionCard>

                    <SectionCard title="Phiên bản đề cương">
                        <Descriptions column={1} size="small" colon={false}>
                            <Descriptions.Item label="Đề cương">
                                <Text strong>v{meta.outlineVersion}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Vân tay outline.py">
                                <Text code style={{ fontSize: 11 }}>
                                    {meta.sourceSha256.slice(0, 12)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Bề rộng vùng chữ">
                                {meta.usable} twips
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại gốc">
                                {meta.baseProfiles.join(' · ')}
                            </Descriptions.Item>
                        </Descriptions>
                        <Alert
                            type="info"
                            showIcon
                            style={{ marginTop: spacing[2] }}
                            message="Sinh tự động"
                            description="Đề cương lấy từ srs/tools/outline.py. Không sửa outline.json bằng tay — CI của repo srs sẽ chặn nếu hai bên lệch."
                        />
                    </SectionCard>

                    <SectionCard title="Quy ước mã">
                        <Table
                            size="small"
                            bordered
                            pagination={false}
                            dataSource={Object.entries(meta.codeRules).map(([key, r]) => ({ key, ...r }))}
                            columns={[
                                { title: 'Loại', dataIndex: 'label', key: 'label', width: '30%' },
                                {
                                    title: 'Dạng',
                                    dataIndex: 'form',
                                    key: 'form',
                                    render: (v: string) => <Text style={{ fontSize: 11 }}>{v}</Text>,
                                },
                                {
                                    title: 'Ví dụ',
                                    dataIndex: 'example',
                                    key: 'example',
                                    render: (v: string) => (
                                        <Text code style={{ fontSize: 11 }}>
                                            {v}
                                        </Text>
                                    ),
                                },
                            ]}
                        />
                    </SectionCard>
                </Space>

                {/* RIGHT — cây đề cương của loại đang chọn */}
                <SectionCard
                    title={profile ? `Đề cương · ${profile.id}` : 'Đề cương'}
                    count={profile ? totalSections : undefined}
                    extra={
                        profile ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {profile.before.length + profile.after.length} mục Heading 4 ·{' '}
                                {profile.features.length} mục Heading 5 mỗi tính năng
                            </Text>
                        ) : undefined
                    }
                >
                    {!profile ? (
                        <div style={{ textAlign: 'center', padding: spacing[8] }}>
                            <Spin />
                        </div>
                    ) : (
                        <div style={{ paddingTop: spacing[2] }}>
                            {/* Tiêu đề trang Confluence = Heading 3 bên Word */}
                            <div
                                style={{
                                    background: colors.bg.subtle,
                                    borderRadius: radius.md,
                                    padding: spacing[3],
                                    marginBottom: spacing[4],
                                }}
                            >
                                <Space size="small">
                                    <FileTextOutlined style={{ color: colors.subsystem.tools }} />
                                    <Text strong>{meta.title}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        Heading 3 · tiêu đề trang Confluence
                                    </Text>
                                </Space>
                            </div>

                            {profile.before.map((s) => (
                                <SectionView
                                    key={s.name}
                                    section={s}
                                    level="h4"
                                    usable={meta.usable}
                                    diagramMark={meta.diagramMark}
                                />
                            ))}

                            {/* Khối Tính năng — lặp n lần, nên khoanh vùng cho rõ */}
                            <div
                                style={{
                                    border: `1px dashed ${colors.subsystem.tools}`,
                                    borderRadius: radius.lg,
                                    padding: spacing[4],
                                    marginBottom: spacing[4],
                                }}
                            >
                                <div style={{ marginBottom: spacing[2] }}>
                                    <Space size="small" wrap>
                                        <BranchesOutlined style={{ color: colors.subsystem.tools }} />
                                        <Text strong style={{ fontSize: 14 }}>
                                            {meta.featureTitle}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Heading 4
                                        </Text>
                                        <Tag color={colors.subsystem.tools}>lặp cho mỗi tính năng</Tag>
                                    </Space>
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: 12, display: 'block', marginBottom: spacing[3] }}
                                >
                                    {meta.featureNote}
                                </Text>

                                {profile.features.map((s) => (
                                    <SectionView
                                        key={s.name}
                                        section={s}
                                        level="h5"
                                        usable={meta.usable}
                                        diagramMark={meta.diagramMark}
                                    />
                                ))}
                            </div>

                            {profile.after.map((s) => (
                                <SectionView
                                    key={s.name}
                                    section={s}
                                    level="h4"
                                    usable={meta.usable}
                                    diagramMark={meta.diagramMark}
                                />
                            ))}

                            {data?.guidance?.length ? (
                                <SectionCard title="Quy ước bắt buộc">
                                    <ul style={{ paddingInlineStart: spacing[5], margin: 0 }}>
                                        {data.guidance.map((g, i) => (
                                            <li
                                                key={i}
                                                style={{
                                                    fontSize: 12,
                                                    color: colors.text.secondary,
                                                    marginBottom: spacing[1],
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {g}
                                            </li>
                                        ))}
                                    </ul>
                                </SectionCard>
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có quy ước" />
                            )}
                        </div>
                    )}
                </SectionCard>
            </div>
        </PageLayout>
    );
};

export default SrsOutline;

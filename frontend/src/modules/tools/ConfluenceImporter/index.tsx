'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Typography, Image, Alert, Tag } from 'antd';
import { CloudDownloadOutlined, ThunderboltOutlined, FileTextOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard } from '@/components/ui';
import { spacing, colors } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    fetchConfluencePage,
    generateDocFromSource,
    fetchPromptLabel,
    type ConfluencePage,
} from '@/services/aiService';
import ProviderSelect from '../UIDocGenerator/ProviderSelect';
import DocResultPanel from '../UIDocGenerator/DocResultPanel';
import { buildConfluence } from '../UIDocGenerator/buildConfluence';
import { useAIProvider } from '../UIDocGenerator/useAIProvider';
import type { DocData } from '../UIDocGenerator/types';

const { Text } = Typography;

const ConfluenceImporter: React.FC = () => {
    const isMobile = useIsMobile();
    const { providers, providerId, setProviderId, loading: providersLoading } = useAIProvider();

    const [link, setLink] = useState('');
    const [page, setPage] = useState<ConfluencePage | null>(null);
    const [markdown, setMarkdown] = useState('');
    const [fetching, setFetching] = useState(false);

    const [data, setData] = useState<DocData | null>(null);
    const [confluence, setConfluence] = useState('');
    const [generating, setGenerating] = useState(false);
    const [promptLabel, setPromptLabel] = useState<string | null>(null);

    useHeaderActions({ title: 'Confluence → Tài liệu SRS' }, []);

    useEffect(() => {
        fetchPromptLabel('confluence').then(setPromptLabel);
    }, []);

    const selected = providers.find((p) => p.id === providerId);
    const images = page?.images ?? [];

    const handleFetch = async () => {
        if (!link.trim()) {
            message.error('Nhập link Confluence hoặc Page ID.');
            return;
        }
        setFetching(true);
        setPage(null);
        setMarkdown('');
        setData(null);
        setConfluence('');
        try {
            // Số thuần → pageId; còn lại → url.
            const input = /^\d+$/.test(link.trim()) ? { pageId: link.trim() } : { url: link.trim() };
            const result = await fetchConfluencePage(input);
            setPage(result);
            setMarkdown(result.markdown);
            message.success(`Đã kéo trang: ${result.title || result.pageId}`);
        } catch (err) {
            message.error('Lỗi kéo Confluence: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setFetching(false);
        }
    };

    const handleGenerate = async () => {
        if (!markdown.trim()) {
            message.error('Chưa có nội dung. Hãy "Kéo dữ liệu" trước.');
            return;
        }
        if (!providerId) {
            message.error('Vui lòng chọn AI provider.');
            return;
        }
        if (selected && !selected.typeValid) {
            message.error(`Provider "${selected.label}" có type không hợp lệ (chỉ A/O/G).`);
            return;
        }
        if (selected && !selected.hasKey) {
            message.error(`Provider "${selected.label}" chưa cấu hình API key trên server.`);
            return;
        }
        setGenerating(true);
        setData(null);
        setConfluence('');
        try {
            const result = await generateDocFromSource(markdown, images, providerId);
            setData(result);
            setConfluence(buildConfluence(result));
            message.success('Hoàn thành! Sẵn sàng xuất Confluence & Word.');
        } catch (err) {
            message.error('Lỗi: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setGenerating(false);
        }
    };

    return (
        <PageLayout>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
                    gap: spacing[4],
                    alignItems: 'start',
                }}
            >
                {/* LEFT — nguồn Confluence */}
                <SectionCard title="Nguồn Confluence">
                    <Form layout="vertical" style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                        <Form.Item label="Link Confluence hoặc Page ID" style={{ marginBottom: spacing[2] }}>
                            <Input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="VD: https://wiki.../pages/viewpage.action?pageId=12345 hoặc 12345"
                                onPressEnter={handleFetch}
                            />
                        </Form.Item>
                        <Button
                            icon={<CloudDownloadOutlined />}
                            onClick={handleFetch}
                            loading={fetching}
                            block
                            style={{ marginBottom: spacing[3] }}
                        >
                            {fetching ? 'Đang kéo dữ liệu...' : 'Kéo dữ liệu'}
                        </Button>

                        {page && (
                            <Text type="secondary" style={{ fontSize: 12, marginBottom: spacing[2] }}>
                                Đã kéo: <b>{page.title || page.pageId}</b> · {images.length} ảnh
                            </Text>
                        )}

                        {markdown && (
                            <Form.Item label="Nội dung (markdown — có thể sửa/cắt trước khi sinh)" style={{ marginBottom: spacing[3] }}>
                                <Input.TextArea
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
                                    autoSize={{ minRows: 6, maxRows: 16 }}
                                    style={{ fontFamily: 'monospace', fontSize: 12 }}
                                />
                            </Form.Item>
                        )}

                        {images.length > 0 && (
                            <Form.Item label="Ảnh đính kèm (gửi AI + nhúng mockup)" style={{ marginBottom: spacing[3] }}>
                                <Image.PreviewGroup>
                                    <Space wrap size="small">
                                        {images.map((img, i) => (
                                            <Image key={i} src={img.dataUrl} alt={img.name} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 6 }} />
                                        ))}
                                    </Space>
                                </Image.PreviewGroup>
                            </Form.Item>
                        )}

                        <Form.Item label="AI Provider" style={{ marginBottom: spacing[3] }}>
                            <ProviderSelect
                                providers={providers}
                                value={providerId}
                                onChange={setProviderId}
                                disabled={generating}
                                loading={providersLoading}
                            />
                            {selected && !selected.hasKey && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    style={{ marginTop: spacing[1] }}
                                    message="Provider chưa có API key"
                                    description="Provider này chưa được cấu hình apiKey trên server."
                                />
                            )}
                            {promptLabel && (
                                <Tag
                                    icon={<FileTextOutlined />}
                                    color={colors.subsystem.tools}
                                    style={{ marginTop: spacing[1] }}
                                >
                                    Prompt: {promptLabel}
                                </Tag>
                            )}
                        </Form.Item>

                        <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            onClick={handleGenerate}
                            loading={generating}
                            disabled={!markdown.trim()}
                            block
                            size="large"
                        >
                            {generating ? 'Đang sinh tài liệu...' : 'Sinh tài liệu'}
                        </Button>
                        <Text type="secondary" style={{ fontSize: 11, marginTop: spacing[1] }}>
                            PAT Confluence & key AI do server giữ — bạn không cần nhập.
                        </Text>
                    </Form>
                </SectionCard>

                {/* RIGHT — kết quả (dùng chung) */}
                <DocResultPanel
                    data={data}
                    confluence={confluence}
                    loading={generating}
                    image={images[0]?.dataUrl}
                />
            </div>
        </PageLayout>
    );
};

export default ConfluenceImporter;

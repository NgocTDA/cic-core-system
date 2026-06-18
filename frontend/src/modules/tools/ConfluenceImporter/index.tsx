'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Typography, Image, Alert, Tag, Modal } from 'antd';
import { CloudDownloadOutlined, ThunderboltOutlined, FileTextOutlined, KeyOutlined, CheckCircleFilled } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard } from '@/components/ui';
import { spacing, colors } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    fetchConfluencePage,
    generateDocFromSource,
    fetchPromptLabel,
    validateConfluencePat,
    type ConfluencePage,
} from '@/services/aiService';
import ProviderSelect from '../UIDocGenerator/ProviderSelect';
import DocResultPanel from '../UIDocGenerator/DocResultPanel';
import { buildConfluence } from '../UIDocGenerator/buildConfluence';
import { useAIProvider } from '../UIDocGenerator/useAIProvider';
import type { DocData } from '../UIDocGenerator/types';

const { Text } = Typography;

// PAT của người dùng lưu localStorage (Confluence không cho xem lại PAT → phải tự lưu).
const LS_PAT = 'confluence.pat';
const LS_FULLNAME = 'confluence.fullname';

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

    // PAT cá nhân + fullname (lưu localStorage)
    const [pat, setPat] = useState('');
    const [fullname, setFullname] = useState('');
    const [patOpen, setPatOpen] = useState(false);
    const [patInput, setPatInput] = useState('');
    const [validating, setValidating] = useState(false);

    useHeaderActions({ title: 'Confluence → Tài liệu SRS' }, []);

    useEffect(() => {
        fetchPromptLabel('confluence').then(setPromptLabel);
        setPat(localStorage.getItem(LS_PAT) ?? '');
        setFullname(localStorage.getItem(LS_FULLNAME) ?? '');
    }, []);

    const handleSavePat = async () => {
        const token = patInput.trim();
        if (!token) {
            message.error('Dán PAT trước khi lưu.');
            return;
        }
        setValidating(true);
        try {
            const r = await validateConfluencePat(token);
            if (!r.valid) {
                message.error('PAT không hợp lệ: ' + (r.error ?? 'kiểm tra lại'));
                return;
            }
            localStorage.setItem(LS_PAT, token);
            localStorage.setItem(LS_FULLNAME, r.fullname ?? '');
            setPat(token);
            setFullname(r.fullname ?? '');
            setPatInput('');
            setPatOpen(false);
            message.success(`PAT hợp lệ — xin chào ${r.fullname || 'bạn'}!`);
        } catch (err) {
            message.error('Lỗi kiểm tra PAT: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setValidating(false);
        }
    };

    const clearPat = () => {
        localStorage.removeItem(LS_PAT);
        localStorage.removeItem(LS_FULLNAME);
        setPat('');
        setFullname('');
        message.info('Đã xoá PAT khỏi trình duyệt.');
    };

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
            const result = await fetchConfluencePage(input, pat || undefined);
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
                        {/* Trạng thái PAT cá nhân */}
                        <Form.Item label="PAT Confluence (tài khoản của bạn)" style={{ marginBottom: spacing[2] }}>
                            {pat ? (
                                <Space wrap>
                                    <Tag icon={<CheckCircleFilled />} color={colors.success.base}>
                                        Đã cấu hình{fullname ? ` · ${fullname}` : ''}
                                    </Tag>
                                    <Button size="small" icon={<KeyOutlined />} onClick={() => setPatOpen(true)}>
                                        Đổi PAT
                                    </Button>
                                    <Button size="small" danger onClick={clearPat}>
                                        Xoá
                                    </Button>
                                </Space>
                            ) : (
                                <Button icon={<KeyOutlined />} onClick={() => setPatOpen(true)} block>
                                    Cấu hình PAT
                                </Button>
                            )}
                        </Form.Item>

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
                            PAT lưu tại trình duyệt của bạn; key AI do server giữ. Tên bạn ({fullname || '—'}) sẽ điền vào [Tên BA].
                        </Text>
                    </Form>
                </SectionCard>

                {/* RIGHT — kết quả (dùng chung) */}
                <DocResultPanel
                    data={data}
                    confluence={confluence}
                    loading={generating}
                    image={images[0]?.dataUrl}
                    author={fullname || undefined}
                />
            </div>

            {/* Modal cấu hình PAT */}
            <Modal
                title="Cấu hình PAT Confluence"
                open={patOpen}
                onCancel={() => setPatOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[2] }}>
                        <Button onClick={() => setPatOpen(false)}>Huỷ</Button>
                        <Button type="primary" loading={validating} onClick={handleSavePat}>
                            Kiểm tra &amp; lưu
                        </Button>
                    </div>
                }
            >
                <Input.Password
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="Dán Personal Access Token"
                    onPressEnter={handleSavePat}
                />
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: spacing[2] }}>
                    PAT lưu tại trình duyệt của bạn (localStorage). Confluence không cho xem lại PAT — nếu mất phải sinh token mới.
                    Tạo PAT: avatar → Settings → Personal Access Tokens.
                </Text>
            </Modal>
        </PageLayout>
    );
};

export default ConfluenceImporter;

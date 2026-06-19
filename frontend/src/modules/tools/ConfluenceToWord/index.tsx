'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Typography, Alert, Tag, Modal, Spin } from 'antd';
import {
    FileWordOutlined,
    DownloadOutlined,
    KeyOutlined,
    CheckCircleFilled,
} from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard } from '@/components/ui';
import { spacing, colors } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import { fetchConfluenceDocx, fetchCachedDocxBlob, validateConfluencePat } from '@/services/aiService';
import DocxBlobPreview from './DocxBlobPreview';

const { Text } = Typography;

// PAT dùng chung với ConfluenceImporter (Confluence không cho xem lại PAT → tự lưu localStorage).
const LS_PAT = 'confluence.pat';
const LS_FULLNAME = 'confluence.fullname';

const ConfluenceToWord: React.FC = () => {
    const isMobile = useIsMobile();

    const [link, setLink] = useState('');
    const [generating, setGenerating] = useState(false);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [fileId, setFileId] = useState('');
    const [filename, setFilename] = useState('confluence.docx');
    const [title, setTitle] = useState('');

    // PAT cá nhân + fullname (lưu localStorage)
    const [pat, setPat] = useState('');
    const [fullname, setFullname] = useState('');
    const [patOpen, setPatOpen] = useState(false);
    const [patInput, setPatInput] = useState('');
    const [validating, setValidating] = useState(false);

    useHeaderActions({ title: 'Confluence → Word (nguyên bản)' }, []);

    useEffect(() => {
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

    const handleGenerate = async () => {
        if (!link.trim()) {
            message.error('Nhập link Confluence hoặc Page ID.');
            return;
        }
        setGenerating(true);
        setBlob(null);
        setFileId('');
        setTitle('');
        try {
            const input = /^\d+$/.test(link.trim()) ? { pageId: link.trim() } : { url: link.trim() };
            const result = await fetchConfluenceDocx(input, pat || undefined);
            setFileId(result.fileId);
            setFilename(result.filename);
            setTitle(result.title ?? '');
            // Fetch blob từ server cache (cùng file sẽ dùng cho download) → docx-preview render
            const docxBlob = await fetchCachedDocxBlob(result.fileId);
            setBlob(docxBlob);
            message.success('Đã tạo bản Word từ Confluence!');
        } catch (err) {
            message.error('Lỗi: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setGenerating(false);
        }
    };

    const resultActions = fileId ? (
        <a
            href={`/api/confluence/docx?fileId=${encodeURIComponent(fileId)}&download=1`}
            download={filename}
        >
            <Button type="primary" icon={<DownloadOutlined />}>Tải .docx</Button>
        </a>
    ) : undefined;

    return (
        <PageLayout>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
                    gridTemplateRows: '1fr',
                    gap: spacing[4],
                    flex: 1,
                    minHeight: 0,
                    alignItems: 'stretch',
                }}
            >
                {/* LEFT — nguồn Confluence */}
                <SectionCard title="Nguồn Confluence" style={{ alignSelf: 'start' }}>
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

                        <Form.Item label="Link Confluence hoặc Page ID" style={{ marginBottom: spacing[3] }}>
                            <Input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="VD: https://wiki.../pages/viewpage.action?pageId=12345 hoặc 12345"
                                onPressEnter={handleGenerate}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            icon={<FileWordOutlined />}
                            onClick={handleGenerate}
                            loading={generating}
                            block
                            size="large"
                        >
                            {generating ? 'Đang tạo bản Word...' : 'Tạo bản Word'}
                        </Button>

                        <Alert
                            type="info"
                            showIcon
                            style={{ marginTop: spacing[2] }}
                            message="Chuyển nguyên bản"
                            description="Giữ cấu trúc & ảnh đúng vị trí từ Confluence, không qua AI."
                        />

                        <Text type="secondary" style={{ fontSize: 11, marginTop: spacing[1] }}>
                            PAT lưu tại trình duyệt của bạn. Mỗi lần nhập link sẽ tạo bản Word mới.
                        </Text>
                    </Form>
                </SectionCard>

                {/* RIGHT — kết quả */}
                <SectionCard title={title ? `Kết quả · ${title}` : 'Kết quả'} extra={resultActions} flex>
                    {generating && !blob ? (
                        <div style={{ textAlign: 'center', padding: spacing[6] }}>
                            <Spin />
                            <div style={{ marginTop: spacing[2], color: colors.text.secondary, fontSize: 13 }}>
                                Đang kéo trang & dựng bản Word...
                            </div>
                        </div>
                    ) : (
                        <DocxBlobPreview blob={blob} />
                    )}
                </SectionCard>
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

export default ConfluenceToWord;

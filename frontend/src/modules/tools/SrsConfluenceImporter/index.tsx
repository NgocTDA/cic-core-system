'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, message, Alert, Spin } from 'antd';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout } from '@/components/ui';
import { spacing } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    fetchConfluencePage,
    validateConfluencePat,
    type ConfluencePage,
} from '@/services/aiService';
import { matchPageTitleToCodes } from '@/services/registryService';
import { useAIProvider } from '../UIDocGenerator/useAIProvider';
import type { SrsV4DocData, SrsV4Profile } from '@/types/srsV4';
import { MetadataHeaderBar } from './MetadataHeaderBar';
import { SrsV4ResultPanel } from './SrsV4ResultPanel';

const LS_PAT = 'confluence.pat';
const LS_FULLNAME = 'confluence.fullname';

const SrsConfluenceImporter: React.FC = () => {
    const isMobile = useIsMobile();
    const { providers, providerId, setProviderId } = useAIProvider();

    const [link, setLink] = useState('');
    const [page, setPage] = useState<ConfluencePage | null>(null);
    const [fetching, setFetching] = useState(false);

    // Metadata Context Codes
    const [profile, setProfile] = useState<SrsV4Profile>('UI');
    const [phanHe, setPhanHe] = useState('QLSP');
    const [maChucNang, setMaChucNang] = useState('FUNC-QLSP-047');
    const [tenChucNang, setTenChucNang] = useState('');
    const [nhomChucNang, setNhomChucNang] = useState('GRP-QLSP-01');
    const [useCases, setUseCases] = useState('UC-0778, UC-0779');

    // AI Generation
    const [docData, setDocData] = useState<SrsV4DocData | null>(null);
    const [generating, setGenerating] = useState(false);
    const [downloadingDocx, setDownloadingDocx] = useState(false);

    // PAT Modal
    const [pat, setPat] = useState('');
    const [fullname, setFullname] = useState('');
    const [patOpen, setPatOpen] = useState(false);
    const [patInput, setPatInput] = useState('');
    const [validatingPat, setValidatingPat] = useState(false);

    useHeaderActions({ title: 'SRS Confluence Importer (v4 SRS)' }, []);

    useEffect(() => {
        setPat(localStorage.getItem(LS_PAT) ?? '');
        setFullname(localStorage.getItem(LS_FULLNAME) ?? '');
    }, []);

    const handleSavePat = async () => {
        const token = patInput.trim();
        if (!token) {
            message.error('Vui lòng dán PAT trước khi lưu.');
            return;
        }
        setValidatingPat(true);
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
            message.success(`Xác thực PAT thành công! Xin chào ${r.fullname || 'bạn'}.`);
        } catch (err) {
            message.error('Lỗi kiểm tra PAT: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setValidatingPat(false);
        }
    };

    const handleClearPat = () => {
        localStorage.removeItem(LS_PAT);
        localStorage.removeItem(LS_FULLNAME);
        setPat('');
        setFullname('');
        message.info('Đã xoá PAT khỏi trình duyệt.');
    };

    const handleFetchConfluence = async () => {
        if (!link.trim()) {
            message.error('Nhập link Confluence hoặc Page ID.');
            return;
        }
        setFetching(true);
        setPage(null);
        setDocData(null);
        try {
            const input = /^\d+$/.test(link.trim()) ? { pageId: link.trim() } : { url: link.trim() };
            const result = await fetchConfluencePage(input, pat || undefined);
            setPage(result);
            setTenChucNang(result.title);
            message.success(`Đã kéo trang Confluence: "${result.title}"`);

            // Khớp Tên trang với sổ đăng ký CSV để tự động gợi ý mã
            const match = await matchPageTitleToCodes(result.title);
            if (match.phanHe) setPhanHe(match.phanHe);
            if (match.maChucNang) setMaChucNang(match.maChucNang);
            if (match.nhomChucNang) setNhomChucNang(match.nhomChucNang);
        } catch (err) {
            message.error('Lỗi kéo Confluence: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setFetching(false);
        }
    };

    const handleGenerateSrsV4 = async () => {
        if (!page?.markdown?.trim()) {
            message.error('Chưa có nội dung. Vui lòng bấm "Kéo dữ liệu" trước.');
            return;
        }
        if (!providerId) {
            message.error('Vui lòng chọn AI provider.');
            return;
        }
        setGenerating(true);
        setDocData(null);
        try {
            const res = await fetch('/api/ai/srs-v4-generate', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    providerId,
                    source: page.markdown,
                    context: {
                        profile,
                        phanHe,
                        maChucNang,
                        tenChucNang: tenChucNang || page.title,
                        nhomChucNang,
                        useCases: useCases.split(',').map((u) => u.trim()).filter(Boolean),
                    },
                    images: (page.images || []).map((img) => ({ dataUrl: img.dataUrl })),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? 'Lỗi gọi AI sinh SRS v4.0');
            setDocData(data.doc as SrsV4DocData);
            message.success('Phân tích & sinh SRS v4.0 hoàn tất!');
        } catch (err) {
            message.error('Lỗi: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadDocx = async () => {
        if (!docData) return;
        setDownloadingDocx(true);
        try {
            const res = await fetch('/api/ai/srs-v4-docx', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    doc: docData,
                    images: page?.images || [],
                    author: fullname || 'Cán bộ BA',
                }),
            });
            if (!res.ok) throw new Error('Không tải được file Word .docx');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${maChucNang}_${tenChucNang || 'SRS_v4'}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            message.success('Đã tải xuống file Word .docx thành công!');
        } catch (err) {
            message.error('Lỗi tải file Word: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setDownloadingDocx(false);
        }
    };

    return (
        <PageLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                {/* Header & Metadata Control Bar */}
                <MetadataHeaderBar
                    pat={pat}
                    fullname={fullname}
                    onOpenPatModal={() => setPatOpen(true)}
                    onClearPat={handleClearPat}
                    providers={providers}
                    providerId={providerId}
                    onSelectProvider={setProviderId}
                    profile={profile}
                    onChangeProfile={setProfile}
                    link={link}
                    onChangeLink={setLink}
                    onFetch={handleFetchConfluence}
                    fetching={fetching}
                    phanHe={phanHe}
                    onChangePhanHe={setPhanHe}
                    maChucNang={maChucNang}
                    onChangeMaChucNang={setMaChucNang}
                    tenChucNang={tenChucNang}
                    onChangeTenChucNang={setTenChucNang}
                    nhomChucNang={nhomChucNang}
                    onChangeNhomChucNang={setNhomChucNang}
                    useCases={useCases}
                    onChangeUseCases={setUseCases}
                    onGenerate={handleGenerateSrsV4}
                    generating={generating}
                    hasSource={!!page?.markdown}
                />

                {/* Loading state */}
                {generating && (
                    <div style={{ textAlign: 'center', padding: spacing[8] }}>
                        <Spin size="large" tip="AI đang phân tích tài liệu và cấu trúc hóa theo mẫu SRS v4.0..." />
                    </div>
                )}

                {/* Result Panel */}
                {docData && !generating && (
                    <SrsV4ResultPanel
                        data={docData}
                        onDownloadDocx={handleDownloadDocx}
                        downloadingDocx={downloadingDocx}
                    />
                )}
            </div>

            {/* PAT Modal */}
            <Modal
                title="Cấu hình PAT Confluence"
                open={patOpen}
                onOk={handleSavePat}
                onCancel={() => setPatOpen(false)}
                confirmLoading={validatingPat}
                okText="Lưu PAT"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Personal Access Token (PAT)" required>
                        <Input.Password
                            value={patInput}
                            onChange={(e) => setPatInput(e.target.value)}
                            placeholder="Dán PAT lấy từ Confluence Profile > Personal Access Tokens"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </PageLayout>
    );
};

export default SrsConfluenceImporter;

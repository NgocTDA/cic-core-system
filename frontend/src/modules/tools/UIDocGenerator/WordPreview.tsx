'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spin, Alert, Empty } from 'antd';
import { spacing, colors } from '@/design-system';
import { fetchDocxBlob } from '@/services/aiService';
import type { DocData } from './types';

interface WordPreviewProps {
    doc: DocData | null;
    image?: string;
}

// Render file .docx THẬT (từ template Word) ra HTML bằng docx-preview.
// Lazy: chỉ fetch + render khi component được mount (mở tab) và có doc.
const WordPreview: React.FC<WordPreviewProps> = ({ doc, image }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doc) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { blob } = await fetchDocxBlob(doc, image);
                if (cancelled) return;
                const { renderAsync } = await import('docx-preview');
                const container = containerRef.current;
                if (!container) return;
                container.innerHTML = '';
                await renderAsync(blob, container, undefined, {
                    className: 'docx',
                    inWrapper: true,
                    ignoreWidth: false,
                    ignoreHeight: false,
                    breakPages: true,
                });
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Không render được file Word.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [doc, image]);

    if (!doc) {
        return (
            <div style={{ padding: 60, textAlign: 'center' }}>
                <Empty description="Sinh tài liệu xong, mở tab này để xem đúng bản Word sẽ tải về" />
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', minHeight: 200 }}>
            {loading && (
                <div style={{ textAlign: 'center', padding: spacing[6] }}>
                    <Spin />
                    <div style={{ marginTop: spacing[2], color: colors.text.secondary, fontSize: 13 }}>
                        Đang dựng bản Word thật...
                    </div>
                </div>
            )}
            {error && (
                <Alert type="error" showIcon message="Lỗi xem trước Word" description={error} style={{ marginBottom: spacing[3] }} />
            )}
            {/* Container cho docx-preview; nền xám để thấy mép trang giống Word */}
            <div
                ref={containerRef}
                style={{
                    display: loading ? 'none' : 'block',
                    background: colors.bg.page,
                    padding: spacing[3],
                    borderRadius: 8,
                    maxHeight: '65vh',
                    overflow: 'auto',
                }}
            />
        </div>
    );
};

export default WordPreview;

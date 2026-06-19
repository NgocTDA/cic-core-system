'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spin, Alert, Empty } from 'antd';
import { spacing, colors } from '@/design-system';

interface DocxBlobPreviewProps {
    blob: Blob | null;
}

const DocxBlobPreview: React.FC<DocxBlobPreviewProps> = ({ blob }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const styleContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!blob) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { renderAsync } = await import('docx-preview');
                const container = containerRef.current;
                const styleContainer = styleContainerRef.current;
                if (cancelled || !container) return;
                container.innerHTML = '';
                await renderAsync(blob, container, styleContainer ?? undefined, {
                    className: 'docx',
                    inWrapper: true,
                    ignoreWidth: false,
                    ignoreFonts: false,
                    breakPages: true,
                    ignoreLastRenderedPageBreak: false,
                    useBase64URL: true,
                    renderHeaders: true,
                    renderFooters: true,
                    renderFootnotes: true,
                    renderEndnotes: true,
                });
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Không render được file Word.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [blob]);

    if (!blob) {
        return (
            <div style={{ padding: 60, textAlign: 'center' }}>
                <Empty description="Tạo bản Word xong sẽ hiển thị xem trước ở đây" />
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div ref={styleContainerRef} style={{ display: 'none' }} />
            {loading && (
                <div style={{ textAlign: 'center', padding: spacing[6] }}>
                    <Spin />
                    <div style={{ marginTop: spacing[2], color: colors.text.secondary, fontSize: 13 }}>
                        Đang dựng bản Word...
                    </div>
                </div>
            )}
            {error && (
                <Alert type="error" showIcon message="Lỗi xem trước Word" description={error}
                    style={{ marginBottom: spacing[3] }} />
            )}
            <div
                ref={containerRef}
                style={{
                    display: loading ? 'none' : 'block',
                    flex: 1,
                    overflow: 'auto',
                    background: colors.bg.page,
                    padding: spacing[3],
                    borderRadius: 8,
                }}
            />
        </div>
    );
};

export default DocxBlobPreview;

'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, Button, Space, message, Empty } from 'antd';
import { CopyOutlined, DownloadOutlined, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { SectionCard } from '@/components/ui';
import { colors, spacing, radius } from '@/design-system';
import { downloadDocx } from '@/services/aiService';
import DocPreview from './DocPreview';
import WordPreview from './WordPreview';
import type { DocData } from './types';

// Chiều cao vùng kết quả — dùng chung cho cả 3 tab để đồng nhất.
const RESULT_AREA_HEIGHT = '65vh';

interface DocResultPanelProps {
    data: DocData | null;
    confluence: string;
    loading: boolean; // đang sinh tài liệu → tab hiện spin
    image?: string; // ảnh mockup đầu tiên (cho WordPreview + nhúng docx)
}

// Khu "Kết quả" dùng chung cho mọi tool sinh tài liệu (form nhập tay / Confluence).
// Tự quản lý: tab đang chọn, icon spin/✓, copy Confluence, tải .docx.
const DocResultPanel: React.FC<DocResultPanelProps> = ({ data, confluence, loading, image }) => {
    const [activeTab, setActiveTab] = useState('confluence');
    const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set());
    const [downloading, setDownloading] = useState(false);

    // Reset trạng thái đã xem mỗi lần bắt đầu sinh mới.
    useEffect(() => {
        if (loading) setViewedTabs(new Set());
    }, [loading]);

    const markViewed = (key: string) =>
        setViewedTabs((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));

    useEffect(() => {
        if (!loading && data && (activeTab === 'confluence' || activeTab === 'preview')) {
            markViewed(activeTab);
        }
    }, [activeTab, data, loading]);

    const tabIcon = (key: string): React.ReactNode => {
        if (loading) return <LoadingOutlined />;
        if (viewedTabs.has(key)) return <CheckCircleFilled style={{ color: colors.success.base }} />;
        return null;
    };

    const copyConfluence = () =>
        navigator.clipboard.writeText(confluence).then(() => message.success('Đã copy Confluence Markup!'));

    const handleDownload = async () => {
        if (!data) return;
        setDownloading(true);
        try {
            await downloadDocx(data, image);
            message.success('Đã tải file .docx!');
        } catch (err) {
            message.error('Lỗi tạo file: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setDownloading(false);
        }
    };

    const resultActions = data ? (
        <Space>
            <Button icon={<CopyOutlined />} onClick={copyConfluence}>
                Copy Confluence
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} loading={downloading} onClick={handleDownload}>
                Tải .docx
            </Button>
        </Space>
    ) : undefined;

    return (
        <SectionCard title="Kết quả" extra={resultActions}>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'confluence',
                        label: 'Confluence Markup',
                        icon: tabIcon('confluence'),
                        children: (
                            <div style={{ height: RESULT_AREA_HEIGHT, overflow: 'auto' }}>
                                {confluence ? (
                                    <pre
                                        style={{
                                            background: colors.neutral[900],
                                            color: colors.neutral[100],
                                            padding: spacing[4],
                                            borderRadius: radius.md,
                                            fontSize: 12,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 1.65,
                                            margin: 0,
                                        }}
                                    >
                                        {confluence}
                                    </pre>
                                ) : (
                                    <Empty description="Confluence Markup sẽ hiển thị ở đây" />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'preview',
                        label: 'Xem trước nội dung',
                        icon: tabIcon('preview'),
                        children: (
                            <div style={{ height: RESULT_AREA_HEIGHT, overflow: 'auto' }}>
                                <DocPreview d={data} />
                            </div>
                        ),
                    },
                    {
                        key: 'word',
                        label: 'Bản Word thật',
                        icon: tabIcon('word'),
                        children: (
                            <div style={{ height: RESULT_AREA_HEIGHT, overflow: 'auto' }}>
                                {activeTab === 'word' ? (
                                    <WordPreview doc={data} image={image} onRendered={() => markViewed('word')} />
                                ) : null}
                            </div>
                        ),
                    },
                ]}
            />
        </SectionCard>
    );
};

export default DocResultPanel;

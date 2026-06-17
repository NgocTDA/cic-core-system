'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard } from '@/components/ui';
import { spacing } from '@/design-system';
import { useIsMobile } from '@/hooks/useIsMobile';
import { generateDoc, fetchPromptLabel } from '@/services/aiService';
import DocForm from './DocForm';
import DocResultPanel from './DocResultPanel';
import { buildConfluence } from './buildConfluence';
import { useAIProvider } from './useAIProvider';
import type { DocData, DocInput } from './types';

const EMPTY_INPUT: DocInput = { funcName: '', screenCode: '', module: '', funcDesc: '', images: [] };

const UIDocGenerator: React.FC = () => {
    const isMobile = useIsMobile();
    const { providers, providerId, setProviderId, loading: providersLoading } = useAIProvider();
    const [input, setInput] = useState<DocInput>(EMPTY_INPUT);
    const [data, setData] = useState<DocData | null>(null);
    const [confluence, setConfluence] = useState('');
    const [loading, setLoading] = useState(false);
    const [promptLabel, setPromptLabel] = useState<string | null>(null);

    useHeaderActions({ title: 'CIC UI Doc Generator' }, []);

    useEffect(() => {
        fetchPromptLabel().then(setPromptLabel);
    }, []);

    const onChange = (patch: Partial<DocInput>) => setInput((prev) => ({ ...prev, ...patch }));

    const handleGenerate = async () => {
        if (!input.funcName.trim()) {
            message.error('Vui lòng nhập tên chức năng.');
            return;
        }
        if (!providerId) {
            message.error('Vui lòng chọn AI provider.');
            return;
        }
        const selected = providers.find((p) => p.id === providerId);
        if (selected && !selected.typeValid) {
            message.error(`Provider "${selected.label}" có type không hợp lệ (chỉ A/O/G).`);
            return;
        }
        if (selected && !selected.hasKey) {
            message.error(`Provider "${selected.label}" chưa cấu hình API key trên server.`);
            return;
        }
        setLoading(true);
        setData(null);
        setConfluence('');
        try {
            const result = await generateDoc(input, providerId);
            setData(result);
            setConfluence(buildConfluence(result));
            message.success('Hoàn thành! Sẵn sàng xuất Confluence & Word.');
        } catch (err) {
            message.error('Lỗi: ' + (err instanceof Error ? err.message : 'không xác định'));
        } finally {
            setLoading(false);
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
                {/* LEFT — input */}
                <SectionCard title="Thông tin đầu vào">
                    <DocForm
                        input={input}
                        onChange={onChange}
                        providers={providers}
                        providerId={providerId}
                        onProviderChange={setProviderId}
                        providersLoading={providersLoading}
                        promptLabel={promptLabel}
                        onGenerate={handleGenerate}
                        loading={loading}
                    />
                </SectionCard>

                {/* RIGHT — result (dùng chung) */}
                <DocResultPanel
                    data={data}
                    confluence={confluence}
                    loading={loading}
                    image={input.images[0]?.dataUrl}
                />
            </div>
        </PageLayout>
    );
};

export default UIDocGenerator;

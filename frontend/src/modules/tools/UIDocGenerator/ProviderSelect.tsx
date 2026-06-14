'use client';

import React from 'react';
import { Select } from 'antd';
import type { ProviderInfo } from './types';

interface ProviderSelectProps {
    providers: ProviderInfo[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    loading?: boolean;
}

const TYPE_LABEL: Record<string, string> = { A: 'Anthropic', O: 'OpenAI', G: 'Gemini' };

// Chọn AI provider từ danh sách server. Key do server cung cấp — user KHÔNG nhập key.
const ProviderSelect: React.FC<ProviderSelectProps> = ({ providers, value, onChange, disabled, loading }) => (
    <Select
        value={value || undefined}
        onChange={onChange}
        disabled={disabled}
        loading={loading}
        placeholder="Chọn provider"
        style={{ width: '100%' }}
        options={providers.map((p) => ({
            value: p.id,
            label: `${p.label} · ${TYPE_LABEL[p.type] ?? p.type}`,
        }))}
    />
);

export default ProviderSelect;

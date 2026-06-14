'use client';

import { useEffect, useState } from 'react';
import { fetchProviders } from '@/services/aiService';
import type { ProviderInfo } from './types';

const STORAGE_KEY = 'uidoc.providerId';

// Tải danh sách provider từ server và quản lý provider đang chọn (theo id).
// KHÔNG giữ API key ở client — key nằm server-side.
export function useAIProvider() {
    const [providers, setProviders] = useState<ProviderInfo[]>([]);
    const [providerId, setProviderIdState] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        fetchProviders()
            .then((list) => {
                if (!active) return;
                setProviders(list);
                const saved = localStorage.getItem(STORAGE_KEY);
                const valid = saved && list.some((p) => p.id === saved) ? saved : list[0]?.id ?? '';
                setProviderIdState(valid);
            })
            .catch((e) => active && setError(e instanceof Error ? e.message : 'Lỗi tải provider'))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    const setProviderId = (id: string) => {
        setProviderIdState(id);
        localStorage.setItem(STORAGE_KEY, id);
    };

    return { providers, providerId, setProviderId, loading, error };
}

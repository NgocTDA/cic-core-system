// ============================================================
//  AI Providers config (SERVER-ONLY)
//  Đọc các "khối" provider từ file JSON (gitignore).
//  KHÔNG bao giờ trả apiKey/baseUrl ra client — chỉ id/label/type.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

export type ProviderType = 'A' | 'O' | 'G'; // Anthropic | OpenAI | Gemini

export interface ProviderConfig {
    label?: string;
    type: ProviderType;
    baseUrl: string;
    apiKey: string;
    model: string;
    authHeader?: string; // (type O) ghi đè tên header auth, vd 'x-api-key'; mặc định Bearer
    reasoningEffort?: string; // (type O) minimal | low | medium | high
}

export type ProvidersMap = Record<string, ProviderConfig>;

// Thông tin an toàn để gửi cho client (không có key/url).
// hasKey/typeValid cho phép UI cảnh báo cấu hình mà không lộ giá trị bí mật.
export interface ProviderInfo {
    id: string;
    label: string;
    type: string; // giữ nguyên giá trị thô để báo lỗi nếu sai
    hasKey: boolean;
    typeValid: boolean;
}

export function isValidType(t: unknown): t is ProviderType {
    return t === 'A' || t === 'O' || t === 'G';
}

function configPath(): string {
    return process.env.AI_PROVIDERS_FILE
        ? path.resolve(process.env.AI_PROVIDERS_FILE)
        : path.join(process.cwd(), 'config', 'ai-providers.json');
}

// Đọc lại file mỗi lần (file nhỏ) để sửa config không cần restart.
export function loadProviders(): ProvidersMap {
    try {
        const raw = fs.readFileSync(configPath(), 'utf-8');
        const parsed = JSON.parse(raw) as ProvidersMap;
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

export function listProviders(): ProviderInfo[] {
    return Object.entries(loadProviders()).map(([id, cfg]) => ({
        id,
        label: cfg.label ?? id,
        type: cfg.type,
        hasKey: typeof cfg.apiKey === 'string' && cfg.apiKey.trim().length > 0,
        typeValid: isValidType(cfg.type),
    }));
}

// ============================================================
//  SRS v4.0 AI Proxy — Route Handler (server-side)
//  POST /api/ai/srs-v4-generate { providerId, source, context, images }
// ============================================================

import { NextResponse } from 'next/server';
import { loadProviders, isValidType, type ProviderConfig } from '../providersConfig';
import { loadSrsV4SystemPrompt, buildSrsV4UserPrompt, type SrsV4ContextInput } from '../srsV4Prompt';
import { extractDocJson } from '../srsPrompt';
import type { SrsV4DocData } from '@/types/srsV4';

export const runtime = 'nodejs';

interface ImagePayload {
    dataUrl: string;
}

interface SrsV4GenerateRequest {
    providerId: string;
    source: string; // Confluence markdown content
    context?: SrsV4ContextInput; // phanHe, maChucNang, tenChucNang, nhomChucNang, useCases
    images?: ImagePayload[];
}

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } {
    const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
    if (match) return { mediaType: match[1], base64: match[2] };
    return { mediaType: 'image/png', base64: dataUrl.replace(/^data:.*,/, '') };
}

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

function apiError(label: string, status: number, message?: string): Error {
    const m = (message ?? '').toLowerCase();
    if (status === 429 || status === 503 || m.includes('high demand') || m.includes('overloaded') || m.includes('rate limit') || m.includes('quota')) {
        return new Error(`AI Provider "${label}" đang tạm thời quá tải (High demand / 429 / 503). Vui lòng chọn AI Provider khác trên thanh công cụ (ví dụ: "N GPT-5.5" hoặc "N Claude Opus 4.8") và thử lại.`);
    }
    if (status === 401 || status === 403 || m.includes('invalid api key')) {
        return new Error(`${label}: API key sai hoặc không có quyền truy cập.`);
    }
    return new Error(message ?? `${label} lỗi (${status}).`);
}

async function callProvider(cfg: ProviderConfig, systemPrompt: string, userPrompt: string, images: ImagePayload[], providerId: string): Promise<string> {
    switch (cfg.type) {
        case 'A':
            return await callAnthropic(cfg, systemPrompt, userPrompt, images, providerId);
        case 'O':
            return await callOpenAI(cfg, systemPrompt, userPrompt, images, providerId);
        case 'G':
            return await callGemini(cfg, systemPrompt, userPrompt, images, providerId);
        default:
            throw new Error(`Type ${cfg.type} không hợp lệ.`);
    }
}

async function callAnthropic(cfg: ProviderConfig, system: string, userPrompt: string, images: ImagePayload[], label: string): Promise<string> {
    const content: unknown[] = [
        ...images.map((img) => {
            const { mediaType, base64 } = parseDataUrl(img.dataUrl);
            return { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } };
        }),
        { type: 'text', text: userPrompt },
    ];

    const res = await fetch(cfg.baseUrl, {
        method: 'POST',
        headers: {
            'x-api-key': cfg.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({ model: cfg.model, max_tokens: 8192, stream: false, system, messages: [{ role: 'user', content }] }),
    });

    const bodyText = await res.text();
    let data: { content?: { text?: string }[]; error?: { message?: string } };
    try {
        data = JSON.parse(bodyText);
    } catch {
        throw new Error(`${label}: phản hồi không hợp lệ — ${bodyText.slice(0, 120)}`);
    }
    if (!res.ok) throw apiError(label, res.status, data?.error?.message);
    return data?.content?.[0]?.text ?? '';
}

async function callOpenAI(cfg: ProviderConfig, system: string, userPrompt: string, images: ImagePayload[], label: string): Promise<string> {
    const userContent: unknown[] = [
        { type: 'text', text: userPrompt },
        ...images.map((img) => ({ type: 'image_url', image_url: { url: img.dataUrl } })),
    ];

    const body: Record<string, unknown> = {
        model: cfg.model,
        stream: false,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: userContent },
        ],
    };
    if (cfg.reasoningEffort) {
        body.reasoning_effort = cfg.reasoningEffort;
        body.max_completion_tokens = 8192;
    } else {
        body.max_tokens = 8192;
    }

    const authHeaders: Record<string, string> = cfg.authHeader
        ? { [cfg.authHeader]: cfg.apiKey }
        : { authorization: `Bearer ${cfg.apiKey}` };

    const res = await fetch(cfg.baseUrl, {
        method: 'POST',
        headers: { ...authHeaders, 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw apiError(label, res.status, data?.error?.message);
    return data?.choices?.[0]?.message?.content ?? '';
}

async function callGemini(cfg: ProviderConfig, system: string, userPrompt: string, images: ImagePayload[], label: string): Promise<string> {
    const parts: unknown[] = [
        { text: userPrompt },
        ...images.map((img) => {
            const { mediaType, base64 } = parseDataUrl(img.dataUrl);
            return { inlineData: { mimeType: mediaType, data: base64 } };
        }),
    ];

    const base = cfg.baseUrl.replace(/\/$/, '');
    const url = base.includes(':generateContent')
        ? `${base}${base.includes('key=') ? '' : `${base.includes('?') ? '&' : '?'}key=${cfg.apiKey}`}`
        : `${base}/v1beta/models/${cfg.model}:generateContent?key=${cfg.apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts }],
        }),
    });

    const data = await res.json();
    if (!res.ok) throw apiError(label, res.status, data?.error?.message);
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function POST(req: Request) {
    let body: SrsV4GenerateRequest;
    try {
        body = await req.json();
    } catch {
        return err('Body không phải JSON hợp lệ.');
    }

    const { providerId, source, context = {}, images = [] } = body;
    if (!providerId) return err('Thiếu providerId.');
    if (!source?.trim()) return err('Thiếu nội dung nguồn (source markdown).');

    const allProviders = loadProviders();
    const cfg = allProviders[providerId];
    if (!cfg) return err(`Provider không tồn tại: ${providerId}`);

    const systemPrompt = loadSrsV4SystemPrompt();
    const userPrompt = buildSrsV4UserPrompt(source, context, images.length);

    // Thử gọi provider chính
    try {
        const rawText = await callProvider(cfg, systemPrompt, userPrompt, images, providerId);
        const doc = extractDocJson(rawText) as SrsV4DocData;
        return NextResponse.json({ doc });
    } catch (primaryErr) {
        // Fallback tự động sang các provider dự phòng khác nếu có (như nghimmo-gpt hay nghimmo-claude)
        const fallbackKeys = Object.keys(allProviders).filter(
            (k) => k !== providerId && allProviders[k]?.apiKey?.trim(),
        );

        for (const fbKey of fallbackKeys) {
            try {
                const fbCfg = allProviders[fbKey];
                const rawText = await callProvider(fbCfg, systemPrompt, userPrompt, images, fbKey);
                const doc = extractDocJson(rawText) as SrsV4DocData;
                return NextResponse.json({ doc, warning: `Provider "${providerId}" bị quá tải. Đã tự động chuyển đổi sang Provider "${fbCfg.label || fbKey}" thành công.` });
            } catch {
                // Thử provider tiếp theo
            }
        }

        const message = primaryErr instanceof Error ? primaryErr.message : 'Lỗi không xác định khi gọi AI.';
        return err(message, 502);
    }
}

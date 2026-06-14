// ============================================================
//  AI Proxy — Route Handler (server-side)
//  Browser → POST /api/ai/generate { providerId, screen, images }
//  Backend dựng system+user prompt (system prompt từ file runtime),
//  gọi đúng API theo type, parse JSON và trả { doc }.
//  Key KHÔNG bao giờ ra browser.
// ============================================================

import { NextResponse } from 'next/server';
import { loadProviders, isValidType, type ProviderConfig } from '../providersConfig';
import { loadSystemPrompt, buildUserPrompt, extractDocJson, type ScreenInput } from '../srsPrompt';

export const runtime = 'nodejs';

interface ImagePayload {
    dataUrl: string; // "data:image/png;base64,...."
}

interface GenerateRequest {
    providerId: string;
    screen: ScreenInput;
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

// Phân loại lỗi từ provider thành thông báo thân thiện (tiếng Việt).
function apiError(label: string, status: number, message?: string): Error {
    const m = (message ?? '').toLowerCase();
    if (status === 401 || status === 403 || m.includes('invalid api key') || m.includes('invalid_api_key')) {
        return new Error(`${label}: API key sai hoặc không có quyền truy cập.`);
    }
    if (status === 429 || m.includes('quota') || m.includes('insufficient') || m.includes('exceeded') || m.includes('rate limit')) {
        return new Error(`${label}: Hết token/quota hoặc vượt giới hạn. Kiểm tra billing của tài khoản.`);
    }
    if (status === 404 || m.includes('not found') || m.includes('model')) {
        return new Error(`${label}: Sai endpoint hoặc model không tồn tại (${status}).`);
    }
    return new Error(message ?? `${label} lỗi (${status}).`);
}

// ─── type A: Anthropic Messages API ─────────────────────────
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
        body: JSON.stringify({ model: cfg.model, max_tokens: 4096, stream: false, system, messages: [{ role: 'user', content }] }),
    });

    const bodyText = await res.text();
    if (bodyText.startsWith('event:') || bodyText.includes('\nevent:')) {
        if (!res.ok) throw apiError(label, res.status);
        return parseAnthropicSSE(bodyText);
    }
    let data: { content?: { text?: string }[]; error?: { message?: string } };
    try {
        data = JSON.parse(bodyText);
    } catch {
        throw new Error(`${label}: phản hồi không hợp lệ — ${bodyText.slice(0, 120)}`);
    }
    if (!res.ok) throw apiError(label, res.status, data?.error?.message);
    return data?.content?.[0]?.text ?? '';
}

function parseAnthropicSSE(raw: string): string {
    let out = '';
    for (const line of raw.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
            const evt = JSON.parse(payload);
            if (evt?.delta?.type === 'text_delta' && typeof evt.delta.text === 'string') {
                out += evt.delta.text;
            }
        } catch {
            // bỏ qua dòng không phải JSON
        }
    }
    return out;
}

// ─── type O: OpenAI Chat Completions API ────────────────────
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
        body.max_completion_tokens = 4096;
    } else {
        body.max_tokens = 4096;
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

// ─── type G: Google Gemini generateContent ──────────────────
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
    let body: GenerateRequest;
    try {
        body = await req.json();
    } catch {
        return err('Body không phải JSON hợp lệ.');
    }

    const { providerId, screen, images = [] } = body;
    if (!providerId) return err('Thiếu providerId.');
    if (!screen?.funcName?.trim()) return err('Thiếu tên chức năng (screen.funcName).');

    const cfg = loadProviders()[providerId];
    if (!cfg) return err(`Provider không tồn tại: ${providerId}`);
    if (!isValidType(cfg.type)) {
        return err(`Provider "${providerId}" có type không hợp lệ: "${cfg.type}". Chỉ chấp nhận A, O hoặc G.`);
    }
    if (!cfg.apiKey || !cfg.apiKey.trim()) {
        return err(`Provider "${providerId}" chưa cấu hình API key trên server.`);
    }
    if (!cfg.baseUrl || !cfg.model) {
        return err(`Provider "${providerId}" thiếu baseUrl hoặc model.`);
    }

    const system = loadSystemPrompt();
    const userPrompt = buildUserPrompt(screen, images.length);

    try {
        let text: string;
        switch (cfg.type) {
            case 'A':
                text = await callAnthropic(cfg, system, userPrompt, images, providerId);
                break;
            case 'O':
                text = await callOpenAI(cfg, system, userPrompt, images, providerId);
                break;
            case 'G':
                text = await callGemini(cfg, system, userPrompt, images, providerId);
                break;
        }
        const doc = extractDocJson(text);
        return NextResponse.json({ doc });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi không xác định khi gọi AI.';
        return err(message, 502);
    }
}

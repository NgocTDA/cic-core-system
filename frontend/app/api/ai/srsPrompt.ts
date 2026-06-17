// ============================================================
//  SRS prompt builder (SERVER-ONLY)
//  - System prompt đọc từ file runtime (config/srs-prompt.md),
//    sửa file là có hiệu lực ngay, KHÔNG cần build lại.
//  - User prompt dựng từ dữ liệu màn hình thô do FE gửi.
//  - extractDocJson: cắt + parse JSON từ phản hồi AI.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

export interface ScreenInput {
    funcName?: string;
    screenCode?: string;
    module?: string;
    description?: string;
}

// Hai "loại" prompt: 'srs' (sinh mới từ form) và 'confluence' (chuyển nội dung sẵn có, trung thực).
export type PromptKind = 'srs' | 'confluence';

// Fallback cho luồng SRS (sinh mới — được phép suy luận, có min item).
const DEFAULT_SRS_PROMPT = `You are a Business Analyst at CIC (Vietnam National Credit Information Center).
Analyze the UI screen described by the user and return ONLY a single valid JSON object.
No markdown, no backticks, no explanation. Start with { and end with }.
Write all content values in Vietnamese.

Return JSON with EXACTLY these keys:
- funcName (string)
- screenCode (string)
- module (string)
- purpose (string, 1-2 sentences)
- scope (array of strings)
- screenType (one of: Form nhập liệu | Danh sách | Xem chi tiết | Báo cáo | Khác)
- accessRoles (string)
- parentScreen (string or null)
- childScreens (string or null)
- components (array, min 5; each: { stt, name, type, required, desc, validation })
- flow (array, min 5 steps including a success path and an error path; each: { step, actor, action, result })
- errors (array, min 3; each: { situation, message, action })
- businessRules (array of strings, min 2; prefix each with [BR-0N])
- openQuestions (array of objects, each: { topic, content }) — topic = chủ đề ngắn, content = nội dung câu hỏi/ghi chú

RETURN ONLY VALID JSON. NO OTHER TEXT.`;

// Fallback cho luồng Confluence: CHUYỂN nội dung sẵn có vào schema — TRUNG THỰC, KHÔNG sửa/bịa.
const DEFAULT_CONFLUENCE_PROMPT = `You are given the ACTUAL content of an existing document (a Confluence page) converted to markdown.
Your task is to MAP that content into the JSON structure below — faithfully, WITHOUT altering it.

STRICT RULES:
- Do NOT rewrite, summarize, paraphrase, translate, reorder ideas, or invent anything. Preserve the original wording and values VERBATIM (keep the source language).
- Only fill a field if the source actually contains that information. If it is absent, use an empty string "" or an empty array []. Do NOT fabricate. Do NOT enforce any minimum number of items.
- For tables/lists in the source, copy each row as-is into the matching array (do not merge, split, or summarize rows).
- Map by meaning to the closest key; if content does not fit any key, omit it rather than distort other fields.
- Return ONLY a single valid JSON object. No markdown, no backticks, no explanation. Start with { and end with }.

JSON keys (must match the Word template):
- funcName (string) — the screen/feature title from the page
- screenCode (string)
- module (string)
- purpose (string)
- scope (array of strings)
- screenType (one of: Form nhập liệu | Danh sách | Xem chi tiết | Báo cáo | Khác; "" if not stated)
- accessRoles (string)
- parentScreen (string or null)
- childScreens (string or null)
- components (array; each: { stt, name, type, required, desc, validation })
- flow (array; each: { step, actor, action, result })
- errors (array; each: { situation, message, action })
- businessRules (array of strings)
- openQuestions (array of objects, each: { topic, content })

RETURN ONLY VALID JSON. NO OTHER TEXT.`;

const PROMPT_SPEC: Record<PromptKind, { file: string; env: string; def: string }> = {
    srs: { file: 'srs-prompt.md', env: 'SRS_PROMPT_FILE', def: DEFAULT_SRS_PROMPT },
    confluence: { file: 'confluence-prompt.md', env: 'CONFLUENCE_PROMPT_FILE', def: DEFAULT_CONFLUENCE_PROMPT },
};

function promptPath(kind: PromptKind): string {
    const spec = PROMPT_SPEC[kind];
    const env = process.env[spec.env];
    return env ? path.resolve(env) : path.join(process.cwd(), 'config', spec.file);
}

// Quy ước nhãn: dòng đầu dạng "@label: <nội dung>" → nhãn nhận diện prompt.
const LABEL_RE = /^@label:\s*(.*)$/;

// Đọc nội dung prompt thô (file runtime, fallback hằng số theo kind).
function rawPrompt(kind: PromptKind): string {
    try {
        const raw = fs.readFileSync(promptPath(kind), 'utf-8').trim();
        return raw || PROMPT_SPEC[kind].def;
    } catch {
        return PROMPT_SPEC[kind].def;
    }
}

export interface PromptData {
    label: string | null; // nhãn nhận diện (nếu có)
    system: string; // nội dung gửi cho AI (đã bỏ dòng @label)
}

// Tách nhãn ở dòng đầu (nếu có) khỏi nội dung system prompt.
export function loadPrompt(kind: PromptKind = 'srs'): PromptData {
    const raw = rawPrompt(kind);
    const nl = raw.indexOf('\n');
    const firstLine = (nl === -1 ? raw : raw.slice(0, nl)).trim();
    const m = LABEL_RE.exec(firstLine);
    if (m) {
        return { label: m[1].trim() || null, system: (nl === -1 ? '' : raw.slice(nl + 1)).trim() };
    }
    return { label: null, system: raw };
}

// Đọc lại mỗi request để chỉnh prompt không cần restart.
export function loadSystemPrompt(kind: PromptKind = 'srs'): string {
    return loadPrompt(kind).system;
}

export function loadPromptLabel(kind: PromptKind = 'srs'): string | null {
    return loadPrompt(kind).label;
}

// User prompt = dữ liệu màn hình thô (không chứa quy tắc/schema).
export function buildUserPrompt(screen: ScreenInput, imageCount: number): string {
    const imgNote =
        imageCount > 0
            ? ` Has ${imageCount} mockup image(s) attached — analyze them directly.`
            : ' No mockup images.';
    return [
        `Screen name: ${screen.funcName ?? ''}`,
        `Screen code: ${screen.screenCode || 'N/A'}`,
        `Module: ${screen.module || 'N/A'}`,
        `Description: ${screen.description || 'N/A'}`,
        imgNote,
    ].join('\n');
}

// User prompt từ nội dung nguồn (markdown trang Confluence) — system/schema giữ nguyên.
export function buildSourcePrompt(source: string, imageCount: number): string {
    const imgNote =
        imageCount > 0
            ? `There are ${imageCount} mockup image(s) attached — analyze them together with the content.`
            : 'No mockup images.';
    return [
        'Below is the source content (markdown extracted from a Confluence page).',
        'Map it into the required JSON faithfully — do NOT change, summarize, or invent. Leave fields empty if not present in the source.',
        imgNote,
        '',
        '--- SOURCE CONTENT ---',
        source,
    ].join('\n');
}

// Cắt JSON object đầu tiên ra khỏi text và parse. Ném lỗi nếu không hợp lệ.
export function extractDocJson(raw: string): unknown {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end <= start) {
        throw new Error('AI không trả về JSON hợp lệ: ' + raw.slice(0, 160));
    }
    try {
        return JSON.parse(raw.slice(start, end + 1));
    } catch {
        throw new Error('AI trả về JSON sai cú pháp, không parse được.');
    }
}

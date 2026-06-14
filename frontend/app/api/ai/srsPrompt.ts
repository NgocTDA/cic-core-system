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

// Fallback dùng khi file config/srs-prompt.md không tồn tại.
const DEFAULT_SYSTEM_PROMPT = `You are a Business Analyst at CIC (Vietnam National Credit Information Center).
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

function promptPath(): string {
    return process.env.SRS_PROMPT_FILE
        ? path.resolve(process.env.SRS_PROMPT_FILE)
        : path.join(process.cwd(), 'config', 'srs-prompt.md');
}

// Quy ước nhãn: dòng đầu dạng "@label: <nội dung>" → nhãn nhận diện prompt.
const LABEL_RE = /^@label:\s*(.*)$/;

// Đọc nội dung prompt thô (file runtime, fallback hằng số).
function rawPrompt(): string {
    try {
        const raw = fs.readFileSync(promptPath(), 'utf-8').trim();
        return raw || DEFAULT_SYSTEM_PROMPT;
    } catch {
        return DEFAULT_SYSTEM_PROMPT;
    }
}

export interface PromptData {
    label: string | null; // nhãn nhận diện (nếu có)
    system: string; // nội dung gửi cho AI (đã bỏ dòng @label)
}

// Tách nhãn ở dòng đầu (nếu có) khỏi nội dung system prompt.
export function loadPrompt(): PromptData {
    const raw = rawPrompt();
    const nl = raw.indexOf('\n');
    const firstLine = (nl === -1 ? raw : raw.slice(0, nl)).trim();
    const m = LABEL_RE.exec(firstLine);
    if (m) {
        return { label: m[1].trim() || null, system: (nl === -1 ? '' : raw.slice(nl + 1)).trim() };
    }
    return { label: null, system: raw };
}

// Đọc lại mỗi request để chỉnh prompt không cần restart.
export function loadSystemPrompt(): string {
    return loadPrompt().system;
}

export function loadPromptLabel(): string | null {
    return loadPrompt().label;
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

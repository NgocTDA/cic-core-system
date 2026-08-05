// ============================================================
//  SRS v4 Prompt Builder (SERVER-ONLY)
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import type { SrsV4Profile } from '@/types/srsV4';

export interface SrsV4ContextInput {
    profile?: SrsV4Profile;
    phanHe?: string;
    maChucNang?: string;
    tenChucNang?: string;
    nhomChucNang?: string;
    useCases?: string[];
}

const DEFAULT_PROMPT = `You are a Senior Business Analyst at CIC. Map the Confluence document into SRS v4.0 JSON structure accurately. Return ONLY valid JSON.`;

export function loadSrsV4SystemPrompt(): string {
    const customFile = process.env.SRS_V4_PROMPT_FILE
        ? path.resolve(process.env.SRS_V4_PROMPT_FILE)
        : path.join(process.cwd(), 'config', 'srs-v4-prompt.md');

    try {
        const raw = fs.readFileSync(customFile, 'utf-8').trim();
        if (!raw) return DEFAULT_PROMPT;
        // Bỏ dòng @label
        const nl = raw.indexOf('\n');
        if (raw.startsWith('@label:')) {
            return nl === -1 ? '' : raw.slice(nl + 1).trim();
        }
        return raw;
    } catch {
        return DEFAULT_PROMPT;
    }
}

export function buildSrsV4UserPrompt(
    sourceContent: string,
    context: SrsV4ContextInput,
    imageCount: number,
): string {
    const imgNote =
        imageCount > 0
            ? `There are ${imageCount} image(s) attached from Confluence. Map image placeholders into feature mockups or flow diagrams.`
            : 'No attached mockup images.';

    return [
        '--- CONTEXT CODES & METADATA ---',
        `Target Profile: ${context.profile || 'UI'}`,
        `Subsystem (Phân hệ): ${context.phanHe || 'N/A'}`,
        `Function Code (Mã Chức năng): ${context.maChucNang || 'FUNC-N/A-001'}`,
        `Function Title (Tên Chức năng): ${context.tenChucNang || 'N/A'}`,
        `Group Code (Nhóm Chức năng): ${context.nhomChucNang || 'GRP-N/A-01'}`,
        `Mapped UCs: ${(context.useCases || []).join(', ') || 'N/A'}`,
        imgNote,
        '',
        '--- CONFLUENCE SOURCE CONTENT (MARKDOWN) ---',
        sourceContent,
        '',
        'Please map the content into the SrsV4DocData JSON structure following all code and hierarchy rules. RETURN ONLY VALID JSON.',
    ].join('\n');
}

// ============================================================
//  Confluence config (SERVER-ONLY)
//  Đọc baseUrl + Personal Access Token từ file runtime (gitignore).
//  PAT KHÔNG bao giờ ra browser.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

export interface ConfluenceConfig {
    baseUrl: string; // vd https://wiki.noibo.example (KHÔNG kèm /rest/api) — BẮT BUỘC
    token?: string; // PAT mặc định (tùy chọn) — bị PAT của người dùng (localStorage) ghi đè
}

function configPath(): string {
    return process.env.CONFLUENCE_CONFIG_FILE
        ? path.resolve(process.env.CONFLUENCE_CONFIG_FILE)
        : path.join(process.cwd(), 'config', 'confluence.json');
}

// Đọc lại mỗi request để chỉnh config không cần restart.
// Chỉ cần baseUrl (địa chỉ Confluence dùng chung); token là PAT mặc định tùy chọn.
export function loadConfluenceConfig(): ConfluenceConfig | null {
    try {
        const raw = fs.readFileSync(configPath(), 'utf-8');
        const cfg = JSON.parse(raw) as Partial<ConfluenceConfig>;
        if (!cfg.baseUrl) return null;
        return { baseUrl: cfg.baseUrl.replace(/\/$/, ''), token: cfg.token?.trim() || undefined };
    } catch {
        return null;
    }
}

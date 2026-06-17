// ============================================================
//  Confluence config (SERVER-ONLY)
//  Đọc baseUrl + Personal Access Token từ file runtime (gitignore).
//  PAT KHÔNG bao giờ ra browser.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

export interface ConfluenceConfig {
    baseUrl: string; // vd https://wiki.noibo.example (KHÔNG kèm /rest/api)
    token: string; // Personal Access Token (Bearer)
}

function configPath(): string {
    return process.env.CONFLUENCE_CONFIG_FILE
        ? path.resolve(process.env.CONFLUENCE_CONFIG_FILE)
        : path.join(process.cwd(), 'config', 'confluence.json');
}

// Đọc lại mỗi request để chỉnh config không cần restart. Trả null nếu chưa cấu hình.
export function loadConfluenceConfig(): ConfluenceConfig | null {
    try {
        const raw = fs.readFileSync(configPath(), 'utf-8');
        const cfg = JSON.parse(raw) as Partial<ConfluenceConfig>;
        if (!cfg.baseUrl || !cfg.token) return null;
        return { baseUrl: cfg.baseUrl.replace(/\/$/, ''), token: cfg.token };
    } catch {
        return null;
    }
}

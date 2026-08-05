import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

// Thư mục chứa sổ đăng ký CSV (ưu tiên srs-pipeline, fallback config/registries)
const PIPELINE_PATH = 'C:\\Users\\ngoct\\Downloads\\srs-pipeline';
const FALLBACK_PATH = path.join(process.cwd(), 'config', 'registries');

function getCsvPath(filename: string): string {
    const p1 = path.join(PIPELINE_PATH, filename);
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(FALLBACK_PATH, filename);
    if (fs.existsSync(p2)) return p2;
    return p1;
}

// Parse CSV đơn giản (split lines, handle quotes)
function parseCsv(content: string): Record<string, string>[] {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) return [];
    
    // Header
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const results: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        // Simple regex split for CSV row handling escaped quotes
        const line = lines[i];
        const row: string[] = [];
        let insideQuotes = false;
        let entry = '';

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                row.push(entry.trim().replace(/^"|"$/g, ''));
                entry = '';
            } else {
                entry += char;
            }
        }
        row.push(entry.trim().replace(/^"|"$/g, ''));

        if (row.length === headers.length) {
            const item: Record<string, string> = {};
            headers.forEach((h, idx) => {
                item[h] = row[idx] ?? '';
            });
            results.push(item);
        }
    }
    return results;
}

// Ghi lại CSV
function stringifyCsv(headers: string[], data: Record<string, string>[]): string {
    const lines = [headers.join(',')];
    for (const item of data) {
        const row = headers.map((h) => {
            const val = String(item[h] ?? '');
            return val.includes(',') ? `"${val.replace(/"/g, '""')}"` : val;
        });
        lines.push(row.join(','));
    }
    return lines.join('\n');
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const registry = searchParams.get('registry') || 'manifest'; // manifest | groups | usecases | messages | states | roles | participants | objects
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    const filenameMap: Record<string, string> = {
        manifest: 'manifest.csv',
        groups: 'groups.csv',
        usecases: 'usecases.csv',
        messages: 'messages.csv',
        states: 'states.csv',
        roles: 'roles.csv',
        participants: 'participants.csv',
        objects: 'objects.csv',
    };

    const targetFile = filenameMap[registry] || 'manifest.csv';
    const filePath = getCsvPath(targetFile);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ registry, items: [], total: 0, warning: `File ${targetFile} chưa tồn tại.` });
    }

    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        let items = parseCsv(raw);

        if (query) {
            items = items.filter((item) =>
                Object.values(item).some((val) => String(val).toLowerCase().includes(query)),
            );
        }

        return NextResponse.json({ registry, items, total: items.length });
    } catch (err) {
        return NextResponse.json(
            { error: 'Lỗi đọc file sổ đăng ký: ' + (err instanceof Error ? err.message : 'không xác định') },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    let body: { registry: string; items: Record<string, string>[] };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Body không phải JSON hợp lệ.' }, { status: 400 });
    }

    const { registry, items } = body;
    const filenameMap: Record<string, string> = {
        manifest: 'manifest.csv',
        groups: 'groups.csv',
        usecases: 'usecases.csv',
        messages: 'messages.csv',
        states: 'states.csv',
        roles: 'roles.csv',
        participants: 'participants.csv',
        objects: 'objects.csv',
    };

    const targetFile = filenameMap[registry];
    if (!targetFile) {
        return NextResponse.json({ error: 'Mã sổ đăng ký không hợp lệ.' }, { status: 400 });
    }

    const filePath = getCsvPath(targetFile);
    if (!items || items.length === 0) {
        return NextResponse.json({ error: 'Danh sách dữ liệu rỗng.' }, { status: 400 });
    }

    try {
        const headers = Object.keys(items[0]);
        const csvContent = stringifyCsv(headers, items);
        fs.writeFileSync(filePath, csvContent, 'utf-8');
        return NextResponse.json({ success: true, message: `Đã cập nhật ${targetFile} thành công.` });
    } catch (err) {
        return NextResponse.json(
            { error: 'Lỗi ghi file sổ đăng ký: ' + (err instanceof Error ? err.message : 'không xác định') },
            { status: 500 },
        );
    }
}

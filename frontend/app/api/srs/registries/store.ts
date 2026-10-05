import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const SCHEMAS: Record<string, string[]> = {
    manifest: ['thu_tu_nhom', 'ma_nhom', 'ten_nhom', 'thu_tu_chuc_nang', 'ma_chuc_nang', 'ten_chuc_nang', 'loai', 'file', 'owner', 'reviewer', 'status', 'ghi_chu'],
    groups: ['ma', 'ten_nhom', 'phan_he', 'ghi_chu'],
    usecases: ['ma', 'ten_uc', 'phan_he', 'ma_chuc_nang', 'ghi_chu'],
    messages: ['ma', 'noi_dung', 'ghi_chu'],
    states: ['ma', 'ten', 'ghi_chu'],
    roles: ['ma', 'ten', 'ghi_chu'],
    participants: ['ma', 'ten', 'loai', 'ghi_chu'],
    objects: ['ma', 'ten', 'ghi_chu'],
};
export type RegistryItem = Record<string, string>;
export interface RegistrySnapshot { headers: string[]; items: RegistryItem[]; rowIds: string[]; revision: string }
export interface RegistryMutation { registry: string; revision: string; action: 'add' | 'update' | 'delete'; rowId?: string; values?: RegistryItem }
export class RegistryError extends Error {
    constructor(message: string, public status = 400) { super(message); }
}
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

// Parse complete records (including quoted newlines), preserving whitespace and escaped quotes.
export function parseCsv(raw: string): { headers: string[]; items: RegistryItem[] } {
    const text = raw.replace(/^\uFEFF/, '');
    const rows: string[][] = [];
    let row: string[] = [], field = '', quoted = false, closed = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (quoted) {
            if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (char === '"') { quoted = false; closed = true; }
            else field += char;
        } else if (char === ',' || char === '\n' || char === '\r') {
            const wasQuoted = closed;
            row.push(field); field = ''; closed = false;
            if (char !== ',') {
                if (wasQuoted || row.some(value => value !== '') || row.length > 1) rows.push(row);
                row = [];
                if (char === '\r' && text[i + 1] === '\n') i++;
            }
        } else if (char === '"' && field === '' && !closed) quoted = true;
        else {
            if (closed || char === '"') throw new RegistryError('CSV có dấu ngoặc kép không hợp lệ.', 422);
            field += char;
        }
    }
    if (quoted) throw new RegistryError('CSV có trường chưa đóng ngoặc kép.', 422);
    if (field !== '' || row.length || closed) { row.push(field); rows.push(row); }
    if (!rows.length) return { headers: [], items: [] };
    const headers = rows.shift()!;
    if (headers.some(h => !h) || new Set(headers).size !== headers.length) throw new RegistryError('Header CSV rỗng hoặc trùng.', 422);
    const items = rows.map(values => {
        if (values.length !== headers.length) throw new RegistryError('Số cột CSV không khớp header.', 422);
        return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
    });
    return { headers, items };
}
export function stringifyCsv(headers: string[], items: RegistryItem[]) {
    const escape = (value: string) => value === '' || /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    return [headers, ...items.map(item => headers.map(h => item[h] ?? ''))].map(row => row.map(escape).join(',')).join('\r\n') + '\r\n';
}
function assertRegistry(registry: string) {
    if (!Object.hasOwn(SCHEMAS, registry)) throw new RegistryError('Mã sổ đăng ký không hợp lệ.');
}
export function registryDirectory() { return path.resolve(process.env.SRS_REGISTRY_DIR || path.join(process.cwd(), 'data', 'registries')); }
export async function readRegistry(registry: string, directory = registryDirectory()): Promise<RegistrySnapshot> {
    assertRegistry(registry);
    let raw = '';
    try { raw = await fs.readFile(path.join(directory, `${registry}.csv`), 'utf8'); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    const parsed = parseCsv(raw);
    const headers = parsed.headers.length ? parsed.headers : SCHEMAS[registry];
    return { headers, items: parsed.items, revision: hash(raw), rowIds: parsed.items.map((item, i) => hash(JSON.stringify([i, item]))) };
}
export async function mutateRegistry(input: RegistryMutation, directory = registryDirectory()) {
    if (!input || typeof input.registry !== 'string') throw new RegistryError('Yêu cầu không hợp lệ.');
    assertRegistry(input.registry);
    if (!['add', 'update', 'delete'].includes(input.action) || typeof input.revision !== 'string') throw new RegistryError('Thiếu thao tác hoặc phiên bản dữ liệu.');
    await fs.mkdir(directory, { recursive: true });
    const target = path.join(directory, `${input.registry}.csv`);
    const lock = `${target}.lock`;
    // Exclusive file works across workers/processes sharing this data directory. Never break a live lock.
    let handle;
    try { handle = await fs.open(lock, 'wx'); }
    catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new RegistryError('Sổ đang được cập nhật. Vui lòng tải lại và thử lại.', 409);
        throw error;
    }
    const temporary = `${target}.${randomUUID()}.tmp`;
    try {
        const snapshot = await readRegistry(input.registry, directory);
        if (input.revision !== snapshot.revision) throw new RegistryError('Dữ liệu đã thay đổi. Tải lại sổ trước khi lưu.', 409);
        const index = snapshot.rowIds.indexOf(input.rowId || '');
        if (input.action !== 'add' && index < 0) throw new RegistryError('Bản ghi không còn tồn tại.', 409);
        if (input.action === 'delete') snapshot.items.splice(index, 1);
        else {
            const values = input.values;
            if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).some(key => !snapshot.headers.includes(key)) || snapshot.headers.some(key => typeof values[key] !== 'string')) throw new RegistryError('Các trường dữ liệu không khớp schema.');
            const item = Object.fromEntries(snapshot.headers.map(key => [key, values[key]]));
            if (input.action === 'add') snapshot.items.unshift(item);
            else snapshot.items[index] = item;
        }
        const writer = await fs.open(temporary, 'wx');
        try { await writer.writeFile(stringifyCsv(snapshot.headers, snapshot.items), 'utf8'); await writer.sync(); }
        finally { await writer.close(); }
        await fs.rename(temporary, target);
        return await readRegistry(input.registry, directory);
    } finally {
        try { await fs.rm(temporary, { force: true }); }
        finally {
            try { await handle.close(); }
            finally { await fs.unlink(lock); }
        }
    }
}

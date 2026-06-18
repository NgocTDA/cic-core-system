// ============================================================
//  POST /api/confluence/validate { token } — kiểm tra PAT của người dùng.
//  Gọi /rest/api/user/current trên baseUrl (từ config) bằng PAT đó.
//  Trả { valid, fullname, username } để client lưu localStorage + fill [Tên BA].
// ============================================================

import { NextResponse } from 'next/server';
import { loadConfluenceConfig } from '../confluenceConfig';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    const cfg = loadConfluenceConfig();
    if (!cfg) {
        return NextResponse.json({ valid: false, error: 'Chưa cấu hình baseUrl Confluence trên server.' }, { status: 400 });
    }

    let token = '';
    try {
        token = (await req.json())?.token ?? '';
    } catch {
        return NextResponse.json({ valid: false, error: 'Body không hợp lệ.' }, { status: 400 });
    }
    token = token.trim();
    if (!token) return NextResponse.json({ valid: false, error: 'Thiếu PAT.' }, { status: 400 });

    try {
        const res = await fetch(`${cfg.baseUrl}/rest/api/user/current`, {
            headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
        });
        if (res.status === 401 || res.status === 403) {
            return NextResponse.json({ valid: false, error: 'PAT sai hoặc không có quyền.' });
        }
        if (!res.ok) {
            return NextResponse.json({ valid: false, error: `Confluence lỗi (${res.status}).` });
        }
        const u = await res.json();
        return NextResponse.json({
            valid: true,
            fullname: u?.displayName ?? u?.username ?? '',
            username: u?.username ?? '',
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Không kết nối được Confluence.';
        return NextResponse.json({ valid: false, error: message }, { status: 502 });
    }
}

// ============================================================
//  GET /api/srs/outline — trả đề cương đặc tả chức năng cho UI.
//
//  ?meta=1        → chỉ metadata (version, sha, danh sách loại) — nhẹ, dùng
//                   để hiện phiên bản đề cương trên UI mà không tải 55KB.
//  ?profile=UI    → chỉ 1 loại chức năng + phần dùng chung.
//  (không tham số) → toàn bộ.
//
//  Không có secret nên trả thẳng cho client được.
// ============================================================

import { NextResponse } from 'next/server';
import { loadOutline, type OutlineProfile } from '../outlineConfig';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    let outline;
    try {
        outline = loadOutline();
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Không đọc được đề cương.';
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);

    // Phần chung, luôn kèm theo để client không phải gọi hai lần.
    const common = {
        schema: outline.schema,
        outlineVersion: outline.outlineVersion,
        sourceSha256: outline.sourceSha256,
        usable: outline.usable,
        baseProfiles: outline.baseProfiles,
        title: outline.title,
        featureTitle: outline.featureTitle,
        featureNote: outline.featureNote,
        diagramMark: outline.diagramMark,
        codeRules: outline.codeRules,
    };

    if (searchParams.get('meta')) {
        const profiles = Object.entries(outline.profiles).map(([id, p]) => ({
            id,
            ten: (p as OutlineProfile).ten,
            requireDiagram: (p as OutlineProfile).requireDiagram,
            variantOf: (p as OutlineProfile).variantOf,
        }));
        return NextResponse.json({ ...common, profiles });
    }

    const wanted = searchParams.get('profile');
    if (wanted) {
        const profile = (outline.profiles as Record<string, OutlineProfile>)[wanted];
        if (!profile) {
            return NextResponse.json(
                {
                    error: `Không có loại chức năng "${wanted}". Hợp lệ: ${Object.keys(outline.profiles).join(', ')}.`,
                },
                { status: 400 },
            );
        }
        return NextResponse.json({ ...common, guidance: outline.guidance, profile: { id: wanted, ...profile } });
    }

    return NextResponse.json(outline);
}

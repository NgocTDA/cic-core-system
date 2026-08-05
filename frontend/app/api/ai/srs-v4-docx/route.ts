// ============================================================
//  POST /api/ai/srs-v4-docx — sinh file .docx cho SRS v4.0
//  Body: { doc: SrsV4DocData, images?: ImageAttachment[], author?: string }
// ============================================================

import { NextResponse } from 'next/server';
import { renderSrsV4Docx, type ImageAttachment } from '../srsV4DocxRenderer';
import type { SrsV4DocData } from '@/types/srsV4';

export const runtime = 'nodejs';

function safeName(s: string): string {
    return (s || 'tai-lieu').replace(/\s+/g, '_').replace(/[^\w_-]/g, '');
}

export async function POST(req: Request) {
    let body: { doc?: SrsV4DocData; images?: ImageAttachment[]; author?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Body không phải JSON hợp lệ.' }, { status: 400 });
    }
    const { doc, images = [], author } = body;
    if (!doc?.general?.tenChucNang) {
        return NextResponse.json({ error: 'Thiếu dữ liệu tài liệu SRS (doc.general.tenChucNang).' }, { status: 400 });
    }

    try {
        const buffer = await renderSrsV4Docx(doc, author, images);
        const filename = `${safeName(doc.general.maChucNang)}_${safeName(doc.general.tenChucNang)}.docx`;
        const uint8Array = new Uint8Array(buffer);

        return new Response(uint8Array, {
            status: 200,
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi tạo file .docx.';
        console.error('[SRS-V4-DOCX-ERROR]', e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

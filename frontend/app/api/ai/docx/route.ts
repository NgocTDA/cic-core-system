// ============================================================
//  POST /api/ai/docx — sinh file .docx từ DocData + template Word.
//  Body: { doc: DocData, image?: dataUrl }
//  Trả về file .docx (attachment).
// ============================================================

import { NextResponse } from 'next/server';
import { renderDocx } from '../docxTemplate';
import type { DocData } from '@/modules/tools/UIDocGenerator/types';

export const runtime = 'nodejs';

function safeName(s: string): string {
    return (s || 'tai-lieu').replace(/\s+/g, '_').replace(/[^\w_-]/g, '');
}

export async function POST(req: Request) {
    let body: { doc?: DocData; image?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Body không phải JSON hợp lệ.' }, { status: 400 });
    }
    const { doc, image } = body;
    if (!doc?.funcName) {
        return NextResponse.json({ error: 'Thiếu dữ liệu tài liệu (doc.funcName).' }, { status: 400 });
    }

    try {
        const buffer = await renderDocx(doc, image);
        const filename = `${safeName(doc.screenCode)}_${safeName(doc.funcName)}.docx`;
        return new NextResponse(buffer as BodyInit, {
            status: 200,
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi tạo file .docx.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

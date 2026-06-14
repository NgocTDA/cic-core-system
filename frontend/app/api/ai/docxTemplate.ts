// ============================================================
//  Render .docx từ template Word (docx-templates) — SERVER-ONLY
//  Template đọc từ file runtime config/srs-template.docx (mount).
//  Sửa template trong Word → có hiệu lực ngay, không cần build.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { createReport } from 'docx-templates';
import type { DocData } from '@/modules/tools/UIDocGenerator/types';

function templatePath(): string {
    if (process.env.SRS_TEMPLATE_FILE) return path.resolve(process.env.SRS_TEMPLATE_FILE);
    const live = path.join(process.cwd(), 'config', 'srs-template.docx');
    // Bản "sống" (gitignore) ưu tiên; nếu chưa có thì dùng bản mẫu đã commit.
    return fs.existsSync(live) ? live : path.join(process.cwd(), 'config', 'srs-template.example.docx');
}

function parseDataUrl(dataUrl: string): { ext: string; base64: string } {
    const m = /^data:image\/([a-zA-Z0-9.+-]+);base64,([\s\S]*)$/.exec(dataUrl);
    if (m) return { ext: '.' + m[1].replace('jpeg', 'jpg'), base64: m[2] };
    return { ext: '.png', base64: dataUrl.replace(/^data:.*,/, '') };
}

// Chuẩn hoá DocData → dữ liệu khớp placeholder của template.
function toTemplateData(doc: DocData) {
    return {
        funcName: doc.funcName ?? '',
        screenCode: doc.screenCode ?? '',
        module: doc.module ?? '',
        purpose: doc.purpose ?? '',
        accessRoles: doc.accessRoles ?? '',
        parentScreen: doc.parentScreen ?? '—',
        childScreens: doc.childScreens ?? '—',
        screenType: doc.screenType ?? '',
        scope: doc.scope ?? [],
        components: doc.components ?? [],
        flow: doc.flow ?? [],
        errors: doc.errors ?? [],
        businessRules: doc.businessRules ?? [],
        // openQuestions: {topic, content} → bổ sung stt/asker/status cho 5 cột bảng template
        openQuestions: (doc.openQuestions ?? []).map((q, i) => ({
            stt: i + 1,
            topic: q?.topic ?? '—',
            content: q?.content ?? '',
            asker: 'BA',
            status: 'Đang mở',
        })),
        today: new Date().toLocaleDateString('vi-VN'),
        author: '[Tên BA]',
        approver: '[Tên Lead / PM]',
    };
}

// Render template → Buffer .docx. image (dataUrl) tùy chọn để nhúng mockup.
export async function renderDocx(doc: DocData, image?: string): Promise<Uint8Array> {
    const template = fs.readFileSync(templatePath());
    const hasImage = !!image;

    const buffer = await createReport({
        template,
        cmdDelimiter: ['[[', ']]'],
        data: { ...toTemplateData(doc), hasImage },
        additionalJsContext: {
            mockup: () => {
                if (!image) return null;
                const { ext, base64 } = parseDataUrl(image);
                return { width: 16, height: 9, data: base64, extension: ext };
            },
        },
    });
    return buffer;
}

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

// Chuẩn hoá DocData → dữ liệu khớp placeholder của template. author: tên BA (fill [Tên BA]).
function toTemplateData(doc: DocData, author?: string) {
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
        author: author?.trim() || '[Tên BA]',
        approver: '[Tên Lead / PM]',
    };
}

// PNG 1x1 trong suốt — placeholder khi không có mockup (giữ ô bảng hợp lệ).
const TRANSPARENT_PNG =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Đọc kích thước pixel thật của ảnh (PNG/JPEG/GIF) từ buffer, không cần thư viện.
function pixelSize(buf: Buffer): { w: number; h: number } | null {
    // PNG
    if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    // GIF
    if (buf.length >= 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
        return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
    }
    // JPEG
    if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
        let pos = 2;
        while (pos + 9 < buf.length) {
            if (buf[pos] !== 0xff) break;
            const marker = buf[pos + 1];
            // SOF0..SOF15 (trừ C4=DHT, C8=JPG, CC=DAC) chứa kích thước
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                return { h: buf.readUInt16BE(pos + 5), w: buf.readUInt16BE(pos + 7) };
            }
            pos += 2 + buf.readUInt16BE(pos + 2);
        }
    }
    return null;
}

// Tính kích thước hiển thị (cm) giữ đúng tỉ lệ, vừa khổ giấy (không kéo méo, không phóng to gây mờ).
function displayCm(base64: string): { width: number; height: number } {
    const MAX_W = 16.5; // bề rộng nội dung A4 (~17cm)
    const MAX_H = 20;
    const FALLBACK = { width: 15, height: 9 };
    try {
        const px = pixelSize(Buffer.from(base64, 'base64'));
        if (!px || !px.w || !px.h) return FALLBACK;
        const wCm = (px.w / 96) * 2.54;
        const hCm = (px.h / 96) * 2.54;
        const scale = Math.min(MAX_W / wCm, MAX_H / hCm, 1); // chỉ thu nhỏ, không phóng to
        return { width: +(wCm * scale).toFixed(2), height: +(hCm * scale).toFixed(2) };
    } catch {
        return FALLBACK;
    }
}

// Render template → Buffer .docx. image (dataUrl) tùy chọn để nhúng mockup.
export async function renderDocx(doc: DocData, image?: string, author?: string): Promise<Uint8Array> {
    const template = fs.readFileSync(templatePath());

    const buffer = await createReport({
        template,
        cmdDelimiter: ['[[', ']]'],
        data: { ...toTemplateData(doc, author), hasImage: !!image },
        additionalJsContext: {
            // LUÔN trả 1 ảnh hợp lệ (IF trong ô bảng làm docx-templates xoá ô/hàng → docx hỏng).
            // Có mockup: giữ đúng tỉ lệ + vừa khổ giấy. Không có: PNG 1x1 trong suốt rất nhỏ.
            mockup: () => {
                if (image) {
                    const { ext, base64 } = parseDataUrl(image);
                    const { width, height } = displayCm(base64);
                    return { width, height, data: base64, extension: ext };
                }
                return { width: 0.1, height: 0.1, data: TRANSPARENT_PNG, extension: '.png' };
            },
        },
    });
    return buffer;
}

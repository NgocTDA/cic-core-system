'use client';

import React from 'react';
import { Empty } from 'antd';
import { colors } from '@/design-system';
import type { DocData } from './types';

const C = {
    navy: colors.toolsColors.primary,
    blue: colors.toolsColors.secondary,
    blueLt: colors.toolsColors.light,
    blueXs: colors.toolsColors.xlight,
    border: colors.border.base,
    text: colors.text.primary,
    muted: colors.text.secondary,
    danger: colors.error.base,
};

const TD: React.CSSProperties = { border: `1px solid ${C.border}`, padding: '6px 10px', verticalAlign: 'top', fontSize: 12 };
const TA: React.CSSProperties = { ...TD, background: C.blueXs };
const TH: React.CSSProperties = { background: C.navy, color: '#fff', padding: '7px 10px', textAlign: 'left', fontWeight: 600, fontSize: 12 };

const DocPreview: React.FC<{ d: DocData | null }> = ({ d }) => {
    if (!d) {
        return (
            <div style={{ padding: 60, textAlign: 'center' }}>
                <Empty description="Xem trước nội dung Word sẽ hiển thị ở đây" />
            </div>
        );
    }

    const today = new Date().toLocaleDateString('vi-VN');
    const code = d.screenCode || 'SCR-???';
    const isRequired = (v: string) => v === 'Co' || v === 'Có';

    const H2 = (t: string) => (
        <h2 style={{ color: C.navy, borderBottom: `2px solid ${C.blue}`, paddingBottom: 4, fontSize: 16, marginTop: 20 }}>{t}</h2>
    );
    const H3 = (t: string) => <h3 style={{ color: C.blue, fontSize: 14, marginTop: 14 }}>{t}</h3>;

    return (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '24px 28px', maxWidth: 720, margin: '0 auto', fontSize: 13, lineHeight: 1.7 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Trung tâm Thông tin Tín dụng Quốc gia Việt Nam
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '6px 0 3px' }}>{d.funcName}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{code} · {d.module || ''} · {today} · Draft</div>
            </div>

            {H2('1. Thông tin chung')}
            {H3('1.1. Mục đích')}
            <p>{d.purpose}</p>
            {H3('1.2. Phạm vi')}
            <ul>{(d.scope || []).map((s, i) => <li key={i}>{s}</li>)}</ul>

            {H2('2. ' + d.funcName)}
            {H3('2.1. Tổng quan màn hình')}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <tbody>
                    {([
                        ['Tên màn hình', d.funcName],
                        ['Mã màn hình', code],
                        ['Module', d.module || ''],
                        ['Loại màn hình', d.screenType || ''],
                        ['Quyền truy cập', d.accessRoles || ''],
                        ['Màn hình cha', d.parentScreen || '—'],
                        ['Màn hình con', d.childScreens || '—'],
                    ] as [string, string][]).map(([k, v], i) => (
                        <tr key={i}>
                            <td style={{ ...TD, background: C.blueLt, fontWeight: 600, width: 160 }}>{k}</td>
                            <td style={TD}>{v}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {H3('2.3. Danh sách thành phần UI')}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['STT', 'Tên thành phần', 'Loại', 'Bắt buộc', 'Mô tả', 'Validation'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {(d.components || []).map((c, i) => {
                        const t = i % 2 ? TD : TA;
                        return (
                            <tr key={i}>
                                <td style={t}>{c.stt}</td>
                                <td style={t}>{c.name}</td>
                                <td style={t}>{c.type}</td>
                                <td style={{ ...t, color: isRequired(c.required) ? C.danger : 'inherit', fontWeight: isRequired(c.required) ? 700 : 400 }}>{c.required}</td>
                                <td style={t}>{c.desc}</td>
                                <td style={t}>{c.validation}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {H3('2.4. Luồng xử lý chính')}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Bước', 'Người thực hiện', 'Hành động', 'Kết quả / Ghi chú'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {(d.flow || []).map((f, i) => {
                        const t = i % 2 ? TD : TA;
                        return (
                            <tr key={i}>
                                <td style={t}>{f.step}</td>
                                <td style={t}>{f.actor}</td>
                                <td style={t}>{f.action}</td>
                                <td style={t}>{f.result}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {H3('2.5. Xử lý lỗi & thông báo')}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Tình huống lỗi', 'Thông báo hiển thị', 'Hành động hệ thống'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {(d.errors || []).map((e, i) => {
                        const t = i % 2 ? TD : TA;
                        return (
                            <tr key={i}>
                                <td style={t}>{e.situation}</td>
                                <td style={t}>{e.message}</td>
                                <td style={t}>{e.action}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {H3('2.6. Điều kiện nghiệp vụ')}
            <ul>{(d.businessRules || []).map((r, i) => <li key={i}>{r}</li>)}</ul>

            {H3('2.7. Câu hỏi mở / Ghi chú')}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['#', 'Nội dung', 'Người hỏi', 'Trạng thái'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {(d.openQuestions || ['(chưa có)']).map((q, i) => (
                        <tr key={i}>
                            <td style={TD}>{i + 1}</td>
                            <td style={TD}>{q}</td>
                            <td style={TD}>BA</td>
                            <td style={TD}>Đang mở</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocPreview;

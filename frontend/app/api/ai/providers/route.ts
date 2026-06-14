// ============================================================
//  GET /api/ai/providers — danh sách provider cho UI chọn.
//  Chỉ trả id/label/type. KHÔNG trả apiKey/baseUrl.
// ============================================================

import { NextResponse } from 'next/server';
import { listProviders } from '../providersConfig';

export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.json({ providers: listProviders() });
}

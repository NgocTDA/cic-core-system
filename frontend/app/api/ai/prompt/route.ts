// ============================================================
//  GET /api/ai/prompt — nhãn nhận diện system prompt đang dùng.
//  Chỉ trả nhãn (dòng @label), không trả toàn bộ prompt.
// ============================================================

import { NextResponse } from 'next/server';
import { loadPromptLabel } from '../srsPrompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ label: loadPromptLabel() });
}

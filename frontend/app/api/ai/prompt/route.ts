// ============================================================
//  GET /api/ai/prompt?kind=srs|confluence — nhãn nhận diện system prompt.
//  Chỉ trả nhãn (dòng @label), không trả toàn bộ prompt.
// ============================================================

import { NextResponse } from 'next/server';
import { loadPromptLabel, type PromptKind } from '../srsPrompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const kindParam = new URL(req.url).searchParams.get('kind');
    const kind: PromptKind = kindParam === 'confluence' ? 'confluence' : 'srs';
    return NextResponse.json({ label: loadPromptLabel(kind) });
}

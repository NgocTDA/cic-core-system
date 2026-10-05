import { NextResponse } from 'next/server';
import { readRegistry, mutateRegistry, RegistryError } from './store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function failure(error: unknown) {
    console.error('Registry request failed:', error);
    return NextResponse.json({ error: error instanceof RegistryError ? error.message : 'Không thể đọc hoặc lưu sổ đăng ký.' }, { status: error instanceof RegistryError ? error.status : 500 });
}
export async function GET(req: Request) {
    try {
        const params = new URL(req.url).searchParams;
        const registry = params.get('registry') || 'manifest';
        const snapshot = await readRegistry(registry);
        const query = (params.get('q') || '').trim().toLowerCase();
        const indices = snapshot.items.flatMap((item, index) => !query || Object.values(item).some(value => value.toLowerCase().includes(query)) ? [index] : []);
        return NextResponse.json({ ...snapshot, registry, items: indices.map(i => snapshot.items[i]), rowIds: indices.map(i => snapshot.rowIds[i]), total: indices.length }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) { return failure(error); }
}
export async function POST(req: Request) {
    let body;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: 'Body không phải JSON hợp lệ.' }, { status: 400 }); }
    try { return NextResponse.json({ ...await mutateRegistry(body), success: true }); }
    catch (error) { return failure(error); }
}

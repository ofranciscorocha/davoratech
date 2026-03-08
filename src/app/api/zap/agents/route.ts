import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const agents = db.prepare('SELECT * FROM agents WHERE tenant_id = ?').all(tenantId);

        return NextResponse.json(agents);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const body = await request.json();
        const { id, name, type, system_prompt, description, temperature, max_tokens, is_active } = body;

        db.prepare(`
            INSERT OR REPLACE INTO agents (id, tenant_id, name, type, description, system_prompt, temperature, max_tokens, is_active, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(id, tenantId, name, type, description, system_prompt, temperature || 0.7, max_tokens || 500, is_active === undefined ? 1 : is_active);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

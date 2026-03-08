import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const settings = db.prepare('SELECT * FROM settings WHERE tenant_id = ?').all(tenantId);

        return NextResponse.json({ settings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const { key, value } = await request.json();

        db.prepare('INSERT OR REPLACE INTO settings (tenant_id, key, value, updated_at) VALUES (?, ?, ?, datetime("now"))')
            .run(tenantId, key, value);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

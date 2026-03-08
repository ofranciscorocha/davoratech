import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
        }

        const messages = db.prepare(`
            SELECT m.*, c.name as contact_name, c.phone as contact_phone
            FROM messages m
            LEFT JOIN contacts c ON m.contact_id = c.id AND c.tenant_id = m.tenant_id
            WHERE m.conversation_id = ? AND m.tenant_id = ?
            ORDER BY m.created_at ASC
        `).all(conversationId, tenantId);

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

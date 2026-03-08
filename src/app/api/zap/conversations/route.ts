import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';

        const conditions = ['c.tenant_id = ?'];
        const values = [tenantId];

        if (status !== 'all') {
            conditions.push('c.status = ?');
            values.push(status);
        }

        const query = `
            SELECT c.*, ct.name, ct.phone, ct.pushname, ct.profile_pic,
                (SELECT content FROM messages WHERE conversation_id = c.id AND tenant_id = ? ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT type FROM messages WHERE conversation_id = c.id AND tenant_id = ? ORDER BY created_at DESC LIMIT 1) as last_message_type,
                (SELECT created_at FROM messages WHERE conversation_id = c.id AND tenant_id = ? ORDER BY created_at DESC LIMIT 1) as last_message_at,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND tenant_id = ? AND is_from_bot = 0) as unread_count
            FROM conversations c
            JOIN contacts ct ON c.contact_id = ct.id AND ct.tenant_id = c.tenant_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY c.updated_at DESC
        `;

        const conversations = db.prepare(query).all(tenantId, tenantId, tenantId, tenantId, ...values);
        return NextResponse.json(conversations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const body = await request.json();
        const { conversationId, status, agent, isHumanTakeover } = body;

        if (status) {
            db.prepare('UPDATE conversations SET status = ? WHERE id = ? AND tenant_id = ?').run(status, conversationId, tenantId);
        }
        if (agent) {
            db.prepare('UPDATE conversations SET current_agent = ? WHERE id = ? AND tenant_id = ?').run(agent, conversationId, tenantId);
        }
        if (isHumanTakeover !== undefined) {
            db.prepare('UPDATE conversations SET is_human_takeover = ? WHERE id = ? AND tenant_id = ?').run(isHumanTakeover ? 1 : 0, conversationId, tenantId);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

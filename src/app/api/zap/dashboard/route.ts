import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();

        // Basic dashboard stats
        const contactsCount = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE tenant_id = ?').get(tenantId).count;
        const activeConversations = db.prepare('SELECT COUNT(*) as count FROM conversations WHERE tenant_id = ? AND status = "active"').get(tenantId).count;
        const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages WHERE tenant_id = ?').get(tenantId).count;

        // Recent activity
        const recentActivity = db.prepare(`
            SELECT m.*, c.name as contact_name
            FROM messages m
            JOIN contacts c ON m.contact_id = c.id AND c.tenant_id = m.tenant_id
            WHERE m.tenant_id = ?
            ORDER BY m.created_at DESC
            LIMIT 10
        `).all(tenantId);

        return NextResponse.json({
            stats: {
                contacts: contactsCount,
                conversations: activeConversations,
                messages: totalMessages,
                efficiency: '92%' // Mocked for now
            },
            activity: recentActivity
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';
        const db = getDatabase();

        // 1. Basic Stats
        const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE tenant_id = ?').get(tenantId)?.count || 0;
        const activeConversations = db.prepare('SELECT COUNT(*) as count FROM conversations WHERE tenant_id = ? AND status = "active"').get(tenantId)?.count || 0;
        const todayMessages = db.prepare("SELECT COUNT(*) as count FROM messages WHERE tenant_id = ? AND date(created_at) = date('now')").get(tenantId)?.count || 0;
        const pendingSchedules = db.prepare("SELECT COUNT(*) as count FROM schedules WHERE tenant_id = ? AND status = 'pending'").get(tenantId)?.count || 0;

        // 2. Recent Conversations with contact info
        const recentConversations = db.prepare(`
            SELECT c.*, ct.name, ct.phone, ct.profile_pic
            FROM conversations c
            JOIN contacts ct ON c.contact_id = ct.id AND ct.tenant_id = c.tenant_id
            WHERE c.tenant_id = ?
            ORDER BY c.updated_at DESC
            LIMIT 5
        `).all(tenantId);

        // 3. Message Volume (Last 7 Days)
        const messagesPerDay = db.prepare(`
            SELECT date(created_at) as day, COUNT(*) as count
            FROM messages
            WHERE tenant_id = ? AND created_at >= date('now', '-7 days')
            GROUP BY day
            ORDER BY day ASC
        `).all(tenantId);

        return NextResponse.json({
            stats: {
                totalContacts,
                activeConversations,
                todayMessages,
                pendingSchedules
            },
            recentConversations,
            messagesPerDay
        });
    } catch (error: any) {
        console.error('[Dashboard API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';

export async function GET() {
    try {
        const db = getDatabase();
        const tenantId = 'tenant-master'; // Default for now

        const stats = {
            todayMessages: db.prepare("SELECT COUNT(*) as count FROM messages WHERE date(created_at) = date('now') AND tenant_id = ?").get(tenantId).count,
            activeConversations: db.prepare("SELECT COUNT(*) as count FROM conversations WHERE status = 'active' AND tenant_id = ?").get(tenantId).count,
            totalContacts: db.prepare("SELECT COUNT(*) as count FROM contacts WHERE tenant_id = ?").get(tenantId).count,
            pendingSchedules: db.prepare("SELECT COUNT(*) as count FROM schedules WHERE status = 'pending' AND tenant_id = ?").get(tenantId).count,
        };

        const recentConversations = db.prepare(`
            SELECT c.*, t.name, t.phone 
            FROM conversations c 
            JOIN contacts t ON c.contact_id = t.id 
            WHERE c.tenant_id = ? 
            ORDER BY c.updated_at DESC LIMIT 5
        `).all(tenantId);

        const messagesPerDay = db.prepare(`
            SELECT date(created_at) as day, COUNT(*) as count 
            FROM messages 
            WHERE tenant_id = ? 
            GROUP BY day ORDER BY day DESC LIMIT 7
        `).all(tenantId).reverse();

        return NextResponse.json({
            stats,
            recentConversations,
            messagesPerDay
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

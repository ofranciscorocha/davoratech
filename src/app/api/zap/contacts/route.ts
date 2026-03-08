import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const conditions = ['tenant_id = ?'];
        const values = [tenantId];

        if (search) {
            conditions.push(`(name LIKE ? OR phone LIKE ? OR pushname LIKE ?)`);
            values.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const query = `SELECT * FROM contacts WHERE ${conditions.join(' AND ')} ORDER BY last_contact DESC`;
        const contacts = db.prepare(query).all(...values);

        return NextResponse.json(contacts);
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
        const { id, name, tags, notes, qualified, lead_score, agent_type, is_blocked } = body;

        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

        const updates = [];
        const values = [];

        if (name !== undefined) { updates.push('name = ?'); values.push(name); }
        if (tags !== undefined) { updates.push('tags = ?'); values.push(typeof tags === 'string' ? tags : JSON.stringify(tags)); }
        if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
        if (qualified !== undefined) { updates.push('qualified = ?'); values.push(qualified); }
        if (lead_score !== undefined) { updates.push('lead_score = ?'); values.push(lead_score); }
        if (agent_type !== undefined) { updates.push('agent_type = ?'); values.push(agent_type); }
        if (is_blocked !== undefined) { updates.push('is_blocked = ?'); values.push(is_blocked); }
        updates.push("updated_at = datetime('now')");

        values.push(id, tenantId);

        const result = db.prepare(`UPDATE contacts SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Contact not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

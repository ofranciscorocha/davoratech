import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';
        const db = getDatabase();

        const schedules = db.prepare(`
            SELECT s.*, c.name as contact_display_name
            FROM schedules s
            LEFT JOIN contacts c ON s.contact_id = c.id AND c.tenant_id = s.tenant_id
            WHERE s.tenant_id = ?
            ORDER BY s.date ASC, s.time ASC
        `).all(tenantId);

        return NextResponse.json(schedules);
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
        const { contact_id, contact_name, contact_phone, title, description, date, time, duration = 30, agent_type = 'commercial' } = body;

        if (!title || !date || !time) {
            return NextResponse.json({ error: 'title, date and time required' }, { status: 400 });
        }

        const result = db.prepare(`
            INSERT INTO schedules (tenant_id, contact_id, contact_name, contact_phone, title, description, date, time, duration, agent_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(tenantId, contact_id || null, contact_name || '', contact_phone || '', title, description || '', date, time, duration, agent_type);

        return NextResponse.json({ id: result.lastInsertRowid, success: true });
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
        const { id, status, title, description, date, time, duration } = body;

        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

        const updates = [];
        const values = [];

        if (status !== undefined) { updates.push('status = ?'); values.push(status); }
        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (date !== undefined) { updates.push('date = ?'); values.push(date); }
        if (time !== undefined) { updates.push('time = ?'); values.push(time); }
        if (duration !== undefined) { updates.push('duration = ?'); values.push(duration); }

        updates.push("updated_at = datetime('now')");

        values.push(tenantId);
        values.push(id);

        db.prepare(`UPDATE schedules SET ${updates.join(', ')} WHERE tenant_id = ? AND id = ?`).run(...values);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';
        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

        db.prepare('DELETE FROM schedules WHERE tenant_id = ? AND id = ?').run(tenantId, id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

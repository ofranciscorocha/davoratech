import { NextResponse } from 'next/server';
import { getWhatsAppStatus, initWhatsApp, disconnectWhatsApp } from '@/lib/zap/whatsapp';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';
        const status = getWhatsAppStatus(tenantId);
        return NextResponse.json(status);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';
        const { action } = await request.json();

        if (action === 'init') {
            const status = await initWhatsApp(tenantId);
            return NextResponse.json(status);
        } else if (action === 'disconnect') {
            await disconnectWhatsApp(tenantId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

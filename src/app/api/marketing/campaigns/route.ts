import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const campaigns = await prisma.marketingCampaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const campaign = await prisma.marketingCampaign.create({
            data: {
                name: body.name,
                type: body.type || 'whatsapp',
                content: body.content,
                subject: body.subject,
                status: body.status || 'scheduled',
                scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
                recipient: body.recipient,
                groupId: body.groupId ? parseInt(body.groupId) : null,
                filterState: body.filterState,
                filterCity: body.filterCity,
                emailAccountId: body.emailAccountId ? parseInt(body.emailAccountId) : null
            }
        });
        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Campaign creation error:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}

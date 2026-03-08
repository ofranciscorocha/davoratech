import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const leads = await prisma.crmLead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ leads });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const lead = await prisma.crmLead.create({
            data: {
                name: body.name,
                headline: body.headline,
                company: body.company,
                location: body.location,
                email: body.email,
                phone: body.phone,
                profileUrl: body.profileUrl,
                photoUrl: body.photoUrl,
                connectionDegree: body.connectionDegree,
                status: body.status || 'new',
                notes: body.notes,
                tags: body.tags || '[]'
            }
        });
        return NextResponse.json(lead);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}

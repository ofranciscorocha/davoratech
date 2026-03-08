import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const groups = await prisma.marketingGroup.findMany({
            include: { _count: { select: { contacts: true } } },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(groups);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const group = await prisma.marketingGroup.create({
            data: { name: body.name }
        });
        return NextResponse.json(group);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
    }
}

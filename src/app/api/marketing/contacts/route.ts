import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const contacts = await prisma.marketingContact.findMany({
            include: { group: true },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const contact = await prisma.marketingContact.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                city: body.city,
                state: body.state,
                personType: body.personType || 'PF',
                birthDate: body.birthDate,
                groupId: body.groupId ? parseInt(body.groupId) : null
            }
        });
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }
}

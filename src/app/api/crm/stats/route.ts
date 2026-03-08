import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalLeads, newLeads, qualifiedLeads] = await Promise.all([
            prisma.crmLead.count(),
            prisma.crmLead.count({ where: { status: 'new' } }),
            prisma.crmLead.count({ where: { status: 'qualified' } })
        ]);

        return NextResponse.json({
            totalLeads,
            newLeads,
            qualifiedLeads,
            performance: '98.2%'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

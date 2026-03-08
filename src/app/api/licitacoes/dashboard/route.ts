import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [bids, stats] = await Promise.all([
            prisma.licitacaoBid.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
            {
                totalMonitored: await prisma.licitacaoBid.count(),
                aiAnalysisToday: 12 // Mock or query audits
            }
        ]);

        return NextResponse.json({ bids, stats });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}

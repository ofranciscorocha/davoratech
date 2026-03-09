import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const controls = await prisma.internalControl.findMany({
            include: { auction: { select: { title: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(controls);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            type,
            status,
            demands,
            meetings,
            inspections,
            tasks,
            notes,
            processNumber,
            parties,
            officialLettersSent,
            importantDocsInfo,
            evaluationReportUrl,
            seizureInfo,
            seizedPropertyDocs,
            edictUrl,
            auctionDate
        } = body;

        const newControl = await prisma.internalControl.create({
            data: {
                title,
                type,
                status: status || 'PROSPECCAO',
                demands,
                meetings,
                inspections,
                tasks,
                notes,
                processNumber,
                parties,
                officialLettersSent,
                importantDocsInfo,
                evaluationReportUrl,
                seizureInfo,
                seizedPropertyDocs,
                edictUrl,
                auctionDate: auctionDate ? new Date(auctionDate) : null
            }
        });

        return NextResponse.json(newControl);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

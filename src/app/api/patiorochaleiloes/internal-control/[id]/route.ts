import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = (await params).id;
        const control = await prisma.internalControl.findUnique({
            where: { id },
            include: { documents: true }
        });
        if (!control) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json(control);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = (await params).id;
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

        const updatedControl = await prisma.internalControl.update({
            where: { id },
            data: {
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
                auctionDate: auctionDate ? new Date(auctionDate) : null
            }
        });

        return NextResponse.json(updatedControl);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = (await params).id;
        await prisma.internalControl.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

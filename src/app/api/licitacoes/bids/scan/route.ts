import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Mock scan results
        const newBid = await prisma.licitacaoBid.create({
            data: {
                title: 'Aquisição de Equipamentos de TI - Prefeitura Municipal',
                portal: 'Compras.gov.br',
                value: 'R$ 450.000,00',
                status: 'OPEN'
            }
        });

        return NextResponse.json({ message: 'Varredura concluída com sucesso! 1 novo edital encontrado.', bid: newBid });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to run scanner' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const objective = body.objective || 'vendas';

        // Mock AI generation
        const mockMessage = `Olá, estamos entrando em contato para falar sobre ${objective}. Temos condições exclusivas para você hoje!`;

        return NextResponse.json({ message: mockMessage });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}

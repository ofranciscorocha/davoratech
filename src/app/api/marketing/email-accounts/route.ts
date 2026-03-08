import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json([
        { id: 1, name: 'Rocha Official (SMTP)', email: 'contato@rochatec.com.br' }
    ]);
}

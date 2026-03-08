import { NextResponse } from 'next/server';

const BRACC_API_URL = process.env.VITE_API_URL || 'http://localhost:8000';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || '';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${BRACC_API_URL}/api/v1/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.detail || 'Error fetching data from BR-ACC' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[OSINT CPF API Error]:', error);
        return NextResponse.json(
            { error: 'Internal server error connecting to BR-ACC service.' },
            { status: 500 }
        );
    }
}

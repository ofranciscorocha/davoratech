import { NextRequest, NextResponse } from 'next/server';

// FIPE table lookup via BrasilAPI
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const codigoFipe = searchParams.get('codigo');
        const marca = searchParams.get('marca');
        const modelo = searchParams.get('modelo');
        const ano = searchParams.get('ano');

        if (codigoFipe) {
            // Direct FIPE code lookup
            const res = await fetch(
                `https://brasilapi.com.br/api/fipe/preco/v1/${encodeURIComponent(codigoFipe)}`,
                { signal: AbortSignal.timeout(10000) }
            );
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json({ success: true, data });
            }
            return NextResponse.json({ success: false, error: 'Código FIPE não encontrado' }, { status: 404 });
        }

        // Search by brand/model for FIPE reference tables
        if (marca) {
            const tablesRes = await fetch(
                `https://brasilapi.com.br/api/fipe/tabelas/v1`,
                { signal: AbortSignal.timeout(10000) }
            );
            if (tablesRes.ok) {
                const tables = await tablesRes.json();
                return NextResponse.json({ success: true, data: { tables: tables.slice(0, 3) } });
            }
        }

        // Brand listing
        const brandsRes = await fetch(
            `https://brasilapi.com.br/api/fipe/marcas/v1/carros`,
            { signal: AbortSignal.timeout(10000) }
        );
        if (brandsRes.ok) {
            const brands = await brandsRes.json();
            return NextResponse.json({ success: true, data: brands });
        }

        return NextResponse.json({ success: false, error: 'Parâmetros inválidos' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erro na consulta FIPE' }, { status: 500 });
    }
}

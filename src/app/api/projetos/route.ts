import { NextRequest, NextResponse } from 'next/server'
import { kvGet, kvSet } from '@/lib/kv'

export async function GET() {
  const projetos = await kvGet<any[]>('admin:projetos', [])
  return NextResponse.json(projetos)
}

// POST /api/projetos — reorder: { ordem: number[] }
export async function POST(req: NextRequest) {
  try {
    const { ordem } = await req.json() as { ordem: number[] }
    const projetos = await kvGet<{ id: number }[]>('admin:projetos', [])
    const mapa = new Map(projetos.map((p) => [p.id, p]))
    const reordenados = ordem.map(id => mapa.get(id)).filter(Boolean)
    await kvSet('admin:projetos', reordenados)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true, warning: 'storage error' })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { kvGet, kvSet } from '@/lib/kv'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const projetos = await kvGet<any[]>('admin:projetos', [])
    const idx = projetos.findIndex((p: any) => String(p.id) === String(id))
    if (idx === -1) return NextResponse.json({ erro: 'Projeto não encontrado' }, { status: 404 })

    projetos[idx] = { ...projetos[idx], ...body, atualizadoEm: new Date().toISOString().split('T')[0] }
    await kvSet('admin:projetos', projetos)
    return NextResponse.json({ projeto: projetos[idx] })
  } catch {
    return NextResponse.json({ erro: 'Erro ao salvar' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const projetos = await kvGet<any[]>('admin:projetos', [])
    const projeto = projetos.find((p: any) => String(p.id) === String(id))
    if (!projeto) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(projeto)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar' }, { status: 500 })
  }
}

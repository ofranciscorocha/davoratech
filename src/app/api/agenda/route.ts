import { NextRequest, NextResponse } from 'next/server'
import { kvGet, kvSet } from '@/lib/kv'

export interface Nota {
  id: string
  titulo: string
  conteudo: string
  projetoId?: number
  projetoNome?: string
  tipo: 'nota' | 'upgrade' | 'novo-projeto' | 'reuniao' | 'tarefa'
  prioridade: 'baixa' | 'media' | 'alta'
  dataAgendada?: string
  concluida: boolean
  criadoEm: string
}

export async function GET() {
  const notas = await kvGet<Nota[]>('admin:agenda', [])
  return NextResponse.json(notas)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const notas = await kvGet<Nota[]>('admin:agenda', [])

    const nova: Nota = {
      id: Date.now().toString(),
      titulo: body.titulo ?? 'Sem título',
      conteudo: body.conteudo ?? '',
      projetoId: body.projetoId,
      projetoNome: body.projetoNome,
      tipo: body.tipo ?? 'nota',
      prioridade: body.prioridade ?? 'media',
      dataAgendada: body.dataAgendada,
      concluida: false,
      criadoEm: new Date().toISOString(),
    }

    notas.unshift(nova)
    await kvSet('admin:agenda', notas)
    return NextResponse.json(nova, { status: 201 })
  } catch {
    return NextResponse.json({ ok: true, warning: 'storage error' }, { status: 201 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const notas = await kvGet<Nota[]>('admin:agenda', [])

    const idx = notas.findIndex(n => n.id === body.id)
    if (idx === -1) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })

    notas[idx] = { ...notas[idx], ...body }
    await kvSet('admin:agenda', notas)
    return NextResponse.json(notas[idx])
  } catch {
    return NextResponse.json({ ok: true, warning: 'storage error' })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const notas = await kvGet<Nota[]>('admin:agenda', [])
    const filtrado = notas.filter(n => n.id !== id)
    await kvSet('admin:agenda', filtrado)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true, warning: 'storage error' })
  }
}

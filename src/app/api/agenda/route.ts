import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const AGENDA_FILE = join('D:/LaFamiglia/engine/data', 'agenda.json')

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
  try {
    const raw = await readFile(AGENDA_FILE, 'utf-8')
    const notas: Nota[] = JSON.parse(raw)
    return NextResponse.json(notas)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const raw = await readFile(AGENDA_FILE, 'utf-8').catch(() => '[]')
    const notas: Nota[] = JSON.parse(raw)

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
    await writeFile(AGENDA_FILE, JSON.stringify(notas, null, 2), 'utf-8')
    return NextResponse.json(nova, { status: 201 })
  } catch {
    return NextResponse.json({ ok: true, warning: 'read-only filesystem' }, { status: 201 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const raw = await readFile(AGENDA_FILE, 'utf-8')
    const notas: Nota[] = JSON.parse(raw)

    const idx = notas.findIndex(n => n.id === body.id)
    if (idx === -1) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })

    notas[idx] = { ...notas[idx], ...body }
    await writeFile(AGENDA_FILE, JSON.stringify(notas, null, 2), 'utf-8')
    return NextResponse.json(notas[idx])
  } catch {
    return NextResponse.json({ ok: true, warning: 'read-only filesystem' })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const raw = await readFile(AGENDA_FILE, 'utf-8')
    const notas: Nota[] = JSON.parse(raw)
    const filtrado = notas.filter(n => n.id !== id)
    await writeFile(AGENDA_FILE, JSON.stringify(filtrado, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true, warning: 'read-only filesystem' })
  }
}

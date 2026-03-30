import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const HISTORICO_FILE = join('D:/LaFamiglia/engine/data', 'historico.json')

export interface EntradaHistorico {
  id: string
  timestamp: string
  projeto: string          // nome do projeto
  agente: string           // CTO | Arquiteto | Dev | QA | Auditor | Claude | sistema | etc.
  tipo: string             // progresso | deploy | code_review | qa | planning | bug | feature | vault | sistema
  acao: string             // descrição curta da ação
  detalhes?: string        // contexto adicional livre
  de?: number              // progresso anterior (quando aplicável)
  para?: number            // progresso novo (quando aplicável)
  status?: string          // status do projeto após a ação
}

// GET — lista histórico com filtros opcionais (?projeto=X&agente=Y&tipo=Z&limit=N)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const filtroProjeto = searchParams.get('projeto')
    const filtroAgente = searchParams.get('agente')
    const filtroTipo = searchParams.get('tipo')
    const limite = Number(searchParams.get('limit') ?? 100)

    const raw = await readFile(HISTORICO_FILE, 'utf-8')
    let historico: EntradaHistorico[] = JSON.parse(raw)

    if (filtroProjeto) historico = historico.filter(e => e.projeto === filtroProjeto)
    if (filtroAgente) historico = historico.filter(e => e.agente === filtroAgente)
    if (filtroTipo) historico = historico.filter(e => e.tipo === filtroTipo)

    // mais recentes primeiro
    historico = historico.slice().reverse().slice(0, limite)

    return NextResponse.json(historico)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST — Claude ou qualquer agente loga uma atividade
// Body: { projeto, agente, tipo, acao, detalhes?, de?, para?, status? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.projeto || !body.agente || !body.acao) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: projeto, agente, acao' },
        { status: 400 }
      )
    }

    const raw = await readFile(HISTORICO_FILE, 'utf-8').catch(() => '[]')
    const historico: EntradaHistorico[] = JSON.parse(raw)

    const nova: EntradaHistorico = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      projeto: body.projeto,
      agente: body.agente ?? 'sistema',
      tipo: body.tipo ?? 'sistema',
      acao: body.acao,
      detalhes: body.detalhes,
      de: body.de,
      para: body.para,
      status: body.status,
    }

    historico.push(nova)
    await writeFile(HISTORICO_FILE, JSON.stringify(historico, null, 2), 'utf-8')

    return NextResponse.json({ ok: true, entrada: nova })
  } catch {
    return NextResponse.json({ ok: true, entrada: null, warning: 'read-only filesystem' })
  }
}

import { NextResponse } from 'next/server'
import { kvGet } from '@/lib/kv'

interface Projeto {
  id: number
  nome: string
  status: string
  progresso: number
  tipo: string
  url?: string
  pasta?: string
  criadoEm: string
  atualizadoEm: string
}

interface HistoricoEntry {
  timestamp: string
  projeto: string
  de: number
  para: number
  status: string
}

export async function GET() {
  try {
    const [projetos, historico] = await Promise.all([
      kvGet<Projeto[]>('admin:projetos', []),
      kvGet<HistoricoEntry[]>('admin:historico', []),
    ])

    const total = projetos.length
    const emProgresso = projetos.filter(p =>
      ['Em Progresso', 'Iniciado', 'Desenvolvimento', 'Revisão', 'Finalizando'].includes(p.status)
    ).length
    const concluidos = projetos.filter(p => p.status === 'Concluído').length
    const planejamento = projetos.filter(p => p.status === 'Planejamento').length
    const progressoMedio = total > 0
      ? Math.round(projetos.reduce((acc, p) => acc + p.progresso, 0) / total)
      : 0

    // últimas 30 atividades, mais recentes primeiro
    const historicoRecente = [...historico].reverse().slice(0, 30)

    return NextResponse.json({
      projetos,
      historico: historicoRecente,
      metricas: { total, emProgresso, concluidos, planejamento, progressoMedio },
    })
  } catch {
    return NextResponse.json({
      projetos: [],
      historico: [],
      metricas: { total: 0, emProgresso: 0, concluidos: 0, planejamento: 0, progressoMedio: 0 },
    })
  }
}

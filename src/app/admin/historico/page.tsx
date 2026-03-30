'use client'

import { useEffect, useState } from 'react'
import {
  RefreshCw, TrendingUp, TrendingDown, Minus, Bot, GitCommit,
  Rocket, ShieldCheck, TestTube, BookOpen, Wrench, Zap, Filter, X,
} from 'lucide-react'

interface EntradaHistorico {
  id: string
  timestamp: string
  projeto: string
  agente: string
  tipo: string
  acao: string
  detalhes?: string
  de?: number
  para?: number
  status?: string
}

// ─── Configuração visual por tipo ────────────────────────────────────────────

const TIPO_CONFIG: Record<string, { label: string; cor: string; bg: string; Icon: React.ElementType }> = {
  progresso:    { label: 'Progresso',    cor: '#3d7a1a', bg: '#f0fdf4', Icon: TrendingUp   },
  deploy:       { label: 'Deploy',       cor: '#0284c7', bg: '#f0f9ff', Icon: Rocket       },
  code_review:  { label: 'Code Review',  cor: '#7c3aed', bg: '#faf5ff', Icon: ShieldCheck  },
  qa:           { label: 'QA',           cor: '#d97706', bg: '#fffbeb', Icon: TestTube     },
  planning:     { label: 'Planning',     cor: '#0d1b3e', bg: '#f1f5f9', Icon: GitCommit    },
  vault:        { label: 'Vault',        cor: '#0891b2', bg: '#ecfeff', Icon: BookOpen     },
  bug:          { label: 'Bug Fix',      cor: '#dc2626', bg: '#fef2f2', Icon: Wrench       },
  feature:      { label: 'Feature',      cor: '#7ac943', bg: '#f0fdf4', Icon: Zap          },
  sistema:      { label: 'Sistema',      cor: '#64748b', bg: '#f8fafc', Icon: Bot          },
}

const AGENTE_COR: Record<string, string> = {
  'CTO':         '#7c3aed',
  'Arquiteto':   '#0d1b3e',
  'Dev':         '#0284c7',
  'DevOps':      '#d97706',
  'QA':          '#d97706',
  'Auditor':     '#dc2626',
  'Documentador':'#0891b2',
  'Researcher':  '#059669',
  'Claude':      '#7ac943',
  'sistema':     '#94a3b8',
}

function BadgeAgente({ agente }: { agente: string }) {
  const cor = AGENTE_COR[agente] ?? '#94a3b8'
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0"
      style={{ backgroundColor: cor + '20', color: cor, border: `1px solid ${cor}30` }}
    >
      {agente}
    </span>
  )
}

function BadgeTipo({ tipo }: { tipo: string }) {
  const cfg = TIPO_CONFIG[tipo] ?? TIPO_CONFIG.sistema
  const Icon = cfg.Icon
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
      style={{ backgroundColor: cfg.bg, color: cfg.cor, border: `1px solid ${cfg.cor}20` }}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<EntradaHistorico[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroProjeto, setFiltroProjeto] = useState('')
  const [filtroAgente, setFiltroAgente] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const buscar = async () => {
    setCarregando(true)
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (filtroProjeto) params.set('projeto', filtroProjeto)
      if (filtroAgente) params.set('agente', filtroAgente)
      if (filtroTipo) params.set('tipo', filtroTipo)
      const res = await fetch(`/api/historico?${params}`, { cache: 'no-store' })
      const json = await res.json()
      setHistorico(Array.isArray(json) ? json : [])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { buscar() }, [filtroProjeto, filtroAgente, filtroTipo])

  // Listas únicas para filtros
  const projetos = [...new Set(historico.map(e => e.projeto))].sort()
  const agentes  = [...new Set(historico.map(e => e.agente))].sort()
  const tipos    = [...new Set(historico.map(e => e.tipo))].sort()

  // Agrupa por data
  const agrupado = historico.reduce<Record<string, EntradaHistorico[]>>((acc, e) => {
    const data = new Date(e.timestamp).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    })
    if (!acc[data]) acc[data] = []
    acc[data].push(e)
    return acc
  }, {})

  const temFiltro = filtroProjeto || filtroAgente || filtroTipo
  const limparFiltros = () => { setFiltroProjeto(''); setFiltroAgente(''); setFiltroTipo('') }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#0d1b3e]">Histórico</h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">
            {historico.length} atividade{historico.length !== 1 ? 's' : ''} registrada{historico.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={buscar}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#0d1b3e] hover:text-[#0d1b3e] transition"
        >
          <RefreshCw size={14} className={carregando ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={13} className="text-slate-400 shrink-0" />

        <select
          value={filtroProjeto}
          onChange={e => setFiltroProjeto(e.target.value)}
          className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0d1b3e]"
        >
          <option value="">Todos os projetos</option>
          {projetos.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filtroAgente}
          onChange={e => setFiltroAgente(e.target.value)}
          className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0d1b3e]"
        >
          <option value="">Todos os agentes</option>
          {agentes.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0d1b3e]"
        >
          <option value="">Todos os tipos</option>
          {tipos.map(t => <option key={t} value={t}>{TIPO_CONFIG[t]?.label ?? t}</option>)}
        </select>

        {temFiltro && (
          <button
            onClick={limparFiltros}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition font-bold"
          >
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      {/* Timeline */}
      {carregando ? (
        <div className="flex items-center justify-center h-48 text-slate-300">
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span className="text-sm font-semibold">Carregando...</span>
        </div>
      ) : historico.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <Bot size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-300">Nenhuma atividade registrada ainda</p>
          <p className="text-xs text-slate-200 mt-1">
            As atividades aparecem aqui quando projetos são atualizados ou agentes agem
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(agrupado).map(([data, entradas]) => (
            <div key={data}>
              {/* Label de data */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest capitalize">{data}</span>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] text-slate-300 font-semibold">{entradas.length} entrada{entradas.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Cards de entrada */}
              <div className="space-y-2">
                {entradas.map((entry) => {
                  const cfg = TIPO_CONFIG[entry.tipo] ?? TIPO_CONFIG.sistema
                  const Icon = cfg.Icon
                  const delta = entry.para !== undefined && entry.de !== undefined ? entry.para - entry.de : null

                  return (
                    <div
                      key={entry.id ?? entry.timestamp}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-start gap-3 hover:border-slate-200 transition group"
                    >
                      {/* Ícone do tipo */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <Icon size={13} style={{ color: cfg.cor }} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#0d1b3e] truncate">{entry.projeto}</span>
                          <BadgeAgente agente={entry.agente} />
                          <BadgeTipo tipo={entry.tipo} />
                        </div>

                        <p className="text-xs text-slate-600 mt-0.5 font-medium">{entry.acao}</p>

                        {entry.detalhes && (
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{entry.detalhes}</p>
                        )}
                      </div>

                      {/* Delta de progresso */}
                      {delta !== null && (
                        <div className={`flex items-center gap-1 text-xs font-black shrink-0 ${
                          delta > 0 ? 'text-[#3d7a1a]' : delta < 0 ? 'text-red-500' : 'text-slate-400'
                        }`}>
                          {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                          {delta > 0 ? `+${delta}` : delta}%
                        </div>
                      )}

                      {/* Hora */}
                      <span className="text-[10px] text-slate-300 font-mono shrink-0 mt-1">
                        {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

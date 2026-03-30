'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Clock, CheckCircle2, Layers, RefreshCw, ExternalLink } from 'lucide-react'

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

interface Metricas {
  total: number
  emProgresso: number
  concluidos: number
  planejamento: number
  progressoMedio: number
}

interface DadosAPI {
  projetos: Projeto[]
  historico: HistoricoEntry[]
  metricas: Metricas
}

const STATUS_COR: Record<string, string> = {
  'Concluído':      'bg-[#7ac943]/15 text-[#3d7a1a]',
  'Em Progresso':   'bg-blue-100 text-blue-700',
  'Desenvolvimento':'bg-indigo-100 text-indigo-700',
  'Revisão':        'bg-purple-100 text-purple-700',
  'Finalizando':    'bg-orange-100 text-orange-700',
  'Iniciado':       'bg-cyan-100 text-cyan-700',
  'Planejamento':   'bg-slate-100 text-slate-600',
}

const TIPO_COR: Record<string, string> = {
  'Interno':       'bg-[#0d1b3e]/10 text-[#0d1b3e]',
  'Gov':           'bg-amber-100 text-amber-700',
  'Institucional': 'bg-teal-100 text-teal-700',
  'Cliente':       'bg-pink-100 text-pink-700',
}

function BarraProgresso({ valor }: { valor: number }) {
  const cor = valor >= 90 ? '#7ac943' : valor >= 50 ? '#0d1b3e' : '#94a3b8'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${valor}%`, backgroundColor: cor }}
        />
      </div>
      <span className="text-xs font-bold text-slate-500 w-8 text-right">{valor}%</span>
    </div>
  )
}

function CardKPI({
  label, valor, sub, icon: Icon, destaque
}: {
  label: string; valor: string | number; sub?: string; icon: React.ElementType; destaque?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${destaque ? 'border-[#7ac943]/40' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${destaque ? 'bg-[#7ac943]/15 text-[#3d7a1a]' : 'bg-[#0d1b3e]/10 text-[#0d1b3e]'}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className={`text-4xl font-black ${destaque ? 'text-[#7ac943]' : 'text-[#0d1b3e]'}`}>{valor}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
    </div>
  )
}

function MiniGrafico({ historico }: { historico: HistoricoEntry[] }) {
  if (historico.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-300 text-sm font-medium">
        Nenhum registro ainda
      </div>
    )
  }

  const max = 100
  const ultimos = historico.slice(-12)

  return (
    <div className="flex items-end gap-2 h-24 mt-2">
      {ultimos.map((entry, i) => {
        const altura = Math.max(4, (entry.para / max) * 96)
        const data = new Date(entry.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t-md bg-[#0d1b3e]/20 group-hover:bg-[#7ac943] transition-colors cursor-default"
              style={{ height: altura }}
              title={`${entry.projeto}: ${entry.de}% → ${entry.para}%`}
            />
            <span className="text-[9px] text-slate-300 font-medium hidden group-hover:block absolute -bottom-4 whitespace-nowrap">
              {data}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminDashboard() {
  const [dados, setDados] = useState<DadosAPI | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [atualizadoEm, setAtualizadoEm] = useState<string>('')

  const buscarDados = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const res = await fetch('/api/dados', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setDados(json)
      setAtualizadoEm(new Date().toLocaleTimeString('pt-BR'))
    } catch (e) {
      setErro(String(e))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { buscarDados() }, [])

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="font-semibold text-sm">Carregando dados...</span>
        </div>
      </div>
    )
  }

  if (erro || !dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-2">Erro ao carregar dados</p>
          <p className="text-slate-400 text-sm mb-4">{erro}</p>
          <button
            onClick={buscarDados}
            className="bg-[#0d1b3e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#152f5e] transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const { projetos, historico, metricas } = dados

  return (
    <div className="space-y-8">
      {/* Topo */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#7ac943] bg-[#0d1b3e] px-2 py-0.5 rounded">~/admin</span>
            <h2 className="text-2xl font-black text-[#0d1b3e]">Dashboard</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Visão geral dos projetos La Famiglia
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {atualizadoEm && (
            <span className="text-xs text-slate-400 hidden sm:block">Atualizado às {atualizadoEm}</span>
          )}
          <button
            onClick={buscarDados}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:border-[#0d1b3e] hover:text-[#0d1b3e] transition"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:block">Atualizar</span>
          </button>
          <a
            href="obsidian://open?vault=LaFamiglia"
            className="flex items-center gap-2 bg-[#0d1b3e] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#152f5e] transition"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:block">Vault</span>
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <CardKPI label="Total de Projetos" valor={metricas.total} icon={Layers} sub="no sistema" />
        <CardKPI label="Em Andamento" valor={metricas.emProgresso} icon={TrendingUp} sub="projetos ativos" />
        <CardKPI label="Concluídos" valor={metricas.concluidos} icon={CheckCircle2} sub="entregues" destaque />
        <CardKPI label="Progresso Médio" valor={`${metricas.progressoMedio}%`} icon={Clock} sub="todos os projetos" />
      </div>

      {/* Tabela + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Projetos */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-[#0d1b3e] text-sm uppercase tracking-wider">Projetos</h3>
            <span className="text-xs text-slate-400 font-semibold">{projetos.length} registros</span>
          </div>
          <div className="divide-y divide-slate-50">
            {projetos.map(p => (
              <Link key={p.id} href={`/admin/projetos/${p.id}`} className="block px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#0d1b3e] text-sm hover:underline">{p.nome}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${TIPO_COR[p.tipo] ?? 'bg-slate-100 text-slate-500'}`}>
                      {p.tipo}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${STATUS_COR[p.status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {p.status}
                  </span>
                </div>
                <BarraProgresso valor={p.progresso} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-300 font-medium">
                    Criado em {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium">
                    Atualizado {new Date(p.atualizadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </Link>
            ))}
            {projetos.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-300 font-medium text-sm">
                Nenhum projeto cadastrado
              </div>
            )}
          </div>
        </div>

        {/* Painel lateral */}
        <div className="space-y-6">
          {/* Gráfico de histórico */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#0d1b3e] text-sm uppercase tracking-wider">Histórico</h3>
              <span className="text-xs text-slate-400 font-semibold">{historico.length} entradas</span>
            </div>
            <MiniGrafico historico={historico} />
            {historico.length === 0 && (
              <p className="text-xs text-slate-300 mt-3 font-medium text-center">
                Use /progresso para registrar atualizações
              </p>
            )}
          </div>

          {/* Distribuição por tipo */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-black text-[#0d1b3e] text-sm uppercase tracking-wider mb-4">Por Tipo</h3>
            <div className="space-y-3">
              {Object.entries(
                projetos.reduce((acc: Record<string, number>, p) => {
                  acc[p.tipo] = (acc[p.tipo] ?? 0) + 1
                  return acc
                }, {})
              ).map(([tipo, count]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${TIPO_COR[tipo] ?? 'bg-slate-100 text-slate-500'}`}>
                    {tipo}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0d1b3e] rounded-full"
                        style={{ width: `${(count / projetos.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link Vault */}
          <div className="bg-[#0d1b3e] rounded-2xl p-6 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Obsidian Vault</p>
            <p className="font-bold text-sm mb-4 text-white/80">
              Notas, ADRs e documentação do projeto
            </p>
            <a
              href="obsidian://open?vault=LaFamiglia&file=projects"
              className="flex items-center gap-2 bg-[#7ac943] text-[#0d1b3e] px-4 py-2.5 rounded-xl text-xs font-black hover:brightness-110 transition w-full justify-center"
            >
              <ExternalLink size={14} />
              Abrir no Obsidian
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

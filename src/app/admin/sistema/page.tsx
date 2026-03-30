'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Cpu, Plug, BookOpen, Shield, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'

interface MCP { nome: string; pacote: string; icone: string; cor: string; descricao: string; temToken: boolean; envKeys: string[] }
interface Skill { pack: string; skills: string[]; descricao: string; autor: string; cor: string }
interface Agente { nome: string; cargo: string; papel: string; icone: string; modelo: string; status: string; skills: string[] }
interface Config { model: string; defaultMode: string }
interface SistemaData { mcps: MCP[]; skills: Skill[]; agentes: Agente[]; permissoes: string[]; config: Config; totalSkills: number }

const STATUS_COR: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-700',
  Standby: 'bg-blue-100 text-blue-700',
  Offline: 'bg-slate-100 text-slate-500',
}

const MODELO_COR: Record<string, string> = {
  'claude-opus-4-6': 'bg-amber-100 text-amber-700',
  'claude-sonnet-4-6': 'bg-indigo-100 text-indigo-700',
  'claude-haiku-4-5-20251001': 'bg-teal-100 text-teal-700',
}

export default function SistemaPage() {
  const [dados, setDados] = useState<SistemaData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'agentes' | 'mcps' | 'skills' | 'permissoes'>('agentes')
  const [skillAberta, setSkillAberta] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sistema')
      .then(r => r.json())
      .then(setDados)
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw size={20} className="animate-spin text-slate-400" />
    </div>
  )

  if (!dados) return <p className="text-red-500 font-bold">Erro ao carregar sistema</p>

  const abas = [
    { id: 'agentes', label: `Agentes (${dados.agentes.length})`, icon: Cpu },
    { id: 'mcps', label: `MCPs (${dados.mcps.length})`, icon: Plug },
    { id: 'skills', label: `Skills (${dados.totalSkills})`, icon: BookOpen },
    { id: 'permissoes', label: `Permissões (${dados.permissoes.length})`, icon: Shield },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#7ac943] bg-[#0d1b3e] px-2 py-0.5 rounded">~/sistema</span>
            <h2 className="text-2xl font-black text-[#0d1b3e]">Sistema & Configuração</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Agentes, MCPs, skills e permissões — modelo: <code className="bg-slate-100 px-1 rounded text-xs">{dados.config.model}</code> · modo: <code className="bg-slate-100 px-1 rounded text-xs">{dados.config.defaultMode}</code>
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Agentes', valor: dados.agentes.length, sub: `${dados.agentes.filter(a => a.status === 'Ativo').length} ativos`, cor: '#0d1b3e' },
          { label: 'MCPs', valor: dados.mcps.length, sub: 'conectados', cor: '#7c3aed' },
          { label: 'Skill Packs', valor: dados.skills.length, sub: `${dados.totalSkills} skills total`, cor: '#f59e0b' },
          { label: 'Permissões', valor: dados.permissoes.length, sub: 'auto-allow', cor: '#10b981' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{k.label}</p>
            <p className="text-4xl font-black" style={{ color: k.cor }}>{k.valor}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {abas.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                abaAtiva === id
                  ? 'text-[#0d1b3e] border-b-2 border-[#7ac943] bg-[#7ac943]/5'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* AGENTES */}
          {abaAtiva === 'agentes' && (
            <div className="grid grid-cols-1 gap-3">
              {dados.agentes.map(a => (
                <Link key={a.nome} href={`/admin/sistema/agente/${encodeURIComponent(a.cargo)}`} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#0d1b3e]/30 hover:bg-slate-50 transition group">
                  <div className="text-2xl flex-shrink-0 w-10 text-center">{a.icone}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-[#0d1b3e] text-sm">{a.nome}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{a.cargo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COR[a.status]}`}>{a.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${MODELO_COR[a.modelo] ?? 'bg-slate-100 text-slate-500'}`}>{a.modelo}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{a.papel}</p>
                    <div className="flex flex-wrap gap-1">
                      {a.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-[#0d1b3e]/8 text-[#0d1b3e] text-[10px] font-mono rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1 transition" />
                </Link>
              ))}
            </div>
          )}

          {/* MCPs */}
          {abaAtiva === 'mcps' && (
            <div className="grid grid-cols-1 gap-3">
              {dados.mcps.map(m => (
                <div key={m.nome} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                  <div className="text-xl flex-shrink-0 w-9 text-center">{m.icone}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-black text-[#0d1b3e] text-sm">{m.nome}</span>
                      {m.temToken && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">🔑 token</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{m.descricao}</p>
                    <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">{m.pacote}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {abaAtiva === 'skills' && (
            <div className="space-y-2">
              {dados.skills.map(s => (
                <div key={s.pack} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setSkillAberta(skillAberta === s.pack ? null : s.pack)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.cor }} />
                      <div>
                        <span className="font-black text-[#0d1b3e] text-sm font-mono">{s.pack}</span>
                        <span className="text-slate-400 text-xs ml-3">por {s.autor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold">{s.skills.length} skills</span>
                      {skillAberta === s.pack ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </div>
                  </button>
                  {skillAberta === s.pack && (
                    <div className="px-4 pb-4 border-t border-slate-50">
                      <p className="text-xs text-slate-400 mb-3 mt-3">{s.descricao}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.skills.map(sk => (
                          <span key={sk} className="px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200 text-slate-600 bg-slate-50">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PERMISSÕES */}
          {abaAtiva === 'permissoes' && (
            <div className="space-y-1.5">
              {dados.permissoes.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Nenhuma permissão configurada</p>
              ) : (
                dados.permissoes.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition">
                    <span className="text-[#7ac943] text-xs flex-shrink-0">✓</span>
                    <code className="text-xs text-slate-600 font-mono break-all">{p}</code>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

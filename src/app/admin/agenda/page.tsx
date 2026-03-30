'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, RefreshCw, CalendarDays, Rocket, FileText, Users, CheckSquare } from 'lucide-react'

interface Nota {
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

interface Projeto {
  id: number
  nome: string
}

const TIPO_ICON: Record<string, React.ElementType> = {
  'nota':          FileText,
  'upgrade':       Rocket,
  'novo-projeto':  Plus,
  'reuniao':       Users,
  'tarefa':        CheckSquare,
}

const TIPO_COR: Record<string, string> = {
  'nota':          'bg-slate-100 text-slate-600',
  'upgrade':       'bg-indigo-100 text-indigo-700',
  'novo-projeto':  'bg-[#7ac943]/15 text-[#3d7a1a]',
  'reuniao':       'bg-amber-100 text-amber-700',
  'tarefa':        'bg-blue-100 text-blue-700',
}

const PRIORIDADE_COR: Record<string, string> = {
  'baixa': 'bg-slate-100 text-slate-500',
  'media': 'bg-orange-100 text-orange-600',
  'alta':  'bg-red-100 text-red-600',
}

const TIPOS = ['nota', 'upgrade', 'novo-projeto', 'reuniao', 'tarefa'] as const
const PRIORIDADES = ['baixa', 'media', 'alta'] as const

const FORM_VAZIO = {
  titulo: '',
  conteudo: '',
  projetoId: '' as string | number,
  tipo: 'nota' as Nota['tipo'],
  prioridade: 'media' as Nota['prioridade'],
  dataAgendada: '',
}

export default function AgendaPage() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [filtro, setFiltro] = useState<string>('todos')

  const buscar = async () => {
    setCarregando(true)
    try {
      const [agRes, dadosRes] = await Promise.all([
        fetch('/api/agenda', { cache: 'no-store' }),
        fetch('/api/dados', { cache: 'no-store' }),
      ])
      const ag = await agRes.json()
      const dados = await dadosRes.json()
      setNotas(ag)
      setProjetos(dados.projetos ?? [])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { buscar() }, [])

  const criarNota = async () => {
    if (!form.titulo.trim()) return
    setSalvando(true)
    try {
      const projetoSelecionado = projetos.find(p => p.id === Number(form.projetoId))
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          projetoId: projetoSelecionado?.id,
          projetoNome: projetoSelecionado?.nome,
          dataAgendada: form.dataAgendada || undefined,
        }),
      })
      const nova = await res.json()
      setNotas(prev => [nova, ...prev])
      setForm(FORM_VAZIO)
      setMostrarForm(false)
    } finally {
      setSalvando(false)
    }
  }

  const toggleConcluida = async (nota: Nota) => {
    const atualizada = { ...nota, concluida: !nota.concluida }
    setNotas(prev => prev.map(n => n.id === nota.id ? atualizada : n))
    await fetch('/api/agenda', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: nota.id, concluida: !nota.concluida }),
    })
  }

  const deletar = async (id: string) => {
    setNotas(prev => prev.filter(n => n.id !== id))
    await fetch('/api/agenda', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const filtradas = filtro === 'todos'
    ? notas
    : filtro === 'pendentes'
    ? notas.filter(n => !n.concluida)
    : notas.filter(n => n.tipo === filtro)

  const pendentes = notas.filter(n => !n.concluida).length

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1b2d5b]">Agenda & Notas</h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">
            {pendentes} pendente{pendentes !== 1 ? 's' : ''} · {notas.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={buscar}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#1b2d5b] transition"
          >
            <RefreshCw size={14} className={carregando ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setMostrarForm(v => !v)}
            className="flex items-center gap-2 bg-[#1b2d5b] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#243d7a] transition"
          >
            <Plus size={14} />
            Nova entrada
          </button>
        </div>
      </div>

      {/* Form */}
      {mostrarForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-[#1b2d5b] text-sm uppercase tracking-wider">Nova entrada</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Título *"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1b2d5b] placeholder:text-slate-300 focus:outline-none focus:border-[#1b2d5b]"
              />
            </div>

            <div className="md:col-span-2">
              <textarea
                placeholder="Anotação, detalhe, contexto..."
                value={form.conteudo}
                onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:border-[#1b2d5b] resize-none"
              />
            </div>

            <div>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Nota['tipo'] }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1b2d5b] focus:outline-none focus:border-[#1b2d5b]"
              >
                {TIPOS.map(t => (
                  <option key={t} value={t}>{
                    { nota: 'Nota', upgrade: 'Upgrade', 'novo-projeto': 'Novo Projeto', reuniao: 'Reunião', tarefa: 'Tarefa' }[t]
                  }</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={form.prioridade}
                onChange={e => setForm(f => ({ ...f, prioridade: e.target.value as Nota['prioridade'] }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1b2d5b] focus:outline-none focus:border-[#1b2d5b]"
              >
                {PRIORIDADES.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={form.projetoId}
                onChange={e => setForm(f => ({ ...f, projetoId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1b2d5b] focus:outline-none focus:border-[#1b2d5b]"
              >
                <option value="">Nenhum projeto</option>
                {projetos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="date"
                value={form.dataAgendada}
                onChange={e => setForm(f => ({ ...f, dataAgendada: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1b2d5b] focus:outline-none focus:border-[#1b2d5b]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={criarNota}
              disabled={salvando || !form.titulo.trim()}
              className="flex items-center gap-2 bg-[#7ac943] text-[#1b2d5b] px-5 py-2.5 rounded-xl text-sm font-black hover:brightness-105 transition disabled:opacity-50"
            >
              {salvando ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
              Salvar
            </button>
            <button
              onClick={() => { setMostrarForm(false); setForm(FORM_VAZIO) }}
              className="text-slate-400 text-sm font-semibold hover:text-slate-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pendentes', label: 'Pendentes' },
          { key: 'nota', label: 'Notas' },
          { key: 'tarefa', label: 'Tarefas' },
          { key: 'upgrade', label: 'Upgrades' },
          { key: 'novo-projeto', label: 'Novos Projetos' },
          { key: 'reuniao', label: 'Reuniões' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
              filtro === key
                ? 'bg-[#1b2d5b] text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-[#1b2d5b]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {carregando ? (
        <div className="flex items-center justify-center h-48 text-slate-300">
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span className="text-sm font-semibold">Carregando...</span>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 flex items-center justify-center h-40">
          <p className="text-slate-300 text-sm font-semibold">Nenhuma entrada aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map(nota => {
            const Icon = TIPO_ICON[nota.tipo] ?? FileText
            return (
              <div
                key={nota.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition ${
                  nota.concluida ? 'border-slate-100 opacity-60' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleConcluida(nota)}
                    className="mt-0.5 shrink-0 text-slate-300 hover:text-[#7ac943] transition"
                  >
                    {nota.concluida
                      ? <CheckCircle2 size={20} className="text-[#7ac943]" />
                      : <Circle size={20} />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-black text-sm ${nota.concluida ? 'line-through text-slate-400' : 'text-[#1b2d5b]'}`}>
                        {nota.titulo}
                      </h4>
                      <button
                        onClick={() => deletar(nota.id)}
                        className="shrink-0 text-slate-200 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {nota.conteudo && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-wrap">{nota.conteudo}</p>
                    )}

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${TIPO_COR[nota.tipo]}`}>
                        <Icon size={10} />
                        {nota.tipo.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${PRIORIDADE_COR[nota.prioridade]}`}>
                        {nota.prioridade}
                      </span>
                      {nota.projetoNome && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1b2d5b]/5 text-[#1b2d5b]">
                          {nota.projetoNome}
                        </span>
                      )}
                      {nota.dataAgendada && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <CalendarDays size={10} />
                          {new Date(nota.dataAgendada + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

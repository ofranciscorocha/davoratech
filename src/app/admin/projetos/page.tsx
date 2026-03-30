'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  RefreshCw, ExternalLink, FolderOpen, LayoutGrid, List,
  Settings2, GripVertical, Plus, Trash2, ChevronUp, ChevronDown, X, Check, Maximize2,
} from 'lucide-react'

function toSlug(nome: string) {
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

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

interface Tipo {
  nome: string
  bg: string
  texto: string
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

function BadgeTipo({ tipo, tipos }: { tipo: string; tipos: Tipo[] }) {
  const cfg = tipos.find(t => t.nome === tipo)
  if (cfg) {
    return (
      <span
        className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
        style={{ backgroundColor: cfg.bg, color: cfg.texto }}
      >
        {cfg.nome}
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
      {tipo}
    </span>
  )
}

function BarraProgresso({ valor }: { valor: number }) {
  const cor = valor >= 90 ? '#7ac943' : valor >= 50 ? '#0d1b3e' : '#94a3b8'
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${valor}%`, backgroundColor: cor }} />
      </div>
      <span className="text-xs font-black text-slate-500 w-8 text-right">{valor}%</span>
    </div>
  )
}

// ── Modal de edição de tags ──────────────────────────────────────
function ModalTags({
  tipos,
  onSave,
  onClose,
}: {
  tipos: Tipo[]
  onSave: (t: Tipo[]) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Tipo[]>(tipos.map(t => ({ ...t })))
  const [salvando, setSalvando] = useState(false)

  const atualizar = (i: number, campo: keyof Tipo, valor: string) => {
    setDraft(prev => prev.map((t, idx) => idx === i ? { ...t, [campo]: valor } : t))
  }

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= draft.length) return
    setDraft(prev => {
      const a = [...prev]
      ;[a[i], a[j]] = [a[j], a[i]]
      return a
    })
  }

  const remover = (i: number) => setDraft(prev => prev.filter((_, idx) => idx !== i))

  const adicionar = () => setDraft(prev => [...prev, { nome: 'Novo', bg: '#e2e8f0', texto: '#475569' }])

  const salvar = async () => {
    setSalvando(true)
    await fetch('/api/tipos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
    onSave(draft)
    setSalvando(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-[#0d1b3e] text-base">Configurar Tags</h3>
            <p className="text-xs text-slate-400 mt-0.5">Nome, cor de fundo e cor do texto</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X size={18} />
          </button>
        </div>

        {/* Lista de tipos */}
        <div className="px-6 py-4 space-y-3 max-h-[55vh] overflow-y-auto">
          {draft.map((t, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => mover(i, -1)} className="text-slate-300 hover:text-slate-500 transition" disabled={i === 0}>
                  <ChevronUp size={13} />
                </button>
                <button onClick={() => mover(i, 1)} className="text-slate-300 hover:text-slate-500 transition" disabled={i === draft.length - 1}>
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Preview */}
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 min-w-[60px] text-center"
                style={{ backgroundColor: t.bg, color: t.texto }}
              >
                {t.nome || '…'}
              </span>

              {/* Nome */}
              <input
                value={t.nome}
                onChange={e => atualizar(i, 'nome', e.target.value)}
                className="flex-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0d1b3e] min-w-0"
                placeholder="Nome"
              />

              {/* Cor fundo */}
              <label className="relative cursor-pointer shrink-0" title="Cor de fundo">
                <div className="w-7 h-7 rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <input
                    type="color"
                    value={t.bg}
                    onChange={e => atualizar(i, 'bg', e.target.value)}
                    className="absolute inset-0 w-10 h-10 -translate-x-1 -translate-y-1 cursor-pointer opacity-0"
                  />
                  <div className="w-full h-full rounded-lg" style={{ backgroundColor: t.bg }} />
                </div>
              </label>

              {/* Cor texto */}
              <label className="relative cursor-pointer shrink-0" title="Cor do texto">
                <div className="w-7 h-7 rounded-lg border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center" style={{ backgroundColor: t.bg }}>
                  <input
                    type="color"
                    value={t.texto}
                    onChange={e => atualizar(i, 'texto', e.target.value)}
                    className="absolute inset-0 w-10 h-10 -translate-x-1 -translate-y-1 cursor-pointer opacity-0"
                  />
                  <span className="text-[10px] font-black pointer-events-none" style={{ color: t.texto }}>A</span>
                </div>
              </label>

              {/* Remover */}
              <button onClick={() => remover(i)} className="text-slate-300 hover:text-red-400 transition shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button onClick={adicionar} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0d1b3e] transition">
            <Plus size={14} /> Adicionar tag
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition">
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#0d1b3e] text-white hover:bg-[#152f5e] transition disabled:opacity-50"
            >
              {salvando ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────
export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos')
  const [vista, setVista] = useState<'grade' | 'lista'>('grade')
  const [modalTags, setModalTags] = useState(false)

  // drag state
  const dragId = useRef<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)

  const buscar = async () => {
    setCarregando(true)
    try {
      const [dadosRes, tiposRes] = await Promise.all([
        fetch('/api/dados', { cache: 'no-store' }),
        fetch('/api/tipos', { cache: 'no-store' }),
      ])
      const dados = await dadosRes.json()
      const tiposData = await tiposRes.json()
      setProjetos(dados.projetos ?? [])
      setTipos(tiposData ?? [])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { buscar() }, [])

  const tiposFiltro = ['Todos', ...tipos.map(t => t.nome)]
  const visiveis = filtroTipo === 'Todos' ? projetos : projetos.filter(p => p.tipo === filtroTipo)

  // ── Drag handlers ──
  const onDragStart = (id: number) => { dragId.current = id }

  const onDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    setDragOverId(id)
  }

  const onDrop = async (targetId: number) => {
    const sourceId = dragId.current
    if (sourceId === null || sourceId === targetId) {
      dragId.current = null
      setDragOverId(null)
      return
    }
    const next = [...projetos]
    const fromIdx = next.findIndex(p => p.id === sourceId)
    const toIdx = next.findIndex(p => p.id === targetId)
    const [item] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, item)
    setProjetos(next)
    dragId.current = null
    setDragOverId(null)
    await fetch('/api/projetos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordem: next.map(p => p.id) }),
    })
  }

  const onDragEnd = () => { dragId.current = null; setDragOverId(null) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#0d1b3e]">Projetos</h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">{projetos.length} projetos registrados</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Vista grid/lista */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setVista('grade')}
              className={`px-3 py-2 transition ${vista === 'grade' ? 'bg-[#0d1b3e] text-white' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grade"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setVista('lista')}
              className={`px-3 py-2 transition ${vista === 'lista' ? 'bg-[#0d1b3e] text-white' : 'text-slate-400 hover:text-slate-600'}`}
              title="Lista"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => setModalTags(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:border-[#0d1b3e] hover:text-[#0d1b3e] transition"
          >
            <Settings2 size={14} /> Tags
          </button>

          <button
            onClick={buscar}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:border-[#0d1b3e] hover:text-[#0d1b3e] transition"
          >
            <RefreshCw size={14} className={carregando ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {tiposFiltro.map(t => {
          const cfg = tipos.find(x => x.nome === t)
          const ativo = filtroTipo === t
          return (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border ${
                ativo && t === 'Todos'
                  ? 'bg-[#0d1b3e] text-white border-[#0d1b3e]'
                  : !ativo
                  ? 'bg-white border-slate-200 text-slate-500 hover:border-[#0d1b3e]'
                  : 'border-transparent'
              }`}
              style={ativo && cfg ? { backgroundColor: cfg.bg, color: cfg.texto, borderColor: cfg.bg } : undefined}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <div className="flex items-center justify-center h-48 text-slate-300">
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span className="text-sm font-semibold">Carregando...</span>
        </div>
      ) : vista === 'grade' ? (
        // ── Grade ──
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visiveis.map(p => (
            <div
              key={p.id}
              draggable
              onDragStart={() => onDragStart(p.id)}
              onDragOver={e => onDragOver(e, p.id)}
              onDrop={() => onDrop(p.id)}
              onDragEnd={onDragEnd}
              className={`relative bg-white rounded-2xl shadow-sm border transition-all group ${
                dragOverId === p.id ? 'border-[#0d1b3e] scale-[0.98]' : 'border-slate-100 hover:border-[#0d1b3e]/30 hover:shadow-md'
              }`}
            >
              {/* Badge de prioridade */}
              <div className="absolute -top-2.5 left-4 z-10">
                <span className="bg-[#0d1b3e] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {projetos.findIndex(x => x.id === p.id) + 1}º
                </span>
              </div>

              {/* Grip */}
              <div className="absolute top-3 right-3 text-slate-200 group-hover:text-slate-400 transition cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
              </div>

              <Link href={`/admin/projetos/${p.id}`} className="block p-6">
                <div className="flex items-start justify-between mb-1 pr-4">
                  <span className="font-black text-[#0d1b3e] text-base group-hover:text-[#152f5e] transition leading-tight">
                    {p.nome}
                  </span>
                  <FolderOpen size={16} className="text-slate-300 group-hover:text-[#7ac943] transition shrink-0 mt-0.5" />
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <BadgeTipo tipo={p.tipo} tipos={tipos} />
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${STATUS_COR[p.status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {p.status}
                  </span>
                </div>

                <BarraProgresso valor={p.progresso} />

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-300 font-medium">
                    Atualizado {new Date(p.atualizadoEm).toLocaleDateString('pt-BR')}
                  </span>
                  <a
                    href={`http://${toSlug(p.nome)}.localhost:3001`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[10px] text-slate-300 font-mono hover:text-[#7ac943] transition flex items-center gap-1"
                    title={`Abrir ${toSlug(p.nome)}.localhost:3001`}
                  >
                    <ExternalLink size={9} />
                    {toSlug(p.nome)}.localhost
                  </a>
                </div>
              </Link>

              {/* Botão Live sobreposto no canto inferior */}
              <Link
                href={`/admin/projetos/${p.id}`}
                onClick={e => e.stopPropagation()}
                className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#0d1b3e] text-white rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition hover:bg-[#7ac943] hover:text-[#0d1b3e]"
              >
                <Maximize2 size={9} /> Live
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // ── Lista ──
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {visiveis.map(p => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragOver={e => onDragOver(e, p.id)}
                onDrop={() => onDrop(p.id)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-4 px-5 py-3.5 group transition ${
                  dragOverId === p.id ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-black text-slate-300 group-hover:text-[#0d1b3e] transition w-6 text-center shrink-0">
                  {projetos.findIndex(x => x.id === p.id) + 1}º
                </span>
                <GripVertical size={14} className="text-slate-200 group-hover:text-slate-400 cursor-grab shrink-0" />

                <Link href={`/admin/projetos/${p.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="font-bold text-[#0d1b3e] text-sm truncate flex-1">{p.nome}</span>
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <BadgeTipo tipo={p.tipo} tipos={tipos} />
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${STATUS_COR[p.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="w-28 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.progresso}%`,
                            backgroundColor: p.progresso >= 90 ? '#7ac943' : p.progresso >= 50 ? '#0d1b3e' : '#94a3b8'
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-400 w-7 text-right">{p.progresso}%</span>
                    </div>
                  </div>
                  <a
                    href={`http://${toSlug(p.nome)}.localhost:3001`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[10px] text-slate-300 font-mono hover:text-[#7ac943] transition shrink-0 hidden md:flex items-center gap-1"
                  >
                    <ExternalLink size={9} />{toSlug(p.nome)}.localhost
                  </a>
                </Link>
                <Link
                  href={`/admin/projetos/${p.id}`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#0d1b3e] text-white rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition hover:bg-[#7ac943] hover:text-[#0d1b3e] shrink-0"
                >
                  <Maximize2 size={9} /> Live
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalTags && (
        <ModalTags
          tipos={tipos}
          onSave={t => { setTipos(t); setModalTags(false) }}
          onClose={() => setModalTags(false)}
        />
      )}
    </div>
  )
}

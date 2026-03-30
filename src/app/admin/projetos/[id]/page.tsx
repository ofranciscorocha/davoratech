'use client'

import { useEffect, useState, use, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ExternalLink, Save, RefreshCw, Monitor, MonitorOff,
  FolderOpen, File, ChevronRight, ChevronDown, Code, GitCommit,
  Package, BarChart2, Layers, Globe, HardDrive, Maximize2,
} from 'lucide-react'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Projeto { id: number; nome: string; status: string; progresso: number; tipo: string; url?: string; pasta?: string; criadoEm: string; atualizadoEm: string }
interface Tipo { nome: string; bg: string; texto: string }
interface Entrada { nome: string; tipo: 'dir' | 'file'; ext: string; tamanho: number; filhos?: Entrada[] }
interface MetricasData {
  pasta: string; totalArquivos: number; totalLinhas: number
  extensoes: [string, number][]; commits: { hash: string; msg: string; autor: string; data: string; branch: string }[]
  git: { totalCommits: number; autores: { commits: number; nome: string }[]; branch: string }
  pkg: { nome: string; versao: string; descricao: string; scripts: string[]; deps: { nome: string; versao: string }[]; devDeps: { nome: string; versao: string }[] } | null
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['Planejamento', 'Iniciado', 'Desenvolvimento', 'Em Progresso', 'Revisão', 'Finalizando', 'Concluído']
const STATUS_COR: Record<string, string> = {
  'Concluído': 'bg-[#7ac943]/15 text-[#3d7a1a]', 'Em Progresso': 'bg-blue-100 text-blue-700',
  'Desenvolvimento': 'bg-indigo-100 text-indigo-700', 'Revisão': 'bg-purple-100 text-purple-700',
  'Finalizando': 'bg-orange-100 text-orange-700', 'Iniciado': 'bg-cyan-100 text-cyan-700', 'Planejamento': 'bg-slate-100 text-slate-600',
}
const EXT_COR: Record<string, string> = {
  '.ts': '#3178c6', '.tsx': '#61dafb', '.js': '#f7df1e', '.jsx': '#61dafb',
  '.css': '#1572b6', '.scss': '#cc6699', '.html': '#e34c26', '.json': '#8bc34a',
  '.md': '#083fa1', '.py': '#3776ab', '.go': '#00add8', '.rs': '#ce422b',
  '.prisma': '#5a67d8', '.sql': '#336791', '.sh': '#89e051', '.env': '#ecd53f',
}

// ─── Explorador de arquivos ───────────────────────────────────────────────────

function Arvore({ entradas, onSelect, selecionado, base }: {
  entradas: Entrada[]; onSelect: (path: string, nome: string) => void; selecionado: string; base: string
}) {
  const [abertos, setAbertos] = useState<Set<string>>(new Set())

  function toggle(path: string) {
    setAbertos(prev => { const n = new Set(prev); n.has(path) ? n.delete(path) : n.add(path); return n })
  }

  function renderEntrada(e: Entrada, prefixo = '') {
    const path = prefixo ? `${prefixo}/${e.nome}` : e.nome
    const aberto = abertos.has(path)
    const ativo = selecionado === path
    const cor = EXT_COR[e.ext] ?? '#94a3b8'

    if (e.tipo === 'dir') {
      return (
        <div key={path}>
          <button
            onClick={() => toggle(path)}
            className="flex items-center gap-1.5 w-full text-left px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold"
          >
            {aberto ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <FolderOpen size={12} className="text-amber-400 flex-shrink-0" />
            <span className="truncate">{e.nome}</span>
          </button>
          {aberto && e.filhos && (
            <div className="ml-3 border-l border-slate-100 pl-2">
              {e.filhos.map(f => renderEntrada(f, path))}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={path}
        onClick={() => onSelect(path, e.nome)}
        className={`flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-xs transition ${ativo ? 'bg-[#0d1b3e] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <File size={11} className="flex-shrink-0" style={{ color: ativo ? '#fff' : cor }} />
        <span className="truncate">{e.nome}</span>
      </button>
    )
  }

  return <div className="space-y-0.5">{entradas.map(e => renderEntrada(e))}</div>
}

// ─── Viewer de código ─────────────────────────────────────────────────────────

function CodeViewer({ conteudo, nome, linhas }: { conteudo: string; nome: string; linhas: number }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1b3e] text-white text-xs flex-shrink-0">
        <span className="font-mono font-bold">{nome}</span>
        <span className="text-white/40">{linhas} linhas</span>
      </div>
      <pre className="flex-1 overflow-auto text-xs font-mono p-4 bg-[#f8f9fb] text-slate-700 leading-relaxed whitespace-pre-wrap break-all">
        {conteudo}
      </pre>
    </div>
  )
}

// ─── Aba Métricas ─────────────────────────────────────────────────────────────

function TabMetricas({ id }: { id: string }) {
  const [dados, setDados] = useState<MetricasData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/projeto/${id}/metricas`)
      .then(r => r.json())
      .then(d => { if (d.erro) setErro(d.erro); else setDados(d) })
      .catch(e => setErro(String(e)))
      .finally(() => setCarregando(false))
  }, [id])

  if (carregando) return <div className="flex items-center justify-center h-64"><RefreshCw size={18} className="animate-spin text-slate-300" /></div>
  if (erro) return <div className="p-6 text-red-500 text-sm font-semibold">Erro: {erro}</div>
  if (!dados) return null

  const totalExt = dados.totalArquivos || 1

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Arquivos', valor: dados.totalArquivos.toLocaleString('pt-BR'), icon: Layers },
          { label: 'Linhas', valor: dados.totalLinhas.toLocaleString('pt-BR'), icon: Code },
          { label: 'Commits', valor: dados.git.totalCommits.toLocaleString('pt-BR'), icon: GitCommit },
          { label: 'Dependências', valor: ((dados.pkg?.deps.length ?? 0) + (dados.pkg?.devDeps.length ?? 0)).toString(), icon: Package },
        ].map(k => (
          <div key={k.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <k.icon size={14} className="text-slate-400 mb-2" />
            <p className="text-2xl font-black text-[#0d1b3e]">{k.valor}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Linguagens */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-4">Linguagens & Tipos</h4>
          <div className="space-y-3">
            {dados.extensoes.slice(0, 12).map(([ext, count]) => {
              const pct = Math.round((count / totalExt) * 100)
              const cor = EXT_COR[ext] ?? '#94a3b8'
              return (
                <div key={ext}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-600">{ext}</span>
                    <span className="text-slate-400">{count} arq · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Git info */}
        <div className="space-y-4">

          {/* Branch e autores */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-3">Git</h4>
            {dados.git.branch && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-slate-400 font-bold">BRANCH</span>
                <code className="bg-[#0d1b3e]/8 text-[#0d1b3e] px-2 py-0.5 rounded text-xs font-mono">{dados.git.branch}</code>
              </div>
            )}
            {dados.git.autores.map(a => (
              <div key={a.nome} className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-semibold truncate">{a.nome}</span>
                <span className="text-slate-400 font-bold ml-2">{a.commits} commits</span>
              </div>
            ))}
            {dados.git.autores.length === 0 && <p className="text-xs text-slate-300">Sem histórico git</p>}
          </div>

          {/* Scripts */}
          {dados.pkg?.scripts && dados.pkg.scripts.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-3">Scripts NPM</h4>
              <div className="flex flex-wrap gap-1.5">
                {dados.pkg.scripts.map(s => (
                  <code key={s} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">
                    {s}
                  </code>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Commits */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest">Commits Recentes</h4>
          <span className="text-xs text-slate-400">{dados.commits.length} exibidos</span>
        </div>
        <div className="divide-y divide-slate-50">
          {dados.commits.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-300">Sem histórico git</p>
          ) : dados.commits.map((c, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition">
              <code className="text-[10px] font-mono bg-[#0d1b3e]/8 text-[#0d1b3e] px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{c.hash}</code>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 font-semibold truncate">{c.msg}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{c.autor} · {c.data}</p>
              </div>
              {c.branch && <code className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded flex-shrink-0">{c.branch}</code>}
            </div>
          ))}
        </div>
      </div>

      {/* Dependências */}
      {dados.pkg && (
        <div className="grid grid-cols-2 gap-4">
          {dados.pkg.deps.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-3">Dependências ({dados.pkg.deps.length})</h4>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {dados.pkg.deps.map(d => (
                  <span key={d.nome} className="px-2 py-0.5 bg-[#0d1b3e]/8 text-[#0d1b3e] text-[10px] font-mono rounded" title={d.versao}>{d.nome}</span>
                ))}
              </div>
            </div>
          )}
          {dados.pkg.devDeps.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h4 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-3">DevDeps ({dados.pkg.devDeps.length})</h4>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {dados.pkg.devDeps.map(d => (
                  <span key={d.nome} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono rounded" title={d.versao}>{d.nome}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

// ─── Aba Explorador ───────────────────────────────────────────────────────────

function TabExplorador({ id }: { id: string }) {
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [carregando, setCarregando] = useState(true)
  const [arquivoSel, setArquivoSel] = useState<string>('')
  const [conteudo, setConteudo] = useState<{ texto: string; linhas: number; nome: string } | null>(null)
  const [lendo, setLendo] = useState(false)

  useEffect(() => {
    fetch(`/api/projeto/${id}/arquivos`)
      .then(r => r.json())
      .then(d => setEntradas(d.entradas ?? []))
      .finally(() => setCarregando(false))
  }, [id])

  const abrirArquivo = useCallback(async (path: string, nome: string) => {
    setArquivoSel(path)
    setLendo(true)
    setConteudo(null)
    try {
      const r = await fetch(`/api/projeto/${id}/arquivos?path=${encodeURIComponent(path)}&ler=1`)
      const d = await r.json()
      if (d.conteudo !== undefined) setConteudo({ texto: d.conteudo, linhas: d.linhas, nome })
      else setConteudo({ texto: d.erro ?? 'Não foi possível ler', linhas: 0, nome })
    } finally {
      setLendo(false)
    }
  }, [id])

  if (carregando) return <div className="flex items-center justify-center h-64"><RefreshCw size={18} className="animate-spin text-slate-300" /></div>

  return (
    <div className="flex h-full overflow-hidden">
      {/* Árvore */}
      <div className="w-64 flex-shrink-0 border-r border-slate-100 overflow-y-auto p-3 bg-white">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Arquivos</p>
        <Arvore entradas={entradas} onSelect={abrirArquivo} selecionado={arquivoSel} base="" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-hidden bg-white">
        {lendo ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw size={16} className="animate-spin text-slate-300" />
          </div>
        ) : conteudo ? (
          <CodeViewer conteudo={conteudo.texto} nome={conteudo.nome} linhas={conteudo.linhas} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Code size={32} className="text-slate-200 mb-3" />
            <p className="text-sm font-bold text-slate-300">Selecione um arquivo</p>
            <p className="text-xs text-slate-200 mt-1">Clique em qualquer arquivo na árvore para visualizar</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

function toSlug(nome: string) {
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function ProjetoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [progresso, setProgresso] = useState(0)
  const [status, setStatus] = useState('')
  const [tipo, setTipo] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [aba, setAba] = useState<'preview' | 'explorador' | 'metricas'>('explorador')
  const [previewSrc, setPreviewSrc] = useState('')

  const buscar = async () => {
    setCarregando(true)
    try {
      const [dadosRes, tiposRes] = await Promise.all([fetch('/api/dados', { cache: 'no-store' }), fetch('/api/tipos')])
      const dados = await dadosRes.json()
      const tiposData = await tiposRes.json()
      const p = dados.projetos?.find((x: Projeto) =>
        String(x.id) === id || toSlug(x.nome) === id
      )
      if (p) { setProjeto(p); setProgresso(p.progresso); setStatus(p.status); setTipo(p.tipo) }
      setTipos(tiposData ?? [])
    } finally { setCarregando(false) }
  }

  useEffect(() => { buscar() }, [id])

  const salvar = async () => {
    if (!projeto) return
    setSalvando(true)
    try {
      const res = await fetch(`/api/projeto/${projeto.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ progresso, status, tipo }) })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setProjeto(json.projeto)
      setMensagem('Salvo!')
      setTimeout(() => setMensagem(''), 2500)
    } catch { setMensagem('Erro ao salvar') }
    finally { setSalvando(false) }
  }

  if (carregando) return <div className="flex items-center justify-center h-64"><RefreshCw size={20} className="animate-spin text-slate-300" /></div>
  if (!projeto) return <div className="text-center py-20"><p className="text-slate-400 font-semibold mb-4">Projeto não encontrado</p><Link href="/admin/projetos" className="text-[#0d1b3e] font-bold text-sm underline">Voltar</Link></div>

  const corBarra = progresso >= 90 ? '#7ac943' : progresso >= 50 ? '#0d1b3e' : '#94a3b8'

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4">

      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link href="/admin/projetos" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0d1b3e] hover:text-[#0d1b3e] transition">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-[#0d1b3e]">{projeto.nome}</h2>
          <p className="text-slate-400 text-xs font-mono mt-0.5">{projeto.pasta ?? 'Sem pasta'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${STATUS_COR[projeto.status] ?? 'bg-slate-100 text-slate-500'}`}>{projeto.status}</span>
        <Link href={`/live/${id}`} className="flex items-center gap-2 bg-[#7ac943] text-[#0d1b3e] px-4 py-2 rounded-xl text-xs font-black hover:brightness-105 transition">
          <Maximize2 size={14} /> Abrir Live
        </Link>
        {projeto.url && (
          <a href={projeto.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:border-slate-300 transition">
            <ExternalLink size={13} /> {projeto.url}
          </a>
        )}
      </div>

      {/* Layout principal */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* Sidebar de controles */}
        <div className="w-56 flex-shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5 overflow-y-auto">
          <h3 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest">Controles</h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progresso</label>
              <span className="text-xl font-black" style={{ color: corBarra }}>{progresso}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={progresso} onChange={e => setProgresso(Number(e.target.value))} className="w-full accent-[#0d1b3e] cursor-pointer" />
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progresso}%`, backgroundColor: corBarra }} />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {[0, 25, 50, 75, 100].map(v => (
                <button key={v} onClick={() => setProgresso(v)} className={`flex-1 py-0.5 rounded text-[9px] font-black transition ${progresso === v ? 'bg-[#0d1b3e] text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{v}%</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0d1b3e] focus:outline-none">
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tag</label>
            <div className="flex flex-wrap gap-1.5">
              {tipos.map(t => (
                <button key={t.nome} onClick={() => setTipo(t.nome)} className="px-2 py-1 rounded-lg text-[10px] font-black uppercase transition border-2"
                  style={tipo === t.nome ? { backgroundColor: t.bg, color: t.texto, borderColor: t.texto + '40' } : { backgroundColor: 'transparent', color: '#94a3b8', borderColor: '#e2e8f0' }}>
                  {t.nome}
                </button>
              ))}
            </div>
          </div>

          <button onClick={salvar} disabled={salvando} className="w-full flex items-center justify-center gap-2 bg-[#7ac943] text-[#0d1b3e] py-2 rounded-xl text-xs font-black hover:brightness-105 transition disabled:opacity-60">
            {salvando ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          {mensagem && <p className={`text-center text-xs font-bold ${mensagem === 'Salvo!' ? 'text-[#3d7a1a]' : 'text-red-500'}`}>{mensagem}</p>}

          <Link href={`/live/${id}`} className="w-full flex items-center justify-center gap-2 bg-[#0d1b3e] text-white py-2 rounded-xl text-xs font-black hover:bg-[#152f5e] transition">
            <Maximize2 size={13} /> Abrir Live
          </Link>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Criado</span><span className="font-bold text-[#0d1b3e]">{new Date(projeto.criadoEm).toLocaleDateString('pt-BR')}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Atualizado</span><span className="font-bold text-[#0d1b3e]">{new Date(projeto.atualizadoEm).toLocaleDateString('pt-BR')}</span></div>
          </div>
        </div>

        {/* Área principal com abas */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">

          {/* Tab bar */}
          <div className="flex border-b border-slate-100 flex-shrink-0">
            {([
              ['explorador', Code, 'Explorador'],
              ['metricas', BarChart2, 'Métricas'],
              ['preview', Monitor, 'Preview'],
            ] as const).map(([tabId, Icon, label]) => (
              <button
                key={tabId}
                onClick={() => setAba(tabId)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition border-b-2 ${
                  aba === tabId ? 'text-[#0d1b3e] border-[#7ac943] bg-[#7ac943]/5' : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={13} />{label}
              </button>
            ))}

            {aba === 'preview' && previewSrc && (
              <div className="ml-auto flex items-center px-4 gap-2">
                <a href={previewSrc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-[#0d1b3e] transition font-mono">
                  <ExternalLink size={10} /> abrir em nova aba
                </a>
                <button onClick={() => setPreviewSrc('')} className="text-slate-300 hover:text-slate-500 transition ml-1">
                  <MonitorOff size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 overflow-hidden">

            {aba === 'explorador' && <TabExplorador id={String(projeto.id)} />}

            {aba === 'metricas' && <TabMetricas id={String(projeto.id)} />}

            {aba === 'preview' && (
              previewSrc ? (
                <iframe src={previewSrc} className="w-full border-0 h-full" title={projeto.nome} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
                  <MonitorOff size={40} className="text-slate-200" />
                  <div>
                    <p className="font-bold text-sm text-slate-400 mb-1">Selecione como visualizar</p>
                    <p className="text-xs text-slate-300">Dev Server carrega o projeto rodando localmente</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {projeto.url && (
                      <button
                        onClick={() => setPreviewSrc(projeto.url!)}
                        className="flex items-center gap-2 bg-[#7ac943] text-[#0d1b3e] px-4 py-2.5 rounded-xl text-xs font-black hover:brightness-105 transition"
                      >
                        <Monitor size={13} /> Dev Server ({projeto.url})
                      </button>
                    )}
                    <button
                      onClick={() => setPreviewSrc(`/api/serve/${projeto.id}`)}
                      className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:border-slate-300 transition"
                    >
                      <HardDrive size={13} /> Arquivos Estáticos
                    </button>
                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

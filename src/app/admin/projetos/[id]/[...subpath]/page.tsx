'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react'

interface Projeto {
  id: number; nome: string; status: string; progresso: number
  url?: string; pasta?: string; tipo: string
}

function toSlug(nome: string) {
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function ProjetoSubpathPage({
  params,
}: {
  params: Promise<{ id: string; subpath: string[] }>
}) {
  const { id, subpath } = use(params)
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    fetch('/api/dados', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const isNumeric = !isNaN(Number(id))
        const p = isNumeric
          ? d.projetos?.find((x: Projeto) => String(x.id) === id)
          : d.projetos?.find((x: Projeto) => toSlug(x.nome) === id)
        setProjeto(p ?? null)
      })
      .finally(() => setCarregando(false))
  }, [id])

  const subpathStr = subpath.join('/')
  const iframeSrc = projeto?.url ? `${projeto.url.replace(/\/$/, '')}/${subpathStr}` : ''
  const slugBase = projeto ? toSlug(projeto.nome) : id

  if (carregando) return (
    <div className="h-screen flex items-center justify-center bg-[#060e1f]">
      <RefreshCw size={18} className="animate-spin text-white/30" />
    </div>
  )

  if (!projeto) return (
    <div className="h-screen flex items-center justify-center bg-[#060e1f] flex-col gap-4">
      <p className="text-white/30 text-sm font-medium">Projeto não encontrado</p>
      <Link href="/admin/projetos" className="text-[#7ac943] text-xs font-bold hover:underline">← Voltar</Link>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-[#060e1f]">
      {/* Barra superior */}
      <div className="h-11 flex items-center gap-3 px-4 flex-shrink-0 bg-[#0d1b3e] border-b border-white/8">
        <Link
          href={`/admin/projetos/${slugBase}`}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition"
        >
          <ArrowLeft size={13} />
        </Link>

        <div className="w-px h-4 bg-white/10 flex-shrink-0" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-white/50 font-mono">
          <Link href={`/admin/projetos/${slugBase}`} className="hover:text-white/80 transition truncate max-w-32">
            {projeto.nome}
          </Link>
          {subpath.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={10} className="text-white/20" />
              <Link
                href={`/admin/projetos/${slugBase}/${subpath.slice(0, i + 1).join('/')}`}
                className="hover:text-white/80 transition"
              >
                {seg}
              </Link>
            </span>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setReloadKey(k => k + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition"
          title="Recarregar"
        >
          <RotateCcw size={12} />
        </button>
        {iframeSrc && (
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition"
            title="Abrir em nova aba"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Iframe */}
      {iframeSrc ? (
        <iframe
          key={reloadKey}
          src={iframeSrc}
          className="flex-1 w-full border-0 bg-white"
          title={`${projeto.nome} — /${subpathStr}`}
          allow="clipboard-read; clipboard-write"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/20 text-sm">URL não configurada para este projeto</p>
        </div>
      )}
    </div>
  )
}

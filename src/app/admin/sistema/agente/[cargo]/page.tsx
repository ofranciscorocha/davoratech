'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface Agente {
  nome: string; cargo: string; papel: string; icone: string
  modelo: string; status: string; skills: string[]
}

const DETALHES: Record<string, {
  responsabilidades: string[]
  fluxo: string[]
  modeloDesc: string
  temperatura: string
  quando: string
}> = {
  'CEO': {
    responsabilidades: ['Você fala diretamente com Junior no terminal — ele é o ponto de entrada', 'Aprovar planos estratégicos (obrigatório para todo projeto novo)', 'Coordenar e despachar todos os outros agentes', 'Receber relatório final de entrega e decidir próximos passos'],
    fluxo: ['Você → Junior → (coordena) → demais agentes', 'PLANNING → CEO_APPROVAL → AUDIT', 'Decisões de stack, pivot e escalação ficam com Junior', 'Na 4ª rodada de veto, Junior escala para você'],
    modeloDesc: 'claude-sonnet-4-6 — rápido e capaz para coordenação contínua',
    temperatura: '0.7 — criativo mas assertivo',
    quando: 'Sempre ativo. É com quem você conversa no terminal.',
  },
  'CTO': {
    responsabilidades: ['Braço operacional do CEO (Junior)', 'Classificar e despachar tarefas recebidas', 'Coordenar o pipeline completo de desenvolvimento', 'Reportar ao CEO apenas em decisões estratégicas'],
    fluxo: ['BRIEFING → RESEARCH → PLANNING → CEO_APPROVAL → AUDIT → DISPATCHING → EXECUTING → CODE_REVIEW → QA → ARCHIVING → DONE'],
    modeloDesc: 'claude-sonnet-4-6 — rápido e capaz para coordenação contínua',
    temperatura: '0.5 — pragmático e direto',
    quando: 'Opera 24h. Suporte operacional ao CEO.',
  },
  'Auditor': {
    responsabilidades: ['Auditar planos nas 4 dimensões: viabilidade, completude, riscos, recursos', 'Vetar código que não passe nos critérios de segurança', 'Garantir conformidade: Lei 14.133/2021, LGPD, Marco Civil, Lei 9.609/1998', 'Code review de todo código antes de QA'],
    fluxo: ['AUDIT (após CEO_APPROVAL)', 'CODE_REVIEW (após EXECUTING)', 'Máximo 3 rodadas de veto — na 4ª escala pro CEO'],
    modeloDesc: 'claude-sonnet-4-6 — análise profunda e consistente',
    temperatura: '0.3 — rigoroso e determinístico',
    quando: 'Todo plano novo e todo código implementado passam por ele',
  },
  'Arquiteto': {
    responsabilidades: ['Decompor projetos em blueprints executáveis', 'Definir tasks claras com dependências mapeadas', 'Garantir Clean Architecture, DDD e SOLID', 'Produzir plano em docs/superpowers/plans/YYYY-MM-DD-feature.md'],
    fluxo: ['RESEARCH → PLANNING', 'Recebe dossiê do Researcher', 'Entrega blueprint ao DevOps para dispatch'],
    modeloDesc: 'claude-sonnet-4-6',
    temperatura: '0.6 — criativo mas estruturado',
    quando: 'Todo projeto novo e feature complexa',
  },
  'Documentador': {
    responsabilidades: ['Manter o vault Obsidian organizado', 'Registrar ADRs e lições aprendidas', 'Salvar nota de entrega após cada projeto', 'Executar /vault-sync, /entity-extract, /daily-brief'],
    fluxo: ['ARCHIVING — última etapa antes de DONE', 'Salva em D:/LaFamiglia/memory/vault/projects/'],
    modeloDesc: 'claude-haiku-4-5-20251001 — rápido para tarefas de documentação',
    temperatura: '0.4 — preciso e organizado',
    quando: 'Final de cada projeto e sessão',
  },
  'DevOps': {
    responsabilidades: ['Distribuir tasks do blueprint para os Soldati', 'Monitorar progresso e resolver bloqueios', 'Garantir que nenhuma task fique sem responsável ou prazo', 'Coordenar trabalho paralelo via subagentes'],
    fluxo: ['DISPATCHING → EXECUTING', 'Usa superpowers/subagent-driven-development', 'Monitora durante EXECUTING'],
    modeloDesc: 'claude-sonnet-4-6',
    temperatura: '0.5',
    quando: 'Após aprovação do Auditor, durante execução',
  },
  'Dev Backend': {
    responsabilidades: ['Implementar código backend: Node.js, TypeScript, Express, Prisma', 'Zero gambiarra — código limpo que passa nos testes do Ragioniere', 'TDD obrigatório: Red→Green→Refactor', 'Variáveis e comentários em português'],
    fluxo: ['EXECUTING', 'Recebe task do DevOps', 'Entrega código ao Auditor para CODE_REVIEW'],
    modeloDesc: 'claude-sonnet-4-6',
    temperatura: '0.5',
    quando: 'Fase EXECUTING — tasks de backend',
  },
  'Dev Fullstack': {
    responsabilidades: ['Frontend React + TypeScript + Tailwind', 'Integração de APIs e responsividade', 'Troubleshooting de bugs difíceis', 'WCAG 2.1 AA mínimo em todas as interfaces'],
    fluxo: ['EXECUTING', 'Tasks de frontend e integração', 'Entrega ao CODE_REVIEW'],
    modeloDesc: 'claude-sonnet-4-6',
    temperatura: '0.5',
    quando: 'Fase EXECUTING — tasks de frontend e fullstack',
  },
  'Researcher': {
    responsabilidades: ['Pesquisar documentação técnica e boas práticas', 'Analisar bibliotecas e frameworks', 'Entregar dossiê ao Arquiteto antes do PLANNING', 'Usar defuddle para extrair conteúdo limpo da web'],
    fluxo: ['RESEARCH — antes do PLANNING', 'Obrigatório para projetos novos e features complexas', 'Pode ser pulado em: bugfix trivial, refactor pequeno'],
    modeloDesc: 'claude-haiku-4-5-20251001 — rápido para pesquisa',
    temperatura: '0.7 — exploratório',
    quando: 'Início de projetos novos e features complexas',
  },
  'Intel': {
    responsabilidades: ['Inteligência competitiva e market research', 'Analisar concorrentes e tendências de tecnologia', 'Pesquisa OSINT e referências estratégicas', 'Entregar dossiê para embasar decisões do Padrino'],
    fluxo: ['Acionado pelo CTO ou CEO quando necessário', 'Não faz parte do pipeline padrão de desenvolvimento'],
    modeloDesc: 'claude-haiku-4-5-20251001',
    temperatura: '0.8 — exploratório e criativo',
    quando: 'Pesquisa estratégica e análise de mercado',
  },
  'QA': {
    responsabilidades: ['Rodar suite completa de testes (Vitest, Playwright)', 'Validar acceptance criteria de cada task', 'Verificar OWASP Top 10 e WCAG 2.1 AA', 'Nenhum código vai para produção sem seus testes passando'],
    fluxo: ['QA_TESTING — após CODE_REVIEW aprovado', 'Máximo 3 rodadas — na 4ª escala pro CEO'],
    modeloDesc: 'claude-sonnet-4-6',
    temperatura: '0.3 — rigoroso',
    quando: 'Após aprovação do Auditor no CODE_REVIEW',
  },
}

const STATUS_COR: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-700',
  Standby: 'bg-blue-100 text-blue-700',
}

const MODELO_COR: Record<string, string> = {
  'claude-opus-4-6': 'bg-amber-100 text-amber-700',
  'claude-sonnet-4-6': 'bg-indigo-100 text-indigo-700',
  'claude-haiku-4-5-20251001': 'bg-teal-100 text-teal-700',
}

export default function AgentePage({ params }: { params: Promise<{ cargo: string }> }) {
  const { cargo } = use(params)
  const cargoDecodado = decodeURIComponent(cargo)
  const [agente, setAgente] = useState<Agente | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/api/sistema')
      .then(r => r.json())
      .then(d => {
        const a = d.agentes?.find((ag: Agente) => ag.cargo === cargoDecodado)
        setAgente(a ?? null)
      })
      .finally(() => setCarregando(false))
  }, [cargoDecodado])

  if (carregando) return <div className="flex items-center justify-center h-64"><RefreshCw size={18} className="animate-spin text-slate-300" /></div>
  if (!agente) return <div className="text-center py-20"><p className="text-slate-400">Agente não encontrado</p><Link href="/admin/sistema" className="text-[#0d1b3e] font-bold text-sm underline mt-2 block">Voltar</Link></div>

  const detalhes = DETALHES[agente.cargo]

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/sistema" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0d1b3e] transition">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl">{agente.icone}</span>
            <h2 className="text-2xl font-black text-[#0d1b3e]">{agente.nome}</h2>
            <span className="text-slate-400 font-bold text-sm">{agente.cargo}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${STATUS_COR[agente.status]}`}>{agente.status}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${MODELO_COR[agente.modelo] ?? 'bg-slate-100 text-slate-500'}`}>{agente.modelo}</span>
          </div>
          <p className="text-slate-500 text-sm mt-2 ml-12">{agente.papel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* Responsabilidades */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-4">Responsabilidades</h3>
          <ul className="space-y-2">
            {(detalhes?.responsabilidades ?? [agente.papel]).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-[#7ac943] font-bold mt-0.5 flex-shrink-0">→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Fluxo no pipeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-4">Posição no Pipeline</h3>
          <div className="space-y-2">
            {(detalhes?.fluxo ?? []).map((f, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-600 leading-relaxed">
                {f}
              </div>
            ))}
          </div>
          {detalhes?.quando && (
            <div className="mt-4 p-3 bg-[#0d1b3e]/5 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quando é acionado</p>
              <p className="text-xs text-slate-600">{detalhes.quando}</p>
            </div>
          )}
        </div>

      </div>

      {/* Skills e modelo */}
      <div className="grid grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-4">Skills Instaladas</h3>
          <div className="flex flex-wrap gap-2">
            {agente.skills.map(s => (
              <span key={s} className="px-3 py-1.5 bg-[#0d1b3e]/8 text-[#0d1b3e] text-xs font-mono rounded-lg">{s}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-[#0d1b3e] text-xs uppercase tracking-widest mb-4">Configuração de IA</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Modelo</p>
              <p className="text-sm text-slate-600">{detalhes?.modeloDesc ?? agente.modelo}</p>
            </div>
            {detalhes?.temperatura && (
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Temperatura</p>
                <p className="text-sm text-slate-600">{detalhes.temperatura}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Pipeline geral */}
      <div className="bg-[#0d1b3e] rounded-2xl p-6 text-white">
        <h3 className="font-black text-xs uppercase tracking-widest text-white/40 mb-4">Pipeline Completo da Famiglia</h3>
        <div className="flex items-center gap-1 flex-wrap">
          {['BRIEFING','RESEARCH','PLANNING','CEO_APPROVAL','AUDIT','DISPATCHING','EXECUTING','CODE_REVIEW','QA_TESTING','ARCHIVING','DONE'].map((etapa, i, arr) => {
            const ativa = detalhes?.fluxo?.some(f => f.includes(etapa)) ?? false
            return (
              <div key={etapa} className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded text-[10px] font-black ${ativa ? 'bg-[#7ac943] text-[#0d1b3e]' : 'bg-white/10 text-white/30'}`}>
                  {etapa}
                </span>
                {i < arr.length - 1 && <span className="text-white/20 text-xs">→</span>}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

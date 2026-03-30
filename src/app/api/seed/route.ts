import { NextResponse } from 'next/server'
import { kvSet } from '@/lib/kv'

const projetos = [
  {
    "id": 9,
    "nome": "Atelie Laura Verissimo",
    "status": "Em Progresso",
    "progresso": 65,
    "tipo": "Cliente",
    "url": "http://localhost:8080",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/laura-verissimo-atelier",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-25"
  },
  {
    "id": 7,
    "nome": "Arremate Club",
    "status": "Em Progresso",
    "progresso": 70,
    "tipo": "saas",
    "url": "http://localhost:8181",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/integradorleiloes",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 2,
    "nome": "Recicladora Rocha",
    "status": "Em Progresso",
    "progresso": 50,
    "tipo": "Interno",
    "url": "http://localhost:3004",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/recicladora-rocha",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 3,
    "nome": "Rocha Marketing",
    "status": "Em Progresso",
    "progresso": 40,
    "tipo": "Modulo",
    "url": "http://localhost:5173",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/PatioMarketingHub/frontend",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 13,
    "nome": "Gerenciador de Emails",
    "status": "Em Progresso",
    "progresso": 85,
    "tipo": "Modulo",
    "url": "http://localhost:3009",
    "pasta": "D:/LaFamiglia/engine/projects/email-manager",
    "criadoEm": "2026-03-27",
    "atualizadoEm": "2026-03-28"
  },
  {
    "id": 1,
    "nome": "Pátio Rocha Leilões",
    "status": "Em Progresso",
    "progresso": 35,
    "tipo": "Interno",
    "url": "http://localhost:3000",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/leilao-patio-rocha",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 4,
    "nome": "Rocha Zap",
    "status": "Desenvolvimento",
    "progresso": 60,
    "tipo": "Modulo",
    "url": "http://localhost:3005",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/rocha-zap",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 5,
    "nome": "Rocha Licitações",
    "status": "Em Progresso",
    "progresso": 45,
    "tipo": "Modulo",
    "url": "http://localhost:3006",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/rocha-licitacoes",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 6,
    "nome": "Rocha CRM",
    "status": "Desenvolvimento",
    "progresso": 55,
    "tipo": "Modulo",
    "url": "http://localhost:5180",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/RochaCRM/frontend",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 8,
    "nome": "Rocha Select",
    "status": "Planejamento",
    "progresso": 20,
    "tipo": "Interno",
    "url": "http://localhost:3003",
    "pasta": "D:/PROJETOS-ROCHINHA/PROJETOS/rochaselect",
    "criadoEm": "2026-03-01",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 16,
    "nome": "SENATRAN Consultas",
    "status": "Iniciado",
    "progresso": 100,
    "tipo": "Modulo",
    "url": "http://localhost:8000",
    "pasta": "D:/LaFamiglia/engine/projects/senatran-consultas",
    "criadoEm": "2026-03-28",
    "atualizadoEm": "2026-03-29"
  },
  {
    "id": 10,
    "nome": "AgentVille UI",
    "status": "Em Progresso",
    "progresso": 75,
    "tipo": "Sistema",
    "url": "http://localhost:4000",
    "pasta": "D:/LaFamiglia/engine/projects/agentville",
    "criadoEm": "2026-03-23",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 11,
    "nome": "DAVORA TECH Site",
    "status": "Em Progresso",
    "progresso": 30,
    "tipo": "Sistema",
    "url": "http://localhost:3001",
    "pasta": "D:/LaFamiglia/engine/projects/davoratech",
    "criadoEm": "2026-03-25",
    "atualizadoEm": "2026-03-26"
  },
  {
    "id": 12,
    "nome": "Phone OSINT",
    "status": "Iniciado",
    "progresso": 40,
    "tipo": "Ferramenta",
    "url": "http://localhost:5055",
    "pasta": "D:/LaFamiglia/tools/phone-osint",
    "criadoEm": "2026-03-27",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 14,
    "nome": "Deep-Live-Cam",
    "status": "Instalando",
    "progresso": 10,
    "tipo": "Ferramenta",
    "url": "http://localhost:7860",
    "pasta": "D:/LaFamiglia/engine/projects/deep-live-cam",
    "criadoEm": "2026-03-27",
    "atualizadoEm": "2026-03-27"
  },
  {
    "id": 15,
    "nome": "Voice Clone",
    "status": "Instalando",
    "progresso": 10,
    "tipo": "Ferramenta",
    "url": "http://localhost:7861",
    "pasta": "D:/LaFamiglia/tools/voice-clone",
    "criadoEm": "2026-03-27",
    "atualizadoEm": "2026-03-27"
  }
]

const historico = [
  {
    "id": "1774550462365-43d7r",
    "timestamp": "2026-03-26T18:41:02.365Z",
    "projeto": "DAVORA TECH Site",
    "agente": "Claude",
    "tipo": "sistema",
    "acao": "Sistema de historico inicializado",
    "detalhes": "Schema expandido com agente/tipo/acao. Obsidian MCP corrigido. Endpoint /api/historico criado para logging de agentes."
  },
  {
    "id": "1774550579812-syzbg",
    "timestamp": "2026-03-26T18:42:59.812Z",
    "projeto": "DAVORA TECH Site",
    "agente": "Claude",
    "tipo": "feature",
    "acao": "Preview de projetos via iframe com slug-based routing",
    "detalhes": "Implementado /admin/projetos/[slug] com lookup por nome normalizado. APIs de metricas e explorador usam ID numerico do projeto."
  },
  {
    "id": "1774550579890-iqqxk",
    "timestamp": "2026-03-26T18:42:59.890Z",
    "projeto": "DAVORA TECH Site",
    "agente": "Claude",
    "tipo": "vault",
    "acao": "Obsidian MCP path corrigido para D:/LaFamiglia/memory/vault",
    "detalhes": "Caminho estava apontando para D:/agentville/memory/vault (legado). Corrigido em C:/Users/Francisco/.claude/settings.json."
  }
]

const agenda: any[] = []

export async function GET() {
  await Promise.all([
    kvSet('admin:projetos', projetos),
    kvSet('admin:historico', historico),
    kvSet('admin:agenda', agenda),
  ])

  return NextResponse.json({
    ok: true,
    total: {
      projetos: projetos.length,
      historico: historico.length,
      agenda: agenda.length,
    },
  })
}

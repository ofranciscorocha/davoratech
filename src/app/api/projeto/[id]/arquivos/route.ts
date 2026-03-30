import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const DATA_DIR = 'D:/LaFamiglia/engine/data'
const IGNORE = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', '.turbo'])

interface Entrada { nome: string; tipo: 'dir' | 'file'; ext: string; tamanho: number; filhos?: Entrada[] }

function listarDir(dir: string, depth = 0): Entrada[] {
  if (depth > 4) return []
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(e => !IGNORE.has(e.name))
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1
        if (!a.isDirectory() && b.isDirectory()) return 1
        return a.name.localeCompare(b.name)
      })
      .map(e => {
        const fullPath = join(dir, e.name)
        if (e.isDirectory()) {
          return { nome: e.name, tipo: 'dir' as const, ext: '', tamanho: 0, filhos: listarDir(fullPath, depth + 1) }
        }
        const stat = statSync(fullPath)
        return { nome: e.name, tipo: 'file' as const, ext: extname(e.name), tamanho: stat.size, filhos: undefined }
      })
  } catch { return [] }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const url = new URL(req.url)
  const subPath = url.searchParams.get('path') ?? ''

  try {
    const projetos = JSON.parse(readFileSync(join(DATA_DIR, 'projetos.json'), 'utf-8'))
    const projeto = projetos.find((p: any) => String(p.id) === id)
    if (!projeto?.pasta) return NextResponse.json({ erro: 'Pasta não configurada' }, { status: 404 })

    const base = projeto.pasta
    const alvo = subPath ? join(base, subPath) : base

    // Leitura de arquivo específico
    if (url.searchParams.get('ler') === '1') {
      if (!existsSync(alvo)) return NextResponse.json({ erro: 'Arquivo não encontrado' }, { status: 404 })
      const stat = statSync(alvo)
      if (stat.size > 500_000) return NextResponse.json({ erro: 'Arquivo muito grande', tamanho: stat.size }, { status: 413 })
      try {
        const conteudo = readFileSync(alvo, 'utf-8')
        return NextResponse.json({ conteudo, linhas: conteudo.split('\n').length })
      } catch { return NextResponse.json({ erro: 'Não foi possível ler (binário?)' }, { status: 422 }) }
    }

    // Listagem de diretório
    const entradas = listarDir(alvo)
    return NextResponse.json({ pasta: base, subPath, entradas })
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 })
  }
}

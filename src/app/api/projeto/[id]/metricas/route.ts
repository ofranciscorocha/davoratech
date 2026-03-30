import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { execSync } from 'child_process'

const DATA_DIR = 'D:/LaFamiglia/engine/data'
const IGNORE = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.nuxt', 'out', 'coverage', '.turbo'])

function scanDir(dir: string, exts: Record<string, number>, linhas: { total: number }, depth = 0) {
  if (depth > 8) return
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (IGNORE.has(entry.name)) continue
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        scanDir(fullPath, exts, linhas, depth + 1)
      } else {
        const ext = extname(entry.name) || '(sem ext)'
        exts[ext] = (exts[ext] ?? 0) + 1
        try {
          const conteudo = readFileSync(fullPath, 'utf-8')
          linhas.total += conteudo.split('\n').length
        } catch { /* binário */ }
      }
    }
  } catch { /* sem acesso */ }
}

function gitLog(pasta: string) {
  try {
    const raw = execSync(`git -C "${pasta}" log --format="%H|%s|%an|%ai|%D" -30 2>/dev/null`, { timeout: 5000, encoding: 'utf-8' })
    return raw.trim().split('\n').filter(Boolean).map(line => {
      const [hash, msg, autor, data, refs] = line.split('|')
      return { hash: hash?.slice(0, 7), msg, autor, data: data?.slice(0, 16), branch: refs?.split(',')[0]?.trim() ?? '' }
    })
  } catch { return [] }
}

function gitStats(pasta: string) {
  try {
    const total = execSync(`git -C "${pasta}" rev-list --count HEAD 2>/dev/null`, { timeout: 3000, encoding: 'utf-8' }).trim()
    const autores = execSync(`git -C "${pasta}" shortlog -sn --no-merges HEAD 2>/dev/null`, { timeout: 3000, encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean).slice(0, 5).map(l => {
        const m = l.match(/^\s*(\d+)\s+(.+)$/)
        return { commits: Number(m?.[1]), nome: m?.[2] ?? '' }
      })
    const branch = execSync(`git -C "${pasta}" branch --show-current 2>/dev/null`, { timeout: 2000, encoding: 'utf-8' }).trim()
    return { totalCommits: Number(total) || 0, autores, branch }
  } catch { return { totalCommits: 0, autores: [], branch: '' } }
}

function getDeps(pasta: string) {
  try {
    const pkg = JSON.parse(readFileSync(join(pasta, 'package.json'), 'utf-8'))
    return {
      nome: pkg.name, versao: pkg.version, descricao: pkg.description,
      scripts: Object.keys(pkg.scripts ?? {}),
      deps: Object.entries(pkg.dependencies ?? {}).map(([n, v]) => ({ nome: n, versao: String(v) })),
      devDeps: Object.entries(pkg.devDependencies ?? {}).map(([n, v]) => ({ nome: n, versao: String(v) })),
    }
  } catch { return null }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const projetos = JSON.parse(readFileSync(join(DATA_DIR, 'projetos.json'), 'utf-8'))
    const projeto = projetos.find((p: any) => String(p.id) === id)
    if (!projeto?.pasta) return NextResponse.json({ erro: 'Pasta não configurada' }, { status: 404 })

    const pasta = projeto.pasta
    if (!existsSync(pasta)) return NextResponse.json({ erro: 'Pasta não encontrada: ' + pasta }, { status: 404 })

    const exts: Record<string, number> = {}
    const linhas = { total: 0 }
    scanDir(pasta, exts, linhas)

    const extsSorted = Object.entries(exts).sort(([, a], [, b]) => b - a)
    const totalArquivos = extsSorted.reduce((acc, [, n]) => acc + n, 0)

    const commits = gitLog(pasta)
    const gitStatsData = gitStats(pasta)
    const pkg = getDeps(pasta)

    return NextResponse.json({
      pasta,
      totalArquivos,
      totalLinhas: linhas.total,
      extensoes: extsSorted,
      commits,
      git: gitStatsData,
      pkg,
    })
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 })
  }
}

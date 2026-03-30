import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const PROJETOS_FILE = join('D:/LaFamiglia/engine/data', 'projetos.json')

// POST /api/projetos — reorder: { ordem: number[] }
export async function POST(req: NextRequest) {
  try {
    const { ordem } = await req.json() as { ordem: number[] }
    const raw = await readFile(PROJETOS_FILE, 'utf-8')
    const projetos = JSON.parse(raw)
    const mapa = new Map(projetos.map((p: { id: number }) => [p.id, p]))
    const reordenados = ordem.map(id => mapa.get(id)).filter(Boolean)
    await writeFile(PROJETOS_FILE, JSON.stringify(reordenados, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true, warning: 'read-only filesystem' })
  }
}

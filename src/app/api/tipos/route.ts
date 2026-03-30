import { NextResponse } from 'next/server'

const tipos = [
  { nome: "Cliente", cor: "#7ac943" },
  { nome: "SaaS", cor: "#3498db" },
  { nome: "Interno", cor: "#e67e22" },
  { nome: "Modulo", cor: "#9b59b6" },
  { nome: "Sistema", cor: "#1abc9c" },
  { nome: "Ferramenta", cor: "#e74c3c" }
]

export async function GET() {
  return NextResponse.json(tipos)
}

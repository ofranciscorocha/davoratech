'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, FolderKanban, History, CalendarDays, ExternalLink, Shield, Settings, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/admin', icon: LayoutDashboard },
  { label: 'Projetos', href: '/admin/projetos', icon: FolderKanban },
  { label: 'Agenda & Notas', href: '/admin/agenda', icon: CalendarDays },
  { label: 'Histórico', href: '/admin/historico', icon: History },
  { label: 'Sistema', href: '/admin/sistema', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarAberta, setSidebarAberta] = useState(false)

  const fecharSidebar = () => setSidebarAberta(false)

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={fecharSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-60 bg-[#060e1c] flex flex-col fixed h-full z-40 border-r border-white/5 transition-transform duration-300 ${
        sidebarAberta ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-white/5">
          <div className="w-7 h-7 bg-[#7ac943] rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={14} className="text-[#0d1b3e]" />
          </div>
          <span className="text-white font-black tracking-tighter text-base leading-none">
            DAVORA <span className="text-[#7ac943]">TECH</span>
          </span>
          <button
            onClick={fecharSidebar}
            className="ml-auto text-white/40 hover:text-white/80 transition md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-5 space-y-0.5">
          <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(({ label, href, icon: Icon }) => {
            const ativo = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={fecharSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  ativo
                    ? 'bg-[#7ac943] text-[#0d1b3e]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Vault link */}
        <div className="px-2 pb-5 border-t border-white/5 pt-3">
          <a
            href="obsidian://open?vault=LaFamiglia"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-white/25 hover:text-white/50 hover:bg-white/5 transition-all"
          >
            <ExternalLink size={14} />
            Abrir Vault
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarAberta(true)}
              className="md:hidden text-slate-500 hover:text-[#0d1b3e] transition p-1"
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest hidden sm:block">Painel Interno</p>
              <h1 className="text-[#0d1b3e] font-black text-lg leading-tight">DAVORA TECH</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7ac943] animate-pulse" />
            <span className="text-xs text-slate-400 font-semibold hidden sm:block">Sistema online</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

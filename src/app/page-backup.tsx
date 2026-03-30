'use client'
import React, { useState } from 'react';
import { ArrowRight, Shield, BarChart3, Scan, FileCheck, Building2, Menu, X } from 'lucide-react';

const Gavel = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m14 13-5 5" /><path d="m3 21 3-3" /><path d="m9.5 15.5 4-4" /><path d="m11.5 7.5 4-4" /><path d="m3 3 3.5 3.5" /><path d="m2 6 4 4" /><path d="m6 2 4 4" />
  </svg>
);

const solutions = [
  {
    title: 'DAVORA Pátio',
    description: 'Gestão completa de pátios de veículos, desde a remoção até o leilão ou liberação.',
    icon: Building2,
    features: ['Vistoria Digital', 'Inventário Automatizado', 'Controle Financeiro'],
  },
  {
    title: 'DAVORA Leilão',
    description: 'Plataforma de alta performance para leiloeiros oficiais e gestão de ativos.',
    icon: Gavel,
    features: ['Lances em Tempo Real', 'Auditoria Digital', 'Integração Bancária'],
  },
  {
    title: 'DAVORA Vistoria',
    description: 'Aplicativo especializado para vistorias técnicas e cautelares em campo.',
    icon: Scan,
    features: ['Fotos com GPS', 'Checklist Dinâmico', 'Laudo Instantâneo'],
  },
  {
    title: 'DAVORA Analytics',
    description: 'Inteligência de dados para tomada de decisão estratégica em grandes operações.',
    icon: BarChart3,
    features: ['BI Integrado', 'Previsão de Receita', 'Métricas de Performance'],
  },
];

const navLinks = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Documentação', href: '#docs' },
];

export default function HomePage() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── Nav ── */}
      <nav className="fixed w-full z-50 bg-[#0d1b3e]/95 backdrop-blur-md border-b border-white/5 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#7ac943] rounded-xl flex items-center justify-center shadow-lg shadow-[#7ac943]/20 flex-shrink-0">
              <Shield className="text-[#0d1b3e]" size={20} />
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tighter leading-none">
              DAVORA <span className="text-[#7ac943]">TECH</span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center space-x-10 text-sm font-bold tracking-wide uppercase opacity-70">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-[#7ac943] hover:opacity-100 transition">{l.label}</a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <button className="text-sm font-bold opacity-50 hover:opacity-90 transition">Entrar</button>
            <button className="bg-[#7ac943] text-[#0d1b3e] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#7ac943]/20 hover:scale-105 active:scale-95 transition-all">
              Agendar Demo
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuAberto && (
          <div className="sm:hidden bg-[#0d1b3e] border-t border-white/10 px-4 py-6 flex flex-col gap-5">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-bold uppercase tracking-widest opacity-70 hover:text-[#7ac943] hover:opacity-100 transition"
                onClick={() => setMenuAberto(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <button className="text-sm font-bold opacity-50 text-left">Entrar</button>
              <button className="bg-[#7ac943] text-[#0d1b3e] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#7ac943]/20 w-full">
                Agendar Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 sm:pt-40 sm:pb-32 lg:pt-56 lg:pb-48 bg-[#0d1b3e] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#06101f] via-[#0d1b3e] to-[#152f5e]" />
        <div className="hero-grid absolute inset-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Texto */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-[#7ac943] animate-pulse flex-shrink-0" />
              <span className="text-white/50 text-xs font-mono uppercase tracking-widest">v2 · Asset Management Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-6 sm:mb-8">
              Controle não é opção.
              <span className="text-[#7ac943] block mt-2">É necessidade.</span>
            </h1>
            <p className="text-base sm:text-xl text-white/40 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10">
              Transformamos a gestão de ativos e operações de pátios com inteligência de dados e segurança de nível bancário.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button className="w-full sm:w-auto bg-[#7ac943] text-[#0d1b3e] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black flex items-center justify-center gap-3 hover:brightness-110 hover:shadow-2xl hover:shadow-[#7ac943]/30 transition-all">
                Conhecer o Ecossistema <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto border border-white/15 text-white/70 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold hover:border-white/30 hover:text-white transition">
                Falar com Consultor
              </button>
            </div>
          </div>

          {/* Mock device */}
          <div className="lg:w-1/2 relative w-full max-w-sm sm:max-w-none mx-auto">
            <div className="relative z-10 bg-gradient-to-tr from-[#06101f] to-[#152f5e] border border-white/10 p-3 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl">
              <div className="bg-[#0a1428] rounded-[1.5rem] sm:rounded-[1.8rem] overflow-hidden shadow-inner aspect-video flex items-center justify-center border border-white/5">
                <div className="text-center p-6 sm:p-12">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center text-[#7ac943]">
                    <BarChart3 size={32} />
                  </div>
                  <p className="text-white/30 font-mono uppercase tracking-widest text-xs mb-2">Interface Premium</p>
                  <h4 className="text-lg sm:text-2xl font-black text-white">Dashboard Inteligente</h4>
                </div>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7ac943]/15 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* ── Soluções ── */}
      <section id="solucoes" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-20 gap-6 sm:gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#0d1b3e] tracking-tighter leading-tight">
                Soluções desenhadas para a <span className="text-slate-300">complexidade do dia a dia.</span>
              </h3>
            </div>
            <p className="text-slate-500 font-medium max-w-sm mb-2 mx-auto lg:mx-0">
              Uma estrutura robusta que atende desde o pequeno pátio até grandes operações.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {solutions.map((sol) => (
              <div
                key={sol.title}
                className="group p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-[#0d1b3e] hover:border-[#0d1b3e] transition-all duration-500"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0d1b3e] mb-6 sm:mb-8 group-hover:bg-[#7ac943] group-hover:text-[#0d1b3e] transition-colors duration-500">
                  <sol.icon size={28} />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-[#0d1b3e] group-hover:text-white mb-3 sm:mb-4 transition-colors">{sol.title}</h4>
                <p className="text-slate-500 group-hover:text-white/50 mb-6 sm:mb-8 text-sm leading-relaxed transition-colors">{sol.description}</p>
                <ul className="space-y-2 sm:space-y-3">
                  {sol.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-[#7ac943] transition-colors">
                      <FileCheck size={14} className="flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 sm:py-24 bg-[#06101f] text-white relative overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            {[
              { num: '+100k', label: 'Ativos Gerenciados' },
              { num: '+50', label: 'Clientes Ativos' },
              { num: '99.9%', label: 'Disponibilidade' },
              { num: '100%', label: 'Conformidade Legal' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#7ac943] mb-2">{num}</p>
                <p className="text-xs font-mono uppercase tracking-widest text-white/30">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#06101f] pt-16 sm:pt-24 pb-10 sm:pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-12 sm:gap-16 mb-16 sm:mb-20">
            <div className="max-w-xs">
              <div className="text-2xl font-black tracking-tighter mb-5 text-white">
                DAVORA<span className="text-[#7ac943]">TECH</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed">
                Referência nacional em tecnologia para gestão de ativos, pátios e leilões.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-24">
              <div className="space-y-5">
                <p className="font-black text-xs uppercase tracking-widest text-white/40">Plataforma</p>
                <div className="flex flex-col gap-3 text-sm text-white/25 font-medium">
                  <a href="#" className="hover:text-white/70 transition">Soluções</a>
                  <a href="#" className="hover:text-white/70 transition">Vistoria</a>
                  <a href="#" className="hover:text-white/70 transition">Leilão</a>
                </div>
              </div>
              <div className="space-y-5">
                <p className="font-black text-xs uppercase tracking-widest text-white/40">Empresa</p>
                <div className="flex flex-col gap-3 text-sm text-white/25 font-medium">
                  <a href="#" className="hover:text-white/70 transition">Sobre Nós</a>
                  <a href="#" className="hover:text-white/70 transition">Contato</a>
                  <a href="#" className="hover:text-white/70 transition">Carreiras</a>
                </div>
              </div>
              <div className="space-y-5">
                <p className="font-black text-xs uppercase tracking-widest text-white/40">Social</p>
                <div className="flex flex-col gap-3 text-sm text-white/25 font-medium">
                  <a href="#" className="hover:text-white/70 transition">LinkedIn</a>
                  <a href="#" className="hover:text-white/70 transition">Instagram</a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-white/20">
            <p>© 2026 DAVORA TECH. Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white/50 transition">Privacidade</a>
              <a href="#" className="hover:text-white/50 transition">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

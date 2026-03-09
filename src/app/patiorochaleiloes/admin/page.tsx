'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Gavel,
    Car,
    Users,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function PatioAdmin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen bg-[#050b1a] flex">
            {/* Sidebar */}
            <aside className="w-68 bg-[#0a1b3f] text-white flex flex-col border-r border-white/5">
                <div className="p-8 border-b border-white/5">
                    <img src="/assets/logo-patio.png" alt="Logo" className="h-10 mb-2" />
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">Gestão <span className="text-[#D4AF37]">Premium</span></h1>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-[#D4AF37] text-[#0a1b3f] shadow-lg shadow-[#D4AF37]/20 scale-[1.02]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={18} />
                            <span className="font-black text-[11px] uppercase tracking-[0.2em]">Dashboard</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('leiloes')}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === 'leiloes' ? 'bg-[#D4AF37] text-[#0a1b3f] shadow-lg shadow-[#D4AF37]/20 scale-[1.02]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Gavel size={18} />
                            <span className="font-black text-[11px] uppercase tracking-[0.2em]">Leilões</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('lotes')}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === 'lotes' ? 'bg-[#D4AF37] text-[#0a1b3f] shadow-lg shadow-[#D4AF37]/20 scale-[1.02]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Car size={18} />
                            <span className="font-black text-[11px] uppercase tracking-[0.2em]">Lotes</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('usuarios')}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === 'usuarios' ? 'bg-[#D4AF37] text-[#0a1b3f] shadow-lg shadow-[#D4AF37]/20 scale-[1.02]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Users size={18} />
                            <span className="font-black text-[11px] uppercase tracking-[0.2em]">Licitantes</span>
                        </div>
                    </button>
                </nav>

                <div className="p-8 border-t border-white/5">
                    <Link href="/patiorochaleiloes" className="flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-colors group">
                        <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Página Pública</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-24 bg-[#0a1b3f]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-1">Pátio Rocha Leilões</span>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'leiloes' ? 'Painel de Eventos' : activeTab === 'lotes' ? 'Catálogo de Bens' : 'Gestão de Usuários'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="bg-[#D4AF37] text-[#0a1b3f] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-2xl shadow-[#D4AF37]/10">
                            <Plus size={16} />
                            Novo Leilão
                        </button>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto space-y-10">
                    {activeTab === 'dashboard' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Leilões Ativos', value: '4', icon: Gavel, color: 'text-blue-400' },
                                    { label: 'Total em Lances', value: 'R$ 1.2M', icon: TrendingUp, color: 'text-[#D4AF37]' },
                                    { label: 'Novos Lotes', value: '+42', icon: Car, color: 'text-emerald-400' },
                                    { label: 'Usuários Verif.', value: '1.2k', icon: ShieldCheck, color: 'text-purple-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 rounded-[2.5rem] group hover:border-[#D4AF37]/30 transition-all">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={22} />
                                        </div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-white italic">{stat.value}</h3>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                                    <TrendingUp className="text-[#D4AF37]" />
                                    Atividade em Tempo Real
                                </h3>
                                <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-[2rem] text-gray-600 font-bold italic text-sm">
                                    Carregando dados do servidor de lances...
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden">
                            <div className="p-10 border-b border-white/5 flex items-center justify-between gap-6">
                                <div className="relative flex-1 max-w-xl">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por ID, título ou comitente..."
                                        className="w-full pl-16 pr-6 py-5 bg-white/5 border-none rounded-2xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                    />
                                </div>
                                <button className="p-5 bg-white/5 text-gray-400 rounded-2xl hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                                    <Filter size={24} />
                                </button>
                            </div>
                            <div className="p-32 text-center space-y-6">
                                <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                                    <Gavel size={48} />
                                </div>
                                <p className="text-gray-500 font-bold italic text-lg tracking-tight">O motor de busca Pátio Rocha está sincronizando o banco de dados...</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

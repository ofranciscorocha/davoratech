'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Settings,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    Truck,
    Recycle
} from 'lucide-react';
import Link from 'next/link';

export default function RecicladoraAdmin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a4731] text-white flex flex-col">
                <div className="p-8 border-b border-white/10">
                    <img src="/assets/logo-recicladora.png" alt="Logo" className="h-10 mb-2" />
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">Painel <span className="text-[#8ec448]">Admin</span></h1>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#8ec448] text-white shadow-lg' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('salvados')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'salvados' ? 'bg-[#8ec448] text-white shadow-lg' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Package size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Salvados</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('coletas')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'coletas' ? 'bg-[#8ec448] text-white shadow-lg' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Truck size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Coletas</span>
                    </button>
                </nav>

                <div className="p-8 border-t border-white/10">
                    <Link href="/recicladora" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Ver Site Público</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10">
                    <h2 className="text-2xl font-black text-[#1a4731] uppercase italic tracking-tighter">
                        {activeTab === 'dashboard' ? 'Visão Geral' : activeTab === 'salvados' ? 'Gestão de Salvados' : 'Gerenciamento de Coletas'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <button className="bg-[#1a4731] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1a4731]/90 transition-all flex items-center gap-2 shadow-lg">
                            <Plus size={16} />
                            Novo Registro
                        </button>
                    </div>
                </header>

                <div className="p-10">
                    {activeTab === 'dashboard' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Total Salvados', value: '142', icon: Package, color: 'text-blue-500' },
                                { label: 'Prensagens Mês', value: '38', icon: Recycle, color: 'text-[#8ec448]' },
                                { label: 'Coletas Pendentes', value: '12', icon: Truck, color: 'text-amber-500' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-[#1a4731]">{stat.value}</h3>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar registros..."
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#8ec448]/20"
                                    />
                                </div>
                                <button className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
                                    <Filter size={20} />
                                </button>
                            </div>
                            <div className="p-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <ClipboardList size={40} />
                                </div>
                                <p className="text-slate-400 font-medium">Nenhum registro encontrado para a busca atual.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

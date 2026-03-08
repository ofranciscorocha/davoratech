'use client';
import React, { useState, useEffect } from 'react';
import {
    Users, Search, Download, Trash2, LayoutDashboard, Settings,
    Menu, X, TrendingUp, UserPlus, FileSpreadsheet, Linkedin,
    ChevronRight, Filter, MoreVertical, CheckCircle2, AlertCircle,
    Briefcase, MapPin, Building2, Phone, Mail, ExternalLink, Sparkles,
    ArrowUpRight, BarChart3, Target, Zap, Shield
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './crm.css';

// API Configuration for integrated project
const API_BASE = '/api/crm';

// --- ORIGINAL PREMIUM COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-premium p-6 rounded-[2rem] relative overflow-hidden group border-white/5 hover:border-[#c5a059]/30 transition-all duration-500"
    >
        <div className={`absolute -right-4 -bottom-4 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 ${color}`}>
            <Icon size={120} />
        </div>

        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${color} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{trend}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-black text-white tracking-widest">{value}</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{title}</p>
            </div>
        </div>
    </motion.div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative
      ${active
                ? 'text-[#c5a059]'
                : 'text-gray-500 hover:text-white'}`}
    >
        {active && (
            <motion.div
                layoutId="sidebar-active-bg"
                className="absolute inset-0 bg-gradient-to-r from-[#c5a059]/10 to-transparent rounded-2xl border-l-2 border-[#c5a059]"
            />
        )}
        <Icon className={`w-5 h-5 transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'group-hover:scale-110'}`} />
        <span className={`font-bold text-xs uppercase tracking-widest transition-all ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
    </button>
);

export default function CRMPage() {
    const [activePage, setActivePage] = useState('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        fetchStats();
        fetchLeads();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchStats = async () => {
        try {
            const r = await axios.get(`${API_BASE}/stats`);
            setStats(r.data);
        } catch (e) { console.error('Error stats:', e); }
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const r = await axios.get(`${API_BASE}/leads`);
            setLeads(r.data.leads || []);
            setLoading(false);
        } catch (e) {
            console.error('Error leads:', e);
            setLoading(false);
        }
    };

    return (
        <div id="crm-root" className="min-h-screen animate-mesh text-white flex font-premium selection:bg-[#c5a059] selection:text-white relative">

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c5a059]/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* SIDEBAR */}
            <aside className={`fixed lg:relative z-50 h-[96vh] m-[2vh] rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/5 transition-all duration-700 overflow-hidden sidebar-glow
        ${isSidebarOpen ? 'w-80' : 'w-0 lg:w-24'}`}>
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-16 px-2">
                        <div className="w-12 h-12 gold-gradient-bg rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] group cursor-pointer hover:rotate-12 transition-transform duration-500">
                            <Zap className="text-black w-6 h-6" fill="black" />
                        </div>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <h2 className="text-xl font-black tracking-widest uppercase italic leading-none">ROCHA</h2>
                                <span className="text-[#c5a059] text-[10px] font-black tracking-[0.4em] uppercase">Intelligence</span>
                            </motion.div>
                        )}
                    </div>

                    <nav className="space-y-3 flex-1">
                        <SidebarItem icon={LayoutDashboard} label="Overview" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                        <SidebarItem icon={Target} label="Prospecção" active={activePage === 'prospect'} onClick={() => setActivePage('prospect')} />
                        <SidebarItem icon={Users} label="Base de Leads" active={activePage === 'leads'} onClick={() => setActivePage('leads')} />
                        <SidebarItem icon={BarChart3} label="Performance" active={activePage === 'reports'} onClick={() => setActivePage('reports')} />
                    </nav>

                    <div className="pt-8 mt-auto border-t border-white/5">
                        <SidebarItem icon={Shield} label="Rocha Pro" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden relative z-10">

                {/* HEADER */}
                <header className={`h-24 flex items-center justify-between px-10 shrink-0 transition-all duration-500 ${scrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5' : ''}`}>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-all border-white/5 hover:border-[#c5a059]/30">
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-black italic tracking-tight uppercase">Bem-vindo, <span className="gold-text">Francisco Rocha</span></h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sistema Operacional Online</p>
                            </div>
                        </div>
                    </div>

                    {/* Marquee Premium */}
                    <div className="flex-1 max-w-2xl mx-12 h-12 glass rounded-2xl flex items-center overflow-hidden border-white/5 group">
                        <div className="w-1.5 h-full gold-gradient-bg" />
                        <div className="flex-1 whitespace-nowrap overflow-hidden relative">
                            <div className="inline-block animate-marquee-scroll">
                                <span className="mx-8 text-[11px] font-black text-white/40 italic tracking-[0.4em] uppercase">ROCHINHA É O CARA • SISTEMA PREMIUM DE CRM ELITE • PROSPECÇÃO INTELIGENTE AI • </span>
                                <span className="mx-8 text-[11px] font-black text-white/40 italic tracking-[0.4em] uppercase">ROCHINHA É O CARA • SISTEMA PREMIUM DE CRM ELITE • PROSPECÇÃO INTELIGENTE AI • </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl gold-gradient-bg p-[1px] shadow-[0_0_20px_rgba(197,160,89,0.2)] group cursor-pointer overflow-hidden">
                            <div className="w-full h-full rounded-[15px] bg-black/90 flex items-center justify-center font-black text-[#c5a059] text-sm group-hover:scale-110 transition-transform duration-500">FR</div>
                        </div>
                    </div>
                </header>

                {/* PAGE BODY */}
                <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
                    <AnimatePresence mode="wait">
                        {activePage === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-12"
                            >
                                {/* Hero Banner */}
                                <div className="relative p-10 rounded-[3rem] overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 via-transparent to-transparent z-0" />
                                    <div className="absolute inset-0 glass-premium z-[-1]" />
                                    <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
                                        <Linkedin size={300} />
                                    </div>

                                    <div className="relative z-10 max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c5a059]/20 rounded-full border border-[#c5a059]/30 mb-6 animate-float">
                                            <Sparkles size={14} className="text-[#c5a059]" />
                                            <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em]">Insights do Dia</span>
                                        </div>
                                        <h2 className="text-6xl font-black italic tracking-tight mb-6 leading-tight uppercase">Domine a sua <span className="gold-text">Prospecção</span></h2>
                                        <p className="text-gray-400 font-medium text-lg leading-relaxed mb-8">Baseado no seu perfil, encontramos <span className="text-white font-bold">127 novos leads</span> potenciais nas últimas 24 horas. Pronto para iniciar o ataque?</p>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setActivePage('prospect')} className="gold-gradient-bg text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#c5a059]/40 hover:scale-105 active:scale-95 transition-all">Iniciar Coleta</button>
                                            <button className="glass px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border-white/10 hover:border-[#c5a059] transition-all">Relatório Completo</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <StatCard title="Leads Coletados" value={stats?.totalLeads || 0} icon={Users} color="text-blue-500" trend="+12.5%" />
                                    <StatCard title="Novos Leads" value={stats?.newLeads || 0} icon={UserPlus} color="text-[#c5a059]" trend="+8%" />
                                    <StatCard title="Qualificados" value={stats?.qualifiedLeads || 0} icon={CheckCircle2} color="text-emerald-500" />
                                    <StatCard title="Performance AI" value="98.2%" icon={Zap} color="text-purple-500" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Recent leads */}
                                    <div className="lg:col-span-2 glass-premium rounded-[3rem] p-10 border-white/5">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic tracking-widest">Leads <span className="gold-text">Recentes</span></h3>
                                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Últimas coletas processadas pela Rocha AI</p>
                                            </div>
                                            <button onClick={() => setActivePage('leads')} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-all border-white/5">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {leads.slice(0, 5).map((lead: any, idx: number) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    key={lead.id}
                                                    className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5 relative overflow-hidden"
                                                >
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 p-0.5 border border-white/10 group-hover:border-[#c5a059]/50 transition-all duration-500 relative z-10">
                                                        <img src={lead.photoUrl} alt={lead.name} className="w-full h-full object-cover rounded-[14px]" />
                                                    </div>
                                                    <div className="flex-1 relative z-10">
                                                        <h4 className="font-black text-sm tracking-widest uppercase">{lead.name}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase truncate max-w-[250px] tracking-tight">{lead.headline}</p>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-2 relative z-10">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 size={12} className="text-[#c5a059]" />
                                                            <span className="text-[11px] font-black uppercase tracking-tighter">{lead.company}</span>
                                                        </div>
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                            lead.status === 'new' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-white/5 text-gray-500 border border-white/5'
                                                            }`}>
                                                            {lead.status}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {leads.length === 0 && (
                                                <div className="py-24 text-center">
                                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Users className="text-gray-600" size={40} />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">A base de dados está em branco.</p>
                                                    <button onClick={() => setActivePage('prospect')} className="mt-8 px-10 py-4 gold-gradient-bg text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Iniciar Captura</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Goal/AI Sidebar */}
                                    <div className="space-y-8">
                                        <div className="glass-premium rounded-[3rem] p-10 text-center relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-full h-1 gold-gradient-bg opacity-30" />
                                            <div className="w-32 h-32 rounded-full border-[10px] border-white/5 border-t-[#c5a059] border-r-[#c5a059]/50 flex flex-col items-center justify-center mx-auto mb-8 animate-[spin_10s_linear_infinite] relative">
                                                <div className="animate-[spin_10s_linear_infinite_reverse] flex flex-col items-center justify-center">
                                                    <span className="text-3xl font-black italic gold-text">84%</span>
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-black italic uppercase tracking-widest mb-3">Goal <span className="text-[#c5a059]">Reached</span></h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Você está a 16 leads de bater a sua meta semanal de prospecção.</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group border border-white/10">
                                            <BarChart3 className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
                                            <h4 className="text-2xl font-black mb-4 leading-tight italic uppercase tracking-widest">ROI <span className="text-white/60">ANALYZER</span></h4>
                                            <p className="text-white/70 text-sm mb-8 font-medium leading-relaxed">Setor de <span className="text-white font-bold">Tecnologia</span> gerou melhores leads este mês.</p>
                                            <button className="w-full bg-white text-blue-700 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">Ver Sugestões AI</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* PROSPECT PAGE */}
                        {activePage === 'prospect' && (
                            <motion.div
                                key="prospect"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-5xl mx-auto py-10"
                            >
                                <div className="text-center mb-16">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] glass-premium text-[#c5a059] mb-8 shadow-2xl shadow-[#c5a059]/10 animate-float">
                                        <Target size={44} />
                                    </div>
                                    <h2 className="text-7xl font-black italic tracking-tighter mb-4 uppercase leading-none">Scraping <span className="gold-text">Elite</span></h2>
                                    <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">Nossa tecnologia de extração furtiva garante 100% de segurança no LinkedIn.</p>
                                </div>

                                <div className="glass-premium rounded-[4rem] p-16 space-y-12 relative overflow-hidden border-white/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059] flex items-center gap-3">
                                                <div className="w-5 h-[1px] bg-[#c5a059]" />
                                                Target Headline
                                            </label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c5a059] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="DIRETOR COMERCIAL, CEO, VP..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] px-16 py-6 text-sm font-bold placeholder:text-gray-700 focus:border-[#c5a059]/50 outline-none transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059] flex items-center gap-3">
                                                <div className="w-5 h-[1px] bg-[#c5a059]" />
                                                Industry Filter
                                            </label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c5a059] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="SAAS, LOGÍSTICA, VAREJO..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] px-16 py-6 text-sm font-bold placeholder:text-gray-700 focus:border-[#c5a059]/50 outline-none transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center pt-8">
                                        <button className="gold-gradient-bg text-black px-24 py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_60px_-15px_rgba(197,160,89,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
                                            <Zap size={20} fill="black" className="group-hover:animate-pulse" />
                                            Iniciar Varredura
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* LEADS LIST PAGE */}
                        {activePage === 'leads' && (
                            <motion.div
                                key="leads"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-12"
                            >
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                                    <div>
                                        <h2 className="text-6xl font-black italic tracking-tighter mb-4 uppercase leading-none">Base <span className="gold-text">Prospect</span></h2>
                                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Total de ativos: <span className="text-white">{leads.length} Contatos</span></p>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <button className="glass px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all border-white/10">
                                            <Filter size={16} /> Filters
                                        </button>
                                        <button className="gold-gradient-bg text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                            <Download size={16} /> Export CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="glass-premium rounded-[3.5rem] overflow-hidden border-white/5 shadow-2xl">
                                    <div className="p-8 bg-white/[0.02] border-b border-white/5 flex items-center gap-6">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Pesquisar..."
                                                className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-16 text-sm focus:border-[#c5a059]/50 outline-none transition-all uppercase tracking-widest font-bold font-premium"
                                            />
                                        </div>
                                    </div>

                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059]">Identificação</th>
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059]">Headline / Cargo</th>
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059]">Organização</th>
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059] text-right">Interação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {leads.map((lead: any, idx: number) => (
                                                <motion.tr
                                                    key={lead.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                                >
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 p-0.5 border border-white/10 group-hover:border-[#c5a059] transition-all duration-500 relative shadow-xl">
                                                                <img src={lead.photoUrl} alt={lead.name} className="w-full h-full object-cover rounded-[14px]" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-sm tracking-widest uppercase mb-1">{lead.name}</div>
                                                                <div className="text-[9px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-widest"><MapPin size={10} className="text-[#c5a059]" /> {lead.location}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="text-[11px] text-white/50 group-hover:text-white transition-colors max-w-[280px] font-bold leading-relaxed uppercase tracking-tighter italic">{lead.headline}</div>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                                                                <Building2 size={14} className="text-[#c5a059]" />
                                                                {lead.company}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <a href={lead.profileUrl} target="_blank" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all border-white/5">
                                                                <Linkedin size={18} />
                                                            </a>
                                                            <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-[#c5a059] hover:bg-[#c5a059]/10 transition-all border-white/5">
                                                                <MoreVertical size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

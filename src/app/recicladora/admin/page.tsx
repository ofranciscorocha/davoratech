'use client';

import { useState, useEffect } from 'react';
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
    Recycle,
    Car,
    FileText,
    Activity,
    FileCheck,
    ChevronRight,
    SearchX,
    BadgeCheck,
    Calendar,
    ArrowRight,
    Users,
    Settings2,
    ShieldCheck,
    Database,
    Zap,
    LogOut,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { getVehicles } from '@/lib/recicladora-storage';
import { Vehicle, STATUS_LABELS, STATUS_COLORS } from '@/lib/recicladora-types';

export default function RecicladoraAdmin() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        recebido: 0,
        em_analise: 0,
        prensado: 0,
        certificado: 0,
    });

    useEffect(() => {
        const v = getVehicles();
        setVehicles(v);
        setStats({
            total: v.length,
            recebido: v.filter(x => x.status === 'recebido').length,
            em_analise: v.filter(x => x.status === 'em_analise').length,
            prensado: v.filter(x => x.status === 'prensado').length,
            certificado: v.filter(x => x.status === 'certificado_emitido').length,
        });
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.seguradora.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recentVehicles = [...vehicles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

    // Filter certificates (prensado or certificado_emitido)
    const certificates = vehicles.filter(v => v.status === 'prensado' || v.status === 'certificado_emitido');

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1a4731] text-white flex flex-col shadow-2xl z-20 sticky top-0 h-screen">
                <div className="p-10 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#8ec448] rounded-xl flex items-center justify-center shadow-lg shadow-[#8ec448]/20 group-hover:rotate-12 transition-transform">
                            <Recycle className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                            Rocha <br />
                            <span className="text-[#8ec448]">Recicla</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
                    <SidebarButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
                    <SidebarButton active={activeTab === 'salvados'} onClick={() => setActiveTab('salvados')} icon={Car} label="Salvados" />
                    <SidebarButton active={activeTab === 'coletas'} onClick={() => setActiveTab('coletas')} icon={Truck} label="Coletas" />
                    <SidebarButton active={activeTab === 'certificados'} onClick={() => setActiveTab('certificados')} icon={FileCheck} label="Certificados" />
                    <SidebarButton active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} icon={Users} label="Usuários" />
                    <SidebarButton active={activeTab === 'configuracoes'} onClick={() => setActiveTab('configuracoes')} icon={Settings2} label="Configurações" />
                </nav>

                <div className="p-8 border-t border-white/10 space-y-4">
                    <Link href="/recicladora" className="flex items-center gap-3 text-white/40 hover:text-[#8ec448] transition-all group">
                        <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ambiente Público</span>
                    </Link>
                    <button className="flex items-center gap-3 text-red-400/60 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
                        <LogOut size={18} />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="h-28 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-12 sticky top-0 z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#8ec448] uppercase tracking-[0.4em] mb-1">Recicladora Rocha Leilões</span>
                        <h2 className="text-4xl font-black text-[#1a4731] uppercase italic tracking-tighter">
                            {getTitle(activeTab)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-4 bg-slate-100 text-slate-400 rounded-full hover:bg-[#8ec448]/10 hover:text-[#8ec448] transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="bg-[#1a4731] text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#1a4731]/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-[#1a4731]/20">
                            <Plus size={18} />
                            Novo Registro
                        </button>
                    </div>
                </header>

                <div className="p-12 max-w-[1600px] w-full mx-auto space-y-12 flex-1">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );

    function getTitle(tab: string) {
        switch (tab) {
            case 'dashboard': return 'Overview';
            case 'salvados': return 'Controle de Frota';
            case 'coletas': return 'Gestão de Logística';
            case 'certificados': return 'Emissão de Laudos';
            case 'usuarios': return 'Gestão de Acessos';
            case 'configuracoes': return 'Configurações do Sistema';
            default: return 'Recicladora Rocha';
        }
    }

    function renderTabContent() {
        switch (activeTab) {
            case 'dashboard': return (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard label="Frota em Estoque" value={stats.total} icon={Car} sub="Total acumulado" color="text-blue-500" bg="bg-blue-50" />
                        <StatCard label="Em Processamento" value={stats.recebido + stats.em_analise} icon={Activity} sub="Triagem e análise" color="text-amber-500" bg="bg-amber-50" />
                        <StatCard label="Material Prensado" value={stats.prensado} icon={Recycle} sub="Pronto para despacho" color="text-emerald-500" bg="bg-emerald-50" />
                        <StatCard label="Laudos Emitidos" value={stats.certificado} icon={FileCheck} sub="Certificação final" color="text-indigo-500" bg="bg-indigo-50" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity Table */}
                        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-[#1a4731] uppercase italic tracking-tighter flex items-center gap-3">
                                    <Activity className="text-[#8ec448]" />
                                    Movimentação Recente
                                </h3>
                                <button onClick={() => setActiveTab('salvados')} className="text-xs font-black text-[#8ec448] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
                                    Ver todos <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificador</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Veículo</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentVehicles.length > 0 ? recentVehicles.map((v) => (
                                            <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                                <td className="px-10 py-7">
                                                    <span className="text-sm font-black text-[#1a4731] bg-slate-100 px-4 py-2 rounded-xl group-hover:bg-[#8ec448] group-hover:text-white transition-colors uppercase tracking-wider">{v.placa}</span>
                                                </td>
                                                <td className="px-10 py-7 text-sm font-bold text-slate-600 uppercase italic">{v.modelo}</td>
                                                <td className="px-10 py-7">
                                                    <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white italic shadow-sm" style={{ backgroundColor: STATUS_COLORS[v.status] }}>
                                                        {STATUS_LABELS[v.status]}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="p-20 text-center text-slate-300 font-bold italic">Aguardando registros...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 flex flex-col gap-8">
                            <h3 className="text-xl font-black text-[#1a4731] uppercase italic tracking-tighter">System Health</h3>
                            <HealthItem icon={Database} label="Sync Database" value="99.9%" color="text-emerald-500" />
                            <HealthItem icon={ShieldCheck} label="Security Core" value="Active" color="text-blue-500" />
                            <HealthItem icon={Zap} label="API Latency" value="14ms" color="text-amber-500" />
                        </div>
                    </div>
                </>
            );
            case 'salvados': return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                                <input
                                    type="text"
                                    placeholder="Buscar por placa, modelo ou seguradora..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-20 pr-10 py-6 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-4 focus:ring-[#8ec448]/10 transition-all font-medium placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Placa</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Modelo</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seguradora</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredVehicles.length > 0 ? filteredVehicles.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-10 py-7">
                                                <span className="text-sm font-black text-[#1a4731] bg-slate-100 px-4 py-2 rounded-xl group-hover:bg-[#8ec448] group-hover:text-white transition-colors uppercase tracking-wider">{v.placa}</span>
                                            </td>
                                            <td className="px-10 py-7 text-sm font-bold text-slate-600 uppercase italic">{v.modelo}</td>
                                            <td className="px-10 py-7 text-sm font-medium text-slate-500 uppercase">{v.seguradora}</td>
                                            <td className="px-10 py-7">
                                                <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white italic shadow-sm" style={{ backgroundColor: STATUS_COLORS[v.status] }}>
                                                    {STATUS_LABELS[v.status]}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-center">
                                                <button className="p-3 text-[#8ec448] hover:bg-[#8ec448]/10 rounded-xl transition-all">
                                                    <ArrowUpRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="p-32 text-center text-slate-300 font-bold italic">Nenhum registro encontrado...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
            case 'coletas': return (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.filter(v => v.status === 'recebido').map(v => (
                            <div key={v.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 group hover:border-[#8ec448]/30 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#8ec448] uppercase tracking-widest mb-1">Pendente</span>
                                        <h4 className="text-xl font-black text-[#1a4731] uppercase italic tracking-tighter">{v.placa}</h4>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                        <Truck size={24} />
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar size={16} className="text-slate-300" />
                                        <span className="font-bold text-slate-600 uppercase">{v.data_retirada}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <ArrowUpRight size={16} className="text-slate-300" />
                                        <span className="font-medium text-slate-500 uppercase">{v.local_retirada}</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-50 text-[#1a4731] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#8ec448] hover:text-white transition-all">
                                    Confirmar Recebimento
                                </button>
                            </div>
                        ))}
                        {vehicles.filter(v => v.status === 'recebido').length === 0 && (
                            <div className="col-span-full py-40 text-center">
                                <p className="text-slate-400 font-bold italic">Sem coletas pendentes.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'certificados': return (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {certificates.length > 0 ? certificates.map(v => (
                            <div key={v.id} className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 flex items-center gap-8 group hover:border-[#8ec448]/30 transition-all">
                                <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <BadgeCheck size={48} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-[#1a4731] uppercase italic tracking-tighter mb-4">{v.modelo} - {v.placa}</h4>
                                    <button className="w-full py-3 bg-[#1a4731] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#1a4731]/90 transition-all flex items-center justify-center gap-2">
                                        Visualizar Laudo <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 text-center">
                                <p className="text-slate-400 font-bold italic">Sem certificados disponíveis.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'usuarios': return (
                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-12 text-center">
                    <Users size={64} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-[#1a4731] uppercase italic tracking-tighter mb-2">Gestão de Usuários</h3>
                    <p className="text-slate-400 font-medium">Módulo de controle de parceiros e seguradoras em sincronização.</p>
                </div>
            );
            case 'configuracoes': return (
                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-12">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-slate-50 text-[#1a4731] rounded-2xl flex items-center justify-center">
                            <Settings2 size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-[#1a4731] uppercase italic tracking-tighter">System Config</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <ConfigField label="Nome da Empresa" value="ROCHA & CASTELO BRANCO LTDA" />
                        <ConfigField label="CNPJ" value="09.055.117/0001-47" />
                        <ConfigField label="Ano Fiscal" value="2025" />
                        <ConfigField label="Versão do Sistema" value="Premium 2.4.0" />
                    </div>
                </div>
            );
            default: return null;
        }
    }
}

function SidebarButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-[#8ec448] text-white shadow-xl shadow-[#8ec448]/20 scale-[1.02]' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
        >
            <Icon size={20} className={active ? 'text-white' : 'text-[#8ec448]'} />
            <span className="font-black text-xs uppercase tracking-[0.2em]">{label}</span>
        </button>
    );
}

function StatCard({ label, value, icon: Icon, sub, color, bg }: any) {
    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:shadow-2xl hover:border-[#8ec448]/30 transition-all duration-500 relative overflow-hidden">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 ${bg} ${color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <Icon size={30} />
            </div>
            <div className="space-y-2 relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
                <h3 className="text-5xl font-black text-[#1a4731] italic tracking-tighter">{value}</h3>
                <p className="text-slate-300 text-[10px] font-bold uppercase italic mt-4">{sub}</p>
            </div>
            <Icon className="absolute -right-4 -bottom-4 w-40 h-40 text-slate-50 opacity-50 pointer-events-none transition-all group-hover:scale-110 group-hover:text-[#8ec448]/5" />
        </div>
    );
}

function HealthItem({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#8ec448]/20 transition-all group">
            <div className="flex items-center gap-4">
                <Icon size={20} className="text-slate-400 group-hover:text-[#8ec448] transition-colors" />
                <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{label}</span>
            </div>
            <span className={`text-sm font-black ${color}`}>{value}</span>
        </div>
    );
}

function ConfigField({ label, value }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a4731] uppercase tracking-tight">{value}</div>
        </div>
    );
}

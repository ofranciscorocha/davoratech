'use client';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Calendar, Users, Cake, BarChart3, Settings,
    PlusCircle, Mail, MessageCircle, CheckCircle2, Clock, Send,
    Smartphone, ArrowUpDown, UserPlus, Upload, Trash2, Search, X
} from 'lucide-react';
import './marketing.css';

/* Ported Marketing Hub from original PatioMarketingHub */
export default function MarketingPage() {
    const [activePage, setActivePage] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial data fetch would go here
        setLoading(false);
    }, []);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Agendamentos', icon: Calendar },
        { id: 'contacts', label: 'Contatos', icon: Users },
        { id: 'birthdays', label: 'Aniversários', icon: Cake },
        { id: 'reports', label: 'Relatórios', icon: BarChart3 },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div id="marketing-root" className="min-h-screen flex flex-col md:flex-row overflow-hidden h-screen font-sans">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 w-72 sidebar-marketing flex flex-col shadow-2xl z-50 transition-transform duration-300 transform
        md:relative md:translate-x-0 md:w-64 md:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-black text-white leading-tight">ROCHA</h1>
                    <p className="text-[11px] text-marketing-gold font-semibold tracking-wider uppercase">Marketing Hub</p>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 mt-4">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all ${activePage === item.id
                                ? 'nav-item-active shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                        <p className="text-[10px] font-black text-marketing-gold uppercase tracking-widest opacity-80">Base de Contatos</p>
                        <p className="text-3xl font-black text-white mt-1.5">0</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">0 grupos ativos</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 overflow-y-auto relative">
                {activePage === 'dashboard' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">Dashboard</h2>
                                <p className="text-gray-500 font-medium mt-1">Bem-vindo ao centro de comando Rocha</p>
                            </div>
                            <button className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-teal-700 flex items-center justify-center gap-3 shadow-xl shadow-teal-100 transition-all">
                                <PlusCircle className="w-6 h-6" /> Nova Campanha
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-600 p-6 rounded-2xl text-white card-stat">
                                <Mail className="w-8 h-8 opacity-80" />
                                <p className="text-3xl font-black mt-3">0</p>
                                <p className="text-sm opacity-90">Emails</p>
                            </div>
                            <div className="bg-emerald-600 p-6 rounded-2xl text-white card-stat">
                                <MessageCircle className="w-8 h-8 opacity-80" />
                                <p className="text-3xl font-black mt-3">0</p>
                                <p className="text-sm opacity-90">WhatsApp</p>
                            </div>
                            <div className="bg-amber-600 p-6 rounded-2xl text-white card-stat">
                                <CheckCircle2 className="w-8 h-8 opacity-80" />
                                <p className="text-3xl font-black mt-3">0</p>
                                <p className="text-sm opacity-90">Concluídas</p>
                            </div>
                            <div className="bg-purple-600 p-6 rounded-2xl text-white card-stat">
                                <Clock className="w-8 h-8 opacity-80" />
                                <p className="text-3xl font-black mt-3">0</p>
                                <p className="text-sm opacity-90">Agendadas</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

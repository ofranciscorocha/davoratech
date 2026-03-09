'use client';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Calendar, Users, Cake, BarChart3, Settings,
    PlusCircle, Mail, MessageCircle, CheckCircle2, Clock, Send,
    Smartphone, ArrowUpDown, UserPlus, Upload, Trash2, Search, X,
    Menu,
    ChevronRight,
    Loader2,
    Save
} from 'lucide-react';
import axios from 'axios';
import './marketing.css';

// Import ported components
import { CampaignWizard } from '@/components/marketing/CampaignWizard';
import { ImportWizard } from '@/components/marketing/ImportWizard';
import { ContactForm } from '@/components/marketing/ContactForm';
import { CampaignManager } from '@/components/marketing/CampaignManager';
import { BirthdayCampaigns } from '@/components/marketing/BirthdayCampaigns';
import { DeliveryReports } from '@/components/marketing/DeliveryReports';
import { MarketingSettings } from '@/components/marketing/MarketingSettings';

const API_BASE = '/api/marketing';
const CONTACTS_PER_PAGE = 15;

export default function MarketingPage() {
    const [activePage, setActivePage] = useState('dashboard');
    const [showCampaignWizard, setShowCampaignWizard] = useState(false);
    const [reusingCampaign, setReusingCampaign] = useState<any>(null);
    const [showImportWizard, setShowImportWizard] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [filterPersonType, setFilterPersonType] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'city' | 'state' | 'birthDate' | 'personType'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [contactsPage, setContactsPage] = useState(0);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [campaignRes, contactRes, groupRes] = await Promise.all([
                axios.get(`${API_BASE}/campaigns`),
                axios.get(`${API_BASE}/contacts`),
                axios.get(`${API_BASE}/groups`),
            ]);
            if (Array.isArray(campaignRes.data)) setCampaigns(campaignRes.data);
            if (Array.isArray(contactRes.data)) setContacts(contactRes.data);
            if (Array.isArray(groupRes.data)) setGroups(groupRes.data);
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenWizard = (data: any = null) => {
        setReusingCampaign(data);
        setShowCampaignWizard(true);
    };

    const handleCloseWizard = () => {
        setShowCampaignWizard(false);
        setReusingCampaign(null);
    };

    const deleteContact = async (id: number) => {
        if (!confirm('Excluir este contato?')) return;
        try {
            await axios.delete(`${API_BASE}/contacts/${id}`);
            fetchData();
        } catch (e) { alert('Erro ao excluir'); }
    };

    const createGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            await axios.post(`${API_BASE}/groups`, { name: newGroupName });
            setNewGroupName('');
            fetchData();
        } catch (e) { alert('Erro ao criar grupo'); }
    };

    const deleteGroup = async (id: number) => {
        if (!confirm('Excluir grupo?')) return;
        try {
            await axios.delete(`${API_BASE}/groups/${id}`);
            fetchData();
        } catch (e) { alert('Erro ao excluir grupo'); }
    };

    // Stats
    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
    const safeContacts = Array.isArray(contacts) ? contacts : [];
    const safeGroups = Array.isArray(groups) ? groups : [];

    const emailCampaigns = safeCampaigns.filter(c => c.type === 'email');
    const whatsappCampaigns = safeCampaigns.filter(c => c.type === 'whatsapp');
    const completedCampaigns = safeCampaigns.filter(c => c.status === 'completed' || c.status === 'sent');
    const scheduledCampaigns = safeCampaigns.filter(c => c.status === 'scheduled');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Agendamentos', icon: Calendar },
        { id: 'contacts', label: 'Contatos', icon: Users },
        { id: 'birthdays', label: 'Aniversários', icon: Cake },
        { id: 'reports', label: 'Relatórios', icon: BarChart3 },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div id="marketing-root" className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Top Bar */}
            <div className="md:hidden bg-[#0a192f] p-4 flex items-center justify-between border-b border-white/10 z-50 shrink-0">
                <div>
                    <h1 className="text-lg font-black text-white leading-tight uppercase">ROCHA</h1>
                    <p className="text-[9px] text-[#c5a059] font-semibold tracking-wider uppercase">Marketing Hub</p>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#0a192f] to-[#112240] flex flex-col shadow-2xl z-50 transition-transform duration-300 transform
                md:relative md:translate-x-0 md:w-64 md:z-auto md:h-screen
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/10 hidden md:block">
                    <h1 className="text-2xl font-black text-white leading-tight uppercase">ROCHA</h1>
                    <p className="text-[11px] text-[#c5a059] font-semibold tracking-wider uppercase">Marketing Hub</p>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 mt-4">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActivePage(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all ${activePage === item.id
                                ? 'bg-[#c5a059] text-[#0a192f] shadow-lg shadow-[#c5a059]/10'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activePage === item.id ? 'stroke-[3px]' : ''}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                        <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest opacity-80">Base de Contatos</p>
                        <p className="text-3xl font-black text-white mt-1.5">{safeContacts.length.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{safeGroups.length} grupos ativos</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-gray-50 text-gray-900">
                {activePage === 'dashboard' && (
                    <div className="space-y-8 relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.04 }}>
                            <div className="animate-marquee-scroll whitespace-nowrap text-[120px] font-black text-[#0a192f] absolute top-[30%]">
                                ROCHINHA É O CARA &nbsp;&nbsp;&nbsp; ROCHINHA É O CARA &nbsp;&nbsp;&nbsp; ROCHINHA É O CARA
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">Dashboard</h2>
                                <p className="text-gray-500 font-medium mt-1">Bem-vindo ao centro de comando Rocha</p>
                            </div>
                            <button
                                onClick={() => handleOpenWizard()}
                                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-4 rounded-2xl font-black hover:from-teal-700 hover:to-teal-600 flex items-center justify-center gap-3 shadow-xl shadow-teal-200 transition-all hover:scale-[1.03] active:scale-[0.97]"
                            >
                                <PlusCircle className="w-6 h-6" /> Nova Campanha
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 overflow-hidden group hover:shadow-xl transition-all">
                                <Mail className="w-8 h-8 text-white/80" />
                                <p className="text-3xl font-black text-white mt-3">{emailCampaigns.length}</p>
                                <p className="text-sm text-blue-100 font-medium">Emails</p>
                            </div>
                            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg shadow-green-200 overflow-hidden group hover:shadow-xl transition-all">
                                <MessageCircle className="w-8 h-8 text-white/80" />
                                <p className="text-3xl font-black text-white mt-3">{whatsappCampaigns.length}</p>
                                <p className="text-sm text-green-100 font-medium">WhatsApp</p>
                            </div>
                            <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl shadow-lg shadow-amber-200 overflow-hidden group hover:shadow-xl transition-all">
                                <CheckCircle2 className="w-8 h-8 text-white/80" />
                                <p className="text-3xl font-black text-white mt-3">{completedCampaigns.length}</p>
                                <p className="text-sm text-amber-100 font-medium">Concluídas</p>
                            </div>
                            <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-2xl shadow-lg shadow-violet-200 overflow-hidden group hover:shadow-xl transition-all">
                                <Clock className="w-8 h-8 text-white/80" />
                                <p className="text-3xl font-black text-white mt-3">{scheduledCampaigns.length}</p>
                                <p className="text-sm text-violet-100 font-medium">Agendadas</p>
                            </div>
                        </div>

                        {/* Quick Actions + Recent Campaigns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800">Ações Rápidas</h3>
                                <button onClick={() => handleOpenWizard({ type: 'email' })} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"><Mail className="w-6 h-6 text-blue-600" /></div>
                                    <div className="text-left font-bold text-gray-800">Enviar Email</div>
                                </button>
                                <button onClick={() => handleOpenWizard({ type: 'whatsapp' })} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"><MessageCircle className="w-6 h-6 text-green-600" /></div>
                                    <div className="text-left font-bold text-gray-800">Enviar WhatsApp</div>
                                </button>
                                <button onClick={() => setActivePage('contacts')} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"><Users className="w-6 h-6 text-teal-600" /></div>
                                    <div className="text-left font-bold text-gray-800">Gerenciar Contatos</div>
                                </button>
                            </div>

                            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800">Campanhas Recentes</h3>
                                </div>
                                <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                                    {safeCampaigns.length === 0 ? (
                                        <p className="p-10 text-center text-gray-400 font-medium">Nenhuma campanha criada ainda</p>
                                    ) : (
                                        safeCampaigns.slice(-8).reverse().map(c => (
                                            <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                                    {c.type === 'email' ? <Mail className="w-5 h-5 text-blue-600" /> : <MessageCircle className="w-5 h-5 text-green-600" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 truncate">{c.name}</p>
                                                    <p className="text-xs text-gray-500">{c.type?.toUpperCase()} • {c.recipient || 'Grupo'}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'completed' || c.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {c.status === 'completed' || c.status === 'sent' ? 'Enviada' : c.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'campaigns' && <CampaignManager onReuse={handleOpenWizard} />}

                {activePage === 'contacts' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-4xl font-black text-gray-900 leading-tight">Contatos</h2>
                            <div className="flex gap-3 w-full sm:w-auto cursor-pointer">
                                <button onClick={() => setShowContactForm(true)} className="flex-1 bg-teal-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-teal-700 flex items-center justify-center gap-3 shadow-lg shadow-teal-200">
                                    <UserPlus className="w-6 h-6" /> Novo Contato
                                </button>
                                <button onClick={() => setShowImportWizard(true)} className="flex-1 bg-white text-teal-700 border-2 border-teal-200 px-6 py-4 rounded-2xl font-black hover:bg-teal-50 flex items-center justify-center gap-3">
                                    <Upload className="w-6 h-6" /> Importar
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">📁 Grupos / Pastas</h3>
                            <div className="flex gap-4 mb-8">
                                <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Nome do novo grupo..." className="flex-1 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all" />
                                <button onClick={createGroup} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg">Criar Grupo</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {safeGroups.map(g => (
                                    <div key={g.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between group hover:border-teal-200 transition-all">
                                        <div>
                                            <p className="font-black text-gray-900">{g.name}</p>
                                            <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{safeContacts.filter(c => c.groupId === g.id).length} contatos</p>
                                        </div>
                                        <button onClick={() => deleteGroup(g.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-5 bg-gray-50/50 border-b border-gray-50 flex flex-wrap gap-3">
                                <div className="flex-1 min-w-[200px] relative">
                                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input type="text" placeholder="Buscar por nome..." value={searchName} onChange={e => { setSearchName(e.target.value); setContactsPage(0); }} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                                <select value={filterGroup} onChange={e => { setFilterGroup(e.target.value); setContactsPage(0); }} className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                                    <option value="">Todos os Grupos</option>
                                    {safeGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">NOME</th>
                                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">TELEFONE</th>
                                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">EMAIL</th>
                                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">AÇÕES</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {safeContacts.filter(c => {
                                            if (searchName && !c.name?.toLowerCase().includes(searchName.toLowerCase())) return false;
                                            if (filterGroup && String(c.groupId) !== filterGroup) return false;
                                            return true;
                                        }).slice(contactsPage * CONTACTS_PER_PAGE, (contactsPage + 1) * CONTACTS_PER_PAGE).map(c => (
                                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 text-sm font-bold text-gray-800">{c.name}</td>
                                                <td className="px-5 py-3 text-sm text-gray-500">{c.phone || '-'}</td>
                                                <td className="px-5 py-3 text-sm text-gray-500">{c.email || '-'}</td>
                                                <td className="px-5 py-3">
                                                    <button onClick={() => deleteContact(c.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'birthdays' && <BirthdayCampaigns />}
                {activePage === 'reports' && <DeliveryReports />}
                {activePage === 'settings' && <MarketingSettings />}
            </main>

            {/* Modals */}
            {showCampaignWizard && <CampaignWizard initialData={reusingCampaign} onClose={handleCloseWizard} onSuccess={() => { handleCloseWizard(); fetchData(); }} />}
            {showImportWizard && <ImportWizard onClose={() => setShowImportWizard(false)} onSuccess={() => { setShowImportWizard(false); fetchData(); }} />}
            {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} onSuccess={() => { setShowContactForm(false); fetchData(); }} />}
        </div>
    );
}

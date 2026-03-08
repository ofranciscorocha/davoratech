'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="11" width="7" height="10" /><rect x="3" y="15" width="7" height="6" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    simulator: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20" /><path d="M5 20V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12" /><circle cx="12" cy="12" r="3" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    followup: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
};

const NAV_ITEMS = [
    { label: 'Painel Geral', icon: ICONS.dashboard, path: '/zap/dashboard' },
    { label: 'Central de Mensagens', icon: ICONS.conversations, path: '/zap/conversations' },
    { label: 'Gestão de Contatos', icon: ICONS.contacts, path: '/zap/contacts' },
    { label: 'Base de Conhecimento', icon: ICONS.knowledge, path: '/zap/knowledge' },
    { label: 'Agentes Estratégicos', icon: ICONS.agents, path: '/zap/agents' },
    { label: 'Simulador de Atendimento', icon: ICONS.simulator, path: '/zap/simulator' },
    { label: 'Agenda Corporativa', icon: ICONS.scheduling, path: '/zap/scheduling' },
    { label: 'Follow-Up', icon: ICONS.followup, path: '/zap/followup' },
    { label: 'Instagram (Em Breve)', icon: ICONS.instagram, path: '#', disabled: true },
    { label: 'Configurações Avançadas', icon: ICONS.settings, path: '/zap/settings' },
];

export default function Sidebar({ stats }: any) {
    const pathname = usePathname();
    const router = useRouter();
    const [whatsappStatus, setWhatsappStatus] = useState('disconnected');
    const [botName, setBotName] = useState('ROCHA ZAP');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/zap/whatsapp/status');
                const data = await res.json();
                setWhatsappStatus(data.status || 'disconnected');
            } catch (e) {
                setWhatsappStatus('disconnected');
            }
        };

        const fetchWhiteLabel = async () => {
            try {
                const res = await fetch('/api/zap/settings');
                const data = await res.json();
                const nameSetting = data.settings?.find((s: any) => s.key === 'system_name');
                if (nameSetting?.value) setBotName(nameSetting.value);
            } catch (e) {
                console.error('Error fetching white label settings:', e);
            }
        };

        checkStatus();
        fetchWhiteLabel();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const statusLabel: any = {
        connected: 'Operacional',
        disconnected: 'Inativo',
        qr_ready: 'Aguardando QR',
        initializing: 'Inicializando...',
        authenticated: 'Autenticado',
        auth_failed: 'Falha na Auth',
        error: 'Erro de Sistema',
    };

    const statusClass = whatsappStatus === 'connected' ? 'bg-green-500' :
        ['initializing', 'qr_ready', 'authenticated'].includes(whatsappStatus) ? 'bg-amber-500' : 'bg-red-500';

    return (
        <aside className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-8 flex items-center gap-4">
                <div className="text-teal-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                </div>
                <h2 className="text-xl font-black text-white">{botName}</h2>
            </div>

            <div className="px-6 mb-8">
                <div className="bg-gray-900/50 p-4 rounded-2xl flex items-center gap-4 border border-gray-700">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-black">R</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Corporativo Rocha</span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Administrador</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Navegação Estratégica</div>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.path}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${pathname === item.path
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                        onClick={() => !item.disabled && router.push(item.path)}
                    >
                        <span className={`icon ${pathname === item.path ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-700">
                <div className="flex items-center gap-3 px-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusClass} animate-pulse`}></span>
                    <span className="text-xs font-bold text-gray-400">Status: {statusLabel[whatsappStatus] || statusLabel.error}</span>
                </div>
            </div>
        </aside>
    );
}

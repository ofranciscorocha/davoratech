'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="11" width="7" height="10" /><rect x="3" y="15" width="7" height="6" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
};

const MENU_ITEMS = [
    { label: 'Dashboard', icon: ICONS.dashboard, path: '/zap/dashboard' },
    { label: 'Conversas', icon: ICONS.conversations, path: '/zap/conversations', badge: '12+' },
    { label: 'Contatos', icon: ICONS.contacts, path: '/zap/contacts' },
    { label: 'Agendas', icon: ICONS.scheduling, path: '/zap/scheduling' },
];

const ANALYTICS_ITEMS = [
    { label: 'Conhecimento', icon: ICONS.knowledge, path: '/zap/knowledge' },
    { label: 'Agentes IA', icon: ICONS.agents, path: '/zap/agents' },
];

const GENERAL_ITEMS = [
    { label: 'Configurações', icon: ICONS.settings, path: '/zap/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [botName, setBotName] = useState('ROCHA ZAP');

    useEffect(() => {
        const fetchWhiteLabel = async () => {
            try {
                const res = await fetch('/api/zap/settings');
                const data = await res.json();
                const nameSetting = data.settings?.find((s: any) => s.key === 'system_name');
                if (nameSetting?.value) setBotName(nameSetting.value);
            } catch (e) { }
        };
        fetchWhiteLabel();
    }, []);

    const NavItem = ({ item }: { item: any }) => (
        <div
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
        >
            <span className="icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
                <span style={{ fontSize: '10px', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    {item.badge}
                </span>
            )}
        </div>
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    <h2>{botName.split(' ')[0]}<span style={{ opacity: 0.6 }}>{botName.split(' ')[1]}</span></h2>
                </div>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto' }}>
                <div className="nav-section-label">MENU</div>
                {MENU_ITEMS.map(item => <NavItem key={item.path} item={item} />)}

                <div className="nav-section-label">ESTRATÉGIA</div>
                {ANALYTICS_ITEMS.map(item => <NavItem key={item.path} item={item} />)}

                <div className="nav-section-label">GERAL</div>
                {GENERAL_ITEMS.map(item => <NavItem key={item.path} item={item} />)}
                <div className="nav-item" style={{ marginTop: 'auto', color: 'var(--trend-down)', opacity: 0.7 }}>
                    <span className="icon">{ICONS.logout}</span>
                    <span>Sair do Sistema</span>
                </div>
            </nav>

            <div className="sidebar-support-card">
                <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>Rocha Business Hub</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
                    Acesse o ecossistema completo de gestão corporativa.
                </p>
                <button
                    onClick={() => router.push('/')}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                    Voltar ao Hub
                </button>
            </div>
        </aside >
    );
}

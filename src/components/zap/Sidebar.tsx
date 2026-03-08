'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="11" width="7" height="10" /><rect x="3" y="15" width="7" height="6" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
};

const SECTIONS = [
    {
        label: 'MENU',
        items: [
            { label: 'Dashboard', icon: ICONS.dashboard, path: '/zap/dashboard' },
            { label: 'Conversas', icon: ICONS.conversations, path: '/zap/conversations', badge: '12+' },
            { label: 'Contatos', icon: ICONS.contacts, path: '/zap/contacts' },
            { label: 'Agendas', icon: ICONS.scheduling, path: '/zap/scheduling' },
        ]
    },
    {
        label: 'ESTRATEGIA',
        items: [
            { label: 'Conhecimento', icon: ICONS.knowledge, path: '/zap/knowledge' },
            { label: 'Agentes IA', icon: ICONS.agents, path: '/zap/agents' },
        ]
    },
    {
        label: 'GERAL',
        items: [
            { label: 'Configurações', icon: ICONS.settings, path: '/zap/settings' },
        ]
    }
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
            <span className="label-text">{item.label}</span>
            {item.badge && (
                <span className="nav-badge">{item.badge}</span>
            )}
        </div>
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                </div>
                <h2>{botName.split(' ')[0]}<span className="accent">{botName.split(' ').slice(1).join(' ')}</span></h2>
            </div>

            <nav className="sidebar-nav">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="nav-section">
                        <div className="nav-section-label">{section.label}</div>
                        {section.items.map(item => <NavItem key={item.path} item={item} />)}
                    </div>
                ))}

                <div className="logout-container">
                    <div className="nav-item logout-btn">
                        <span className="icon">{ICONS.logout}</span>
                        <span>Sair do Sistema</span>
                    </div>
                </div>
            </nav>

            <div className="support-card-wrapper">
                <div className="support-card">
                    <h4>Rocha Business Hub</h4>
                    <p>Acesse o ecossistema completo de gestão corporativa.</p>
                    <button onClick={() => router.push('/')}>Voltar ao Hub</button>
                </div>
            </div>

            <style jsx>{`
                .sidebar {
                    background: var(--bg-primary);
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid var(--border-color);
                }
                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 32px 24px;
                    border-bottom: 1px solid var(--border-color);
                }
                .logo-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--gold-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    box-shadow: 0 8px 16px rgba(201, 160, 91, 0.2);
                }
                .sidebar-logo h2 {
                    font-size: 1.1rem;
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -0.5px;
                    margin: 0;
                }
                .sidebar-logo .accent { opacity: 0.6; font-weight: 500; }

                .sidebar-nav {
                    padding: 16px;
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .nav-section { margin-bottom: 24px; }
                .nav-section-label {
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    padding: 12px;
                    letter-spacing: 0.15em;
                }

                .nav-item {
                    height: 48px;
                    padding: 0 12px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-primary);
                }
                .nav-item.active {
                    background: var(--bg-tertiary);
                    color: var(--gold-primary);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                .nav-item.active .icon { color: var(--gold-primary); }
                .nav-badge {
                    font-size: 0.65rem;
                    background: var(--bg-tertiary);
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-weight: 800;
                    color: var(--gold-primary);
                    border: 1px solid var(--border-color);
                }

                .logout-container { margin-top: auto; padding-top: 20px; }
                .logout-btn { color: #f87171; opacity: 0.8; }
                .logout-btn:hover { background: rgba(248, 113, 113, 0.05); opacity: 1; }

                .support-card-wrapper { padding: 16px; }
                .support-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 20px;
                    text-align: center;
                }
                .support-card h4 { font-size: 0.85rem; font-weight: 800; margin: 0 0 8px; color: #fff; }
                .support-card p { font-size: 0.75rem; color: var(--text-muted); margin: 0 0 16px; line-height: 1.4; }
                .support-card button {
                    width: 100%;
                    padding: 10px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .support-card button:hover { background: var(--bg-tertiary); border-color: var(--gold-primary); }
            `}</style>
        </aside>
    );
}

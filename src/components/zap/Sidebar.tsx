'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
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
        label: 'ESTRATÉGIA',
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

    const NavItem = ({ item }: { item: any }) => (
        <div
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
        >
            <div className="icon-wrapper">
                {item.icon}
            </div>
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" />
                    </svg>
                </div>
                <h2>ROCHA<span className="accent">ZAP</span></h2>
            </div>

            <nav className="sidebar-nav">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="nav-section">
                        <div className="nav-section-label">{section.label}</div>
                        {section.items.map(item => <NavItem key={item.path} item={item} />)}
                    </div>
                ))}

                <div className="nav-item logout-btn" style={{ marginTop: 'auto', marginBottom: '40px' }}>
                    <div className="icon-wrapper">
                        {ICONS.logout}
                    </div>
                    <span>Sair do Sistema</span>
                </div>
            </nav>

            <style jsx>{`
                .sidebar {
                    background: #040813;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid var(--border-color);
                    width: 280px;
                }
                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 40px 32px 30px;
                }
                .logo-box {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: #facc15;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    flex-shrink: 0;
                    box-shadow: 0 8px 16px rgba(250, 204, 21, 0.2);
                }
                .sidebar-logo h2 {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -1.2px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                }
                .sidebar-logo .accent {
                    color: #64748b;
                }

                .sidebar-nav {
                    padding: 0 16px;
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                
                /* Custom Scrollbar matching image */
                .sidebar-nav::-webkit-scrollbar {
                    width: 8px;
                }
                .sidebar-nav::-webkit-scrollbar-track {
                    background: #ffffff;
                    border-radius: 0;
                }
                .sidebar-nav::-webkit-scrollbar-thumb {
                    background: #64748b;
                    border-radius: 10px;
                    border: 2px solid #ffffff;
                }

                .nav-section { margin-bottom: 24px; }
                .nav-section-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #516281;
                    padding: 0 16px 16px;
                    letter-spacing: 0.15em;
                }

                .nav-item {
                    height: 52px;
                    padding: 0 12px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 4px;
                }
                .nav-item:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.03);
                }
                .nav-item.active {
                    color: #ffffff;
                    background: #101931;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                
                .icon-wrapper {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: inherit;
                    transition: all 0.2s ease;
                }
                .nav-item.active .icon-wrapper {
                    background: rgba(250, 204, 21, 0.1);
                    border-color: rgba(250, 204, 21, 0.15);
                    color: #facc15;
                }
                .nav-item:hover .icon-wrapper {
                    background: rgba(255, 255, 255, 0.08);
                }

                .label-text { flex: 1; }
                
                .nav-badge {
                    font-size: 0.7rem;
                    background: #141f36;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-weight: 800;
                    color: #4c77c6;
                    border: 1px solid rgba(76, 119, 198, 0.2);
                }

                .logout-btn { color: #f87171 !important; opacity: 0.8; }
                .logout-btn .icon-wrapper { border-color: rgba(248, 113, 113, 0.15); }
                .logout-btn:hover { opacity: 1; background: rgba(248, 113, 113, 0.05); }

                @media (max-width: 1024px) {
                    .sidebar { display: none; }
                }
            `}</style>
        </aside>
    );
}

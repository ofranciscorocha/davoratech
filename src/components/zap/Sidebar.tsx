'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
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

    return (
        <aside className="sidebar-premium">
            <div className="sidebar-logo">
                <div className="logo-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <h2>ROCHA<span>ZAP</span></h2>
            </div>

            <nav className="nav-container">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="nav-group">
                        <div className="group-label">{section.label}</div>
                        <div className="group-items">
                            {section.items.map(item => (
                                <div
                                    key={item.path}
                                    className={`nav-rectangle ${pathname === item.path ? 'active' : ''}`}
                                    onClick={() => router.push(item.path)}
                                >
                                    <div className="icon-box">
                                        {item.icon}
                                    </div>
                                    <span className="nav-text">{item.label}</span>
                                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="logout-area">
                <div className="nav-rectangle logout" onClick={() => console.log('logout')}>
                    <div className="icon-box">
                        {ICONS.logout}
                    </div>
                    <span className="nav-text">Sair do Sistema</span>
                </div>
            </div>

            <style jsx>{`
                .sidebar-premium {
                    width: 280px;
                    height: 100vh;
                    background: #040813;
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .sidebar-logo {
                    padding: 40px 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .logo-box {
                    width: 44px;
                    height: 44px;
                    background: #facc15;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    box-shadow: 0 8px 16px rgba(250, 204, 21, 0.2);
                }

                .sidebar-logo h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -1px;
                    margin: 0;
                }

                .sidebar-logo span {
                    color: #64748b;
                }

                .nav-container {
                    flex: 1;
                    padding: 0 16px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: #1e293b transparent;
                }

                .nav-container::-webkit-scrollbar { width: 4px; }
                .nav-container::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }

                .nav-group {
                    margin-bottom: 32px;
                }

                .group-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #334155;
                    padding: 0 12px 16px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .group-items {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .nav-rectangle {
                    height: 52px;
                    padding: 0 12px;
                    border-radius: 14px;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    border: 1px solid transparent;
                    position: relative;
                }

                .nav-rectangle:hover {
                    background: rgba(255, 255, 255, 0.03);
                    border-color: rgba(255, 255, 255, 0.05);
                }

                .nav-rectangle.active {
                    background: rgba(250, 204, 21, 0.05);
                    border-color: rgba(250, 204, 21, 0.1);
                }

                .icon-box {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #475569;
                    transition: all 0.25s ease;
                }

                .nav-rectangle:hover .icon-box {
                    color: #94a3b8;
                    border-color: rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                }

                .nav-rectangle.active .icon-box {
                    background: rgba(250, 204, 21, 0.15);
                    border-color: rgba(250, 204, 21, 0.2);
                    color: #facc15;
                    box-shadow: 0 0 15px rgba(250, 204, 21, 0.1);
                }

                .nav-text {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #64748b;
                    flex: 1;
                    transition: all 0.25s ease;
                }

                .nav-rectangle:hover .nav-text,
                .nav-rectangle.active .nav-text {
                    color: #f8fafc;
                }

                .nav-badge {
                    font-size: 0.7rem;
                    font-weight: 800;
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .logout-area {
                    padding: 24px 16px 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.04);
                }

                .nav-rectangle.logout {
                    color: #ef4444;
                }

                .nav-rectangle.logout .icon-box {
                    color: #ef4444;
                    opacity: 0.7;
                    border-color: rgba(239, 68, 68, 0.1);
                }

                .nav-rectangle.logout:hover {
                    background: rgba(239, 68, 68, 0.05);
                    border-color: rgba(239, 68, 68, 0.1);
                }

                .nav-rectangle.logout:hover .nav-text {
                    color: #ef4444;
                    opacity: 1;
                }

                @media (max-width: 1024px) {
                    .sidebar-premium { transform: translateX(-100%); width: 0; padding: 0; overflow: hidden; opacity: 0; visibility: hidden; }
                }
            `}</style>
        </aside>
    );
}

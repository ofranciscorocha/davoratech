'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const ICONS = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    conversations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    contacts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    knowledge: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /></svg>,
    scheduling: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
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
        <aside className="sidebar-rocha">
            <div className="logo-header">
                <div className="logo-square">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <h2>ROCHA<span>ZAP</span></h2>
            </div>

            <div className="nav-scroller">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="nav-group">
                        <div className="group-title">{section.label}</div>
                        {section.items.map(item => (
                            <div
                                key={item.path}
                                className={`nav-item-rect ${pathname === item.path ? 'active' : ''}`}
                                onClick={() => router.push(item.path)}
                            >
                                <div className="icon-wrap">
                                    {item.icon}
                                </div>
                                <span className="item-label">{item.label}</span>
                                {item.badge && <span className="item-badge">{item.badge}</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="nav-item-rect logout-item">
                    <div className="icon-wrap">
                        {ICONS.logout}
                    </div>
                    <span className="item-label">Sair do Sistema</span>
                </div>
            </div>

            <style jsx>{`
                .sidebar-rocha {
                    width: 280px;
                    height: 100vh;
                    background: #040813;
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                }

                .logo-header {
                    padding: 40px 24px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .logo-square {
                    width: 44px;
                    height: 44px;
                    background: #facc15;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    box-shadow: 0 8px 16px rgba(250, 204, 21, 0.25);
                    flex-shrink: 0;
                }

                .logo-header h2 {
                    font-size: 1.55rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -1.2px;
                    margin: 0;
                }

                .logo-header span {
                    color: #475569;
                    font-weight: 500;
                }

                .nav-scroller {
                    flex: 1;
                    padding: 0 16px;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .nav-scroller::-webkit-scrollbar { display: none; }

                .nav-group {
                    margin-bottom: 30px;
                }

                .group-title {
                    font-size: 0.68rem;
                    font-weight: 800;
                    color: #334155;
                    padding: 0 12px 14px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .nav-item-rect {
                    height: 50px;
                    padding: 0 12px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    cursor: pointer;
                    margin-bottom: 6px;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }

                .nav-item-rect:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.05);
                }

                .nav-item-rect.active {
                    background: #101931;
                    border-color: rgba(250, 204, 21, 0.15);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .icon-wrap {
                    width: 34px;
                    height: 34px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #475569;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .nav-item-rect:hover .icon-wrap {
                    color: #94a3b8;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .nav-item-rect.active .icon-wrap {
                    background: rgba(250, 204, 21, 0.1);
                    border-color: rgba(250, 204, 21, 0.2);
                    color: #facc15;
                    box-shadow: 0 0 15px rgba(250, 204, 21, 0.1);
                }

                .item-label {
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: #64748b;
                    flex: 1;
                    transition: all 0.2s ease;
                }

                .nav-item-rect:hover .item-label,
                .nav-item-rect.active .item-label {
                    color: #fff;
                }

                .item-badge {
                    font-size: 0.68rem;
                    font-weight: 800;
                    background: #1e293b;
                    color: #3b82f6;
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .sidebar-footer {
                    padding: 24px 16px 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.04);
                }

                .logout-item {
                    color: #f87171;
                }
                .logout-item .icon-wrap {
                    border-color: rgba(248, 113, 113, 0.1);
                    color: #f87171;
                }
                .logout-item:hover {
                    background: rgba(248, 113, 113, 0.05);
                }

                @media (max-width: 1024px) {
                    .sidebar-rocha { display: none; }
                }
            `}</style>
        </aside>
    );
}

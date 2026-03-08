'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAgents(); }, []);

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/zap/agents');
            const data = await res.json();
            setAgents(data.agents || []);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <MainHeader />
                <div className="dashboard-viewport">
                    <div className="page-header-premium">
                        <div className="header-info">
                            <div className="title-row">
                                <div className="icon-box-premium">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /></svg>
                                </div>
                                <h1>Agentes de IA</h1>
                            </div>
                            <p className="subtitle">Configure e monitore seus especialistas virtuais.</p>
                        </div>
                        <button className="btn-create-premium">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Novo Agente
                        </button>
                    </div>

                    <div className="agent-grid-premium">
                        {loading ? (
                            <div className="loading-state-premium"><div className="spinner-premium"></div></div>
                        ) : agents.length === 0 ? (
                            <div className="empty-card-premium">
                                <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
                                <h3>Nenhum Agente Configurado</h3>
                                <p>Crie seu primeiro especialista para automatizar seu atendimento.</p>
                            </div>
                        ) : (
                            agents.map(agent => (
                                <div key={agent.id} className="agent-card-premium">
                                    <div className="agent-visual">
                                        <div className="agent-avatar-premium">
                                            {agent.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="status-indicator online"></div>
                                    </div>
                                    <div className="agent-content">
                                        <h4>{agent.name}</h4>
                                        <span className="agent-role">{agent.role || 'Assistente Geral'}</span>
                                        <p className="agent-desc">{agent.description || 'Especialista treinado para converter leads e suporte.'}</p>
                                        <div className="agent-stats-row">
                                            <div className="a-stat"><b>1.2k</b> msgs</div>
                                            <div className="a-stat"><b>98%</b> precisão</div>
                                        </div>
                                    </div>
                                    <div className="agent-footer">
                                        <button className="btn-outline-premium">Configurar</button>
                                        <button className="btn-icon-premium"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .agent-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
                    .agent-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 28px;
                        padding: 32px;
                        transition: var(--transition);
                        backdrop-filter: blur(10px);
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        position: relative;
                    }
                    .agent-card-premium:hover { border-color: var(--gold-primary); transform: translateY(-5px); background: var(--bg-card-hover); }
                    
                    .agent-visual { position: relative; width: 64px; }
                    .agent-avatar-premium {
                        width: 64px;
                        height: 64px;
                        background: var(--bg-tertiary);
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        font-weight: 800;
                        color: var(--gold-primary);
                        border: 1px solid var(--border-color);
                    }
                    .status-indicator {
                        position: absolute;
                        bottom: -4px;
                        right: -4px;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 3px solid var(--bg-secondary);
                    }
                    .online { background: #10b981; box-shadow: 0 0 10px #10b981; }

                    .agent-content h4 { font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0 0 4px; }
                    .agent-role { font-size: 0.75rem; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 1px; }
                    .agent-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-top: 12px; }
                    
                    .agent-stats-row { display: flex; gap: 16px; margin-top: 8px; }
                    .a-stat { font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 4px 10px; border-radius: 8px; }

                    .agent-footer { display: flex; gap: 12px; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border-color); }
                    .btn-outline-premium { flex: 1; padding: 12px; border-radius: 12px; background: transparent; border: 1px solid var(--border-color); color: #fff; font-weight: 700; cursor: pointer; transition: var(--transition); }
                    .btn-outline-premium:hover { border-color: var(--gold-primary); color: var(--gold-primary); }
                    .btn-icon-premium { width: 44px; height: 44px; border-radius: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
                    .btn-icon-premium:hover { color: #fff; border-color: var(--text-muted); }
                `}</style>
            </main>
        </div>
    );
}

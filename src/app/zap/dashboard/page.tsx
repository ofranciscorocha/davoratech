'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import StatCard from '@/components/zap/StatCard';

export default function ZapDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await fetch('/api/zap/dashboard');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error('Dashboard fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const stats = data?.stats || {};
    const recentActivity = data?.recentConversations || [];
    const messageVolume = data?.messagesPerDay || [];
    const maxMessages = Math.max(...messageVolume.map((d: any) => d.count), 10);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <MainHeader />

                <div className="dashboard-viewport">
                    <div className="dashboard-title-area">
                        <h1>Dashboard</h1>
                        <p className="subtitle">Planeje, priorize e automatize seu atendimento com facilidade.</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="dashboard-content">
                            {/* STATS GRID */}
                            <div className="stats-grid">
                                <StatCard
                                    label="Interações Mensais"
                                    value={stats.todayMessages || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                                    trend="+14% vs último mês"
                                    isPositive={true}
                                    variant="blue"
                                />
                                <StatCard
                                    label="Conversas Ativas"
                                    value={stats.activeConversations || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>}
                                    trend="Monitoramento 24/7"
                                    isPositive={false}
                                />
                                <StatCard
                                    label="Total de Leads"
                                    value={stats.totalContacts || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                                    trend="+5.2% esta semana"
                                    isPositive={true}
                                />
                                <StatCard
                                    label="Agendas Pendentes"
                                    value={stats.pendingSchedules || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                                    trend="Ação requerida"
                                    isPositive={false}
                                    variant="gold"
                                />
                            </div>

                            <div className="main-charts-row">
                                <div className="card chart-card">
                                    <div className="card-header">
                                        <h3>Análise de Volume</h3>
                                        <p>Fluxo de mensagens nos últimos 7 dias</p>
                                    </div>
                                    <div className="chart-body">
                                        {messageVolume.length > 0 ? (
                                            <div className="bar-chart">
                                                {messageVolume.map((d: any, i: number) => (
                                                    <div key={i} className="bar-column">
                                                        <div
                                                            className={`bar ${i === messageVolume.length - 1 ? 'active' : ''}`}
                                                            style={{ height: `${(d.count / maxMessages) * 100}%` }}
                                                        >
                                                            <div className="bar-tooltip">{d.count} msgs</div>
                                                        </div>
                                                        <span className="bar-label">{d.day.split('-').slice(1).join('/')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-chart">Sem dados suficientes para gerar o gráfico</div>
                                        )}
                                    </div>
                                </div>

                                <div className="card activity-card">
                                    <div className="card-header">
                                        <h3>Atividades Recentes</h3>
                                        <p>Últimos contatos realizados</p>
                                    </div>
                                    <div className="activity-list">
                                        {recentActivity.length > 0 ? (
                                            recentActivity.map((conv: any) => (
                                                <div key={conv.id} className="activity-item">
                                                    <div className="avatar">
                                                        {conv.profile_pic ? (
                                                            <img src={conv.profile_pic} alt="" />
                                                        ) : (
                                                            <span>{(conv.name || conv.phone || '?').charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div className="info">
                                                        <div className="info-top">
                                                            <span className="name">{conv.name || conv.phone}</span>
                                                            <span className="time">Agora</span>
                                                        </div>
                                                        <p className="preview">{conv.last_message || 'Iniciou uma conversa...'}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-list">Nenhuma atividade recente.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .loading-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 400px;
                }
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid rgba(201, 160, 91, 0.1);
                    border-top-color: var(--gold-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .main-charts-row {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 32px;
                }

                .card-header {
                    margin-bottom: 32px;
                }
                .card-header h3 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin: 0 0 6px;
                }
                .card-header p {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .chart-body {
                    height: 280px;
                    display: flex;
                    align-items: flex-end;
                    padding-top: 20px;
                }
                .bar-chart {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    gap: 16px;
                }
                .bar-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    height: 100%;
                    justify-content: flex-end;
                }
                .bar {
                    width: 100%;
                    max-width: 40px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 8px;
                    min-height: 4px;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .bar.active {
                    background: var(--gold-primary);
                    box-shadow: 0 0 20px rgba(201, 160, 91, 0.2);
                }
                .bar:hover {
                    background: rgba(255, 255, 255, 0.2);
                    height: 100% !important; /* Visual effect */
                }
                .bar-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: var(--text-muted);
                }

                .activity-list {
                    display: flex;
                    flex-direction: column;
                }
                .activity-item {
                    display: flex;
                    gap: 16px;
                    padding: 16px 24px;
                    border-bottom: 1px solid var(--border-color);
                    transition: var(--transition);
                }
                .activity-item:last-child { border-bottom: none; }
                .activity-item:hover { background: rgba(255,255,255,0.02); }
                
                .avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: var(--bg-tertiary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: var(--gold-primary);
                    flex-shrink: 0;
                    border: 1px solid var(--border-color);
                }
                .avatar img { width: 100%; height: 100%; border-radius: 12px; object-fit: cover; }
                
                .info { flex: 1; overflow: hidden; }
                .info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                .name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
                .time { font-size: 0.7rem; color: var(--text-muted); }
                .preview { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                @media (max-width: 1280px) {
                    .main-charts-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

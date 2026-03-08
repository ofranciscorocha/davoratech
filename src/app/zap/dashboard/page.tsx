'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import StatCard from '@/components/zap/StatCard';
import '../zap.css';

export default function ZapDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('geral');

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
        } catch (e) { }
        finally { setLoading(false); }
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
                    <div className="page-header-premium">
                        <div className="header-info">
                            <div className="title-row">
                                <div className="icon-box-premium">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                                </div>
                                <h1>Dashboard Executivo</h1>
                            </div>
                            <p className="subtitle">Visão geral da sua operação de atendimento e performance de IA.</p>
                        </div>
                        <button className="btn-create-premium">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Exportar Relatório
                        </button>
                    </div>

                    <div className="filter-container">
                        {[
                            { value: 'geral', label: 'Visão Geral' },
                            { value: 'financeiro', label: 'Performance' },
                            { value: 'operacional', label: 'Operacional' },
                        ].map(tab => (
                            <button
                                key={tab.value}
                                className={`filter-tab ${filter === tab.value ? 'active' : ''}`}
                                onClick={() => setFilter(tab.value)}
                            >
                                {tab.label}
                                {filter === tab.value && <div className="active-dot"></div>}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-state-premium">
                            <div className="spinner-premium"></div>
                        </div>
                    ) : (
                        <div className="dashboard-content">
                            <div className="stats-grid">
                                <StatCard
                                    label="Interações Mensais"
                                    value={stats.todayMessages || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                                    trend="+14% vs último mês"
                                    isPositive={true}
                                />
                                <StatCard
                                    label="Conversas Ativas"
                                    value={stats.activeConversations || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>}
                                    trend="Monitoramento IA"
                                    isPositive={true}
                                />
                                <StatCard
                                    label="Total de Leads"
                                    value={stats.totalContacts || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
                                    trend="+5.2% esta semana"
                                    isPositive={true}
                                />
                                <StatCard
                                    label="Agendas"
                                    value={stats.pendingSchedules || 0}
                                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                                    trend="Pendentes hoje"
                                    isPositive={false}
                                />
                            </div>

                            <div className="main-charts-row">
                                <div className="card chart-card-premium">
                                    <div className="card-header-premium">
                                        <h3>Gráfico de Volume</h3>
                                        <p>Mensagens processadas nos últimos 7 dias</p>
                                    </div>
                                    <div className="chart-body">
                                        <div className="bar-chart-premium">
                                            {messageVolume.map((d: any, i: number) => (
                                                <div key={i} className="bar-column-premium">
                                                    <div
                                                        className={`bar-premium ${i === messageVolume.length - 1 ? 'active' : ''}`}
                                                        style={{ height: `${(d.count / maxMessages) * 100}%` }}
                                                    ></div>
                                                    <span className="bar-label">{d.day.split('-').slice(2).join('/')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card activity-card-premium">
                                    <div className="card-header-premium">
                                        <h3>Atividades IA</h3>
                                        <p>Últimas interações automatizadas</p>
                                    </div>
                                    <div className="activity-list-premium">
                                        {recentActivity.slice(0, 5).map((conv: any) => (
                                            <div key={conv.id} className="activity-item-premium">
                                                <div className="avatar-premium">
                                                    {conv.profile_pic ? <img src={conv.profile_pic} alt="" /> : (conv.name || '?').charAt(0)}
                                                </div>
                                                <div className="act-info">
                                                    <div className="act-top">
                                                        <span className="act-name">{conv.name || conv.phone}</span>
                                                        <span className="act-time">Agora</span>
                                                    </div>
                                                    <p className="preview">{conv.last_message || 'Interagindo...'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .main-charts-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-top: 32px; }
                    .chart-card-premium, .activity-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 28px;
                        padding: 32px;
                        backdrop-filter: blur(10px);
                    }
                    .card-header-premium h3 { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 6px; }
                    .card-header-premium p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 30px; }

                    .chart-body { height: 260px; display: flex; align-items: flex-end; }
                    .bar-chart-premium { display: flex; width: 100%; height: 100%; align-items: flex-end; justify-content: space-between; gap: 12px; }
                    .bar-column-premium { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; height: 100%; justify-content: flex-end; }
                    .bar-premium { width: 100%; max-width: 32px; background: rgba(255,255,255,0.03); border-radius: 8px; transition: var(--transition); border: 1px solid rgba(255,255,255,0.05); }
                    .bar-premium.active { background: var(--gold-primary); box-shadow: 0 5px 20px rgba(250, 204, 21, 0.2); }
                    .bar-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }

                    .activity-list-premium { display: flex; flex-direction: column; gap: 8px; }
                    .activity-item-premium { display: flex; gap: 16px; padding: 12px; border-radius: 16px; transition: var(--transition); border: 1px solid transparent; }
                    .activity-item-premium:hover { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); }
                    .avatar-premium { width: 44px; height: 44px; border-radius: 12px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--gold-primary); border: 1px solid var(--border-color); flex-shrink: 0; }
                    .avatar-premium img { width: 100%; height: 100%; border-radius: 12px; object-fit: cover; }
                    .act-info { flex: 1; overflow: hidden; }
                    .act-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
                    .act-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
                    .act-time { font-size: 0.7rem; color: var(--text-muted); }
                    .preview { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                    @media (max-width: 1200px) { .main-charts-row { grid-template-columns: 1fr; } }
                `}</style>
            </main>
        </div>
    );
}

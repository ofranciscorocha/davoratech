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
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error('Dashboard error:', e);
        } finally {
            setLoading(false);
        }
    };

    const stats = data?.stats || {};
    const maxMessages = Math.max(...(data?.messagesPerDay || [{ count: 1 }]).map((d: any) => d.count), 1);

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
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <StatCard
                                    label="Interações Mensais"
                                    value={stats.todayMessages || 0}
                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                                    trend="+14% vs último mês"
                                    isPositive={true}
                                    variant="blue"
                                />
                                <StatCard
                                    label="Conversas Ativas"
                                    value={stats.activeConversations || 0}
                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>}
                                    trend="Monitoramento em tempo real"
                                    isPositive={false}
                                />
                                <StatCard
                                    label="Total de Leads"
                                    value={stats.totalContacts || 0}
                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                                    trend="+5% crescimento constante"
                                    isPositive={true}
                                />
                                <StatCard
                                    label="Agendas Pendentes"
                                    value={stats.pendingSchedules || 0}
                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                                    trend="Ação requerida"
                                    isPositive={false}
                                    variant="gold"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Análise de Volume</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fluxo de mensagens nos últimos 7 dias</p>
                                    </div>
                                    <div className="chart-container" style={{ display: 'flex', alignItems: 'end', gap: '12px', height: '240px' }}>
                                        {(data?.messagesPerDay || []).map((d: any, i: number) => (
                                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <div
                                                    className="chart-bar"
                                                    style={{ height: `${Math.max((d.count / maxMessages) * 200, 5)}px`, width: '100%', maxWidth: '30px' }}
                                                    title={`${d.day}: ${d.count}`}
                                                ></div>
                                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>{d.day?.slice(5)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div className="card-header" style={{ padding: '24px 24px 0' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Atividades Recentes</h3>
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                        {(data?.recentConversations || []).slice(0, 5).map((conv: any) => (
                                            <div key={conv.id} className="conversation-item" style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
                                                <div className="conversation-avatar" style={{ borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--gold-primary)', width: '38px', height: '38px' }}>
                                                    {(conv.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="conversation-info">
                                                    <div className="name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ color: '#fff' }}>{conv.name || conv.phone}</span>
                                                        <span className={`agent-badge agent-${conv.current_agent || 'success'}`}>
                                                            {conv.current_agent || 'IA'}
                                                        </span>
                                                    </div>
                                                    <div className="preview">{conv.last_message || 'Iniciou contato agora'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <style jsx>{`
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid rgba(201, 160, 91, 0.1);
                    border-top-color: var(--gold-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

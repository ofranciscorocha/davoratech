'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';

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
            <Sidebar stats={stats} />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Visão Estratégica</h1>
                        <p className="subtitle">Análise consolidada de operações e atendimentos</p>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={fetchDashboard}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                        Sincronizar Dados
                    </button>
                </div>

                <div className="page-body">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ color: 'var(--blue-primary)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                    </div>
                                    <div className="stat-value">{stats.todayMessages || 0}</div>
                                    <div className="stat-label">Interações Hoje</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ color: 'var(--primary)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    </div>
                                    <div className="stat-value">{stats.activeConversations || 0}</div>
                                    <div className="stat-label">Conversas em Curso</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ color: 'var(--primary-light)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    </div>
                                    <div className="stat-value">{stats.totalContacts || 0}</div>
                                    <div className="stat-label">Base de Leads</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ color: 'var(--gold-primary)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    </div>
                                    <div className="stat-value">{stats.pendingSchedules || 0}</div>
                                    <div className="stat-label">Agendas Pendentes</div>
                                </div>
                            </div>

                            <div className="grid-2">
                                <div className="card">
                                    <div className="card-header">
                                        <h3>Propagação de Volume (Últimos 7 dias)</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="chart-bar-container" style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '200px', gap: '8px' }}>
                                            {(data?.messagesPerDay || []).map((d: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="chart-bar"
                                                    style={{ height: `${(d.count / maxMessages) * 100}%`, background: 'var(--primary)', flex: 1, borderRadius: '4px 4px 0 0' }}
                                                    title={`${d.day}: ${d.count} mensagens`}
                                                ></div>
                                            ))}
                                            {(!data?.messagesPerDay || data.messagesPerDay.length === 0) && (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', width: '100%' }}>
                                                    Aguardando processamento de dados...
                                                </p>
                                            )}
                                        </div>
                                        <div className="chart-bar-label" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                            {(data?.messagesPerDay || []).map((d: any, i: number) => (
                                                <span key={i} style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>{d.day?.slice(5) || ''}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h3>Monitoramento em Tempo Real</h3>
                                    </div>
                                    <div className="card-body" style={{ padding: 0 }}>
                                        {(data?.recentConversations || []).length === 0 ? (
                                            <div className="empty-state" style={{ padding: '30px', textAlign: 'center' }}>
                                                <p style={{ color: 'var(--text-muted)' }}>Sem atividades registradas no período</p>
                                            </div>
                                        ) : (
                                            data.recentConversations.slice(0, 5).map((conv: any) => (
                                                <div key={conv.id} className="conversation-item" style={{ display: 'flex', gap: '12px', padding: '14px 16px', borderBottom: '1px solid var(--border-color)' }}>
                                                    <div className="conversation-avatar" style={{ background: 'var(--bg-tertiary)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {(conv.name || conv.phone || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="conversation-info" style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="name" style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name || conv.phone}</span>
                                                            <span style={{ fontSize: '10px', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)' }}>
                                                                {conv.current_agent}
                                                            </span>
                                                        </div>
                                                        <div className="preview" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.last_message || 'Sem conteúdo'}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <style jsx>{`
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 300px;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(201, 160, 91, 0.1);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

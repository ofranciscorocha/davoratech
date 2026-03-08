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
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <Sidebar stats={stats} />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-white">Visão Estratégica</h1>
                        <p className="text-gray-400 mt-1">Análise consolidada de operações e atendimentos</p>
                    </div>
                    <button
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-gray-700 transition-colors"
                        onClick={fetchDashboard}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                        Sincronizar Dados
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon="MessageSquare" value={stats.todayMessages || 0} label="Interações Hoje" color="text-blue-500" />
                            <StatCard icon="Users" value={stats.activeConversations || 0} label="Conversas em Curso" color="text-teal-500" />
                            <StatCard icon="Zap" value={stats.totalContacts || 0} label="Base de Leads" color="text-purple-500" />
                            <StatCard icon="Calendar" value={stats.pendingSchedules || 0} label="Agendas Pendentes" color="text-amber-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-lg font-bold mb-6">Propagação de Volume (7 dias)</h3>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {(data?.messagesPerDay || []).map((d: any, i: number) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-teal-500/80 rounded-t-lg transition-all hover:bg-teal-500"
                                                style={{ height: `${(d.count / maxMessages) * 100}%` }}
                                                title={`${d.day}: ${d.count} mensagens`}
                                            ></div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{d.day?.slice(5)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-700">
                                    <h3 className="text-lg font-bold">Monitoramento em Tempo Real</h3>
                                </div>
                                <div className="divide-y divide-gray-700">
                                    {(data?.recentConversations || []).slice(0, 5).map((conv: any) => (
                                        <div key={conv.id} className="p-4 flex items-center gap-4 hover:bg-gray-700/30 transition-colors">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-teal-500 font-bold">
                                                {(conv.name || conv.phone || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold truncate">{conv.name || conv.phone}</span>
                                                    <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full uppercase font-black">
                                                        {conv.current_agent}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{conv.last_message || 'Sem conteúdo'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function StatCard({ icon, value, label, color }: any) {
    return (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className={`mb-4 ${color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon === 'MessageSquare' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
                    {icon === 'Users' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                    {icon === 'Zap' && <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />}
                    {icon === 'Calendar' && (
                        <>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </>
                    )}
                </svg>
            </div>
            <div className="text-3xl font-black text-white">{value}</div>
            <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">{label}</div>
        </div>
    );
}

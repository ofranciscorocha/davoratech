'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function ConversationsPage() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Mock data matching the premium style
        setChats([
            { id: 1, name: 'João Silva', lastMsg: 'Olá, gostaria de saber sobre...', time: '10:30', status: 'active', unread: 2, agent: 'Comercial' },
            { id: 2, name: 'Maria Souza', lastMsg: 'Obrigado pelo atendimento!', time: '09:45', status: 'waiting', unread: 0, agent: 'IA' },
            { id: 3, name: 'Tech Solutions', lastMsg: 'Podemos agendar para amanhã?', time: 'Ontem', status: 'active', unread: 5, agent: 'Suporte' },
        ]);
        setLoading(false);
    }, []);

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
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <h1>Central de Conversas</h1>
                            </div>
                            <p className="subtitle">Gerencie suas interações em tempo real com auxílio da IA.</p>
                        </div>
                        <button className="btn-create-premium">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Nova Conversa
                        </button>
                    </div>

                    <div className="filter-container">
                        {['all', 'waiting', 'active', 'finished'].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' ? 'Todas' : f === 'waiting' ? 'Aguardando' : f === 'active' ? 'Em Aberto' : 'Finalizadas'}
                                {filter === f && <div className="active-dot"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="conversations-grid-premium">
                        {loading ? (
                            <div className="loading-state-premium"><div className="spinner-premium"></div></div>
                        ) : (
                            chats.map(chat => (
                                <div key={chat.id} className="chat-card-premium">
                                    <div className="chat-card-top">
                                        <div className="chat-avatar-premium">
                                            {chat.name.charAt(0)}
                                            {chat.unread > 0 && <div className="unread-dot">{chat.unread}</div>}
                                        </div>
                                        <div className="chat-meta">
                                            <span className="chat-time">{chat.time}</span>
                                            <span className={`status-tag ${chat.status}`}>{chat.status === 'active' ? 'Em Curso' : 'Aguardando'}</span>
                                        </div>
                                    </div>
                                    <div className="chat-card-body">
                                        <h4>{chat.name}</h4>
                                        <p className="last-message">{chat.lastMsg}</p>
                                    </div>
                                    <div className="chat-card-footer">
                                        <div className="agent-badge-mini">
                                            <div className="dot"></div>
                                            {chat.agent}
                                        </div>
                                        <button className="btn-chat-action">Abrir Chat</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .conversations-grid-premium {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    .chat-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 24px;
                        padding: 24px;
                        transition: var(--transition);
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        backdrop-filter: blur(10px);
                    }
                    .chat-card-premium:hover {
                        transform: translateY(-5px);
                        border-color: var(--gold-primary);
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }

                    .chat-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                    .chat-avatar-premium {
                        width: 54px;
                        height: 54px;
                        background: linear-gradient(135deg, #1e293b, #0f172a);
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        font-weight: 800;
                        color: var(--gold-primary);
                        border: 1px solid var(--border-color);
                        position: relative;
                    }
                    .unread-dot {
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #3b82f6;
                        color: #fff;
                        font-size: 0.7rem;
                        font-weight: 900;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid #040813;
                    }

                    .chat-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
                    .chat-time { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
                    .status-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
                    .status-tag.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .status-tag.waiting { background: rgba(234, 179, 8, 0.1); color: #eab308; }

                    .chat-card-body h4 { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 6px; }
                    .last-message { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

                    .chat-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-color); }
                    .agent-badge-mini { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); }
                    .agent-badge-mini .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold-primary); box-shadow: 0 0 8px var(--gold-primary); }
                    
                    .btn-chat-action {
                        background: transparent;
                        border: 1px solid var(--border-color);
                        color: #fff;
                        padding: 8px 16px;
                        border-radius: 10px;
                        font-size: 0.8rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: var(--transition);
                    }
                    .btn-chat-action:hover {
                        border-color: var(--gold-primary);
                        color: var(--gold-primary);
                    }
                `}</style>
            </main>
        </div>
    );
}

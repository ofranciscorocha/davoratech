'use client';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';

/* ConversationsPage restored from original project */
export default function ConversationsPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<any>(null);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, [filter]);

    useEffect(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (selected) {
            fetchMessages(selected.id);
            pollRef.current = setInterval(() => fetchMessages(selected.id), 3000);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [selected?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`/api/zap/conversations?status=${filter}`);
            const data = await res.json();
            setConversations(data);
        } catch (e) {
            console.error('Fetch conversations error:', e);
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const res = await fetch(`/api/zap/messages?conversationId=${convId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (e) {
            console.error('Fetch messages error:', e);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selected) return;
        setSending(true);

        try {
            await fetch('/api/zap/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: selected.phone,
                    message: newMessage,
                    isHumanTakeover: true,
                }),
            });

            setMessages(prev => [...prev, {
                sender: 'human_operator',
                content: newMessage,
                is_from_human: 1,
                is_from_bot: 0,
                type: 'text',
                created_at: new Date().toISOString(),
            }]);
            setNewMessage('');
            setTimeout(fetchConversations, 500);
        } catch (e) {
            console.error('Send error:', e);
        }
        setSending(false);
    };

    const handleTakeover = async (resume = false) => {
        if (!selected) return;
        await fetch('/api/zap/conversations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: selected.id,
                isHumanTakeover: !resume,
            }),
        });
        setSelected(prev => prev ? { ...prev, is_human_takeover: resume ? 0 : 1 } : null);
        fetchConversations();
    };

    const changeAgent = async (agentType) => {
        if (!selected) return;
        await fetch('/api/zap/conversations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: selected.id,
                agent: agentType,
            }),
        });
        setSelected(prev => prev ? { ...prev, current_agent: agentType } : null);
        fetchConversations();
    };

    const closeConversation = async () => {
        if (!selected) return;
        if (!confirm('Encerrar esta conversa?')) return;
        await fetch('/api/zap/conversations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: selected.id,
                status: 'closed',
            }),
        });
        setSelected(null);
        fetchConversations();
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Hoje';
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const filteredConversations = conversations.filter(conv => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (conv.name && conv.name.toLowerCase().includes(s)) ||
            (conv.phone && conv.phone.includes(s)) ||
            (conv.pushname && conv.pushname.toLowerCase().includes(s));
    });

    const getChannelIcon = (conv: any) => {
        if (conv.channel === 'instagram') return (
            <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
        );
        return (
            <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19.057 15.852c-.502-.131-.85-.174-1.455-.174h-.467v-2.833c0-1.23-.466-2.339-1.235-3.147-.769-.808-1.819-1.307-2.99-1.307-.208 0-.411.015-.61.043-.377-.736-1.125-1.242-2 -1.242-.208 0-.411.015-.61.043-.377-.736-1.125-1.242-2 -1.242-.208 0-.411.015-.61.043-.377-.736-1.125-1.242-2 -1.242-1.23 0-2.227.997-2.227 2.227v8.526l-.994-.994c-.435-.435-1.141-.435-1.576 0l-.131.131c-.435.435-.435 1.141 0 1.576l4.032 4.032c.435.435 1.141.435 1.576 0l11.458-11.458c.435-.435.435-1.141 0-1.576l-.131-.131c-.435-.435-1.141-.435-1.576 0l-.821.821v-4.833c0-1.23-.466-2.339-1.235-3.147-.769-.808-1.819-1.307-2.99-1.307-1.171 0-2.221.499-2.99 1.307-.769.808-1.235 1.917-1.235 3.147v4.613l-.467.467c-.605 0-.953-.043-1.455.174-.502.217-.831.606-.831 1.091 0 .485.329.873.831 1.09z" /></svg>
        );
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <MainHeader />
                <div className="conversations-layout" style={{ flex: 1, margin: '24px 40px', height: 'calc(100vh - 144px)' }}>
                    <div className="conversation-list">
                        <div className="conversation-search">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Buscar conversas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ marginBottom: '8px' }}
                            />
                            <div className="tabs" style={{ marginBottom: 0 }}>
                                <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todas</button>
                                <button className={`tab ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Ativas</button>
                            </div>
                        </div>

                        {filteredConversations.length === 0 ? (
                            <div className="empty-state" style={{ padding: '40px 20px' }}>
                                <h3>Nenhuma conversa</h3>
                                <p>As conversas aparecerão aqui quando clientes entrarem em contato.</p>
                            </div>
                        ) : (
                            filteredConversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selected?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => setSelected(conv)}
                                >
                                    <div className="conversation-avatar">
                                        {(conv.name || conv.phone || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="name">
                                            <span className="time">
                                                {getChannelIcon(conv)} {formatDate(conv.last_message_at)} {formatTime(conv.last_message_at)}
                                            </span>
                                            <div style={{ fontWeight: 600 }}>{conv.name || conv.pushname || conv.phone}</div>
                                            <div className="preview">{conv.last_message || 'Sem mensagens'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="chat-window">
                        {!selected ? (
                            <div className="chat-empty">
                                <h3>Selecione uma conversa</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Escolha uma conversa na lista para visualizar e responder</p>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <div className="chat-header-info">
                                        <div className="conversation-avatar">
                                            {(selected.name || selected.phone || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{selected.name || selected.pushname || selected.phone}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {getChannelIcon(selected)} {selected.phone}
                                                <span className={`agent-badge agent-${selected.current_agent}`} style={{ marginLeft: '8px' }}>
                                                    {selected.current_agent === 'success' ? 'Sucesso' :
                                                        selected.current_agent === 'qualification' ? 'Qualificação' : 'Comercial'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-header-actions">
                                        <select
                                            className="form-input"
                                            value={selected.current_agent || 'success'}
                                            onChange={(e) => changeAgent(e.target.value)}
                                            style={{ width: 'auto', padding: '6px 30px 6px 8px', fontSize: '0.78rem' }}
                                        >
                                            <option value="success">Sucesso</option>
                                            <option value="qualification">Qualificação</option>
                                            <option value="commercial">Comercial</option>
                                        </select>
                                        {selected.is_human_takeover === 1 ? (
                                            <button className="btn btn-sm btn-primary" onClick={() => handleTakeover(true)}>
                                                Devolver ao Bot
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-gold" onClick={() => handleTakeover(false)}>
                                                Assumir
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-danger" onClick={closeConversation} title="Encerrar conversa">
                                            Encerrar
                                        </button>
                                    </div>
                                </div>

                                {selected.is_human_takeover === 1 && (
                                    <div className="takeover-banner">
                                        <span>AVISO: Bot pausado — Atendimento humano ativo</span>
                                        <span style={{ fontSize: '0.75rem' }}>O bot será retomado automaticamente</span>
                                    </div>
                                )}

                                <div className="chat-messages">
                                    {messages.map((msg, i) => {
                                        const isSent = msg.is_from_bot || msg.is_from_human;
                                        const isSystem = msg.agent_type === 'system';
                                        return (
                                            <div key={msg.id || i} className={`message-bubble ${isSystem ? 'system' : isSent ? 'sent' : 'received'}`}>
                                                {msg.content}
                                                <div className="message-time">
                                                    {msg.is_from_human ? '👤 Operador' : msg.is_from_bot ? `🤖 ${msg.agent_type || 'Bot'}` : '👤 Cliente'}
                                                    {' · '}
                                                    {formatTime(msg.created_at)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form className="chat-input" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={selected.is_human_takeover ? "✍️ Respondendo como operador..." : "✍️ Responder..."}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={sending}
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                                        {sending ? '...' : 'Enviar'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

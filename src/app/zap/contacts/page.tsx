'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchContacts(); }, [search]);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`/api/zap/contacts?search=${search}`);
            if (res.ok) {
                const data = await res.json();
                setContacts(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error('Fetch contacts error:', e);
        } finally {
            setLoading(false);
        }
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
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <h1>Gestão de Contatos</h1>
                            </div>
                            <p className="subtitle">Gerencie {contacts.length} leads e contatos inteligentes.</p>
                        </div>
                    </div>

                    <div className="contacts-toolbar">
                        <div className="search-wrapper-premium">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                placeholder="Buscar por nome, telefone ou empresa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button className="btn-secondary-premium">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                Exportar
                            </button>
                        </div>
                    </div>

                    <div className="contacts-table-wrapper">
                        {loading ? (
                            <div className="loading-state-premium">
                                <div className="spinner-premium"></div>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="empty-card-premium">
                                <div className="empty-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                </div>
                                <h3>Nenhum contato encontrado</h3>
                                <p>Refine sua busca ou aguarde novos leads sincronizados pela IA.</p>
                            </div>
                        ) : (
                            <div className="premium-table-container">
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>Contato</th>
                                            <th>WhatsApp</th>
                                            <th>Agente IA</th>
                                            <th>Score</th>
                                            <th>Última Interação</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map(contact => (
                                            <tr key={contact.id}>
                                                <td>
                                                    <div className="contact-cell">
                                                        <div className="contact-avatar-box">
                                                            {contact.profile_pic ? (
                                                                <img src={contact.profile_pic} alt="" />
                                                            ) : (
                                                                <span>{(contact.name || contact.phone || '?').charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <div className="contact-info-box">
                                                            <span className="contact-name">{contact.name || contact.pushname || 'Lead s/ Nome'}</span>
                                                            <span className="contact-sub">{contact.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="phone-badge">{contact.phone}</span>
                                                </td>
                                                <td>
                                                    <span className={`agent-chip ${contact.current_agent || 'IA'}`}>
                                                        {contact.current_agent === 'commercial' ? '💰 Comercial' :
                                                            contact.current_agent === 'support' ? '🛠️ Suporte' : '⚡ IA Rocha'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="score-wrapper">
                                                        <div className="score-bar-bg">
                                                            <div className="score-bar-fill" style={{ width: `${contact.lead_score || 0}%` }}></div>
                                                        </div>
                                                        <span className="score-value">{contact.lead_score || 0}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="last-contact-text">
                                                        {contact.last_contact_at ? new Date(contact.last_contact_at).toLocaleDateString('pt-BR') : 'Hoje'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions-row">
                                                        <button className="action-circle-btn" title="Ver Histórico">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </button>
                                                        <button className="action-circle-btn delete-btn" title="Remover">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .contacts-toolbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 32px;
                        gap: 20px;
                    }

                    .search-wrapper-premium {
                        flex: 1;
                        max-width: 500px;
                        background: var(--bg-card);
                        border: 1px solid var(--border-color);
                        border-radius: 16px;
                        height: 54px;
                        display: flex;
                        align-items: center;
                        padding: 0 20px;
                        gap: 12px;
                        color: var(--text-muted);
                        transition: var(--transition);
                    }
                    .search-wrapper-premium:focus-within {
                        border-color: var(--gold-primary);
                        background: var(--bg-card-hover);
                        box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1);
                    }
                    .search-wrapper-premium input {
                        background: transparent;
                        border: none;
                        outline: none;
                        color: var(--text-primary);
                        font-size: 0.95rem;
                        width: 100%;
                    }

                    .btn-secondary-premium {
                        background: var(--bg-tertiary);
                        border: 1px solid var(--border-color);
                        color: var(--text-primary);
                        padding: 12px 20px;
                        border-radius: 14px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        cursor: pointer;
                        transition: var(--transition);
                    }
                    .btn-secondary-premium:hover {
                        background: var(--bg-card-hover);
                        border-color: var(--text-muted);
                    }

                    .premium-table-container {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 24px;
                        overflow: hidden;
                        backdrop-filter: blur(10px);
                    }
                    .premium-table {
                        width: 100%;
                        border-collapse: collapse;
                        text-align: left;
                    }
                    .premium-table th {
                        padding: 24px;
                        background: rgba(255, 255, 255, 0.02);
                        font-size: 0.75rem;
                        font-weight: 800;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        border-bottom: 1px solid var(--border-color);
                    }
                    .premium-table td {
                        padding: 20px 24px;
                        border-bottom: 1px solid var(--border-color);
                        vertical-align: middle;
                        transition: var(--transition);
                    }
                    .premium-table tr:last-child td { border-bottom: none; }
                    .premium-table tr:hover td { background: rgba(255, 255, 255, 0.02); }

                    .contact-cell { display: flex; align-items: center; gap: 16px; }
                    .contact-avatar-box {
                        width: 44px;
                        height: 44px;
                        border-radius: 12px;
                        background: var(--bg-tertiary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 800;
                        color: var(--gold-primary);
                        border: 1px solid var(--border-color);
                        flex-shrink: 0;
                        overflow: hidden;
                    }
                    .contact-avatar-box img { width: 100%; height: 100%; object-fit: cover; }
                    
                    .contact-info-box { display: flex; flex-direction: column; }
                    .contact-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 2px; }
                    .contact-sub { font-size: 0.8rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

                    .phone-badge {
                        background: rgba(0,0,0,0.2);
                        padding: 4px 10px;
                        border-radius: 8px;
                        font-size: 0.85rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                    }

                    .agent-chip {
                        padding: 6px 12px;
                        border-radius: 8px;
                        font-size: 0.75rem;
                        font-weight: 700;
                        background: rgba(255,255,255,0.05);
                    }

                    .score-wrapper { display: flex; align-items: center; gap: 12px; }
                    .score-bar-bg { flex: 1; min-width: 60px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
                    .score-bar-fill { height: 100%; background: var(--gold-primary); border-radius: 10px; box-shadow: 0 0 10px var(--gold-primary); }
                    .score-value { font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); }

                    .last-contact-text { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

                    .table-actions-row { display: flex; gap: 8px; }
                    .action-circle-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.03);
                        border: 1px solid var(--border-color);
                        color: var(--text-muted);
                        cursor: pointer;
                        transition: var(--transition);
                    }
                    .action-circle-btn:hover { color: var(--gold-primary); border-color: var(--gold-primary); background: rgba(250, 204, 21, 0.05); }
                    .action-circle-btn.delete-btn:hover { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }

                    @media (max-width: 768px) {
                        .contacts-toolbar { flex-direction: column; align-items: stretch; }
                        .premium-table th:nth-child(4), .premium-table td:nth-child(4) { display: none; }
                        .premium-table th:nth-child(5), .premium-table td:nth-child(5) { display: none; }
                    }
                `}</style>
            </main>
        </div>
    );
}

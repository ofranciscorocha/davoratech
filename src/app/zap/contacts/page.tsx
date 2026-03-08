'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchContacts(); }, [search]);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`/api/zap/contacts?search=${search}`);
            if (res.ok) {
                const data = await res.json();
                setContacts(Array.isArray(data) ? data : []);
            }
        } catch (e) { }
        finally { setLoading(false); }
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
                            <p className="subtitle">Gerencie sua rede de leads e clientes de forma inteligente.</p>
                        </div>
                        <button className="btn-create-premium">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Adicionar Lead
                        </button>
                    </div>

                    <div className="filter-container">
                        {[
                            { value: 'all', label: 'Todos' },
                            { value: 'leads', label: 'Leads' },
                            { value: 'clientes', label: 'Clientes' },
                            { value: 'bloqueado', label: 'Bloqueados' },
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

                    <div className="contacts-toolbar-premium">
                        <div className="search-bar-premium">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                placeholder="Pesquisar por nome ou número..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="contacts-grid-premium">
                        {loading ? (
                            <div className="loading-state-premium"><div className="spinner-premium"></div></div>
                        ) : contacts.length === 0 ? (
                            <div className="empty-card-premium">
                                <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg></div>
                                <h3>Base de Contatos Vazia</h3>
                                <p>Novos leads aparecerão aqui assim que interagirem com sua IA.</p>
                            </div>
                        ) : (
                            contacts.map(contact => (
                                <div key={contact.id} className="contact-card-premium">
                                    <div className="contact-top">
                                        <div className="contact-avatar-premium">
                                            {contact.profile_pic ? <img src={contact.profile_pic} alt="" /> : (contact.name || contact.phone || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="contact-score-badge">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-primary)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                            {contact.lead_score || 0}
                                        </div>
                                    </div>
                                    <div className="contact-mid">
                                        <h4>{contact.name || contact.pushname || 'Sem Nome'}</h4>
                                        <span className="phone-text">{contact.phone}</span>
                                    </div>
                                    <div className="contact-bottom">
                                        <div className="agent-tag">
                                            {contact.current_agent === 'commercial' ? '💰 Comercial' : 'IA Rocha'}
                                        </div>
                                        <button className="btn-action-minimal">Perfil</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .contacts-toolbar-premium { margin-bottom: 24px; display: flex; gap: 20px; }
                    .search-bar-premium {
                        flex: 1;
                        max-width: 400px;
                        background: var(--bg-card);
                        border: 1px solid var(--border-color);
                        height: 52px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        padding: 0 18px;
                        gap: 12px;
                        color: var(--text-muted);
                        transition: var(--transition);
                    }
                    .search-bar-premium:focus-within { border-color: var(--gold-primary); background: var(--bg-card-hover); }
                    .search-bar-premium input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 0.95rem; }

                    .contacts-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
                    .contact-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 20px;
                        padding: 24px;
                        transition: var(--transition);
                        backdrop-filter: blur(10px);
                    }
                    .contact-card-premium:hover { border-color: var(--gold-primary); transform: translateY(-4px); }
                    
                    .contact-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
                    .contact-avatar-premium {
                        width: 48px;
                        height: 48px;
                        background: var(--bg-tertiary);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 8s00;
                        color: var(--gold-primary);
                        border: 1px solid var(--border-color);
                        overflow: hidden;
                    }
                    .contact-avatar-premium img { width: 100%; height: 100%; object-fit: cover; }
                    .contact-score-badge { display: flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; color: #fff; border: 1px solid rgba(255,255,255,0.05); }

                    .contact-mid h4 { font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
                    .phone-text { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }
                    
                    .contact-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color); }
                    .agent-tag { font-size: 0.7rem; font-weight: 800; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 6px; }
                    .btn-action-minimal { background: transparent; border: 1px solid var(--border-color); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: var(--transition); }
                    .btn-action-minimal:hover { border-color: var(--gold-primary); color: var(--gold-primary); }
                `}</style>
            </main>
        </div>
    );
}

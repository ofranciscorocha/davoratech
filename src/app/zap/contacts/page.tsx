'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';

/* ContactsPage restored from original project */
export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedContacts, setSelectedContacts] = useState([]);

    useEffect(() => { fetchContacts(); }, [search]);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`/api/contacts?search=${search}`);
            const data = await res.json();
            setContacts(data);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            Gestão de Contatos
                        </h1>
                        <p className="subtitle">{contacts.length} contatos registrados</p>
                    </div>
                </div>

                <div className="page-body">
                    <div className="toolbar">
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="Buscar contatos por nome ou telefone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="card">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Status</th>
                                        <th>Agente</th>
                                        <th>Score</th>
                                        <th>Último Contato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map(contact => (
                                        <tr key={contact.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div className="conversation-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                        {(contact.name || contact.phone).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{contact.name || contact.pushname || 'Sem Nome'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace' }}>{contact.phone}</td>
                                            <td>
                                                <span className="status-badge status-confirmed">Ativo</span>
                                            </td>
                                            <td>
                                                <span className={`agent-badge agent-${contact.agent_type}`}>
                                                    {contact.agent_type}
                                                </span>
                                            </td>
                                            <td>{contact.lead_score || 0}</td>
                                            <td>{contact.last_contact ? new Date(contact.last_contact).toLocaleDateString('pt-BR') : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

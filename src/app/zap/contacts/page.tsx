'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';

/* ContactsPage restored with Premium Donezo Layout */
export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchContacts(); }, [search]);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`/api/zap/contacts?search=${search}`);
            const data = await res.json();
            setContacts(data);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <MainHeader />
                <div className="dashboard-viewport">
                    <div className="page-header">
                        <div>
                            <h1>Gestão de Contatos</h1>
                            <p className="subtitle">{contacts.length} contatos registrados no sistema.</p>
                        </div>
                    </div>

                    <div className="page-body">
                        <div className="toolbar">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="🔍 Buscar contatos por nome ou telefone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ maxWidth: '400px' }}
                            />
                        </div>

                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                                        {contacts.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                                    Nenhum contato encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            contacts.map(contact => (
                                                <tr key={contact.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div className="conversation-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', borderRadius: '10px' }}>
                                                                {(contact.name || contact.phone).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div style={{ fontWeight: 700 }}>{contact.name || contact.pushname || 'Sem Nome'}</div>
                                                        </div>
                                                    </td>
                                                    <td style={{ opacity: 0.8, fontFamily: 'monospace' }}>{contact.phone}</td>
                                                    <td>
                                                        <span className="status-badge status-confirmed">Ativo</span>
                                                    </td>
                                                    <td>
                                                        <span className={`agent-badge agent-${contact.current_agent || 'success'}`}>
                                                            {contact.current_agent || 'IA'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: 'var(--gold-primary)' }}>
                                                            {contact.lead_score || 0}
                                                        </div>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        {contact.last_contact_at ? new Date(contact.last_contact_at).toLocaleDateString('pt-BR') : 'Sem registro'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

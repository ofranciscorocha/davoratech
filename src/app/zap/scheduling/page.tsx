'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function SchedulingPage() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', date: '', time: '', duration: 30,
        contact_name: '', contact_phone: '', agent_type: 'commercial'
    });
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchSchedules(); }, []);

    const fetchSchedules = async () => {
        try {
            const res = await fetch('/api/zap/scheduling');
            const data = await res.json();
            setSchedules(Array.isArray(data) ? data : []);
        } catch (e) {
            setSchedules([]);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!form.title || !form.date || !form.time) return;
        await fetch('/api/zap/scheduling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setShowModal(false);
        setForm({ title: '', description: '', date: '', time: '', duration: 30, contact_name: '', contact_phone: '', agent_type: 'commercial' });
        fetchSchedules();
    };

    const updateStatus = async (id: number, status: string) => {
        await fetch('/api/zap/scheduling', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        fetchSchedules();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este agendamento?')) return;
        await fetch(`/api/zap/scheduling?id=${id}`, { method: 'DELETE' });
        fetchSchedules();
    };

    const filtered = filter === 'all' ? schedules : schedules.filter(s => s.status === filter);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return { day: '--', month: '---' };
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
            day: d.getDate().toString().padStart(2, '0'),
            month: months[d.getMonth()],
            weekDay: days[d.getDay()]
        };
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
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                </div>
                                <h1>Agenda Corporativa</h1>
                            </div>
                            <p className="subtitle">{schedules.length} agendamentos sincronizados com IA</p>
                        </div>
                        <button className="btn-create-premium" onClick={() => setShowModal(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Novo Agendamento
                        </button>
                    </div>

                    <div className="filter-container">
                        {[
                            { value: 'all', label: 'Todos' },
                            { value: 'pending', label: 'Pendentes' },
                            { value: 'confirmed', label: 'Confirmados' },
                            { value: 'completed', label: 'Concluídos' },
                            { value: 'cancelled', label: 'Cancelados' },
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
                    ) : filtered.length === 0 ? (
                        <div className="empty-card-premium">
                            <div className="empty-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <h3>Nenhum agendamento ativo</h3>
                            <p>Sua agenda está limpa. Novos compromissos aparecerão aqui automaticamente.</p>
                        </div>
                    ) : (
                        <div className="schedule-list-premium">
                            {filtered.map(schedule => {
                                const d = formatDate(schedule.date);
                                return (
                                    <div key={schedule.id} className="schedule-card-premium">
                                        <div className="date-badge-premium">
                                            <span className="weekday">{d.weekDay}</span>
                                            <span className="day">{d.day}</span>
                                            <span className="month">{d.month}</span>
                                        </div>

                                        <div className="schedule-info">
                                            <div className="info-main">
                                                <h4>{schedule.title}</h4>
                                                <div className="info-meta">
                                                    <span className="meta-item">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                        {schedule.time}
                                                    </span>
                                                    {schedule.contact_name && (
                                                        <span className="meta-item">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                            {schedule.contact_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="info-actions">
                                                <span className={`status-pill ${schedule.status}`}>
                                                    {schedule.status === 'pending' ? 'Pendente' :
                                                        schedule.status === 'confirmed' ? 'Confirmado' :
                                                            schedule.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                                </span>

                                                <div className="action-buttons">
                                                    {schedule.status === 'pending' && (
                                                        <button className="icon-btn check-btn" onClick={() => updateStatus(schedule.id, 'confirmed')} title="Confirmar">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                        </button>
                                                    )}
                                                    <button className="icon-btn del-btn" onClick={() => handleDelete(schedule.id)} title="Excluir">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* MODAL PREMIUM */}
                {showModal && (
                    <div className="modal-overlay-premium">
                        <div className="modal-content-premium">
                            <div className="modal-header">
                                <h3>Novo Agendamento</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Título do Compromisso</label>
                                    <input type="text" placeholder="Ex: Reunião de Vendas" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Data</label>
                                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Hora</label>
                                        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Nome do Contato</label>
                                    <input type="text" placeholder="Nome do cliente" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Observações</label>
                                    <textarea placeholder="Detalhes importantes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="save-btn" onClick={handleSave}>Agendar Agora</button>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .page-header-premium {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 40px;
                    }
                    .title-row {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .icon-box-premium {
                        width: 48px;
                        height: 48px;
                        background: var(--bg-tertiary);
                        border: 1px solid var(--border-color);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--gold-primary);
                    }
                    .btn-create-premium {
                        background: var(--gold-primary);
                        color: #000;
                        padding: 12px 24px;
                        border-radius: 14px;
                        font-weight: 800;
                        font-size: 0.9rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: var(--transition);
                        box-shadow: 0 10px 20px rgba(202, 160, 91, 0.2);
                        border: none;
                        cursor: pointer;
                    }
                    .btn-create-premium:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 30px rgba(202, 160, 91, 0.3);
                    }

                    .filter-container {
                        display: flex;
                        gap: 32px;
                        margin-bottom: 40px;
                        border-bottom: 1px solid var(--border-color);
                        padding-bottom: 1px;
                    }
                    .filter-tab {
                        background: transparent;
                        border: none;
                        color: var(--text-muted);
                        font-weight: 700;
                        font-size: 0.9rem;
                        padding: 16px 0;
                        cursor: pointer;
                        position: relative;
                        transition: var(--transition);
                    }
                    .filter-tab:hover { color: var(--text-primary); }
                    .filter-tab.active { color: var(--gold-primary); }
                    .active-dot {
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background: var(--gold-primary);
                        box-shadow: 0 0 10px var(--gold-primary);
                    }

                    .schedule-list-premium {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .schedule-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 24px;
                        padding: 24px;
                        display: flex;
                        gap: 24px;
                        align-items: center;
                        transition: var(--transition);
                        backdrop-filter: blur(10px);
                    }
                    .schedule-card-premium:hover {
                        background: var(--bg-card-hover);
                        border-color: rgba(202, 160, 91, 0.2);
                        transform: translateX(10px);
                    }
                    
                    .date-badge-premium {
                        width: 70px;
                        height: 90px;
                        background: var(--bg-tertiary);
                        border: 1px solid var(--border-color);
                        border-radius: 18px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                    .weekday { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                    .day { font-size: 1.6rem; font-weight: 900; color: var(--gold-primary); margin: 2px 0; }
                    .month { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); }

                    .schedule-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
                    .info-main h4 { font-size: 1.1rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary); }
                    .info-meta { display: flex; gap: 20px; }
                    .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
                    
                    .info-actions { display: flex; align-items: center; gap: 24px; }
                    .status-pill {
                        padding: 6px 14px;
                        border-radius: 10px;
                        font-size: 0.75rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .status-pill.pending { background: rgba(234, 179, 8, 0.1); color: #eab308; }
                    .status-pill.confirmed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .status-pill.completed { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                    .status-pill.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                    .action-buttons { display: flex; gap: 8px; }
                    .icon-btn {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: var(--transition);
                        border: 1px solid transparent;
                    }
                    .check-btn { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .check-btn:hover { background: #10b981; color: #fff; }
                    .del-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                    .del-btn:hover { background: #ef4444; color: #fff; }

                    /* MODAL STYLES */
                    .modal-overlay-premium {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(10px);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .modal-content-premium {
                        background: var(--bg-secondary);
                        width: 100%;
                        max-width: 500px;
                        border-radius: 32px;
                        border: 1px solid var(--border-color);
                        overflow: hidden;
                        box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                    }
                    .modal-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
                    .modal-header h3 { font-size: 1.25rem; font-weight: 800; color: #fff; }
                    .close-btn { background: transparent; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; }
                    
                    .modal-body { padding: 32px; display: flex; flex-direction: column; gap: 20px; }
                    .form-group { display: flex; flex-direction: column; gap: 10px; }
                    .form-group label { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                    .modal-body input, .modal-body textarea {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid var(--border-color);
                        padding: 14px 18px;
                        border-radius: 12px;
                        color: #fff;
                        font-size: 0.9rem;
                        outline: none;
                        transition: var(--transition);
                    }
                    .modal-body input:focus { border-color: var(--gold-primary); background: rgba(255, 255, 255, 0.08); }
                    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

                    .modal-footer { padding: 32px; background: rgba(0,0,0,0.1); display: flex; gap: 16px; }
                    .modal-footer button { flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; transition: var(--transition); border: none; }
                    .cancel-btn { background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); }
                    .cancel-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
                    .save-btn { background: var(--gold-primary); color: #000; box-shadow: 0 10px 20px rgba(202, 160, 91, 0.2); }
                    .save-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(202, 160, 91, 0.3); }

                    .empty-card-premium {
                        background: var(--bg-card);
                        border: 1px dashed var(--border-color);
                        border-radius: 32px;
                        padding: 80px 40px;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .empty-icon {
                        width: 80px;
                        height: 80px;
                        background: rgba(255, 255, 255, 0.03);
                        border-radius: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--text-muted);
                        margin-bottom: 24px;
                    }
                    .empty-card-premium h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 12px; }
                    .empty-card-premium p { color: var(--text-muted); max-width: 300px; line-height: 1.6; }

                    .spinner-premium {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(202, 160, 91, 0.1);
                        border-top-color: var(--gold-primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    .loading-state-premium { display: flex; justify-content: center; padding: 100px 0; }
                `}</style>
            </main>
        </div>
    );
}

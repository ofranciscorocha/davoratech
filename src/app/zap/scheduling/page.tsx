'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
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
            setSchedules(data);
        } catch (e) { }
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
        const parts = dateStr.split('-');
        return { day: parts[2] || '--', month: ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][parseInt(parts[1])] || '---' };
    };

    return (
        <div id="rocha-zap-root">
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="page-header">
                        <div>
                            <h1 className="flex items-center gap-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                Agenda Corporativa
                            </h1>
                            <p className="subtitle">{schedules.length} agendamentos sincronizados</p>
                        </div>
                        <button className="bg-[#c9a05b] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-[#c9a05b]/20" onClick={() => setShowModal(true)}>
                            Novo Agendamento
                        </button>
                    </div>

                    <div className="page-body">
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                            {[
                                { value: 'all', label: 'Todos' },
                                { value: 'pending', label: 'Pendentes' },
                                { value: 'confirmed', label: 'Confirmados' },
                                { value: 'completed', label: 'Concluídos' },
                                { value: 'cancelled', label: 'Cancelados' },
                            ].map(tab => (
                                <button key={tab.value} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${filter === tab.value ? 'bg-[#c9a05b] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`} onClick={() => setFilter(tab.value)}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#c9a05b]/20 border-t-[#c9a05b] rounded-full animate-spin"></div></div>
                        ) : filtered.length === 0 ? (
                            <div className="card p-20 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#c9a05b]/10 text-[#c9a05b] rounded-full flex items-center justify-center mb-6"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2">Nenhum agendamento encontrado</h3>
                                <p className="text-gray-400 max-w-sm">Os compromissos gerados pela IA ou inseridos manualmente aparecerão nesta área.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filtered.map(schedule => {
                                    const d = formatDate(schedule.date);
                                    return (
                                        <div key={schedule.id} className="card flex items-center gap-6 group hover:border-[#c9a05b]/30">
                                            <div className="w-16 h-16 bg-[#c9a05b]/10 rounded-2xl flex flex-col items-center justify-center border border-[#c9a05b]/20">
                                                <span className="text-xl font-black text-[#c9a05b] leading-none">{d.day}</span>
                                                <span className="text-[10px] font-bold text-[#c9a05b] uppercase tracking-tighter">{d.month}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white group-hover:text-[#c9a05b] transition-colors">{schedule.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-bold">
                                                    <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> {schedule.time}</span>
                                                    {schedule.contact_name && <span className="flex items-center gap-1"><X size={12} /> {schedule.contact_name}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${schedule.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        schedule.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {schedule.status}
                                                </span>
                                                <div className="flex gap-2">
                                                    {schedule.status === 'pending' && <button className="bg-emerald-500 text-white p-2 rounded-lg hover:scale-110 transition-all" onClick={() => updateStatus(schedule.id, 'confirmed')}>Check</button>}
                                                    <button className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all" onClick={() => handleDelete(schedule.id)}>Del</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal Overlay Ported Simply */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-[#0d1e45] w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                        <div className="p-8 border-b border-white/10 bg-[#0a1b3f] flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Novo Agendamento</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">Close</button>
                        </div>
                        <div className="p-8 space-y-4">
                            <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" placeholder="Título do Compromisso" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                <input type="time" className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                            </div>
                            <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" placeholder="Nome do Lead/Contato" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
                            <textarea className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" placeholder="Notas Adicionais" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="p-8 bg-[#0a1b3f] flex justify-end">
                            <button onClick={handleSave} className="bg-[#c9a05b] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg">Confirmar Agendamento</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function X({ size = 20 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}

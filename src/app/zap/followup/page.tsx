'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import '../zap.css';

const PRIORITIES = [
    { value: 'urgent', label: 'Urgente', color: '#ef4444', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
    { value: 'high', label: 'Alta', color: '#f59e0b', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
    { value: 'medium', label: 'Média', color: '#3b82f6', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg> },
    { value: 'low', label: 'Baixa', color: '#6b7280', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg> },
];

const STATUSES = [
    { value: 'all', label: 'Todos' },
    { value: 'open', label: 'Abertos' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'waiting', label: 'Aguardando' },
    { value: 'resolved', label: 'Resolvidos' },
];

const CATEGORIES = [
    { value: 'general', label: 'Geral' },
    { value: 'support', label: 'Suporte' },
    { value: 'complaint', label: 'Reclamação' },
    { value: 'sales', label: 'Vendas' },
    { value: 'billing', label: 'Financeiro' },
    { value: 'technical', label: 'Técnico' },
    { value: 'other', label: 'Outro' },
];

export default function FollowUpPage() {
    const [followUps, setFollowUps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('open');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [detailItem, setDetailItem] = useState<any>(null);
    const [newNote, setNewNote] = useState('');
    const [form, setForm] = useState({
        subject: '', description: '', priority: 'medium', category: 'general',
        contact_name: '', contact_phone: '', due_date: '', assigned_agent: 'success',
    });

    useEffect(() => { fetchFollowUps(); }, [filter]);

    const fetchFollowUps = async () => {
        try {
            const res = await fetch(`/api/zap/followups?status=${filter}`);
            const data = await res.json();
            setFollowUps(data);
        } catch (e) { }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!form.subject.trim()) return;
        const method = editItem ? 'PUT' : 'POST';
        const body = editItem ? { id: editItem.id, ...form } : form;
        await fetch('/api/zap/followups', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        setShowModal(false);
        setEditItem(null);
        setForm({ subject: '', description: '', priority: 'medium', category: 'general', contact_name: '', contact_phone: '', due_date: '', assigned_agent: 'success' });
        fetchFollowUps();
    };

    const updateStatus = async (id: number, status: string) => {
        await fetch('/api/zap/followups', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        fetchFollowUps();
        if (detailItem?.id === id) {
            setDetailItem((prev: any) => ({ ...prev, status, resolved_at: status === 'resolved' ? new Date().toISOString() : null }));
        }
    };

    const addNote = async () => {
        if (!newNote.trim() || !detailItem) return;
        await fetch('/api/zap/followups', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: detailItem.id, action: 'add_note', note: newNote }),
        });
        const notes = JSON.parse(detailItem.notes || '[]');
        notes.push({ text: newNote, timestamp: new Date().toISOString() });
        setDetailItem({ ...detailItem, notes: JSON.stringify(notes) });
        setNewNote('');
        fetchFollowUps();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este follow-up?')) return;
        await fetch(`/api/zap/followups?id=${id}`, { method: 'DELETE' });
        setDetailItem(null);
        fetchFollowUps();
    };

    const openEdit = (item: any) => {
        setEditItem(item);
        setForm({
            subject: item.subject, description: item.description || '', priority: item.priority,
            category: item.category, contact_name: item.contact_name || '', contact_phone: item.contact_phone || '',
            due_date: item.due_date || '', assigned_agent: item.assigned_agent || 'success',
        });
        setShowModal(true);
    };

    const openNew = () => {
        setEditItem(null);
        setForm({ subject: '', description: '', priority: 'medium', category: 'general', contact_name: '', contact_phone: '', due_date: '', assigned_agent: 'success' });
        setShowModal(true);
    };

    const getPriority = (p: string) => PRIORITIES.find(pr => pr.value === p) || PRIORITIES[2];
    const getStatusLabel = (s: string) => {
        const map: any = { open: 'Aberto', in_progress: 'Em Andamento', waiting: 'Aguardando', resolved: 'Resolvido' };
        return map[s] || s;
    };

    const isOverdue = (item: any) => {
        if (!item.due_date || item.status === 'resolved') return false;
        return new Date(item.due_date) < new Date();
    };

    return (
        <div id="rocha-zap-root">
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="page-header">
                        <div>
                            <h1 className="flex items-center gap-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Central de Follow-Up
                            </h1>
                            <p className="subtitle">Gestão estratégica de pendências e acompanhamentos</p>
                        </div>
                        <button className="bg-[#c9a05b] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all shadow-lg" onClick={openNew}>Novo Registro</button>
                    </div>

                    <div className="page-body">
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                            {STATUSES.map(s => (
                                <button key={s.value} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${filter === s.value ? 'bg-[#c9a05b] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`} onClick={() => setFilter(s.value)}>
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#c9a05b]/20 border-t-[#c9a05b] rounded-full animate-spin"></div></div>
                        ) : followUps.length === 0 ? (
                            <div className="card p-20 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#c9a05b]/10 text-[#c9a05b] rounded-full flex items-center justify-center mb-6"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2">Sem pendências registradas</h3>
                                <p className="text-gray-400 max-w-sm">Tudo em dia! Novos follow-ups aparecerão aqui conforme forem criados.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {followUps.map(item => {
                                    const pri = getPriority(item.priority);
                                    const overdue = isOverdue(item);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`card group hover:border-[#c9a05b]/30 transition-all cursor-pointer border-l-4`}
                                            style={{ borderLeftColor: pri.color }}
                                            onClick={() => setDetailItem(item)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col items-center min-w-[60px]">
                                                    <div style={{ color: pri.color }}>{pri.icon}</div>
                                                    <span className="text-[9px] font-black uppercase mt-1" style={{ color: pri.color }}>{pri.label}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-lg font-bold text-white group-hover:text-[#c9a05b] transition-colors">{item.subject}</h4>
                                                        {overdue && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black">ATRASADO</span>}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-bold">
                                                        {item.contact_name && <span className="flex items-center gap-1">👤 {item.contact_name}</span>}
                                                        {item.due_date && <span className="flex items-center gap-1">📅 {new Date(item.due_date).toLocaleDateString('pt-BR')}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400`}>
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                    <button className="text-gray-600 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
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

            {/* Modal simple port */}
            {detailItem && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDetailItem(null)}></div>
                    <div className="relative bg-[#0d1e45] w-full max-w-2xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-8 bg-[#0a1b3f] border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{detailItem.subject}</h3>
                            <button onClick={() => setDetailItem(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                            <p className="text-gray-400 text-sm leading-relaxed">{detailItem.description || 'Sem descrição.'}</p>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm" onClick={() => updateStatus(detailItem.id, 'resolved')}>Marcar como Resolvido</button>
                            </div>
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

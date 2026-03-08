'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Edit2, Trash2, Users, MapPin, CheckCircle2, RefreshCw, Copy } from 'lucide-react';

const API_BASE = '/api/marketing';

interface Campaign {
    id: number;
    name: string;
    type: string;
    status: string;
    content: string;
    subject: string | null;
    recipient: string | null;
    groupId: number | null;
    filterState: string | null;
    filterCity: string | null;
    scheduledAt: string | null;
    createdAt: string;
}

interface CampaignManagerProps {
    onReuse?: (campaign: Campaign) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ onReuse }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        content: '',
        subject: '',
        scheduledAt: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [campRes, groupsRes] = await Promise.all([
                axios.get(`${API_BASE}/campaigns`),
                axios.get(`${API_BASE}/groups`),
            ]);
            setCampaigns(campRes.data);
            setGroups(groupsRes.data);
        } catch (e) {
            console.error('Error fetching campaigns:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja cancelar esta campanha?')) return;
        try {
            await axios.delete(`${API_BASE}/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c.id !== id));
        } catch (e) {
            alert('Erro ao excluir campanha');
        }
    };

    const handleEditStart = (c: Campaign) => {
        setEditingId(c.id);
        setEditForm({
            name: c.name,
            content: c.content,
            subject: c.subject || '',
            scheduledAt: c.scheduledAt ? c.scheduledAt.substring(0, 16) : '',
        });
    };

    const handleEditSave = async () => {
        if (!editingId) return;
        try {
            await axios.put(`${API_BASE}/campaigns/${editingId}`, {
                ...editForm,
                status: 'scheduled'
            });
            setEditingId(null);
            fetchData();
        } catch (e) {
            alert('Erro ao salvar edições');
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return date; }
    };

    const getGroupName = (id: number | null) => {
        if (!id) return '-';
        const g = groups.find(group => group.id === Number(id));
        return g ? g.name : `Grupo ${id}`;
    };

    const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled');
    const pastCampaigns = campaigns.filter(c => c.status !== 'scheduled');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white">📅 Campanhas</h2>
                    <p className="text-gray-400 mt-1">Gerencie agendamentos e envios</p>
                </div>
                <button
                    type="button"
                    onClick={() => fetchData()}
                    disabled={loading}
                    className="flex items-center gap-2 text-[#c5a059] font-bold hover:text-[#c5a059]/80"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Agendadas ({scheduledCampaigns.length})
                </h3>

                {scheduledCampaigns.length === 0 ? (
                    <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium italic">Nenhuma campanha agendada no momento</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scheduledCampaigns.map(c => (
                            <div key={c.id} className="bg-white/5 rounded-3xl border border-white/5 hover:border-[#c5a059]/30 shadow-2xl p-6 transition-all relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c5a059]" />
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-black text-lg text-white group-hover:text-[#c5a059] transition-colors">{c.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${c.type === 'email' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                c.type === 'whatsapp' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                }`}>
                                                {c.type}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(c.scheduledAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onReuse?.(c)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"><Copy className="w-4 h-4" /></button>
                                        <button onClick={() => handleEditStart(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 space-y-2 mb-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-500">Público:</span>
                                        <span className="font-bold text-white">{getGroupName(c.groupId)}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400 italic line-clamp-2 bg-black/20 p-3 rounded-xl border border-white/5">
                                    "{c.content.substring(0, 100)}{c.content.length > 100 ? '...' : ''}"
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    Enviadas e Outras ({pastCampaigns.length})
                </h3>
                <div className="bg-[#112240] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="text-left px-5 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Nome</th>
                                <th className="text-left px-5 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Canal</th>
                                <th className="text-left px-5 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-left px-5 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                                <th className="text-left px-5 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pastCampaigns.map(c => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-4 text-sm font-black text-white">{c.name}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                            {c.type === 'email' ? '📧 Email' : c.type === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${c.status === 'completed' || c.status === 'sent' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            c.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-gray-400 border border-white/10'
                                            }`}>
                                            {c.status === 'completed' || c.status === 'sent' ? 'Enviada' : c.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(c.createdAt || c.scheduledAt)}</td>
                                    <td className="px-5 py-3 flex items-center gap-2">
                                        <button onClick={() => onReuse?.(c)} className="text-teal-500 p-1"><Copy className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(c.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
                    <div className="bg-[#112240] rounded-[2rem] shadow-2xl max-w-lg w-full p-8 border border-white/10">
                        <h3 className="text-2xl font-black mb-6 text-white">Editar Campanha</h3>
                        <div className="space-y-4">
                            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#c5a059]" placeholder="Nome" />
                            <textarea value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#c5a059] min-h-[150px]" placeholder="Conteúdo" />
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setEditingId(null)} className="px-6 py-2 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cancelar</button>
                            <button onClick={handleEditSave} className="bg-[#c5a059] text-[#0a0f1a] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#c5a059]/20 hover:scale-105 transition-all">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

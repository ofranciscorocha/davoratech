'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import { X } from 'lucide-react';

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editAgent, setEditAgent] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchAgents(); }, []);

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/zap/agents');
            const data = await res.json();
            setAgents(data);
        } catch (e) { }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editAgent) return;
        setSaving(true);
        try {
            await fetch('/api/zap/agents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editAgent),
            });
            fetchAgents();
            setEditAgent(null);
        } catch (e) {
            console.error('Save error:', e);
        }
        setSaving(false);
    };

    const agentIcons: any = {
        success: {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
            color: 'green',
            label: 'Sucesso do Cliente'
        },
        qualification: {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
            color: 'blue',
            label: 'Qualificação'
        },
        commercial: {
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
            color: 'gold',
            label: 'Comercial'
        },
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Agentes IA Estratégicos
                        </h1>
                        <p className="subtitle">Configure os prompts e comportamento de cada agente</p>
                    </div>
                </div>

                <div className="page-body">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.map(agent => {
                                const info = agentIcons[agent.type] || {
                                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
                                    color: 'green',
                                    label: agent.type
                                };
                                return (
                                    <div key={agent.id} className="card group hover:border-[#c9a05b]/30 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#c9a05b]/10 text-[#c9a05b]`}>
                                                {info.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                                                <p className="text-xs text-gray-400">{agent.description}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-xl text-xs text-gray-400 line-clamp-3 mb-6 font-mono leading-relaxed">
                                            {agent.system_prompt}
                                        </div>

                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Temp</p>
                                                    <p className="text-sm font-bold text-white">{agent.temperature}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Tokens</p>
                                                    <p className="text-sm font-bold text-white">{agent.max_tokens}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setEditAgent({ ...agent })}
                                                className="bg-white/5 hover:bg-[#c9a05b] text-white hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/10 hover:border-[#c9a05b]"
                                            >
                                                Configurar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {editAgent && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditAgent(null)}></div>
                        <div className="relative bg-[#0d1e45] border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#0a1b3f]">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    Configurar Agente: {editAgent.name}
                                </h3>
                                <button onClick={() => setEditAgent(null)} className="text-gray-500 hover:text-white"><X /></button>
                            </div>
                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Prompt</label>
                                    <textarea
                                        className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b] font-mono leading-relaxed"
                                        value={editAgent.system_prompt}
                                        onChange={e => setEditAgent({ ...editAgent, system_prompt: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Temperatura</label>
                                        <input
                                            type="number" step="0.1"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b]"
                                            value={editAgent.temperature}
                                            onChange={e => setEditAgent({ ...editAgent, temperature: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Tokens</label>
                                        <input
                                            type="number"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b]"
                                            value={editAgent.max_tokens}
                                            onChange={e => setEditAgent({ ...editAgent, max_tokens: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-[#0a1b3f] flex justify-end gap-4">
                                <button onClick={() => setEditAgent(null)} className="px-6 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white">Cancelar</button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-[#c9a05b] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-[#c9a05b]/20 flex items-center gap-2"
                                >
                                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}


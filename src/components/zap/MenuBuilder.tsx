'use client';
import { useState, useEffect } from 'react';

export default function MenuBuilder() {
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMenu, setEditingMenu] = useState<any>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/zap/menus');
            const data = await res.json();
            setMenus(data.menus || []);
        } catch (e) {
            console.error('Menu fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMenu = async (menuData: any) => {
        try {
            const res = await fetch('/api/zap/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuData)
            });
            if (res.ok) {
                setEditingMenu(null);
                fetchMenus();
            }
        } catch (e) {
            alert('Erro ao salvar menu');
        }
    };

    const handleDeleteMenu = async (id: string) => {
        if (!confirm('Deseja excluir este menu e todas as suas opções?')) return;
        try {
            await fetch(`/api/zap/menus?id=${id}`, { method: 'DELETE' });
            fetchMenus();
        } catch (e) {
            alert('Erro ao excluir');
        }
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/zap/menus/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt })
            });
            const data = await res.json();
            if (data.success) {
                alert('Fluxo gerado com sucesso! Clique em atualizar.');
                setAiPrompt('');
                fetchMenus();
            } else {
                alert('Erro ao gerar: ' + data.error);
            }
        } catch (e) {
            alert('Erro na conexão com IA');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="menu-builder space-y-8">
            <div className="card bg-[#c9a05b]/5 border-[#c9a05b]/20 p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#c9a05b]/10 text-[#c9a05b] rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#c9a05b]">IA Designer de Fluxos</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 max-w-2xl">
                    Descreva como deseja o atendimento e nossa IA construirá toda a estrutura de menus e opções automaticamente para você.
                </p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-white text-sm outline-none"
                        placeholder="Ex: Crie um menu para clínica odontológica com agendamento e emergência..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <button
                        className="bg-[#c9a05b] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !aiPrompt}
                    >
                        {isGenerating ? 'Trabalhando...' : 'Criar Fluxo'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Fluxos Dinâmicos</h3>
                    <button className="bg-white/5 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-white/10 transition-all" onClick={() => setEditingMenu({ id: '', message: '', options: [] })}>
                        + Novo Menu
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#c9a05b]/20 border-t-[#c9a05b] rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menus.map(menu => (
                            <div key={menu.id} className="card group hover:border-[#c9a05b]/30">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-[#c9a05b] uppercase tracking-widest">{menu.id}</span>
                                        {menu.is_default && <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full">ENTRADA</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-gray-500 hover:text-[#c9a05b]" onClick={() => setEditingMenu(menu)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                        {!menu.is_default && <button className="text-gray-500 hover:text-red-500" onClick={() => handleDeleteMenu(menu.id)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 line-clamp-2 mb-4 bg-black/20 p-3 rounded-lg border border-white/5">
                                    {menu.message}
                                </div>
                                <div className="space-y-1">
                                    {menu.options?.map((opt: any, i: number) => (
                                        <div key={i} className="flex justify-between text-[11px] font-bold">
                                            <span className="text-[#c9a05b]">{opt.trigger}. {opt.label}</span>
                                            <span className="text-gray-600">→ {opt.next_step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Editing Modal simplified for port */}
            {editingMenu && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setEditingMenu(null)}></div>
                    <div className="relative bg-[#0d1e45] w-full max-w-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/10 bg-[#0a1b3f]">
                            <h3 className="text-xl font-bold text-white">Configuração de Menu</h3>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#c9a05b] uppercase tracking-widest">Identificador (ID)</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none"
                                    value={editingMenu.id}
                                    onChange={(e) => setEditingMenu({ ...editingMenu, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#c9a05b] uppercase tracking-widest">Mensagem do Assistente</label>
                                <textarea
                                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none"
                                    value={editingMenu.message}
                                    onChange={(e) => setEditingMenu({ ...editingMenu, message: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-8 bg-[#0a1b3f] flex gap-3">
                            <button className="flex-1 bg-[#c9a05b] text-white py-4 rounded-xl font-bold" onClick={() => handleSaveMenu(editingMenu)}>Salvar Menu</button>
                            <button className="px-8 bg-white/5 text-white py-4 rounded-xl font-bold" onClick={() => setEditingMenu(null)}>Sair</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

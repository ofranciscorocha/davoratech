'use client';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import { X } from 'lucide-react';

export default function KnowledgePage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([{ value: 'all', label: 'Todos', icon: '', color: '' }]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCategorySettings, setShowCategorySettings] = useState(false);

    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState({ title: '', content: '', category: 'general' });
    const [filter, setFilter] = useState('all');

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadCategory, setUploadCategory] = useState('general');
    const [uploading, setUploading] = useState(false);

    const [catList, setCatList] = useState<any[]>([]);
    const [newCat, setNewCat] = useState({ value: '', label: '', icon: '', color: '#c9a05b' });
    const [savingCategories, setSavingCategories] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 1) fetchArticles();
    }, [filter, categories]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/zap/knowledge/categories');
            const data = await res.json();
            setCategories(data);
            setCatList(data.filter((c: any) => c.value !== 'all'));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchArticles = async () => {
        try {
            const url = filter === 'all' ? '/api/zap/knowledge' : `/api/zap/knowledge?category=${filter}`;
            const res = await fetch(url);
            const data = await res.json();
            setArticles(data);
        } catch (e) { }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim()) return;

        if (editItem) {
            await fetch('/api/zap/knowledge', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editItem.id, ...form }),
            });
        } else {
            await fetch('/api/zap/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
        }

        setShowModal(false);
        setEditItem(null);
        setForm({ title: '', content: '', category: 'general' });
        fetchArticles();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
        await fetch(`/api/zap/knowledge?id=${id}`, { method: 'DELETE' });
        fetchArticles();
    };

    const handleEdit = (article: any) => {
        setEditItem(article);
        setForm({ title: article.title, content: article.content, category: article.category });
        setShowModal(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadFile(file);
        setUploadCategory(filter === 'all' ? 'general' : filter);
        setShowUploadModal(true);
    };

    const confirmUpload = async () => {
        if (!uploadFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('category', uploadCategory);

        try {
            const res = await fetch('/api/zap/knowledge/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                fetchArticles();
                setShowUploadModal(false);
                setUploadFile(null);
            } else {
                alert('Erro: ' + (data.error || 'Falha ao processar arquivo'));
            }
        } catch (err) {
            alert('Erro ao enviar arquivo');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const saveCategories = async () => {
        setSavingCategories(true);
        try {
            const updated = [{ value: 'all', label: 'Todos', icon: '', color: '' }, ...catList];
            await fetch('/api/zap/knowledge/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: updated }),
            });
            await fetchCategories();
            setShowCategorySettings(false);
        } catch (e) {
            alert('Erro ao salvar categorias');
        }
        setSavingCategories(false);
    };

    const addCategory = () => {
        if (!newCat.label || !newCat.value) return;
        setCatList([...catList, { ...newCat, value: newCat.label.toLowerCase().replace(/[^a-z0-9]/g, '') }]);
        setNewCat({ value: '', label: '', icon: '', color: '#c9a05b' });
    };

    const removeCategory = (val: string) => {
        if (val === 'general') return alert('A categoria Geral não pode ser excluída.');
        setCatList(catList.filter(c => c.value !== val));
    };

    const getCategoryColor = (val: string) => {
        const cat = categories.find(c => c.value === val);
        return cat?.color || '#c9a05b';
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                            Base de Conhecimento
                        </h1>
                        <p className="subtitle">Alimente o bot com informações sobre sua empresa, produtos e serviços</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/10" onClick={() => setShowCategorySettings(true)}>Categorias</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt,.docx,.xlsx" onChange={handleFileSelect} />
                        <button className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/10" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? 'Processando...' : 'Importar Doc'}</button>
                        <button className="bg-[#c9a05b] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all" onClick={() => { setEditItem(null); setForm({ title: '', content: '', category: 'general' }); setShowModal(true); }}>Novo Artigo</button>
                    </div>
                </div>

                <div className="page-body">
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
                        {categories.map(cat => (
                            <button key={cat.value} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${filter === cat.value ? 'bg-[#c9a05b] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`} onClick={() => setFilter(cat.value)}>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#c9a05b]/20 border-t-[#c9a05b] rounded-full animate-spin"></div></div>
                    ) : articles.length === 0 ? (
                        <div className="card p-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#c9a05b]/10 text-[#c9a05b] rounded-full flex items-center justify-center mb-6"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg></div>
                            <h3 className="text-xl font-bold text-white mb-2">Base de Conhecimento Vazia</h3>
                            <p className="text-gray-400 max-w-sm">Adicione artigos ou importe documentos para que o bot possa responder dúvidas com precisão.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map(a => (
                                <div key={a.id} className="card group hover:border-[#c9a05b]/30 transition-all cursor-pointer" onClick={() => handleEdit(a)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span style={{ color: getCategoryColor(a.category) }} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5">
                                            {categories.find(c => c.value === a.category)?.label || a.category}
                                        </span>
                                        {a.source_file && <span className="text-[9px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded">DOC: {a.source_file}</span>}
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#c9a05b] transition-colors">{a.title}</h4>
                                    <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed">{a.content}</p>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{a.is_active ? 'Ativo' : 'Pendente'}</span>
                                        <button className="text-gray-600 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}><X size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-[#0d1e45] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                        <div className="p-8 border-b border-white/10 bg-[#0a1b3f] flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{editItem ? 'Editar Artigo' : 'Novo Artigo'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Título</label>
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b]" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    {categories.filter(c => c.value !== 'all').map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conteúdo</label>
                                <textarea className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#c9a05b]" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-8 bg-[#0a1b3f] flex justify-end gap-4">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 text-xs font-bold text-gray-400">Cancelar</button>
                            <button onClick={handleSave} className="bg-[#c9a05b] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg">Salvar Artigo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


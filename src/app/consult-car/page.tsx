'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, Car, Fuel, MapPin, Shield, Calendar, Palette, Hash,
    Copy, Check, Download, Clock, Trash2, ChevronRight, AlertTriangle,
    Loader2, FileText, Layers, Gauge, X, Plus, Zap, History, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleData {
    placa: string; marca: string; modelo: string; subModelo: string; versao: string;
    ano: string; anoModelo: string; cor: string; municipio: string; uf: string;
    situacao: string; chassi: string; dataAtualizacao: string; codigoRetorno: string;
    mensagemRetorno: string; extra: Record<string, string>; fipe?: {
        codigoFipe: string; valor: string; marca: string; modelo: string;
        anoModelo: number; combustivel: string; mesReferencia: string; dataConsulta: string;
    };
}

interface HistoryEntry { placa: string; marca: string; modelo: string; timestamp: number; }

const PLATE_RE = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i;
const STORAGE_KEY = 'rocha_consult_car_history';

function formatPlate(raw: string): string {
    const c = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (c.length <= 3) return c;
    return c.substring(0, 3) + '-' + c.substring(3);
}

function loadHistory(): HistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
}

const COLOR_MAP: Record<string, string> = {
    'PRATA': '#C0C0C0', 'BRANCA': '#F8F8F8', 'BRANCO': '#F8F8F8', 'PRETA': '#1a1a1a',
    'CINZA': '#808080', 'VERMELHA': '#DC2626', 'AZUL': '#2563EB', 'VERDE': '#16A34A',
    'AMARELA': '#EAB308', 'BEGE': '#D2B48C', 'MARROM': '#8B4513', 'DOURADA': '#DAA520',
};

export default function ConsultCarPage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VehicleData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [showBatch, setShowBatch] = useState(false);
    const [batchInput, setBatchInput] = useState('');
    const [batchResults, setBatchResults] = useState<VehicleData[]>([]);
    const [batchLoading, setBatchLoading] = useState(false);

    useEffect(() => { setHistory(loadHistory()); }, []);

    const searchPlate = useCallback(async (plate: string) => {
        const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (!PLATE_RE.test(clean)) {
            setError('Formato inválido. Use ABC1234 ou ABC1D23.');
            return null;
        }
        setLoading(true); setError(''); setResult(null);
        try {
            const res = await fetch(`/api/consult-car?placa=${clean}`);
            const json = await res.json();
            if (json.success && json.data) {
                setResult(json.data);
                const entry: HistoryEntry = { placa: clean, marca: json.data.marca, modelo: json.data.modelo, timestamp: Date.now() };
                const updated = [entry, ...history.filter(h => h.placa !== clean)].slice(0, 50);
                setHistory(updated); saveHistory(updated);
                return json.data;
            }
            setError(json.error || 'Erro na consulta');
            return null;
        } catch { setError('Falha na conexão'); return null; }
        finally { setLoading(false); }
    }, [history]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) searchPlate(query); };

    const handleBatch = async () => {
        const plates = batchInput.split(/[\n,;]+/).map(p => p.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase()).filter(p => PLATE_RE.test(p));
        if (plates.length === 0) return;
        setBatchLoading(true); setBatchResults([]);
        const results: VehicleData[] = [];
        for (const plate of plates) {
            try {
                const res = await fetch(`/api/consult-car?placa=${plate}`);
                const json = await res.json();
                if (json.success && json.data) results.push(json.data);
            } catch { /* skip */ }
            await new Promise(r => setTimeout(r, 500));
        }
        setBatchResults(results); setBatchLoading(false);
    };

    const handleCopyJSON = () => {
        const data = showBatch && batchResults.length > 0 ? batchResults : result ? [result] : [];
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const clearHistory = () => { setHistory([]); saveHistory([]); };

    const renderField = (icon: any, label: string, value: string, accent?: string) => {
        const Icon = icon;
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5">
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", accent || "text-cyan-400")} />
                <div className="min-w-0">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{label}</div>
                    <div className="text-sm font-bold text-slate-200 break-words">{value}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-6">
                <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <Car className="w-5 h-5 text-cyan-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Rocha <span className="text-cyan-400">Consult Car</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setShowBatch(!showBatch); setResult(null); }} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", showBatch ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>
                            <Layers className="w-3 h-3" />
                            {showBatch ? 'Consulta Única' : 'Lote'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* Main Column */}
                    <div className="space-y-6">
                        {/* Search Hero */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-slate-900/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Consulta Veicular Integrada
                                </div>
                                <h2 className="text-2xl font-black text-white mb-4">
                                    {showBatch ? 'Consulta em Lote' : 'Consultar Placa'}
                                </h2>

                                {!showBatch ? (
                                    <form onSubmit={handleSearch} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                ref={inputRef}
                                                value={query}
                                                onChange={e => setQuery(e.target.value.toUpperCase())}
                                                placeholder="Digite a placa (ex: ABC1234)"
                                                maxLength={8}
                                                className="w-full h-14 px-5 pr-14 rounded-2xl bg-slate-800/60 border border-white/10 focus:border-cyan-500/50 text-lg font-black tracking-[0.2em] placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-normal outline-none transition-all"
                                            />
                                            {query && (
                                                <button type="button" onClick={() => { setQuery(''); setResult(null); setError(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <button type="submit" disabled={loading || !query.trim()} className="h-14 px-8 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                            Consultar
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-3">
                                        <textarea
                                            value={batchInput}
                                            onChange={e => setBatchInput(e.target.value.toUpperCase())}
                                            placeholder={"Cole as placas, uma por linha:\nABC1234\nDEF5678\nGHI9J12"}
                                            rows={5}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-800/60 border border-white/10 focus:border-cyan-500/50 text-sm font-mono placeholder:text-slate-600 outline-none transition-all resize-none"
                                        />
                                        <button onClick={handleBatch} disabled={batchLoading || !batchInput.trim()} className="h-12 px-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2">
                                            {batchLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : <><Layers className="w-4 h-4" /> Consultar Lote</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span className="text-sm text-rose-300">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Single Result */}
                        <AnimatePresence>
                            {result && !showBatch && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    {/* Vehicle Header */}
                                    <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                                    <Car className="w-7 h-7 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <div className="text-xl font-black text-white">{result.marca} {result.modelo}</div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-black tracking-widest">{formatPlate(result.placa)}</span>
                                                        <span className="text-[10px] font-mono text-slate-500">{result.ano}/{result.anoModelo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={handleCopyJSON} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all" title="Copiar JSON">
                                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status bar */}
                                        <div className={cn("p-3 rounded-xl flex items-center gap-3 text-sm font-bold", result.situacao.includes('Sem restrição') ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border border-rose-500/10")}>
                                            <Shield className="w-4 h-4" />
                                            {result.situacao}
                                        </div>
                                    </div>

                                    {/* Data Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {renderField(Car, 'Marca', result.marca, 'text-cyan-400')}
                                        {renderField(FileText, 'Modelo', result.modelo, 'text-cyan-400')}
                                        {renderField(Info, 'Sub-Modelo', result.subModelo, 'text-slate-400')}
                                        {renderField(Calendar, 'Ano/Modelo', `${result.ano}/${result.anoModelo}`, 'text-amber-400')}
                                        {renderField(Palette, 'Cor', result.cor, 'text-pink-400')}
                                        {renderField(MapPin, 'Município/UF', `${result.municipio} - ${result.uf}`, 'text-emerald-400')}
                                        {renderField(Hash, 'Chassi', result.chassi, 'text-slate-400')}
                                        {renderField(Shield, 'Situação', result.situacao, result.situacao.includes('Sem') ? 'text-emerald-400' : 'text-rose-400')}
                                        {result.extra?.combustivel && renderField(Fuel, 'Combustível', result.extra.combustivel, 'text-orange-400')}
                                        {result.extra?.tipo && renderField(Layers, 'Tipo', result.extra.tipo, 'text-indigo-400')}
                                        {result.extra?.potencia && renderField(Gauge, 'Potência', result.extra.potencia, 'text-violet-400')}
                                        {result.extra?.categoria && renderField(FileText, 'Categoria', result.extra.categoria, 'text-teal-400')}
                                    </div>

                                    {/* FIPE Data (if available) */}
                                    {result.fipe && (
                                        <div className="p-6 rounded-2xl border border-transparent bg-gradient-to-r from-emerald-500/10 to-teal-500/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Gauge className="w-24 h-24 text-emerald-500" />
                                            </div>
                                            <div className="relative">
                                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
                                                    <Zap className="w-4 h-4" />
                                                    Avaliação Tabela FIPE
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                                                    <div>
                                                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Valor de Referência ({result.fipe.mesReferencia})</div>
                                                        <div className="text-4xl font-black text-white tracking-tight">{result.fipe.valor}</div>
                                                        <div className="text-xs text-slate-400 mt-2">
                                                            Código FIPE: <span className="text-emerald-400 font-mono font-bold tracking-wider ml-1">{result.fipe.codigoFipe}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-900/50 border border-white/5 min-w-[200px]">
                                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                                            <span className="text-slate-500">Combustível</span>
                                                            <span className="text-slate-300 font-bold">{result.fipe.combustivel}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                                            <span className="text-slate-500">Ano Referência</span>
                                                            <span className="text-slate-300 font-bold">{result.fipe.anoModelo}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                                            <span className="text-slate-500">Consulta</span>
                                                            <span className="text-slate-300 font-bold">{result.fipe.dataConsulta.split(' ')[0]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer info */}
                                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-600 px-1 pt-2">
                                        <span>{result.mensagemRetorno}</span>
                                        <span>Atualizado: {new Date(result.dataAtualizacao).toLocaleString('pt-BR')}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Batch Results */}
                        <AnimatePresence>
                            {showBatch && batchResults.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400">{batchResults.length} veículos encontrados</span>
                                        <button onClick={handleCopyJSON} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-widest transition-all">
                                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'Copiado!' : 'Copiar Todos'}
                                        </button>
                                    </div>
                                    {batchResults.map((v, i) => (
                                        <motion.div key={v.placa} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex items-center gap-4 hover:border-cyan-500/20 transition-all cursor-pointer"
                                            onClick={() => { setResult(v); setShowBatch(false); }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                                                <Car className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-sm text-white">{v.marca} {v.modelo}</span>
                                                    <span className="text-[10px] font-mono text-slate-500">{v.ano}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-0.5">
                                                    <span className="text-cyan-400 font-bold">{formatPlate(v.placa)}</span>
                                                    <span>{v.cor}</span>
                                                    <span>{v.municipio}-{v.uf}</span>
                                                </div>
                                            </div>
                                            <div className={cn("px-2 py-1 rounded-lg text-[9px] font-bold", v.situacao.includes('Sem') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                                                {v.situacao.includes('Sem') ? 'OK' : '⚠'}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar - History */}
                    <div className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl border border-white/5 bg-slate-900/40">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <History className="w-3.5 h-3.5 text-cyan-400" /> Histórico
                                </h3>
                                {history.length > 0 && (
                                    <button onClick={clearHistory} className="text-[9px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-widest">
                                        Limpar
                                    </button>
                                )}
                            </div>
                            {history.length === 0 ? (
                                <div className="text-center py-8 text-slate-600 text-[11px] font-mono">
                                    Nenhuma consulta realizada
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                    {history.map((h, i) => (
                                        <button key={h.placa + h.timestamp} onClick={() => { setQuery(h.placa); searchPlate(h.placa); setShowBatch(false); }}
                                            className="w-full p-3 rounded-xl bg-slate-800/30 border border-white/5 hover:border-cyan-500/20 transition-all text-left group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-cyan-400 tracking-widest">{formatPlate(h.placa)}</span>
                                                <Clock className="w-3 h-3 text-slate-600" />
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">{h.marca} {h.modelo}</div>
                                            <div className="text-[8px] font-mono text-slate-600 mt-1">
                                                {new Date(h.timestamp).toLocaleString('pt-BR')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Info */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl border border-white/5 bg-slate-900/30">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                                <Info className="w-3.5 h-3.5 text-cyan-400" /> Formatos Aceitos
                            </h3>
                            <div className="space-y-2 text-[10px] font-mono text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold">ABC1234</span>
                                    <span>— Formato antigo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold">ABC1D23</span>
                                    <span>— Mercosul</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                                <div className="text-xl font-black text-cyan-400">{history.length}</div>
                                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Consultas</div>
                            </div>
                            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                                <div className="text-xl font-black text-emerald-400">{new Set(history.map(h => h.marca)).size}</div>
                                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Marcas</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.04),transparent_60%)]" />
        </div>
    );
}

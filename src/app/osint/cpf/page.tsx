'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    User,
    Building2,
    FileText,
    History,
    Shield,
    Database,
    Zap,
    Download,
    CreditCard,
    Network,
    AlertCircle,
    Loader2,
    ChevronRight,
    MapPin,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface SearchResult {
    id: string;
    type: 'CPF' | 'CNPJ' | 'PROPRIE';
    name: string;
    document: string;
    details?: any;
    score?: number;
}

export default function DocumentSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(`/api/osint/cpf?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na busca de documentos.');
            }

            setResults(data.results || []);
        } catch (err: any) {
            setError(err.message || 'Falha na conexão com a base do BR-ACC.');
        } finally {
            setIsSearching(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'CNPJ': return Building2;
            case 'PF': return User;
            case 'CONTRATO': return FileText;
            default: return Database;
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500/30">
            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-6">
                <div className="max-w-[1500px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/osint')}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4 text-amber-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Document <span className="text-amber-400">Search</span>
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Database className="w-3 h-3 text-indigo-400" />
                            DB: <span className="text-slate-300">BR-ACC CORE</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Zap className="w-3 h-3 text-amber-400" />
                            LATENCY: <span className="text-slate-300">14ms</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Parameter Entry"
                            subtitle="Identity Correlation Engine"
                            status={isSearching ? "alert" : "operational"}
                        >
                            <div className="p-8 space-y-8">
                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                                            Document / Name / UID
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Search className="w-5 h-5 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="000.000.000-00"
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching || !query.trim()}
                                        className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-lg shadow-amber-950/20"
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-3" />
                                                Correlating Data...
                                            </>
                                        ) : (
                                            <>
                                                <Database className="w-4 h-4 mr-3" />
                                                Execute Query
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                        <History className="w-3 h-3" />
                                        Target Criteria
                                    </h5>
                                    <div className="space-y-2">
                                        {[
                                            'Pessoas Físicas (Receita Federal)',
                                            'Pessoas Jurídicas (Quadro Societário)',
                                            'Contratos e Licitações',
                                            'Filiados e Colaboradores'
                                        ].map((text, i) => (
                                            <div key={i} className="flex items-center gap-3 py-1 text-[10px] text-slate-400 font-mono">
                                                <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Results Section */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <SurveillanceHUD
                            title="Intelligence Output"
                            subtitle="Matched Entities & Network Nodes"
                            status={results.length > 0 ? "operational" : "offline"}
                        >
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {results.length > 0 ? (
                                        <div className="space-y-4">
                                            {results.map((result: any, i) => {
                                                const Icon = getIcon(result.type);
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="group p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 hover:border-amber-500/30 transition-all"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                            <div className="flex items-center gap-5">
                                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                                    <Icon className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="font-black text-slate-200 uppercase tracking-tight">{result.name}</h4>
                                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-white/5 uppercase">
                                                                            {result.type}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs font-mono text-slate-500">
                                                                        ID: <span className="text-slate-400">{result.document || result.id}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right hidden md:block">
                                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exposure Score</div>
                                                                    <div className="text-sm font-black text-emerald-400">HIGH</div>
                                                                </div>
                                                                <button className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                            <Network className="w-16 h-16 text-slate-600 mb-6" />
                                            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Awaiting Nexus Link</h3>
                                            <p className="text-sm text-slate-600 mt-2 font-mono italic">Input target identifier to correlate network data</p>
                                        </div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-10 p-6 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                                            <Network className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Graph Analysis Protocol</h5>
                                            <p className="text-[10px] text-slate-500 font-mono mt-1">Cross-referencing database nodes for relational clusters</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                                        Visualize Map
                                    </button>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>
                </div>
            </main>

            {/* Global Background Scan */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />
        </div>
    );
}

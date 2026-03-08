'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Database,
    Search,
    ShieldAlert,
    Zap,
    History,
    Loader2,
    ChevronRight,
    Server,
    ShieldX,
    FolderLock,
    Eye,
    Download,
    Terminal as TerminalIcon,
    AlertCircle,
    Copy,
    Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface LeakEntry {
    database: string;
    date: string;
    match_type: 'Email' | 'Password' | 'Full Profile' | 'IP Address';
    content_hint: string;
}

export default function CrossLeaks() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<LeakEntry[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResults([]);

        // Simulate deep database search
        setTimeout(() => {
            setResults([
                { database: 'ComboList_Private_v2', date: '2024-01-12', match_type: 'Email', content_hint: 'user:pass hash detected' },
                { database: 'Brazil_Gov_Leak_2021', date: '2021-02-15', match_type: 'Full Profile', content_hint: 'CPF: ***.***.***-** matched' },
                { database: 'Global_E-commerce_Dump', date: '2022-11-30', match_type: 'Password', content_hint: 'md5:8b1a9953c4611296...' },
            ]);
            setIsSearching(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-rose-500/30">
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
                            <Database className="w-4 h-4 text-rose-500" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Cross <span className="text-rose-500">Leaks</span>
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <TerminalIcon className="w-3 h-3 text-rose-500" />
                            VAULTS: <span className="text-slate-300">ONLINE [4,281]</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Search Controller */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Database Ingest"
                            subtitle="Massive Data Leak Aggregator"
                            status={isSearching ? "alert" : "operational"}
                        >
                            <div className="p-8 space-y-8">
                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                                            Identifier (Email/User/IP/CPF)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FolderLock className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <input
                                                type="text"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="Enter target signature..."
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-rose-500/50 transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching || !query.trim()}
                                        className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-lg shadow-rose-950/20"
                                    >
                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <div className="w-4 h-4 bg-white/20 rounded-full mr-3 animate-pulse" />}
                                        {isSearching ? "Indexing Repos..." : "Execute Cross-Search"}
                                    </button>
                                </form>

                                <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 space-y-4">
                                    <h6 className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Operation Security
                                    </h6>
                                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed italic">
                                        Data is queried through shadow-net mirrors. No direct connection to indexed archives is established.
                                    </p>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Right: Detected Vaults */}
                    <div className="col-span-12 lg:col-span-8">
                        <SurveillanceHUD
                            title="Intercepted Vaults"
                            subtitle="Matched Records in Breached Archives"
                            status={results.length > 0 ? "operational" : "offline"}
                        >
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {results.length > 0 ? (
                                        <div className="space-y-4">
                                            {results.map((leak, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 hover:border-rose-500/30 transition-all"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                                                <Database className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-black text-slate-200 uppercase tracking-tight">{leak.database}</h4>
                                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                                                                        {leak.match_type}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs font-mono text-slate-500">
                                                                    Match Signature: <span className="text-rose-400/80">{leak.content_hint}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right hidden md:block">
                                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compromised Date</div>
                                                                <div className="text-xs font-mono text-slate-400">{leak.date}</div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all">
                                                                    <Download className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                            <ShieldX className="w-16 h-16 text-slate-600 mb-6" />
                                            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">No Archive Link</h3>
                                            <p className="text-sm text-slate-600 mt-2 font-mono italic">Execute cross-search to query intercepted repositories</p>
                                        </div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-10 p-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-500/20 rounded-xl">
                                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black text-rose-500 uppercase tracking-widest">Deep Vault Decryption</h5>
                                            <p className="text-[10px] text-slate-500 font-mono mt-1">Brute-forcing known leaks for associative identifiers</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-2 text-slate-500 hover:text-rose-400">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-500 hover:text-rose-400">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Search,
    ShieldAlert,
    Database,
    Zap,
    History,
    Loader2,
    ChevronRight,
    Globe,
    Lock,
    Unlock,
    AlertTriangle,
    CheckCircle2,
    Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface Breach {
    name: string;
    date: string;
    description: string;
}

interface EmailResult {
    email: string;
    mx_records: string[];
    breaches: Breach[];
    reputation: 'Clean' | 'Suspicious' | 'Malicious';
    is_disposable: boolean;
}

export default function EmailAnalysis() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<EmailResult | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResult(null);

        // Simulate API call for Email Analysis
        setTimeout(() => {
            setResult({
                email: query,
                mx_records: ['mx-01.google.com', 'mx-02.google.com'],
                breaches: [
                    { name: 'Adobe Leak (2013)', date: '2013-10-04', description: 'Emails, Passwords, Hints' },
                    { name: 'LinkedIn Breach (2016)', date: '2016-05-17', description: 'Emails, Hashed Passwords' }
                ],
                reputation: 'Suspicious',
                is_disposable: false
            });
            setIsSearching(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
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
                            <Mail className="w-4 h-4 text-blue-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Email <span className="text-blue-400">Analysis</span>
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <ShieldAlert className="w-3 h-3 text-red-400" />
                            BREACH MONITOR: <span className="text-slate-300">SCANNING</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Input */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Credentials Probe"
                            subtitle="Breach Database Intersection"
                            status={isSearching ? "alert" : "operational"}
                        >
                            <div className="p-8 space-y-8">
                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                                            Target Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <input
                                                type="email"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="target@identity.com"
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching || !query.trim()}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center"
                                    >
                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Search className="w-4 h-4 mr-3" />}
                                        {isSearching ? "Crawling Breaches..." : "Scan Email"}
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                        <Server className="w-3 h-3" />
                                        Data Sources
                                    </h5>
                                    <div className="space-y-2">
                                        {[
                                            'Have I Been Pwned Index',
                                            'DeHashed Search API',
                                            'BreachDirectory Logs',
                                            'Internal Combo Repos'
                                        ].map((text, i) => (
                                            <div key={i} className="flex items-center gap-3 py-1 text-[10px] text-slate-400 font-mono">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Right: Intelligence Output */}
                    <div className="col-span-12 lg:col-span-8">
                        <SurveillanceHUD
                            title="Exposure Dossier"
                            subtitle="Credential Leaks & Domain Trust"
                            status={result ? "operational" : "offline"}
                        >
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {result ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40">
                                                    <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Reputation</div>
                                                    <div className={cn(
                                                        "text-sm font-black uppercase",
                                                        result.reputation === 'Clean' ? "text-emerald-400" : "text-amber-400"
                                                    )}>{result.reputation}</div>
                                                </div>
                                                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40">
                                                    <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Disposable</div>
                                                    <div className="text-sm font-black text-slate-200">{result.is_disposable ? 'YES' : 'NO'}</div>
                                                </div>
                                                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40">
                                                    <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Risk Score</div>
                                                    <div className="text-sm font-black text-rose-500">7.2/10</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-xs font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Detected Leaks ({result.breaches.length})
                                                </h5>
                                                <div className="space-y-3">
                                                    {result.breaches.map((breach, i) => (
                                                        <div key={i} className="p-5 rounded-2xl border border-rose-500/10 bg-rose-500/5 flex items-center justify-between group hover:border-rose-500/30 transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
                                                                    <Unlock className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-black text-slate-200">{breach.name}</h4>
                                                                    <p className="text-[10px] text-slate-500 font-mono mt-1">Data: {breach.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-mono text-slate-600">{breach.date}</div>
                                                                <div className="text-[10px] font-black text-rose-400 uppercase tracking-tighter mt-1">EXPOSED</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                                    <Server className="w-3 h-3" />
                                                    MX Infrastructure
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.mx_records.map((record, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-950/50 border border-white/5 font-mono text-[10px] text-slate-400">
                                                            {record}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                            <Database className="w-16 h-16 text-slate-600 mb-6" />
                                            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Awaiting Probe</h3>
                                            <p className="text-sm text-slate-600 mt-2 font-mono italic">Enter target identifier to intersect breach archives</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </SurveillanceHUD>
                    </div>
                </div>
            </main>
        </div>
    );
}

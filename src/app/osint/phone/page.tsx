'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Phone,
    Search,
    MapPin,
    Building2,
    Wifi,
    Zap,
    History,
    Loader2,
    ChevronRight,
    MessageSquare,
    ShieldCheck,
    Globe,
    Satellite,
    PhoneCall,
    Terminal,
    AlertTriangle,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface PhoneResult {
    number: string;
    carrier: string;
    location: string;
    owner: string;
    ownerType: string;
    ownerDoc: string;
    exposureRisk: string;
    hlrStatus: string;
    whatsapp: string;
    ported: string;
    latency: string;
    protocol: string;
    lastLocationUpdate: string;
    billingAddress: string;
}

export default function PhoneTrace() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<PhoneResult | null>(null);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setResult(null);
        setError('');
        setLogs([]);

        addLog("INITIALIZING SS7 SIGNAL INTERCEPT...");
        addLog("TARGETING GSM NODE: " + query);

        try {
            // Add some dramatic delay for "decryption" feel
            await new Promise(r => setTimeout(r, 800));
            addLog("CORRELATING HLR/VLR REGISTERS...");

            const response = await fetch('/api/osint/phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: query })
            });

            const data = await response.json();

            if (response.ok) {
                addLog("NODE RESOLVED. DECRYPTING IDENTITY...");
                await new Promise(r => setTimeout(r, 600));
                setResult(data);
            } else {
                setError(data.error || 'Erro ao processar sinal.');
                addLog("SIGNAL CORRUPTION DETECTED: " + (data.error || 'UNKNOWN'));
            }
        } catch (err) {
            setError('Falha crítica na conexão com o protocolo Signal.');
            addLog("EMERGENCY SHUTDOWN: CONNECTION LOST");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
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
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Phone <span className="text-emerald-400">Trace</span>
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Satellite className="w-3 h-3 text-emerald-400" />
                            HLR QUERY: <span className="text-slate-300">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Input & Logs */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Signal Intercept"
                            subtitle="GSM/LTE Node Correlation"
                            status={isSearching ? "alert" : "operational"}
                        >
                            <div className="p-8 space-y-8">
                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                                            Mobile/Fixed Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <PhoneCall className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <input
                                                type="text"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="+55 (00) 00000-0000"
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                                            />
                                        </div>
                                        {error && (
                                            <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex gap-2 items-center">
                                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                                <p className="text-[10px] font-mono text-rose-500">{error}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching || !query.trim()}
                                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-lg shadow-emerald-950/20"
                                    >
                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Wifi className="w-4 h-4 mr-3" />}
                                        {isSearching ? "Intercepting..." : "Initiate Trace"}
                                    </button>
                                </form>

                                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/50 space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h6 className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                            <Terminal className="w-3 h-3" /> Intercept Console
                                        </h6>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 min-h-[80px]">
                                        {logs.length > 0 ? logs.map((log, i) => (
                                            <div key={i} className="text-[9px] font-mono text-emerald-500/80 tracking-tight">
                                                {log}
                                            </div>
                                        )) : (
                                            <div className="text-[9px] font-mono text-slate-700 italic">SYSTEM IDLE - AWAITING TARGET</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Right: Intelligence Output */}
                    <div className="col-span-12 lg:col-span-8">
                        <SurveillanceHUD
                            title="Signal Dossier"
                            subtitle="Entity Ownership & Telephony Relational Mapping"
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
                                            <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                                                <div className="flex items-center gap-6">
                                                    <div className="p-4 bg-emerald-500/20 rounded-2xl">
                                                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Owner Identity Resolved</div>
                                                        <div className="text-2xl font-black text-slate-100 uppercase tracking-tighter">{result.owner}</div>
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full">{result.ownerType}</span>
                                                            <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[9px] font-mono rounded-full flex items-center gap-2">
                                                                <FileText className="w-3 h-3" /> DOC: {result.ownerDoc}
                                                            </span>
                                                            <span className={cn(
                                                                "px-3 py-1 border text-[9px] font-black uppercase tracking-widest rounded-full",
                                                                result.exposureRisk === 'LOW' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                                    result.exposureRisk === 'MEDIUM' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                                                        "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                                            )}>RISK: {result.exposureRisk}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-indigo-500/20 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-all">
                                                            <MapPin className="w-5 h-5 text-indigo-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex justify-between">
                                                                <span>Geolocation Matrix</span>
                                                                <span className="text-emerald-400">{result.lastLocationUpdate}</span>
                                                            </div>
                                                            <div className="text-lg font-black text-slate-200">{result.location}</div>
                                                            <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase bg-slate-950/50 p-2 rounded-lg border border-white/5 pt-2">
                                                                <span className="text-indigo-400 font-bold">REGISTERED ADDRESS:</span> {result.billingAddress}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                                                            <MessageSquare className="w-5 h-5 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">WhatsApp Linked</h5>
                                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{result.whatsapp}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                                                            <History className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Portability History</div>
                                                            <div className="text-xs font-black text-slate-300">{result.ported}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 px-1">
                                                    <Zap className="w-3 h-3 text-amber-500" />
                                                    Advanced Protocol Metadata
                                                </h5>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {[
                                                        { label: 'HLR Status', value: result.hlrStatus, color: 'text-emerald-400' },
                                                        { label: 'Latency', value: result.latency },
                                                        { label: 'Protocol', value: result.protocol },
                                                        { label: 'Integrity', value: '100%', color: 'text-emerald-400' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-slate-950/50">
                                                            <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">{item.label}</div>
                                                            <div className={cn("text-xs font-black", item.color || "text-slate-200")}>{item.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                            <Satellite className="w-16 h-16 text-slate-600 mb-6" />
                                            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Awaiting Command</h3>
                                            <p className="text-sm text-slate-600 mt-2 font-mono italic">Initiate protocol to establish GSM handshake</p>
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

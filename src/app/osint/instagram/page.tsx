'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Instagram,
    Search,
    Loader2,
    Mail,
    Phone,
    User,
    Download,
    AlertCircle,
    Shield,
    Globe,
    Zap,
    Users,
    Image as ImageIcon,
    Target,
    Activity,
    ExternalLink,
    Lock,
    Eye,
    AtSign,
    Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface ScrapeResult {
    username: string;
    fullName: string;
    biography: string;
    followers: number;
    following: number;
    posts: number;
    isVerified: boolean;
    isPrivate: boolean;
    isBusiness: boolean;
    businessCategory?: string;
    profilePicUrl: string;
    extractedEmails: string[];
    extractedPhones: string[];
    externalUrl?: string;
    mentions: string[];
    extractedFollowers?: {
        username: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        riskScore: number;
    }[];
}

export default function InstagramScraper() {
    const router = useRouter();
    const [profileInput, setProfileInput] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [result, setResult] = useState<ScrapeResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [proxyLocation, setProxyLocation] = useState('BRAZIL-OSINT-02');

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileInput.trim()) return;

        setIsScraping(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/osint/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: profileInput })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido na API.');
            }

            setResult(data as ScrapeResult);
        } catch (err: any) {
            setError(err.message || 'Erro ao extrair dados. O perfil pode ser privado ou o Instagram bloqueou a requisição temporariamente.');
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-pink-500/30">
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
                            <Instagram className="w-4 h-4 text-pink-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Deep <span className="text-pink-400">Recon</span>
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Globe className="w-3 h-3 text-indigo-400" />
                            PROXY: <span className="text-slate-300">{proxyLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            OPSEC: <span className="text-emerald-400">MAXIMUM</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Operation Section */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Recon Module"
                            subtitle="Social Media Intelligence"
                            status={isScraping ? "alert" : "operational"}
                        >
                            <div className="p-8">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Target className="w-3 h-3 text-pink-500" />
                                    Target Acquisition
                                </h3>

                                <form onSubmit={handleScrape} className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <AtSign className="w-5 h-5 text-slate-600 group-focus-within:text-pink-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileInput}
                                            onChange={(e) => setProfileInput(e.target.value)}
                                            placeholder="username or URL"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all font-mono text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Advanced Scrape Plan</label>
                                        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Zap className="w-4 h-4 text-indigo-400" />
                                                <span className="text-xs font-bold">Deep Extraction Mode</span>
                                            </div>
                                            <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                                                <div className="w-3 h-3 bg-white rounded-full translate-x-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isScraping || !profileInput.trim()}
                                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-lg shadow-indigo-950/20"
                                    >
                                        {isScraping ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-3" />
                                                Analyzing Target...
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4 mr-3" />
                                                Initiate Recon
                                            </>
                                        )}
                                    </button>
                                </form>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 flex gap-4 text-rose-400"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p className="text-[10px] font-mono leading-relaxed">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </SurveillanceHUD>

                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20 space-y-3">
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3 h-3" />
                                Traffic Log
                            </h4>
                            <div className="font-mono text-[9px] text-slate-600 space-y-1">
                                <div>[01:24:02] RECON_REQUEST -&gt; {profileInput || 'NULL'}</div>
                                {isScraping && <div className="text-indigo-400 animate-pulse">[01:24:03] BYPASSING_ANTI_BOT...</div>}
                                {result && <div className="text-emerald-400">[01:24:05] INTEL_EXTRACTED: SUCCESS</div>}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <SurveillanceHUD title="Target Intelligence" subtitle="Extracted Profile Data">
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                                <div className="relative shrink-0">
                                                    <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 ring-4 ring-pink-500/20 ring-offset-4 ring-offset-[#020617]">
                                                        <img src={result.profilePicUrl} alt={result.username} className="w-full h-full object-cover" />
                                                    </div>
                                                    {result.isVerified && (
                                                        <div className="absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-full border-4 border-[#020617]">
                                                            <div className="w-3 h-3 bg-white mask mask-check" />
                                                            <Shield className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-6">
                                                    <div>
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <h3 className="text-3xl font-black tracking-tighter">{result.fullName}</h3>
                                                            {result.isPrivate && <Lock className="w-4 h-4 text-amber-500" />}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-pink-400 font-mono text-sm">
                                                            <AtSign className="w-3 h-3" />
                                                            {result.username}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-4">
                                                        {[
                                                            { label: 'Followers', val: result.followers, icon: Users },
                                                            { label: 'Following', val: result.following, icon: User },
                                                            { label: 'Posts', val: result.posts, icon: ImageIcon },
                                                            { label: 'Category', val: result.businessCategory || 'Standard', icon: Target },
                                                        ].map((stat, i) => (
                                                            <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-center">
                                                                <stat.icon className="w-3 h-3 mx-auto mb-2 text-slate-500" />
                                                                <div className="text-sm font-black text-slate-200">{typeof stat.val === 'number' ? stat.val.toLocaleString() : stat.val}</div>
                                                                <div className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">{stat.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 pt-2 border-t border-white/5">
                                                        <AtSign className="w-3 h-3" />
                                                        Biography Data
                                                    </h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed font-mono bg-slate-950/50 p-6 rounded-2xl border border-white/5 italic">
                                                        {result.biography || 'NO_BIO_RECORDED'}
                                                    </p>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 pt-2 border-t border-white/5">
                                                            <Mail className="w-3 h-3 text-indigo-400" />
                                                            Contact Intelligence
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {result.extractedEmails.length > 0 || result.extractedPhones.length > 0 ? (
                                                                <>
                                                                    {result.extractedEmails.map((email, i) => (
                                                                        <div key={i} className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center justify-between">
                                                                            <span className="text-xs font-mono text-indigo-300">{email}</span>
                                                                            <button className="p-1.5 hover:bg-indigo-500/20 rounded-lg text-indigo-400"><Download className="w-3 h-3" /></button>
                                                                        </div>
                                                                    ))}
                                                                    {result.extractedPhones.map((phone, i) => (
                                                                        <div key={i} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                                                                            <span className="text-xs font-mono text-emerald-400">{phone}</span>
                                                                            <button className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-400"><Download className="w-3 h-3" /></button>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <div className="text-[10px] font-mono text-slate-600 bg-slate-900/20 p-4 rounded-xl border border-white/5 border-dashed text-center uppercase tracking-widest">
                                                                    [No Communications Detected]
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 pt-2 border-t border-white/5">
                                                            <Share2 className="w-3 h-3 text-blue-400" />
                                                            Relational Mentions
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {result.mentions.length > 0 ? result.mentions.map((mention, i) => (
                                                                <button key={i} className="px-3 py-1.5 bg-slate-900/60 border border-white/5 rounded-lg text-[10px] text-pink-400 font-bold hover:border-pink-500/30 transition-all">
                                                                    @{mention}
                                                                </button>
                                                            )) : (
                                                                <span className="text-[10px] font-mono text-slate-600 uppercase italic">N/A</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {result.extractedFollowers && result.extractedFollowers.length > 0 && (
                                                <div className="mt-10 space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 pt-2 border-t border-white/5">
                                                        <Users className="w-3 h-3 text-pink-400" />
                                                        Follower Network Extradition (Sample)
                                                    </h4>
                                                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-900/40">
                                                        <table className="w-full text-left text-[10px] sm:text-xs">
                                                            <thead className="bg-slate-800/50 text-slate-400 font-mono">
                                                                <tr>
                                                                    <th className="px-4 py-3 font-bold uppercase tracking-widest">Target</th>
                                                                    <th className="px-4 py-3 font-bold uppercase tracking-widest">Leaked Email</th>
                                                                    <th className="px-4 py-3 font-bold uppercase tracking-widest">Intercepted Phone</th>
                                                                    <th className="px-4 py-3 font-bold uppercase tracking-widest">Risk</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5">
                                                                {result.extractedFollowers.map((follower, i) => (
                                                                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                                                        <td className="px-4 py-3">
                                                                            <div className="font-bold text-slate-200">{follower.fullName}</div>
                                                                            <div className="text-[9px] text-pink-400 font-mono">@{follower.username}</div>
                                                                        </td>
                                                                        <td className="px-4 py-3 font-mono">
                                                                            {follower.email ? (
                                                                                <span className="text-indigo-300">{follower.email}</span>
                                                                            ) : (
                                                                                <span className="text-slate-600 italic">SECURE</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3 font-mono">
                                                                            {follower.phone ? (
                                                                                <span className="text-emerald-400">{follower.phone}</span>
                                                                            ) : (
                                                                                <span className="text-slate-600 italic">SECURE</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <span className={cn(
                                                                                "px-2 py-1 rounded border text-[8px] font-black uppercase tracking-widest",
                                                                                follower.riskScore > 75 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                                                                                    follower.riskScore > 40 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                                                                                        "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                                            )}>
                                                                                {follower.riskScore}%
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-8 flex gap-4">
                                                <button className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                    <Download className="w-4 h-4" />
                                                    Download Dossier
                                                </button>
                                                {result.externalUrl && (
                                                    <a
                                                        href={result.externalUrl}
                                                        target="_blank"
                                                        className="flex-1 py-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        External Node
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </SurveillanceHUD>
                                </motion.div>
                            ) : (
                                <div className="h-full min-h-[500px] border border-white/5 rounded-[40px] bg-slate-900/20 border-dashed flex flex-col items-center justify-center text-center opacity-40">
                                    <Target className="w-16 h-16 text-slate-600 mb-6" />
                                    <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Target Node Inactive</h3>
                                    <p className="text-sm text-slate-600 mt-2 font-mono">Initialize recon protocol to acquire intelligence</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(219,39,119,0.03),transparent_70%)]" />
        </div>
    );
}


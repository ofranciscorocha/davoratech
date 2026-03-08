'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Globe,
    Search,
    Copy,
    ExternalLink,
    Shield,
    Terminal,
    Command,
    AlertTriangle,
    FileText,
    UserSearch,
    Share2,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface DorkTemplate {
    id: string;
    label: string;
    description: string;
    icon: any;
    query: string;
    category: 'profile' | 'documents' | 'directory' | 'leaks';
}

const dorkTemplates: DorkTemplate[] = [
    {
        id: 'ig-profile',
        label: 'Instagram Profile Discovery',
        description: 'Find profiles by name and keywords across Instagram indexing.',
        icon: UserSearch,
        query: 'site:instagram.com "[[target]]"',
        category: 'profile'
    },
    {
        id: 'ig-mentions',
        label: 'Instagram Mentions',
        description: 'Locate public mentions of a specific handle in bios or posts.',
        icon: Share2,
        query: 'site:instagram.com "@[[target]]"',
        category: 'profile'
    },
    {
        id: 'doc-search',
        label: 'Exposed Documents',
        description: 'Search for PDFs, DOCX, and XLSX files associated with the target.',
        icon: FileText,
        query: 'site:gov.br "[[target]]" filetype:pdf OR filetype:docx OR filetype:xlsx',
        category: 'documents'
    },
    {
        id: 'dir-listing',
        label: 'Directory Listing',
        description: 'Find open web directories containing target data.',
        icon: Globe,
        query: 'intitle:"index of" "[[target]]"',
        category: 'directory'
    },
    {
        id: 'leaked-configs',
        label: 'Leaked Configurations',
        description: 'Search for .env, .git, or .json files indexed by Google.',
        icon: Shield,
        query: 'filetype:env OR filetype:json OR filetype:sql "[[target]]"',
        category: 'leaks'
    },
    {
        id: 'social-pivot',
        label: 'Social Media Pivot',
        description: 'Find the target across multiple platforms (LinkedIn, FB, Twitter).',
        icon: Eye,
        query: '(site:linkedin.com OR site:facebook.com OR site:twitter.com) "[[target]]"',
        category: 'profile'
    }
];

export default function GoogleDorksPage() {
    const router = useRouter();
    const [target, setTarget] = useState('');
    const [selectedDork, setSelectedDork] = useState<DorkTemplate | null>(null);
    const [generatedQuery, setGeneratedQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = (dork: DorkTemplate) => {
        if (!target) return;
        setSelectedDork(dork);
        const query = dork.query.replace('[[target]]', target);
        setGeneratedQuery(query);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedQuery);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openInGoogle = () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(generatedQuery)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
            {/* Top Command Bar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-6">
                <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/osint')}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Google <span className="text-cyan-400">Dorks</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        <SurveillanceHUD
                            title="Parameter Ingestion"
                            subtitle="Dork Configuration"
                            status={target ? "operational" : "alert"}
                        >
                            <div className="p-8 space-y-8">
                                <div>
                                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-3">
                                        Target Identifier (Name, Username, Organization)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Command className="w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="e.g. jhon_doe_investigation"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal className="w-3 h-3" />
                                        Select Dork Template
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {dorkTemplates.map((dork) => (
                                            <button
                                                key={dork.id}
                                                onClick={() => handleGenerate(dork)}
                                                disabled={!target}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                                                    selectedDork?.id === dork.id
                                                        ? "bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/30"
                                                        : target
                                                            ? "bg-slate-900/40 border-white/5 hover:border-white/20"
                                                            : "bg-slate-900/10 border-white/5 opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-2 rounded-lg bg-white/5",
                                                    selectedDork?.id === dork.id ? "text-cyan-400" : "text-slate-500"
                                                )}>
                                                    <dork.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-200">{dork.label}</h4>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{dork.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Result Section */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <SurveillanceHUD
                            title="Query Output"
                            subtitle="Generated Google Search Operators"
                            status={generatedQuery ? "operational" : "offline"}
                        >
                            <div className="p-8 h-full flex flex-col">
                                <AnimatePresence mode="wait">
                                    {generatedQuery ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex-1 flex flex-col"
                                        >
                                            <div className="relative group flex-1">
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/5"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copied ? <div className="text-[10px] text-emerald-400 font-bold px-1">COPIED</div> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <div className="w-full h-full min-h-[200px] bg-slate-950/80 border border-white/10 rounded-2xl p-8 font-mono text-cyan-400 text-lg flex items-center justify-center text-center break-all leading-relaxed">
                                                    {generatedQuery}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button
                                                    onClick={openInGoogle}
                                                    className="flex-1 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20"
                                                >
                                                    <Search className="w-4 h-4" />
                                                    Execute Search on Google
                                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                                </button>
                                            </div>

                                            <div className="mt-6 p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 flex gap-4 items-center">
                                                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                                <div>
                                                    <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">OPSEC Warning</h5>
                                                    <p className="text-[10px] text-rose-400/80 leading-relaxed font-mono">
                                                        Google may trigger CAPTCHAs for high-frequency dorking. Use a dedicated investigator profile or multi-hop proxy.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 grayscale opacity-40">
                                            <Terminal className="w-12 h-12 text-slate-600 mb-6" />
                                            <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Awaiting Parameters</h3>
                                            <p className="text-sm text-slate-600 mt-2 font-mono">Input a target and select a template to generate intel query</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </SurveillanceHUD>

                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                            <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Investigation Tip</h5>
                            <p className="text-[10px] text-slate-400 font-mono">
                                Combined dorks (using multiple filetypes or sites) are more effective at finding sensitive background data.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Background Scan */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent_70%)]" />
        </div>
    );
}

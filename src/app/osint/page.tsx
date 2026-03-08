'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    Instagram,
    Mail,
    Phone,
    User,
    Globe,
    Database,
    SearchCode,
    ShieldAlert,
    Cpu,
    Wifi,
    Building2,
    CreditCard,
    Zap,
    Lock,
    ExternalLink,
    Filter,
    Terminal as TerminalIcon,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface OsintTool {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    status: 'active' | 'development';
}

const tools: OsintTool[] = [
    {
        id: 'instagram',
        name: 'Instagram Scraper',
        description: 'Deep extraction of profiles, bios, posts, and relational mapping with stealth proxying.',
        icon: Instagram,
        color: 'text-pink-500',
        status: 'active'
    },
    {
        id: 'cpf',
        name: 'Busca por Documento',
        description: 'Cruze dados de CPF/CNPJ com bases públicas e registros empresariais do BR-ACC.',
        icon: User,
        color: 'text-amber-400',
        status: 'active'
    },
    {
        id: 'dorks',
        name: 'Google Dorks',
        description: 'Automação de operadores avançados para encontrar documentos e diretórios expostos.',
        icon: Globe,
        color: 'text-cyan-400',
        status: 'active'
    },
    {
        id: 'leaks',
        name: 'Cross-Leaks',
        description: 'Pesquise em arquivos de vazamentos conhecidos por credenciais expostas.',
        icon: Database,
        color: 'text-rose-500',
        status: 'active'
    },
    {
        id: 'email',
        name: 'Análise de E-mail',
        description: 'Verifique vazamentos de dados, domínios associados e registros MX.',
        icon: Mail,
        color: 'text-blue-400',
        status: 'active'
    },
    {
        id: 'phone',
        name: 'Trace de Telefone',
        description: 'Identifique operadoras, localização e registros vinculados a números de telefone.',
        icon: Phone,
        color: 'text-emerald-400',
        status: 'active'
    },
    {
        id: 'vehicle',
        name: 'Vehicle Radar',
        description: 'Consulte veículos por placa, chassi ou motor. Dados do proprietário, restrições e valor FIPE.',
        icon: CreditCard,
        color: 'text-amber-400',
        status: 'active'
    }
];

const libraryCategories = [
    { name: 'Busca e Descoberta', icon: Search, count: 420 },
    { name: 'Análise de Multimídia', icon: Zap, count: 180 },
    { name: 'Rede e Reconhecimento', icon: Wifi, count: 350 },
    { name: 'Identidade e Pessoas', icon: User, count: 450 },
    { name: 'Dark Web e Anonimato', icon: Lock, count: 120 },
    { name: 'Registros e Documentos', icon: Database, count: 280 }
];

export default function OsintDashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'tools' | 'library'>('tools');
    const [systemLogs, setSystemLogs] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            "INITIALIZING SURVEILLANCE MODULE...",
            "ESTABLISHING PROXY TUNNEL [CHILE-04]...",
            "ENCRYPTION HANDSHAKE: SUCCESS (AES-256)",
            "CONNECTED TO BR-ACC CORE DATABASES",
            "SCANNING FOR EXTERNAL OSINT SOURCES...",
            "INTEL HUB SYNCHRONIZED [1,642 ENTRIES]",
            "READY FOR INVESTIGATION."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setSystemLogs(prev => [...prev, logs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
            {/* Top Command Bar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-6">
                <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-75" />
                            </div>
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Mission <span className="text-indigo-400">Control</span>
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-[10px] font-mono text-slate-500">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-emerald-400" />
                            SYSTEM UPTIME: <span className="text-slate-300">99.98%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wifi className="w-3 h-3 text-indigo-400" />
                            SIGNAL: <span className="text-slate-300">ENCRYPTED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3 text-amber-400" />
                            AUTH LEVEL: <span className="text-slate-300">OVERSEER</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column: Command & Tools */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <SurveillanceHUD
                            title="Investigation Framework"
                            subtitle="Core Intelligence Modules"
                            status="operational"
                        >
                            <div className="p-8">
                                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter mb-2">OPERATIONAL HUB</h2>
                                        <p className="text-slate-500 text-sm font-mono uppercase tracking-wider">
                                            Select a module to initiate target reconnaissance
                                        </p>
                                    </div>

                                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                                        <button
                                            onClick={() => setActiveTab('tools')}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                                                activeTab === 'tools' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                                            )}
                                        >
                                            Modules
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('library')}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                                                activeTab === 'library' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
                                            )}
                                        >
                                            Library
                                        </button>
                                    </div>
                                </header>

                                <AnimatePresence mode="wait">
                                    {activeTab === 'tools' ? (
                                        <motion.div
                                            key="tools"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            {filteredTools.map((tool, i) => (
                                                <motion.div
                                                    key={tool.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    onClick={() => tool.status === 'active' ? router.push(`/osint/${tool.id}`) : null}
                                                    className={cn(
                                                        "group relative p-5 rounded-2xl border transition-all duration-300",
                                                        tool.status === 'active'
                                                            ? "bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-800/60 cursor-pointer"
                                                            : "bg-slate-950/20 border-white/5 opacity-40 grayscale"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={cn("p-3 rounded-xl bg-white/5 border border-white/5", tool.color)}>
                                                            <tool.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h3 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                                                    {tool.name}
                                                                </h3>
                                                                {tool.status === 'development' && (
                                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-white/5">
                                                                        Offline
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 leading-normal">
                                                                {tool.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="library"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                    { name: 'Pessoas e CPF', icon: User, links: ['Portal da Transparência', 'Escavador', 'Consulta Sócio'] },
                                                    { name: 'Empresas e CNPJ', icon: Building2, links: ['Casa dos Dados', 'Comprovante RF', 'Redesim'] },
                                                    { name: 'Veículos e Placas', icon: CreditCard, links: ['Sinesp Cidadão', 'Tabela Fipe', 'Detran-SP'] },
                                                    { name: 'Telefones e E-mail', icon: Phone, links: ['Qual Empresa Me Ligou', 'Have I Been Pwned', 'EPIOS'] },
                                                ].map((cat, i) => (
                                                    <div key={cat.name} className="p-4 rounded-xl border border-white/5 bg-slate-900/40">
                                                        <div className="flex items-center gap-3 mb-4 text-indigo-400">
                                                            <cat.icon className="w-4 h-4" />
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest">{cat.name}</h4>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {cat.links.map(link => (
                                                                <button key={link} className="w-full text-left text-[11px] text-slate-500 hover:text-white transition-colors flex items-center justify-between group">
                                                                    {link}
                                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 space-y-4">
                                                    <h5 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                                                        <TerminalIcon className="w-4 h-4" />
                                                        OSINTKit-Brasil Integration
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                                                        Direct access to over 1,600 intelligence nodes calibrated for Brazilian jurisdiction.
                                                    </p>
                                                    <button className="text-[10px] font-bold text-white uppercase tracking-widest px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5">
                                                        Launch Full Directory
                                                    </button>
                                                </div>
                                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 space-y-4">
                                                    <h5 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                                                        <ShieldAlert className="w-4 h-4" />
                                                        OPSEC Advisory
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                                                        External requests are routed via nested proxies. Verify leak integrity before correlation.
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[9px] font-mono text-emerald-400 uppercase">Stealth Tunnel Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </SurveillanceHUD>
                    </div>

                    {/* Right Column: Console & Status */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Terminal Console"
                            subtitle="System Event Stream"
                            className="h-full"
                        >
                            <div className="p-6 font-mono text-xs overflow-y-auto max-h-[500px] hide-scrollbar">
                                <div className="space-y-3">
                                    {systemLogs.map((log, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                                            <span className={cn(
                                                "flex-1",
                                                log.includes('SUCCESS') || log.includes('READY') ? "text-emerald-400" : "text-indigo-400/80"
                                            )}>
                                                {log}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 items-center">
                                        <span className="text-indigo-500">$</span>
                                        <div className="w-2 h-4 bg-indigo-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </SurveillanceHUD>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-900/20 border border-white/5 space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Targets Scanned</span>
                                <div className="text-xl font-black text-slate-200">12,482</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-900/20 border border-white/5 space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active Proxies</span>
                                <div className="text-xl font-black text-emerald-400">04</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Background Scan */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]" />
        </div>
    );
}


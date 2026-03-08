"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Search,
    ShieldCheck,
    BrainCircuit,
    Clock,
    AlertCircle,
    TrendingUp,
    Download,
    Plus,
    ArrowRight,
    Target,
    LayoutDashboard,
    Gavel,
    Files,
    Settings,
    Bell,
    Cpu,
    History,
    Filter,
    ExternalLink,
    RefreshCw,
    CheckCircle2,
    Database,
    CloudCog,
    ShieldAlert,
    FolderOpen,
    FileSignature,
    Upload,
    HardDrive
} from "lucide-react";
import './licitacoes.css';

const API_BASE = '/api/licitacoes';

export default function LicitacoesPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isScanning, setIsScanning] = useState(false);
    const [dbBids, setDbBids] = useState<any[]>([]);
    const [dbStats, setDbStats] = useState({ totalMonitored: 0, aiAnalysisToday: 0 });
    const [dbDocs, setDbDocs] = useState<any[]>([]);
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(`${API_BASE}/dashboard`);
            if (res.ok) {
                const data = await res.json();
                setDbBids(data.bids || []);
                setDbStats(data.stats || { totalMonitored: 0, aiAnalysisToday: 0 });
            }

            const docsRes = await fetch(`${API_BASE}/documents`);
            if (docsRes.ok) {
                const docsData = await docsRes.json();
                setDbDocs(docsData.documents || []);
            }
        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [activeTab]);

    const handleScan = async () => {
        setIsScanning(true);
        try {
            const resp = await fetch(`${API_BASE}/bids/scan`);
            const data = await resp.json();
            alert(data.message || "Busca concluída!");
            fetchDashboardData();
        } catch {
            alert("Erro ao executar scanner.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleAIAnalysis = async () => {
        if (dbBids.length === 0) {
            alert("Nenhum edital na fila scrapeada para analisar. Sincronize os portais primeiro!");
            return;
        }
        const targetBid = dbBids[0];

        setIsAiProcessing(true);
        try {
            const resp = await fetch(`${API_BASE}/ai/analyze/${targetBid.id}`, { method: 'POST' });
            const data = await resp.json();
            if (resp.ok) {
                alert(data.message);
                fetchDashboardData();
                setActiveTab("documents");
            } else {
                alert(data.error || "Erro ao rodar LLM.");
            }
        } catch {
            alert("Erro de comunicação com o servidor.");
        } finally {
            setIsAiProcessing(false);
        }
    };

    const stats = [
        { title: "Licitações Monitoradas", value: dbStats.totalMonitored.toString().padStart(3, '0'), icon: Search, color: "text-blue-400", bg: "bg-blue-400/10" },
        { title: "Análises de IA (Hoje)", value: dbStats.aiAnalysisToday.toString().padStart(2, '0'), icon: BrainCircuit, color: "text-purple-400", bg: "bg-purple-400/10" },
        { title: "Certidões Ativas", value: "27/30", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { title: "Oportunidades Relevantes", value: dbBids.length.toString().padStart(2, '0'), icon: Target, color: "text-amber-400", bg: "bg-amber-400/10" },
    ];

    const recentBids = dbBids.length > 0 ? dbBids : [
        { id: "1", title: "Contratação de Leiloeiro Oficial", portal: "PNCP", value: "R$ 450.000,00", status: "AI Analysis", match: "98%", date: "26/02/2026" },
        { id: "2", title: "Serviços de Alienação de Bens", portal: "ComprasNet", value: "Sob Consulta", status: "Review", match: "85%", date: "25/02/2026" },
    ];

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "monitoring", label: "Monitoramento", icon: Target },
        { id: "documents", label: "Documentos", icon: Files },
        { id: "habilitation", label: "Habilitação", icon: ShieldCheck },
    ];

    const portals = [
        { id: "comprasnet", name: "Compras.gov.br", url: "https://www.gov.br/compras/pt-br", status: "Conectado", sync: "Sincronizado há 5 min", type: "Federal", active: true },
        { id: "pncp", name: "PNCP Nacional", url: "https://www.gov.br/pncp/pt-br", status: "Sincronizando...", sync: "Em andamento", type: "Nacional", active: true },
        { id: "bancobrasil", name: "Licitações-e (BB)", url: "https://www.licitacoes-e.com.br/aop/index.jsp", status: "Conectado", sync: "Sincronizado há 2 hrs", type: "Bancário", active: true },
        { id: "caixa", name: "Licitações CAIXA", url: "https://www.licitacoes.caixa.gov.br/SitePages/pagina_inicial.aspx", status: "Conectado", sync: "Sincronizado há 1 hr", type: "Bancário", active: true },
        { id: "portalcompras", name: "Portal de Compras Públicas", url: "https://www.portaldecompraspublicas.com.br/", status: "Conectado", sync: "Sincronizado há 15 min", type: "Público/Privado", active: true },
        { id: "bll", name: "BLL Compras", url: "https://bllcompras.com/Participant", status: "Conectado", sync: "Sincronizado há 30 min", type: "Independente", active: true },
        { id: "alerta", name: "Alerta Licitação", url: "https://alertalicitacao.com.br/", status: "Monitoramento AI", sync: "Tempo Real", type: "Agregador", active: true },
        { id: "painelprecos", name: "Painel de Preços (Gov)", url: "https://paineldeprecos.planejamento.gov.br/", status: "Banco de Dados", sync: "Disponível", type: "Referência", active: true }
    ];

    const documentsBase = dbDocs.length > 0 ? dbDocs : [
        { name: "Declaração de Habilitação", type: "PDF", size: "124 KB", date: "26/02/2026", status: "Assinado" },
        { name: "Termo de Referência - Edital 342", type: "PDF", size: "2.5 MB", date: "25/02/2026", status: "Análise IA Concluída" },
        { name: "Proposta Comercial Automática", type: "DOCX", size: "85 KB", date: "25/02/2026", status: "Pendente Assinatura" },
        { name: "Atestado de Capacidade Técnica", type: "PDF", size: "540 KB", date: "20/02/2026", status: "Validado" },
    ];

    const certificatesList = [
        { name: "Certidão Negativa Trabalhista (CNDT)", agency: "TST", expires: "04 dias", type: "danger", status: "Crítico", update: "Há 2h" },
        { name: "Regularidade do FGTS", agency: "Caixa Econômica", expires: "12 dias", type: "warning", status: "Atenção", update: "Há 5h" },
        { name: "Certidão Conjunta Receita Federal", agency: "Receita Federal", expires: "45 dias", type: "safe", status: "Regular", update: "Ontem" },
        { name: "Certidão Negativa Estadual", agency: "Sefaz SP", expires: "80 dias", type: "safe", status: "Regular", update: "Ontem" },
        { name: "Certidão Negativa Municipal", agency: "Prefeitura SP", expires: "110 dias", type: "safe", status: "Regular", update: "Ontem" },
    ];

    return (
        <div id="licitacoes-root">
            <div className="rochinha-watermark">ROCHINHA É O CARA</div>

            {/* Side Navigation */}
            <nav className="fixed left-0 top-0 bottom-0 w-24 border-r border-white/5 flex flex-col items-center py-10 gap-10 bg-[#050505]/80 backdrop-blur-xl z-50">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                    <Gavel size={26} className="text-white" />
                </motion.div>

                <div className="flex flex-col gap-8 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${activeTab === tab.id ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <tab.icon size={24} />
                            <div className="absolute left-full ml-5 px-3 py-1.5 bg-zinc-800 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] border border-white/10 shadow-2xl">
                                {tab.label}
                            </div>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute left-[-12px] top-1/4 bottom-1/4 w-[4px] bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <button className="text-zinc-500 hover:text-zinc-300 p-3.5 transition-colors">
                    <Settings size={24} />
                </button>
            </nav>

            <main className="pl-36 pr-10 pt-14 pb-14 max-w-[1700px] mx-auto space-y-12 relative z-10 w-full overflow-y-auto">

                {/* Superior Content: Header & Profile */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-blue-500 font-bold tracking-[0.2em] text-[10px] uppercase"
                        >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            SISTEMA ROCHA LICITAÇÕES
                        </motion.div>
                        <h1 className="text-4xl font-black tracking-tight text-white">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium">Gestão inteligente e automação de editais com tecnologia Rocha AI.</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden lg:flex flex-col items-end gap-1 px-5 border-r border-white/10">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Motor de Busca</span>
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                                ONLINE
                            </span>
                        </div>
                        <button className="relative w-12 h-12 glass rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                            <Bell size={22} />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020202]" />
                        </button>
                        <div className="flex items-center gap-3 glass pl-2 pr-4 py-2 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 border border-white/20 flex items-center justify-center font-bold text-sm text-white shadow-lg">
                                RF
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold text-white">Rocha Francisco</p>
                                <p className="text-[10px] text-zinc-500 font-medium">Administrador</p>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "dashboard" ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-12"
                        >
                            {/* Stats Highlight */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-card p-7 rounded-[2.5rem] space-y-5 hover:border-white/10 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <stat.icon size={100} />
                                        </div>
                                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-xl`}>
                                            <stat.icon size={28} />
                                        </div>
                                        <div>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                                            <h3 className="text-3xl font-black mt-2 tabular-nums group-hover:text-blue-500 transition-colors">{stat.value}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </section>

                            {/* Main Grid: Feed & Secondary */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                                {/* Opportunities List */}
                                <div className="xl:col-span-2 space-y-6">
                                    <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl">
                                        <div className="px-10 py-9 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-black flex items-center gap-3">
                                                    <History size={24} className="text-blue-500" />
                                                    Match de Oportunidades
                                                </h2>
                                                <p className="text-zinc-500 text-xs font-medium">Editais filtrados pela IA com base no seu perfil.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="glass-button flex items-center gap-2 group">
                                                    <Filter size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                                                    Filtros
                                                </button>
                                                <button className="bg-blue-600 hover:bg-blue-600/80 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/20">
                                                    Ver Tudo
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                                                        <th className="px-10 py-5">Objeto / Portal</th>
                                                        <th className="px-6 py-5 text-center">IA Relevância</th>
                                                        <th className="px-6 py-5">Valor</th>
                                                        <th className="px-10 py-5 text-right">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.03]">
                                                    {recentBids.map((bid) => (
                                                        <tr key={bid.id} className="hover:bg-white/[0.02] transition-all group cursor-pointer">
                                                            <td className="px-10 py-8">
                                                                <div className="space-y-2">
                                                                    <div className="font-bold text-zinc-100 group-hover:text-blue-500 transition-colors text-lg">{bid.title}</div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-[10px] bg-white/5 text-zinc-400 border border-white/5 px-2.5 py-1 rounded-lg uppercase font-black tracking-widest">{bid.portal}</span>
                                                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                                                            <Clock size={10} />
                                                                            {bid.date}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-8">
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <span className="text-emerald-400 font-black text-xl italic group-hover:scale-110 transition-transform">
                                                                        {bid.match}
                                                                    </span>
                                                                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: bid.match }}
                                                                            transition={{ duration: 1, delay: 0.5 }}
                                                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-8">
                                                                <div className="space-y-1">
                                                                    <span className="text-sm font-black text-zinc-100">{bid.value}</span>
                                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Estimativa</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8 text-right">
                                                                <div className="flex justify-end gap-2 outline-none">
                                                                    <button className="w-10 h-10 rounded-xl glass border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center">
                                                                        <ArrowRight size={20} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar: AI Pilot & Habilitation */}
                                <div className="space-y-8">
                                    {/* AI Copilot Premium */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                                            <BrainCircuit size={150} />
                                        </div>
                                        <div className="relative z-10 space-y-8">
                                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
                                                <Cpu size={32} className="text-white" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">IA ATIVA</span>
                                                    <h3 className="text-2xl font-black text-white">Rocha Intelligence</h3>
                                                </div>
                                                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                                    "Analisei o edital <span className="text-white font-bold">#342</span>. A documentação exigida está 100% no seu cofre digital. Deseja iniciar o preenchimento automático das declarações?"
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleAIAnalysis}
                                                disabled={isAiProcessing}
                                                className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn shadow-xl disabled:opacity-50"
                                            >
                                                {isAiProcessing ? "PROCESSANDO IA..." : "EXECUTAR ANÁLISE AI"}
                                                <Target size={18} className={isAiProcessing ? "animate-spin" : "group-hover/btn:animate-spin-slow"} />
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Critical Certificates Monitor */}
                                    <div className="glass-card rounded-[3rem] p-9 border-white/5 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black flex items-center gap-2">
                                                    <ShieldCheck size={20} className="text-emerald-400" />
                                                    Habilitação
                                                </h3>
                                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Documentação em Foco</p>
                                            </div>
                                            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                                                <Plus size={18} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { name: "CND Trabalhista (CNDT)", days: 4, type: "danger" },
                                                { name: "Certidão do FGTS", days: 12, type: "warning" },
                                                { name: "Regularidade Estadual", days: 45, type: "safe" }
                                            ].map((cert, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ x: 5 }}
                                                    className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition-all cursor-pointer"
                                                >
                                                    <div className="space-y-1.5 text-left">
                                                        <p className="text-xs font-black text-zinc-100 uppercase tracking-tighter">{cert.name}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${cert.type === 'danger' ? 'bg-red-500 shadow-[0_0_5px_red]' : cert.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                            <span className={`text-[10px] font-bold ${cert.type === 'danger' ? 'text-red-500' : cert.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                                {cert.days <= 7 ? `EXPIRA EM ${cert.days} DIAS` : `VENCIMENTO EM ${cert.days} DIAS`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={14} className="text-zinc-700 group-hover:text-zinc-400" />
                                                </motion.div>
                                            ))}
                                        </div>

                                        <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.02] hover:text-zinc-300 transition-all">
                                            GERENCIAR COFRE DE DOCUMENTOS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === "monitoring" ? (
                        <motion.div
                            key="monitoring"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <Database size={24} className="text-blue-500" />
                                        Fontes de Dados & Portais Integrados
                                    </h2>
                                    <p className="text-zinc-500 font-medium">Os crawlers estão atuando sobre as plataformas listadas abaixo em tempo real.</p>
                                </div>
                                <button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl font-bold transition-all border border-white/10 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <RefreshCw size={16} className={isScanning ? "animate-spin" : ""} />
                                    {isScanning ? "Monitorando Portais..." : "Forçar Sincronização Geral"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {portals.map((portal, idx) => (
                                    <motion.div
                                        key={portal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-card rounded-[2rem] p-6 border-white/5 space-y-6 hover:border-white/20 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                                                <CloudCog size={24} className="text-zinc-300" />
                                            </div>
                                            <span className="bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                {portal.status}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors">{portal.name}</h3>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{portal.type}</p>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                <Clock size={12} />
                                                {portal.sync}
                                            </div>
                                            <a
                                                href={portal.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-blue-600 transition-colors"
                                                title="Abrir portal oficial"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === "documents" ? (
                        <motion.div
                            key="documents"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 xl:grid-cols-3 gap-10"
                        >
                            {/* Document List */}
                            <div className="xl:col-span-2 glass-card rounded-[3rem] p-10 border-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black flex items-center gap-3">
                                            <FolderOpen size={24} className="text-blue-500" />
                                            Cofre de Documentos
                                        </h2>
                                        <p className="text-zinc-500 font-medium text-sm">Templates, Declarações e Editais extraídos via IA.</p>
                                    </div>
                                    <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-600/80 transition-all">
                                        <Upload size={18} />
                                        Novo Template
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {documentsBase.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-blue-500 transition-colors">{doc.name}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 font-medium">
                                                        <span className="uppercase tracking-widest font-black text-[10px]">{doc.type}</span>
                                                        <span>&bull;</span>
                                                        <span>{doc.size}</span>
                                                        <span>&bull;</span>
                                                        <span>{doc.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${doc.status === 'Assinado' || doc.status === 'Validado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : doc.status === 'Em Análise' || doc.status.includes('IA') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                    {doc.status}
                                                </span>
                                                <button className="w-10 h-10 rounded-xl glass border-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center">
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Signature Card */}
                            <div className="space-y-6">
                                <div className="glass-card rounded-[3rem] p-10 border-white/5 relative overflow-hidden group">
                                    <div className="absolute -right-10 -top-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                                        <FileSignature size={200} />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                            <FileSignature size={32} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-2">Assinatura gov.br</h3>
                                            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                                                A integração direta com o portal Gov.br permite assinar juridicamente as propostas geradas pela IA em 1 clique.
                                            </p>
                                        </div>
                                        <button className="w-full py-4 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                            Assinar em Lote (2)
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === "habilitation" ? (
                        <motion.div
                            key="habilitation"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <ShieldCheck size={24} className="text-emerald-400" />
                                        Gestor de Habilitações
                                    </h2>
                                    <p className="text-zinc-500 font-medium">Controle ativo de validade de todos os documentos exigidos em certames.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificatesList.map((cert, idx) => (
                                    <div key={idx} className="glass-card rounded-[2rem] p-8 border-white/5 hover:border-white/20 transition-all space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{cert.agency}</span>
                                                <h3 className="text-lg font-bold text-zinc-100">{cert.name}</h3>
                                            </div>
                                            {cert.type === 'danger' ? (
                                                <ShieldAlert size={28} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            ) : cert.type === 'warning' ? (
                                                <AlertCircle size={28} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                            ) : (
                                                <ShieldCheck size={28} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            )}
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-500 font-medium">Vencimento:</span>
                                                <span className={`font-black ${cert.type === 'danger' ? 'text-red-400' : cert.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {cert.expires}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-500 font-medium">Status:</span>
                                                <span className="font-bold text-white">{cert.status}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-500 font-medium">Última Checagem:</span>
                                                <span className="text-zinc-400">{cert.update}</span>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                                            Atualizar Certidão
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>
        </div>
    );
}

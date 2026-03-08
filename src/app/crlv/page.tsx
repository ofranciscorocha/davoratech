'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    FileText,
    Download,
    Copy,
    Check,
    Play,
    Settings,
    Terminal,
    Shield,
    AlertTriangle,
    ExternalLink,
    Car,
    Hash,
    Clock,
    ChevronDown,
    BookOpen,
    Zap,
    Globe,
    Info,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// The CRLV download script (minified version embedded)
const CRLV_SCRIPT = `(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const processedPlates = new Set();
  const getPlate = (el) => { const p = el.querySelector(".iconSne-placa + span"); return p ? p.textContent.trim() : ""; };
  const getRenavam = (el) => { const r = el.querySelector(".iconSne-veiculo02 + span"); return r ? r.textContent.trim() : ""; };
  const isListVisible = () => document.querySelectorAll(".card-list-item.mini.ng-star-inserted").length > 0;
  const robustClick = (el) => { el.dispatchEvent(new MouseEvent("click", { view: window, bubbles: true, cancelable: true })); };
  const constructDetailURL = (plate, renavam) => \`https://portalservicos.senatran.serpro.gov.br/#/veiculos/meus-veiculos/detalhes/\${plate}/\${renavam}/false\`;
  const waitForDetailPageLoad = async () => { for (let i = 0; i < 20; i++) { const btn = Array.from(document.querySelectorAll("a.text-bold")).find((el) => el.textContent.includes("CRLV Digital (.pdf)")); if (btn) return true; await sleep(1000); } return false; };
  const waitForSpinnerToDisappear = async () => { for (let i = 0; i < 30; i++) { const s = document.querySelector(".ngx-spinner-overlay"); if (!s || s.style.display === "none" || parseFloat(s.style.opacity) === 0) return true; await sleep(500); } return false; };
  const clickVoltarButton = async () => { await waitForSpinnerToDisappear(); const btn = Array.from(document.querySelectorAll("button.br-button.primary.footer-button.no-print")).find((b) => b.textContent.trim() === "Voltar"); if (btn) { robustClick(btn); await sleep(3000); const ok = await waitForSpinnerToDisappear(); if (!ok) return false; return isListVisible(); } document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); await sleep(3000); await waitForSpinnerToDisappear(); return isListVisible(); };
  const goToNextPage = async () => { const btn = Array.from(document.querySelectorAll(".pagination-next a.page-link")).find((el) => el.textContent.trim() === "›"); if (btn && !btn.parentElement.classList.contains("disabled")) { robustClick(btn); await sleep(4000); return true; } return false; };
  const SELECTED_FINALS = __PLATE_FINALS__;
  let hasNextPage = true, currentPage = 1;
  while (hasNextPage) {
    console.log("\\nProcessando página " + currentPage + "...");
    const vehicles = document.querySelectorAll(".card-list-item.mini.ng-star-inserted");
    for (let vehicle of vehicles) {
      const plate = getPlate(vehicle), renavam = getRenavam(vehicle);
      if (!plate || !renavam || processedPlates.has(plate)) continue;
      const lastChar = plate.slice(-1);
      if (!SELECTED_FINALS || SELECTED_FINALS.includes(lastChar)) {
        console.log("Processando placa " + plate + "...");
        window.location.href = constructDetailURL(plate, renavam);
        const loaded = await waitForDetailPageLoad();
        if (!loaded) { await clickVoltarButton(); processedPlates.add(plate); continue; }
        await sleep(2000);
        const crlvBtn = Array.from(document.querySelectorAll("a.text-bold")).find((el) => el.textContent.includes("CRLV Digital (.pdf)"));
        if (crlvBtn) { robustClick(crlvBtn); console.log("CRLV baixado para " + plate); await sleep(2000); }
        await waitForSpinnerToDisappear();
        await clickVoltarButton();
        processedPlates.add(plate);
        await sleep(2000);
      }
    }
    hasNextPage = await goToNextPage();
    if (hasNextPage) { currentPage++; await sleep(2000); }
  }
  console.log("Script concluído. Total: " + processedPlates.size + " veículos processados.");
})();`;

const PORTAL_URL = 'https://portalservicos.senatran.serpro.gov.br/#/veiculos/meus-veiculos';

const STEPS = [
    {
        num: 1,
        title: 'Acesse o Portal SENATRAN',
        desc: 'Faça login no Portal de Serviços SENATRAN/SERPRO com suas credenciais.',
        icon: Globe,
    },
    {
        num: 2,
        title: 'Abra o Console do Navegador',
        desc: 'Pressione F12 e clique na aba "Console".',
        icon: Terminal,
    },
    {
        num: 3,
        title: 'Cole o Script',
        desc: 'Copie o script gerado abaixo e cole no console.',
        icon: Copy,
    },
    {
        num: 4,
        title: 'Execute e Aguarde',
        desc: 'Pressione Enter. O script baixará os CRLVs automaticamente.',
        icon: Play,
    },
];

export default function CRLVPage() {
    const router = useRouter();
    const [selectedDigits, setSelectedDigits] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [showScript, setShowScript] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const toggleDigit = (d: string) => {
        setSelectedDigits(prev =>
            prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
        );
    };

    const generatedScript = useCallback(() => {
        const finals = selectedDigits.length > 0
            ? `[${selectedDigits.map(d => `"${d}"`).join(',')}]`
            : 'null';
        return CRLV_SCRIPT.replace('__PLATE_FINALS__', finals);
    }, [selectedDigits]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedScript());
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-6">
                <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-emerald-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                CRLV <span className="text-emerald-400">Downloader</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={PORTAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Abrir Portal SENATRAN
                        </a>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="p-8 rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-slate-900/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative">
                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-3">
                                <Shield className="w-3 h-3" />
                                Automação SENATRAN/SERPRO
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">
                                Download Automático de <span className="text-emerald-400">CRLV Digital</span>
                            </h2>
                            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                Automatize o download do Certificado de Registro e Licenciamento de Veículo (CRLV)
                                para todos os veículos do seu portal SENATRAN. Configure os finais de placa desejados
                                e gere o script personalizado.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Plate Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl border border-white/5 bg-slate-900/40"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                                Filtro por Final de Placa
                            </h3>
                            <p className="text-[11px] text-slate-500 mb-4 font-mono">
                                Selecione os finais de placa que deseja processar. Deixe vazio para processar todas.
                            </p>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => toggleDigit(d)}
                                        className={cn(
                                            "h-12 rounded-xl border text-lg font-black transition-all duration-200",
                                            selectedDigits.includes(d)
                                                ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                                                : "bg-slate-800/50 border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-white"
                                        )}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-[10px] font-mono text-slate-600">
                                    {selectedDigits.length === 0
                                        ? 'Todos os veículos serão processados'
                                        : `Processando placas terminadas em: ${selectedDigits.sort().join(', ')}`
                                    }
                                </div>
                                {selectedDigits.length > 0 && (
                                    <button
                                        onClick={() => setSelectedDigits([])}
                                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-widest"
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Generated Script */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-2xl border border-white/5 bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                    Script Gerado
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowScript(!showScript)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold uppercase tracking-widest transition-all text-slate-400"
                                    >
                                        <ChevronDown className={cn("w-3 h-3 transition-transform", showScript && "rotate-180")} />
                                        {showScript ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg",
                                            copied
                                                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                                        )}
                                    >
                                        {copied ? (
                                            <><Check className="w-3.5 h-3.5" /> Copiado!</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" /> Copiar Script</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showScript && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <pre className="bg-slate-950/80 border border-white/5 rounded-xl p-4 text-[10px] font-mono text-emerald-400/80 overflow-x-auto max-h-[400px] overflow-y-auto leading-relaxed">
                                            {generatedScript()}
                                        </pre>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!showScript && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/50 border border-white/5">
                                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <div className="text-[11px] text-slate-400">
                                        Script pronto com {selectedDigits.length === 0 ? 'todos os finais' : `finais ${selectedDigits.sort().join(', ')}`}.
                                        Clique em <strong className="text-emerald-400">Copiar Script</strong> para usar.
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {[
                                { icon: Car, label: 'Multi-Veículo', desc: 'Processa toda a frota', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                { icon: Download, label: 'PDF Automático', desc: 'Download em lote', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                { icon: Hash, label: 'Filtro de Placa', desc: 'Por final de dígito', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                { icon: Clock, label: 'Anti-Timeout', desc: 'Spinners e retries', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                            ].map((feat, i) => (
                                <div key={feat.label} className="p-4 rounded-2xl border border-white/5 bg-slate-900/30">
                                    <div className={cn("p-2 rounded-xl w-fit mb-3", feat.bg)}>
                                        <feat.icon className={cn("w-4 h-4", feat.color)} />
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-200">{feat.label}</div>
                                    <div className="text-[9px] font-mono text-slate-500 mt-0.5">{feat.desc}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column - Instructions */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="p-6 rounded-2xl border border-white/5 bg-slate-900/40"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-5">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                                Como Usar
                            </h3>
                            <div className="space-y-4">
                                {STEPS.map((step, i) => (
                                    <motion.div
                                        key={step.num}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.05 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs group-hover:bg-emerald-500/20 transition-all">
                                                {step.num}
                                            </div>
                                            {i < STEPS.length - 1 && (
                                                <div className="w-px h-full bg-white/5 mt-2" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <div className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-2">
                                                <step.icon className="w-3.5 h-3.5 text-emerald-400" />
                                                {step.title}
                                            </div>
                                            <div className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <a
                                href={PORTAL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-600/30 transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Acessar Portal SENATRAN
                            </a>
                        </motion.div>

                        {/* Warning */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/5"
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-[11px] font-bold text-amber-400 mb-1">Atenção</div>
                                    <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
                                        <p>• É necessário estar logado no Portal SENATRAN com credenciais válidas.</p>
                                        <p>• O script só funciona na página "Meus Veículos" do portal.</p>
                                        <p>• Desative bloqueadores de anúncios que possam interferir.</p>
                                        <p>• Mantenha a aba do navegador ativa durante a execução.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="p-5 rounded-2xl border border-white/5 bg-slate-900/30"
                        >
                            <div className="flex items-start gap-3">
                                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-[11px] font-bold text-cyan-400 mb-1">Sobre o CRLV Digital</div>
                                    <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
                                        <p>O CRLV Digital é o documento oficial que comprova o registro e licenciamento do veículo.</p>
                                        <p>Este sistema automatiza o download em lote diretamente do portal oficial do SENATRAN/SERPRO.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Checklist */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-5 rounded-2xl border border-white/5 bg-slate-900/30"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Checklist
                            </h3>
                            <div className="space-y-2">
                                {[
                                    'Logado no Portal SENATRAN',
                                    'Na página "Meus Veículos"',
                                    'Console do navegador aberto (F12)',
                                    'Finais de placa configurados',
                                    'Script copiado',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                        <div className="w-3 h-3 rounded border border-white/10" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.04),transparent_60%)]" />
        </div>
    );
}

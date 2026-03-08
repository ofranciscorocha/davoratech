'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    Loader2,
    AlertCircle,
    Shield,
    Globe,
    Car,
    User,
    FileText,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    CreditCard,
    Banknote,
    CalendarDays,
    Gauge,
    Fuel,
    Palette,
    Hash,
    Target,
    Activity,
    Download,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurveillanceHUD } from '@/components/investigation/SurveillanceHUD';

interface VehicleResult {
    queryType: string;
    queryValue: string;
    vehicle: {
        plate: string;
        plateMercosul: string;
        brand: string;
        model: string;
        yearFab: number;
        yearModel: number;
        color: string;
        fuel: string;
        chassis: string;
        engine: string;
        renavam: string;
        category: string;
        bodyType: string;
        powerHP: number;
        displacement: string;
    };
    owner: {
        name: string;
        cpf: string;
        type: string;
        city: string;
        state: string;
        since: string;
    };
    status: {
        hasRestriction: boolean;
        restrictionType: string | null;
        isStolen: boolean;
        stolenDate: string | null;
        stolenCity: string | null;
        hasFinance: boolean;
        financeBank: string | null;
        financeRemaining: string | null;
        hasRecall: boolean;
        recallDescription: string | null;
    };
    fipeValue: string;
    ipvaStatus: string;
    lastIPVA: string;
    licensingStatus: string;
    previousOwners: number;
    riskScore: number;
}

export default function VehicleTrace() {
    const router = useRouter();
    const [queryInput, setQueryInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<VehicleResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!queryInput.trim()) return;

        setIsSearching(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/osint/vehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryInput })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na consulta veicular.');
            }

            setResult(data as VehicleResult);
        } catch (err: any) {
            setError(err.message || 'Erro ao consultar veículo.');
        } finally {
            setIsSearching(false);
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
                            <Car className="w-4 h-4 text-amber-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Vehicle <span className="text-amber-400">Radar</span>
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Globe className="w-3 h-3 text-indigo-400" />
                            DATABASE: <span className="text-slate-300">DETRAN / SINESP</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            STATUS: <span className="text-emerald-400">CONNECTED</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1500px] mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Search Panel */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <SurveillanceHUD
                            title="Vehicle Intel"
                            subtitle="Plate / Chassis / Engine Query"
                            status={isSearching ? "alert" : "operational"}
                        >
                            <div className="p-8">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Target className="w-3 h-3 text-amber-500" />
                                    Vehicle Query
                                </h3>

                                <form onSubmit={handleSearch} className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="w-5 h-5 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={queryInput}
                                            onChange={(e) => setQueryInput(e.target.value)}
                                            placeholder="Placa, Chassi ou Motor"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono text-sm uppercase"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'Placa', example: 'ABC1D23' },
                                            { label: 'Chassi', example: '17 caracteres' },
                                            { label: 'Motor', example: '8-12 chars' },
                                        ].map((item) => (
                                            <div key={item.label} className="p-2 rounded-lg border border-white/5 bg-slate-900/30 text-center">
                                                <div className="text-[8px] font-black text-amber-400 uppercase tracking-widest">{item.label}</div>
                                                <div className="text-[7px] text-slate-600 font-mono mt-0.5">{item.example}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching || !queryInput.trim()}
                                        className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-lg shadow-amber-950/20"
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-3" />
                                                Querying Databases...
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4 mr-3" />
                                                Run Vehicle Query
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
                                Query Log
                            </h4>
                            <div className="font-mono text-[9px] text-slate-600 space-y-1">
                                <div>[{new Date().toLocaleTimeString()}] VEHICLE_QUERY -&gt; {queryInput || 'NULL'}</div>
                                {isSearching && <div className="text-amber-400 animate-pulse">[...] QUERYING DETRAN/SINESP...</div>}
                                {result && <div className="text-emerald-400">[OK] VEHICLE_FOUND: {result.vehicle.model}</div>}
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
                                    {/* Stolen/Restriction Alert */}
                                    {(result.status.isStolen || result.status.hasRestriction) && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 flex items-center gap-4",
                                                result.status.isStolen
                                                    ? "border-red-500/50 bg-red-500/10"
                                                    : "border-amber-500/50 bg-amber-500/10"
                                            )}
                                        >
                                            <AlertTriangle className={cn("w-8 h-8", result.status.isStolen ? "text-red-400" : "text-amber-400")} />
                                            <div>
                                                <div className={cn("text-sm font-black uppercase tracking-widest", result.status.isStolen ? "text-red-400" : "text-amber-400")}>
                                                    {result.status.isStolen ? "⚠ ALERTA: VEÍCULO COM REGISTRO DE FURTO/ROUBO" : "⚠ VEÍCULO COM RESTRIÇÃO"}
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-400 mt-1">
                                                    {result.status.isStolen
                                                        ? `Registrado em ${result.status.stolenDate} - ${result.status.stolenCity}`
                                                        : `Tipo: ${result.status.restrictionType}`
                                                    }
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Vehicle Main Info */}
                                    <SurveillanceHUD title="Vehicle Dossier" subtitle="Identified Vehicle Intelligence">
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                                {/* Plate Display */}
                                                <div className="shrink-0">
                                                    <div className="w-48 h-28 rounded-xl bg-white flex flex-col items-center justify-center border-4 border-slate-300 shadow-lg relative overflow-hidden">
                                                        <div className="w-full h-6 bg-blue-600 flex items-center justify-center">
                                                            <span className="text-[8px] font-black text-white tracking-[0.3em]">BRASIL</span>
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-center">
                                                            <span className="text-3xl font-black text-slate-800 tracking-[0.15em] font-mono">
                                                                {result.vehicle.plate}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-center">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                            result.riskScore > 60
                                                                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                                                : result.riskScore > 30
                                                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                        )}>
                                                            Risk Score: {result.riskScore}%
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Vehicle Details */}
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="text-2xl font-black tracking-tighter text-slate-200">{result.vehicle.model}</h3>
                                                        <div className="text-sm text-amber-400 font-mono">{result.vehicle.yearFab}/{result.vehicle.yearModel}</div>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {[
                                                            { label: 'Cor', val: result.vehicle.color, icon: Palette },
                                                            { label: 'Combustível', val: result.vehicle.fuel, icon: Fuel },
                                                            { label: 'Potência', val: `${result.vehicle.powerHP} CV`, icon: Gauge },
                                                            { label: 'Motor', val: result.vehicle.displacement, icon: Hash },
                                                        ].map((item, i) => (
                                                            <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                                                <item.icon className="w-3 h-3 text-slate-500 mb-1" />
                                                                <div className="text-[8px] font-mono text-slate-500 uppercase">{item.label}</div>
                                                                <div className="text-[10px] font-bold text-slate-200 truncate">{item.val}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Vehicle IDs */}
                                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { label: 'CHASSI', val: result.vehicle.chassis },
                                                    { label: 'MOTOR', val: result.vehicle.engine },
                                                    { label: 'RENAVAM', val: result.vehicle.renavam },
                                                ].map((item, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                                                        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{item.label}</div>
                                                        <div className="text-xs font-mono font-bold text-amber-300 mt-1 break-all">{item.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </SurveillanceHUD>

                                    {/* Owner Info */}
                                    <SurveillanceHUD title="Owner Intelligence" subtitle="Registered Proprietor">
                                        <div className="p-8">
                                            <div className="flex items-start gap-6">
                                                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                                    <User className="w-6 h-6 text-amber-400" />
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Proprietário Registrado</div>
                                                        <h4 className="text-xl font-black text-slate-200">{result.owner.name}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <div className="text-[8px] font-mono text-slate-500 uppercase">CPF</div>
                                                            <div className="text-xs font-mono font-bold text-indigo-300">{result.owner.cpf}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] font-mono text-slate-500 uppercase">Tipo</div>
                                                            <div className="text-xs font-bold text-slate-300">{result.owner.type}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] font-mono text-slate-500 uppercase">Cidade</div>
                                                            <div className="text-xs font-bold text-slate-300">{result.owner.city}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] font-mono text-slate-500 uppercase">Proprietário Desde</div>
                                                            <div className="text-xs font-bold text-slate-300">{result.owner.since}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SurveillanceHUD>

                                    {/* Financial & Status Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2">
                                            <Banknote className="w-4 h-4 text-emerald-400" />
                                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Valor FIPE</div>
                                            <div className="text-lg font-black text-emerald-400">{result.fipeValue}</div>
                                        </div>
                                        <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2">
                                            <CreditCard className="w-4 h-4 text-indigo-400" />
                                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">IPVA</div>
                                            <div className={cn("text-sm font-black", result.ipvaStatus === 'PAGO' ? "text-emerald-400" : result.ipvaStatus === 'PENDENTE' ? "text-rose-400" : "text-slate-400")}>
                                                {result.ipvaStatus}
                                            </div>
                                            <div className="text-[9px] text-slate-500 font-mono">{result.lastIPVA}</div>
                                        </div>
                                        <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2">
                                            <CalendarDays className="w-4 h-4 text-amber-400" />
                                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Licenciamento</div>
                                            <div className={cn("text-sm font-black", result.licensingStatus === 'REGULAR' ? "text-emerald-400" : "text-rose-400")}>
                                                {result.licensingStatus}
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2">
                                            <FileText className="w-4 h-4 text-cyan-400" />
                                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Proprietários Anteriores</div>
                                            <div className="text-lg font-black text-slate-200">{result.previousOwners}</div>
                                        </div>
                                    </div>

                                    {/* Status Checks */}
                                    <SurveillanceHUD title="Security Status" subtitle="Restriction & Alert Matrix">
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                {
                                                    label: 'Furto / Roubo',
                                                    active: result.status.isStolen,
                                                    detail: result.status.isStolen ? `${result.status.stolenDate} - ${result.status.stolenCity}` : 'Nenhum registro',
                                                },
                                                {
                                                    label: 'Restrições',
                                                    active: result.status.hasRestriction,
                                                    detail: result.status.hasRestriction ? result.status.restrictionType : 'Nenhuma restrição',
                                                },
                                                {
                                                    label: 'Financiamento',
                                                    active: result.status.hasFinance,
                                                    detail: result.status.hasFinance ? `${result.status.financeBank} - ${result.status.financeRemaining}` : 'Sem financiamento',
                                                },
                                                {
                                                    label: 'Recall',
                                                    active: result.status.hasRecall,
                                                    detail: result.status.hasRecall ? result.status.recallDescription : 'Sem recall pendente',
                                                },
                                            ].map((check, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "p-4 rounded-xl border flex items-start gap-4",
                                                        check.active
                                                            ? "border-rose-500/30 bg-rose-500/5"
                                                            : "border-emerald-500/20 bg-emerald-500/5"
                                                    )}
                                                >
                                                    {check.active ? (
                                                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                                    )}
                                                    <div>
                                                        <div className="text-xs font-black uppercase tracking-widest text-slate-300">{check.label}</div>
                                                        <div className={cn(
                                                            "text-[10px] font-mono mt-1",
                                                            check.active ? "text-rose-400" : "text-emerald-400/70"
                                                        )}>
                                                            {check.detail}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </SurveillanceHUD>

                                    <div className="flex gap-4">
                                        <button className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download Laudo
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full min-h-[500px] border border-white/5 rounded-[40px] bg-slate-900/20 border-dashed flex flex-col items-center justify-center text-center opacity-40">
                                    <Car className="w-16 h-16 text-slate-600 mb-6" />
                                    <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Vehicle Radar Standby</h3>
                                    <p className="text-sm text-slate-600 mt-2 font-mono">Informe Placa, Chassi ou Motor para iniciar</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />
        </div>
    );
}

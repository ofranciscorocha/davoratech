'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Car,
    Truck,
    MapPin,
    BarChart3,
    Filter,
    Download,
    TrendingUp,
    TrendingDown,
    Search,
    ChevronDown,
    Globe,
    Fuel,
    Palette,
    Calendar,
    Building2,
    Activity,
    Layers,
    Eye,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import BrazilMap from '@/components/BrazilMap';

// ---- SIMULATED FLEET DATA (Based on DENATRAN structure) ----

interface VehicleRecord {
    id: number;
    uf: string;
    municipio: string;
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    combustivel: string;
    tipo: string;
    quantidade: number;
    lat: number;
    lng: number;
}

const UFS = [
    { sigla: 'SP', nome: 'São Paulo', lat: -23.55, lng: -46.63, pop: 46.29 },
    { sigla: 'RJ', nome: 'Rio de Janeiro', lat: -22.91, lng: -43.17, pop: 17.46 },
    { sigla: 'MG', nome: 'Minas Gerais', lat: -19.92, lng: -43.94, pop: 21.29 },
    { sigla: 'BA', nome: 'Bahia', lat: -12.97, lng: -38.51, pop: 14.93 },
    { sigla: 'PR', nome: 'Paraná', lat: -25.43, lng: -49.27, pop: 11.52 },
    { sigla: 'RS', nome: 'Rio Grande do Sul', lat: -30.03, lng: -51.23, pop: 11.42 },
    { sigla: 'PE', nome: 'Pernambuco', lat: -8.05, lng: -34.87, pop: 9.67 },
    { sigla: 'CE', nome: 'Ceará', lat: -3.72, lng: -38.53, pop: 9.19 },
    { sigla: 'PA', nome: 'Pará', lat: -1.46, lng: -48.50, pop: 8.69 },
    { sigla: 'SC', nome: 'Santa Catarina', lat: -27.60, lng: -48.55, pop: 7.34 },
    { sigla: 'GO', nome: 'Goiás', lat: -16.69, lng: -49.25, pop: 7.11 },
    { sigla: 'MA', nome: 'Maranhão', lat: -2.50, lng: -44.28, pop: 7.11 },
    { sigla: 'AM', nome: 'Amazonas', lat: -3.12, lng: -60.02, pop: 4.21 },
    { sigla: 'ES', nome: 'Espírito Santo', lat: -20.32, lng: -40.34, pop: 4.06 },
    { sigla: 'PB', nome: 'Paraíba', lat: -7.12, lng: -34.86, pop: 4.06 },
    { sigla: 'DF', nome: 'Distrito Federal', lat: -15.79, lng: -47.88, pop: 3.09 },
    { sigla: 'MT', nome: 'Mato Grosso', lat: -15.60, lng: -56.10, pop: 3.57 },
    { sigla: 'MS', nome: 'Mato Grosso do Sul', lat: -20.44, lng: -54.65, pop: 2.84 },
    { sigla: 'RN', nome: 'Rio Grande do Norte', lat: -5.79, lng: -35.21, pop: 3.53 },
    { sigla: 'AL', nome: 'Alagoas', lat: -9.67, lng: -35.74, pop: 3.35 },
    { sigla: 'PI', nome: 'Piauí', lat: -5.09, lng: -42.80, pop: 3.27 },
    { sigla: 'SE', nome: 'Sergipe', lat: -10.91, lng: -37.07, pop: 2.32 },
    { sigla: 'TO', nome: 'Tocantins', lat: -10.18, lng: -48.33, pop: 1.59 },
    { sigla: 'RO', nome: 'Rondônia', lat: -8.76, lng: -63.90, pop: 1.80 },
    { sigla: 'AC', nome: 'Acre', lat: -9.97, lng: -67.81, pop: 0.90 },
    { sigla: 'AP', nome: 'Amapá', lat: 0.03, lng: -51.07, pop: 0.86 },
    { sigla: 'RR', nome: 'Roraima', lat: 2.82, lng: -60.67, pop: 0.63 },
];

const MARCAS = ['VOLKSWAGEN', 'FIAT', 'CHEVROLET', 'TOYOTA', 'HYUNDAI', 'HONDA', 'RENAULT', 'JEEP', 'FORD', 'NISSAN', 'BMW', 'MERCEDES-BENZ', 'AUDI'];
const CORES = ['BRANCO', 'PRETO', 'PRATA', 'CINZA', 'VERMELHO', 'AZUL', 'MARROM', 'VERDE', 'AMARELO'];
const COMBUSTIVEIS = ['FLEX', 'GASOLINA', 'DIESEL', 'ETANOL', 'ELÉTRICO', 'HÍBRIDO'];
const TIPOS = ['AUTOMÓVEL', 'CAMINHONETE', 'SUV', 'UTILITÁRIO', 'MOTOCICLETA'];

function seededRandom(seed: number) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateFleetData(): VehicleRecord[] {
    const records: VehicleRecord[] = [];
    let id = 0;

    UFS.forEach((uf, ufIdx) => {
        MARCAS.forEach((marca, mIdx) => {
            const seed = ufIdx * 100 + mIdx;
            const qty = Math.floor(seededRandom(seed) * uf.pop * 8000 + 500);
            records.push({
                id: id++,
                uf: uf.sigla,
                municipio: uf.nome,
                marca,
                modelo: marca,
                ano: 2015 + Math.floor(seededRandom(seed + 1) * 10),
                cor: CORES[Math.floor(seededRandom(seed + 2) * CORES.length)],
                combustivel: COMBUSTIVEIS[Math.floor(seededRandom(seed + 3) * COMBUSTIVEIS.length)],
                tipo: TIPOS[Math.floor(seededRandom(seed + 4) * TIPOS.length)],
                quantidade: qty,
                lat: uf.lat + (seededRandom(seed + 5) - 0.5) * 2,
                lng: uf.lng + (seededRandom(seed + 6) - 0.5) * 2,
            });
        });
    });

    return records;
}

// ---- COMPONENT ----

interface ApiFrotaUF {
    sigla: string;
    nome: string;
    total: number;
    automoveis: number;
    caminhonetes: number;
    motocicletas: number;
    onibus: number;
    caminhoes: number;
    outros: number;
    mesReferencia: string;
}

export default function MapaFrota() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'mapa' | 'tabela'>('dashboard');
    const [filterUF, setFilterUF] = useState<string>('ALL');
    const [filterMarca, setFilterMarca] = useState<string>('ALL');
    const [filterCombustivel, setFilterCombustivel] = useState<string>('ALL');
    const [filterTipo, setFilterTipo] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [apiData, setApiData] = useState<ApiFrotaUF[]>([]);
    const [apiMeta, setApiMeta] = useState<{ source: string; updatedAt: string; nextUpdate: string; total: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch real data from API
    useEffect(() => {
        fetch('/api/frota')
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setApiData(json.data);
                    setApiMeta({ source: json.source, updatedAt: json.updatedAt, nextUpdate: json.nextUpdate, total: json.total });
                }
            })
            .catch(() => console.warn('Failed to fetch fleet API'))
            .finally(() => setLoading(false));
    }, []);

    const allData = useMemo(() => generateFleetData(), []);

    const filteredData = useMemo(() => {
        return allData.filter(r => {
            if (filterUF !== 'ALL' && r.uf !== filterUF) return false;
            if (filterMarca !== 'ALL' && r.marca !== filterMarca) return false;
            if (filterCombustivel !== 'ALL' && r.combustivel !== filterCombustivel) return false;
            if (filterTipo !== 'ALL' && r.tipo !== filterTipo) return false;
            if (searchQuery && !r.municipio.toLowerCase().includes(searchQuery.toLowerCase()) && !r.marca.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [allData, filterUF, filterMarca, filterCombustivel, filterTipo, searchQuery]);

    // Use real API data for totals when available
    const totalVeiculosReal = useMemo(() => {
        if (apiData.length === 0) return null;
        if (filterUF !== 'ALL') {
            const uf = apiData.find(d => d.sigla === filterUF);
            return uf?.total || 0;
        }
        return apiData.reduce((sum, d) => sum + d.total, 0);
    }, [apiData, filterUF]);

    const totalVeiculos = totalVeiculosReal ?? filteredData.reduce((sum, r) => sum + r.quantidade, 0);

    const topMarcas = useMemo(() => {
        const map = new Map<string, number>();
        filteredData.forEach(r => map.set(r.marca, (map.get(r.marca) || 0) + r.quantidade));
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7);
    }, [filteredData]);

    const topUFs = useMemo(() => {
        if (apiData.length > 0) {
            return apiData.map(d => [d.sigla, d.total] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, 10);
        }
        const map = new Map<string, number>();
        filteredData.forEach(r => map.set(r.uf, (map.get(r.uf) || 0) + r.quantidade));
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [filteredData, apiData]);

    const combustivelDist = useMemo(() => {
        const map = new Map<string, number>();
        filteredData.forEach(r => map.set(r.combustivel, (map.get(r.combustivel) || 0) + r.quantidade));
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    }, [filteredData]);

    const tipoDist = useMemo(() => {
        if (apiData.length > 0) {
            const filtered = filterUF !== 'ALL' ? apiData.filter(d => d.sigla === filterUF) : apiData;
            const totals = filtered.reduce((acc, d) => ({
                'AUTOMÓVEL': acc['AUTOMÓVEL'] + d.automoveis,
                'MOTOCICLETA': acc['MOTOCICLETA'] + d.motocicletas,
                'CAMINHONETE': acc['CAMINHONETE'] + d.caminhonetes,
                'CAMINHÃO': acc['CAMINHÃO'] + d.caminhoes,
                'ÔNIBUS': acc['ÔNIBUS'] + d.onibus,
                'OUTROS': acc['OUTROS'] + d.outros,
            }), { 'AUTOMÓVEL': 0, 'MOTOCICLETA': 0, 'CAMINHONETE': 0, 'CAMINHÃO': 0, 'ÔNIBUS': 0, 'OUTROS': 0 });
            return Object.entries(totals).sort((a, b) => b[1] - a[1]);
        }
        const map = new Map<string, number>();
        filteredData.forEach(r => map.set(r.tipo, (map.get(r.tipo) || 0) + r.quantidade));
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    }, [filteredData, apiData, filterUF]);

    const mapStateData = useMemo(() => {
        if (apiData.length > 0) {
            return apiData.map(d => ({ sigla: d.sigla, nome: d.nome, quantidade: d.total }));
        }
        return UFS.map(uf => {
            const qty = allData.filter(r => r.uf === uf.sigla).reduce((sum, r) => sum + r.quantidade, 0);
            return { sigla: uf.sigla, nome: uf.nome, quantidade: qty };
        });
    }, [allData, apiData]);

    const formatNumber = (n: number) => n.toLocaleString('pt-BR');
    const maxMarca = topMarcas.length > 0 ? topMarcas[0][1] : 1;
    const maxUF = topUFs.length > 0 ? topUFs[0][1] : 1;

    const BRAND_COLORS: Record<string, string> = {
        'VOLKSWAGEN': 'bg-blue-500', 'FIAT': 'bg-red-500', 'CHEVROLET': 'bg-amber-500',
        'TOYOTA': 'bg-rose-500', 'HYUNDAI': 'bg-sky-500', 'HONDA': 'bg-indigo-500',
        'RENAULT': 'bg-yellow-500', 'JEEP': 'bg-emerald-500', 'FORD': 'bg-cyan-500',
        'NISSAN': 'bg-purple-500', 'BMW': 'bg-slate-400', 'MERCEDES-BENZ': 'bg-zinc-400',
        'AUDI': 'bg-pink-500',
    };

    const COMBUSTIVEL_COLORS: Record<string, string> = {
        'FLEX': 'bg-emerald-500', 'GASOLINA': 'bg-amber-500', 'DIESEL': 'bg-slate-500',
        'ETANOL': 'bg-green-500', 'ELÉTRICO': 'bg-blue-500', 'HÍBRIDO': 'bg-cyan-500',
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500/30">
            {/* Top Bar */}
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
                            <Car className="w-5 h-5 text-amber-400" />
                            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">
                                Mapa <span className="text-amber-400">Frota</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                            {(['dashboard', 'mapa', 'tabela'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                                        activeTab === tab ? "bg-amber-600 text-white shadow-lg" : "text-slate-500 hover:text-white"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3 font-mono text-[10px] text-slate-500">
                            {apiMeta ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>SENATRAN • Atualizado {new Date(apiMeta.updatedAt).toLocaleDateString('pt-BR')}</span>
                                </>
                            ) : loading ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    <span>Carregando dados...</span>
                                </>
                            ) : (
                                <>
                                    <Globe className="w-3 h-3 text-amber-400" />
                                    <span>DENATRAN/SENATRAN DATA</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-[1600px] mx-auto">
                {/* Filters Bar */}
                <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar estado ou marca..."
                                className="bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 w-64 font-mono"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all",
                                showFilters
                                    ? "bg-amber-600/20 border-amber-500/30 text-amber-400"
                                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:text-white"
                            )}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Filtros
                            {(filterUF !== 'ALL' || filterMarca !== 'ALL' || filterCombustivel !== 'ALL' || filterTipo !== 'ALL') && (
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                            )}
                        </button>

                        {(filterUF !== 'ALL' || filterMarca !== 'ALL' || filterCombustivel !== 'ALL' || filterTipo !== 'ALL') && (
                            <button
                                onClick={() => { setFilterUF('ALL'); setFilterMarca('ALL'); setFilterCombustivel('ALL'); setFilterTipo('ALL'); }}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase"
                            >
                                <X className="w-3 h-3" /> Limpar
                            </button>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total na Consulta</div>
                        <div className="text-2xl font-black text-amber-400">{formatNumber(totalVeiculos)}</div>
                        <div className="text-[10px] text-slate-500 font-mono">veículos registrados</div>
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-white/5 bg-slate-900/30">
                                {[
                                    { label: 'Estado (UF)', value: filterUF, setter: setFilterUF, options: UFS.map(u => u.sigla) },
                                    { label: 'Marca', value: filterMarca, setter: setFilterMarca, options: MARCAS },
                                    { label: 'Combustível', value: filterCombustivel, setter: setFilterCombustivel, options: COMBUSTIVEIS },
                                    { label: 'Tipo', value: filterTipo, setter: setFilterTipo, options: TIPOS },
                                ].map((filter) => (
                                    <div key={filter.label}>
                                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 block">{filter.label}</label>
                                        <select
                                            value={filter.value}
                                            onChange={(e) => filter.setter(e.target.value)}
                                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                                        >
                                            <option value="ALL">Todos</option>
                                            {filter.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Veículos', value: formatNumber(totalVeiculos), icon: Car, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                    { label: 'Estados Ativos', value: topUFs.length.toString(), icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                    { label: 'Marcas', value: topMarcas.length.toString(), icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                    { label: 'Tipos', value: tipoDist.length.toString(), icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                ].map((kpi, i) => (
                                    <motion.div
                                        key={kpi.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-amber-500/20 transition-all group"
                                    >
                                        <div className={cn("p-2.5 rounded-xl w-fit mb-3", kpi.bg)}>
                                            <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                                        </div>
                                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{kpi.label}</div>
                                        <div className="text-2xl font-black text-slate-200 mt-1">{kpi.value}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Marcas Bar Chart */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                                            Top Marcas
                                        </h3>
                                        <span className="text-[9px] font-mono text-slate-600">{topMarcas.length} marcas</span>
                                    </div>
                                    <div className="space-y-3">
                                        {topMarcas.map(([marca, qty], i) => (
                                            <div key={marca} className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-mono">
                                                    <span className="text-slate-300 font-bold">{marca}</span>
                                                    <span className="text-slate-500">{formatNumber(qty)}</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(qty / maxMarca) * 100}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.05 }}
                                                        className={cn("h-full rounded-full", BRAND_COLORS[marca] || 'bg-slate-500')}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top UFs */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                            Top Estados
                                        </h3>
                                        <span className="text-[9px] font-mono text-slate-600">{topUFs.length} UFs</span>
                                    </div>
                                    <div className="space-y-3">
                                        {topUFs.map(([uf, qty], i) => {
                                            const ufData = UFS.find(u => u.sigla === uf);
                                            return (
                                                <div key={uf} className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-mono">
                                                        <span className="text-slate-300 font-bold">{uf} — {ufData?.nome || ''}</span>
                                                        <span className="text-slate-500">{formatNumber(qty)}</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(qty / maxUF) * 100}%` }}
                                                            transition={{ duration: 0.8, delay: i * 0.05 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Combustível Distribution */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                                        Distribuição por Combustível
                                    </h3>
                                    <div className="flex gap-2 h-8 rounded-xl overflow-hidden">
                                        {combustivelDist.map(([comb, qty]) => {
                                            const pct = (qty / totalVeiculos) * 100;
                                            return (
                                                <motion.div
                                                    key={comb}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1 }}
                                                    className={cn("h-full", COMBUSTIVEL_COLORS[comb] || 'bg-slate-500')}
                                                    title={`${comb}: ${formatNumber(qty)} (${pct.toFixed(1)}%)`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {combustivelDist.map(([comb, qty]) => (
                                            <div key={comb} className="flex items-center gap-2 text-[10px] font-mono">
                                                <div className={cn("w-2.5 h-2.5 rounded-sm", COMBUSTIVEL_COLORS[comb] || 'bg-slate-500')} />
                                                <span className="text-slate-400">{comb}</span>
                                                <span className="text-slate-600">{((qty / totalVeiculos) * 100).toFixed(1)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tipo Distribution */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Car className="w-3.5 h-3.5 text-cyan-400" />
                                        Distribuição por Tipo
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {tipoDist.map(([tipo, qty]) => {
                                            const pct = (qty / totalVeiculos) * 100;
                                            return (
                                                <div key={tipo} className="flex items-center gap-4">
                                                    <span className="text-[10px] font-mono text-slate-400 w-28 truncate">{tipo}</span>
                                                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.8 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-500 w-16 text-right">{pct.toFixed(1)}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'mapa' && (
                        <motion.div
                            key="mapa"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
                                {/* Main Map */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                            Mapa de Densidade da Frota por UF
                                        </h3>
                                        {filterUF !== 'ALL' && (
                                            <button
                                                onClick={() => setFilterUF('ALL')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase hover:bg-amber-500/20 transition-all"
                                            >
                                                <Eye className="w-3 h-3" />
                                                Ver Todos os Estados
                                            </button>
                                        )}
                                    </div>

                                    <BrazilMap
                                        stateData={mapStateData}
                                        onStateClick={(sigla) => setFilterUF(filterUF === sigla ? 'ALL' : sigla)}
                                        selectedState={filterUF !== 'ALL' ? filterUF : undefined}
                                        formatNumber={formatNumber}
                                    />
                                </div>

                                {/* Side Panel - State Ranking */}
                                <div className="space-y-4">
                                    {/* Selected State Info */}
                                    {filterUF !== 'ALL' && (() => {
                                        const selData = mapStateData.find(s => s.sigla === filterUF);
                                        const selUF = UFS.find(u => u.sigla === filterUF);
                                        if (!selData || !selUF) return null;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-slate-900/60"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2.5 rounded-xl bg-amber-500/20">
                                                        <MapPin className="w-4 h-4 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-amber-400 font-black text-lg">{selData.sigla}</div>
                                                        <div className="text-slate-400 text-[11px] font-mono">{selUF.nome}</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-xl bg-slate-900/50">
                                                        <div className="text-[9px] font-mono text-slate-600 uppercase">Veículos</div>
                                                        <div className="text-lg font-black text-white">{formatNumber(selData.quantidade)}</div>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-slate-900/50">
                                                        <div className="text-[9px] font-mono text-slate-600 uppercase">% do Total</div>
                                                        <div className="text-lg font-black text-amber-400">
                                                            {((selData.quantidade / totalVeiculos) * 100).toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="text-[9px] font-mono text-slate-600 uppercase mb-1">Top Marcas neste Estado</div>
                                                    <div className="space-y-1">
                                                        {filteredData
                                                            .filter(r => r.uf === filterUF)
                                                            .sort((a, b) => b.quantidade - a.quantidade)
                                                            .slice(0, 5)
                                                            .map((r) => (
                                                                <div key={r.id} className="flex items-center justify-between text-[10px] font-mono">
                                                                    <span className="text-slate-300">{r.marca}</span>
                                                                    <span className="text-slate-500">{formatNumber(r.quantidade)}</span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })()}

                                    {/* Ranking */}
                                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4 sticky top-0 bg-slate-900/90 backdrop-blur-sm py-2 -mt-2">
                                            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                                            Ranking por Estado
                                        </h3>
                                        <div className="space-y-2">
                                            {mapStateData
                                                .sort((a, b) => b.quantidade - a.quantidade)
                                                .map((state, i) => {
                                                    const maxState = mapStateData.reduce((max, s) => s.quantidade > max ? s.quantidade : max, 0);
                                                    const pct = (state.quantidade / maxState) * 100;
                                                    const isActive = filterUF === state.sigla;
                                                    return (
                                                        <button
                                                            key={state.sigla}
                                                            onClick={() => setFilterUF(filterUF === state.sigla ? 'ALL' : state.sigla)}
                                                            className={`w-full p-3 rounded-xl border transition-all text-left group ${isActive
                                                                ? 'border-amber-500/30 bg-amber-500/10'
                                                                : 'border-white/5 hover:border-amber-500/10 hover:bg-slate-800/30'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-mono text-slate-600 w-5">{String(i + 1).padStart(2, '0')}</span>
                                                                <span className={`font-black text-xs ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                                                                    {state.sigla}
                                                                </span>
                                                                <span className="text-[10px] text-slate-500 truncate flex-1">{state.nome}</span>
                                                                <span className="text-[10px] font-mono font-bold text-slate-400">{formatNumber(state.quantidade)}</span>
                                                            </div>
                                                            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-amber-400' : 'bg-amber-500/40'}`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>

                                    {/* Regional Summary */}
                                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/30">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                            Resumo por Região
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { nome: 'Sudeste', ufs: ['SP', 'RJ', 'MG', 'ES'], color: 'bg-amber-500' },
                                                { nome: 'Sul', ufs: ['PR', 'SC', 'RS'], color: 'bg-emerald-500' },
                                                { nome: 'Nordeste', ufs: ['BA', 'PE', 'CE', 'MA', 'PI', 'RN', 'PB', 'AL', 'SE'], color: 'bg-indigo-500' },
                                                { nome: 'Centro-Oeste', ufs: ['GO', 'MT', 'MS', 'DF'], color: 'bg-cyan-500' },
                                                { nome: 'Norte', ufs: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'], color: 'bg-rose-500' },
                                            ].map(region => {
                                                const regionQty = mapStateData.filter(s => region.ufs.includes(s.sigla)).reduce((sum, s) => sum + s.quantidade, 0);
                                                const regionPct = totalVeiculos > 0 ? (regionQty / totalVeiculos) * 100 : 0;
                                                return (
                                                    <div key={region.nome} className="space-y-1">
                                                        <div className="flex items-center justify-between text-[10px] font-mono">
                                                            <span className="text-slate-300 font-bold flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-sm ${region.color}`} />
                                                                {region.nome}
                                                            </span>
                                                            <span className="text-slate-500">{formatNumber(regionQty)} ({regionPct.toFixed(1)}%)</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${region.color}`}
                                                                style={{ width: `${regionPct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'tabela' && (
                        <motion.div
                            key="tabela"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="rounded-2xl border border-white/5 bg-slate-900/30 overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                                        Dados da Frota ({formatNumber(filteredData.length)} registros)
                                    </h3>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold uppercase tracking-widest transition-all">
                                        <Download className="w-3 h-3" /> Exportar CSV
                                    </button>
                                </div>

                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="w-full text-left text-[10px] sm:text-xs">
                                        <thead className="bg-slate-800/50 text-slate-400 font-mono sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">UF</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">Estado</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">Marca</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">Tipo</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">Combustível</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest">Cor</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-widest text-right">Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredData.slice(0, 100).map((r) => (
                                                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-amber-400">{r.uf}</td>
                                                    <td className="px-4 py-3 text-slate-300">{r.municipio}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-200">{r.marca}</td>
                                                    <td className="px-4 py-3 text-slate-400">{r.tipo}</td>
                                                    <td className="px-4 py-3 text-slate-400">{r.combustivel}</td>
                                                    <td className="px-4 py-3 text-slate-400">{r.cor}</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">{formatNumber(r.quantidade)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredData.length > 100 && (
                                    <div className="p-4 border-t border-white/5 text-center text-[10px] font-mono text-slate-600">
                                        Exibindo 100 de {formatNumber(filteredData.length)} registros. Use filtros para refinar.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.04),transparent_60%)]" />
        </div>
    );
}

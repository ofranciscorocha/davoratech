'use client';
import Navbar from "@/components/leiloes/Navbar";
import Footer from "@/components/leiloes/Footer";
import { Search, Filter, MapPin, Tag, ChevronDown, ListFilter, Grid2X2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useState, use } from "react";
import { motion } from "framer-motion";

const categories = ['Todos os Lotes', 'Imóveis', 'Veículos Leves', 'Veículos Pesados', 'Motos', 'Bens Diversos', 'Sucatas'];
const locations = ['São Paulo - SP', 'Campinas - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG'];

const mockLots = [
    {
        id: '1',
        lotNumber: '001',
        title: 'Porshe 911 Carrera 2024 - 0km',
        location: 'São Paulo - SP',
        currentBid: 955000,
        initialBid: 890000,
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        auction: { title: 'Leilão de Veículos de Luxo #42' }
    },
    {
        id: '2',
        lotNumber: '002',
        title: 'BMW X5 xDrive 2023 - Blindada Nível III-A',
        location: 'Curitiba, PR',
        currentBid: 385000,
        initialBid: 320000,
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        auction: { title: 'Leilão Frota Executiva #15' }
    },
    {
        id: '3',
        lotNumber: '003',
        title: 'Casa de Luxo em Condomínio Fechado',
        location: 'São Roque, SP',
        currentBid: 1380000,
        initialBid: 1250000,
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        auction: { title: 'Imóveis de Alto Padrão - Interior' }
    },
    {
        id: '4',
        lotNumber: '004',
        title: 'Toyota Hilux SRX 2.8 4x4 Diesel 2024',
        location: 'Ribeirão Preto, SP',
        currentBid: 295000,
        initialBid: 270000,
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        auction: { title: 'Pickups & Utilitários #8' }
    },
    {
        id: '5',
        lotNumber: '005',
        title: 'Scania R440 A6x2 Highline 2018',
        location: 'Cuiabá, MT',
        currentBid: 520000,
        initialBid: 480000,
        imageUrl: 'https://images.unsplash.com/photo-1616715633454-526487508ff4?w=800&q=80',
        auction: { title: 'Pesados & Implementos' }
    }
];

export default function LotesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = use(searchParams);
    const [query, setQuery] = useState(typeof resolvedParams.busca === 'string' ? resolvedParams.busca : '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col text-[#0a1b3f]">
            <Navbar />
            <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                >
                    <div>
                        <span className="text-[#c9a05b] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Catálogo Completo</span>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none m-0">Explore os <span className="text-[#c9a05b]">Lotes</span></h1>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{mockLots.length} oportunidades disponíveis no momento</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#0a1b3f] shadow-sm' : 'text-gray-400'}`}
                            >
                                <Grid2X2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#0a1b3f] shadow-sm' : 'text-gray-400'}`}
                            >
                                <ListFilter className="h-4 w-4" />
                            </button>
                        </div>
                        <select className="bg-white border-none shadow-sm rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#0a1b3f] outline-none ring-1 ring-gray-100">
                            <option>Relevância</option>
                            <option>Menor Valor</option>
                            <option>Maior Valor</option>
                        </select>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 space-y-8 flex-shrink-0">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 text-[#0a1b3f] font-black text-xs uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-6">
                                <Filter size={16} className="text-[#c9a05b]" />
                                Refinar Busca
                            </div>

                            {/* Categoria */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-300 mb-5 uppercase tracking-[0.3em]">Categorias</h3>
                                <ul className="space-y-3">
                                    {categories.map((cat, idx) => (
                                        <li key={idx}>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-200 text-[#c9a05b] focus:ring-[#c9a05b]" />
                                                <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#0a1b3f] transition-colors uppercase tracking-widest">{cat}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Localização */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-300 mb-5 uppercase tracking-[0.3em]">Localização</h3>
                                <ul className="space-y-3">
                                    {locations.map((loc, idx) => (
                                        <li key={idx}>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-200 text-[#c9a05b] focus:ring-[#c9a05b]" />
                                                <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#0a1b3f] transition-colors uppercase tracking-widest">{loc}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="w-full bg-[#0a1b3f] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#c9a05b] transition-all shadow-lg">
                                Aplicar Filtros
                            </button>
                        </div>
                    </aside>

                    {/* Lotes Grid */}
                    <div className="flex-1">
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1'}`}>
                            {mockLots.map((lot, i) => (
                                <motion.div
                                    key={lot.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={`/leiloes/lote/${lot.id}`}
                                        className={`group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-row'}`}
                                    >
                                        <div className={`relative ${viewMode === 'grid' ? 'aspect-[4/3]' : 'w-48'} overflow-hidden`}>
                                            <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                                                    Aberto
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="text-[9px] font-black text-[#c9a05b] mb-2 uppercase tracking-[0.2em]">{lot.auction.title}</div>
                                            <h3 className="font-black text-[#0a1b3f] text-lg uppercase italic leading-tight mb-4 group-hover:text-[#c9a05b] transition-colors line-clamp-2 tracking-tighter">
                                                {lot.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 mt-auto uppercase tracking-widest">
                                                <MapPin className="h-3.5 w-3.5 text-[#c9a05b]" />
                                                <span>{lot.location}</span>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <div>
                                                    <span className="block text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Oferta atual</span>
                                                    <span className="text-xl font-black text-[#0a1b3f] tracking-tighter">{formatCurrency(lot.currentBid)}</span>
                                                </div>
                                                <div className="bg-[#0a1b3f] text-white p-3 rounded-xl group-hover:bg-[#c9a05b] transition-all">
                                                    <ChevronDown className="h-5 w-5 -rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

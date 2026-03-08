'use client';
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const stats = [
    { value: "789", label: "Lotes Ativos" },
    { value: "15.200+", label: "Usuários Cadastrados" },
    { value: "R$ 2,5 Bi", label: "Em Negócios Realizados" },
];

const HeroSection = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // In a full implementation, this would redirect to /leiloes/search?q=...
    };

    return (
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                {/* Using a high-quality placeholder for automotive auction if local asset is missing */}
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1950&q=80" alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[#0a1b3f]/90" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b3f]/60 via-transparent to-[#0a1b3f]/80" />
            </div>

            <div className="container relative z-10 py-20 flex flex-col items-center justify-center text-center max-w-7xl mx-auto px-4">
                <div className="max-w-4xl flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-6 inline-flex items-center justify-center gap-3 rounded-full border border-[#c9a05b]/30 bg-[#c9a05b]/10 px-6 py-2 text-[10px] font-black text-[#c9a05b] uppercase tracking-[0.3em]">
                            <span className="h-2 w-2 rounded-full bg-[#c9a05b] animate-pulse" />
                            Leilões online e presenciais em tempo real
                        </div>

                        <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-white italic uppercase tracking-tighter">
                            Arremate com segurança
                            <br />
                            <span className="text-[#c9a05b]">e transparênca total</span>
                        </h1>

                        <p className="mb-10 max-w-2xl text-base md:text-lg text-white/60 font-medium">
                            O maior ecossistema de leilões do Brasil. Veículos, imóveis e bens diversos com oportunidades únicas e governança certificada.
                        </p>
                    </motion.div>

                    {/* Search Bar - Premium Glassmorphism */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-14 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-1.5 shadow-2xl"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por lote, marca, modelo ou cidade..."
                            className="flex-1 border-0 bg-transparent px-8 py-4 text-white text-sm font-medium outline-none placeholder:text-white/30"
                        />
                        <button type="submit" className="bg-[#c9a05b] text-white rounded-xl px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-[#b88a44] transition-all flex items-center gap-3 shadow-lg">
                            <Search className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </motion.form>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-12 md:gap-20"
                    >
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center group">
                                <div className="text-3xl md:text-4xl font-black text-white group-hover:text-[#c9a05b] transition-colors duration-300">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

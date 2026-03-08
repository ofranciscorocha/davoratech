'use client';
import { Search } from "lucide-react";
import { useState } from "react";

const stats = [
    { value: "789", label: "Lotes Ativos" },
    { value: "15.200+", label: "Usuários" },
    { value: "R$ 2,5 Bi", label: "Realizados" },
];

const HeroSection = () => {
    const [search, setSearch] = useState("");

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-4">
            <div className="absolute inset-0">
                <img
                    src="/assets/banner-patio.jpg"
                    alt="Pátio Rocha Leilões Background"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80'
                    }}
                />
                <div className="absolute inset-0 bg-[#0a0f1a]/85" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/50 to-[#0a0f1a]" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto text-center">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    Leilões em tempo real
                </div>

                <h1 className="mb-6 text-5xl md:text-7xl font-black leading-[1.1] text-white tracking-tighter">
                    Oportunidades <span className="text-[#D4AF37]">Exclusivas</span>
                    <br className="hidden md:block" /> em Leilões Online
                </h1>

                <p className="mb-10 max-w-2xl mx-auto text-lg text-gray-400 font-medium leading-relaxed">
                    Veículos, imóveis e ativos de grandes empresas com total segurança e transparência jurídica. Arremate com quem é referência no mercado.
                </p>

                <form className="mb-12 flex w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md shadow-2xl">
                    <div className="flex flex-1 items-center px-4">
                        <Search className="h-5 w-5 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por lote, marca, modelo ou cidade..."
                            className="w-full border-0 bg-transparent px-4 py-4 text-white focus:outline-none placeholder:text-gray-600 font-medium"
                        />
                    </div>
                    <button className="bg-[#D4AF37] text-[#0a0f1a] px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all">
                        Buscar
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center group">
                            <div className="text-3xl md:text-4xl font-black text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                                {stat.value}
                            </div>
                            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

'use client';
import { Home, Car, Bike, Package, Scale, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
    { icon: Home, label: "Imóveis", count: 67, slug: "imoveis", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { icon: Car, label: "Veículos", count: 109, slug: "veiculos", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { icon: Bike, label: "Motos", count: 45, slug: "motos", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    { icon: Truck, label: "Pesados", count: 12, slug: "pesados", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { icon: Scale, label: "Judiciais", count: 34, slug: "judiciais", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { icon: Package, label: "Diversos", count: 21, slug: "diversos", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
];

const CategoriesSection = () => {
    return (
        <section className="py-24 bg-[#0a0f1a]">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Explore por <span className="text-[#D4AF37]">Categorias</span>
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Encontre exatamente o que você procura entre os centenas de lotes disponíveis em nossos leilões.
                        </p>
                    </div>
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#D4AF37] hover:gap-3 transition-all"
                    >
                        Ver catálogo completo <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href="#"
                            className="group flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/[0.08] hover:border-[#D4AF37]/30"
                        >
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${cat.color} transition-transform group-hover:scale-110 shadow-lg`}>
                                <cat.icon className="h-7 w-7" />
                            </div>
                            <div className="text-center">
                                <span className="block text-sm font-bold text-white mb-1">{cat.label}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#D4AF37] transition-colors">
                                    {cat.count} lotes
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;

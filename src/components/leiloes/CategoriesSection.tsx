'use client';
import { Home, Car, Bike, Package, Scale, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
    { icon: Home, label: "Imóveis", count: 67, slug: "imoveis", color: "bg-blue-50 text-blue-600" },
    { icon: Car, label: "Veículos", count: 109, slug: "veiculos", color: "bg-emerald-50 text-emerald-600" },
    { icon: Bike, label: "Motos", count: 45, slug: "motos", color: "bg-orange-50 text-orange-600" },
    { icon: Truck, label: "Pesados", count: 12, slug: "pesados", color: "bg-purple-50 text-purple-600" },
    { icon: Scale, label: "Judiciais", count: 34, slug: "judiciais", color: "bg-rose-50 text-rose-600" },
    { icon: Package, label: "Diversos", count: 21, slug: "diversos", color: "bg-amber-50 text-amber-600" },
];

const CategoriesSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 flex items-end justify-between"
                >
                    <div>
                        <span className="text-[#c9a05b] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Explorar mercado</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0a1b3f] uppercase italic tracking-tighter">
                            Categorias <span className="text-[#c9a05b]">em destaque</span>
                        </h2>
                    </div>
                    <Link
                        href="/leiloes"
                        className="hidden items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c9a05b] hover:text-[#0a1b3f] transition-colors sm:flex"
                    >
                        Ver catálogo completo <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/leiloes?categoria=${cat.slug}`}
                                className="group flex flex-col items-center gap-4 rounded-3xl border border-gray-100 bg-gray-50/50 p-8 transition-all hover:bg-white hover:border-[#c9a05b]/30 hover:shadow-2xl text-center"
                            >
                                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cat.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <cat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-black text-[#0a1b3f] uppercase tracking-tighter mb-1">{cat.label}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {cat.count} ativos
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;

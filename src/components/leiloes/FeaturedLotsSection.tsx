'use client';
import LotCard from "./LotCard";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const featuredLots = [
    {
        id: 1,
        title: "Casa de Luxo em Condomínio Fechado com Área Gourmet",
        location: "São Roque, SP",
        startingBid: "R$ 1.250.000,00",
        currentBid: "R$ 1.380.000,00",
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        status: "aberto" as const,
        endsIn: "2d 14h",
        category: "Imóvel",
    },
    {
        id: 2,
        title: "Porshe 911 Carrera 2024 - 0km",
        location: "Curitiba, PR",
        startingBid: "R$ 890.000,00",
        currentBid: "R$ 955.000,00",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        status: "aberto" as const,
        endsIn: "5h 12m",
        category: "Veículo",
    },
    {
        id: 3,
        title: "Apartamento Duplex Frente Mar - Mobiliado",
        location: "Balneário Camboriú, SC",
        startingBid: "R$ 3.450.000,00",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        status: "em-breve" as const,
        category: "Imóvel",
    }
];

const FeaturedLotsSection = () => {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14 flex items-end justify-between"
                >
                    <div>
                        <span className="text-[#c9a05b] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Seleção exclusiva</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0a1b3f] uppercase italic tracking-tighter">
                            Lotes em <span className="text-[#c9a05b]">destaque</span>
                        </h2>
                    </div>
                    <Link
                        href="/leiloes"
                        className="hidden items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c9a05b] hover:text-[#0a1b3f] transition-colors sm:flex"
                    >
                        Ver todas as ofertas <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredLots.map((lot, i) => (
                        <motion.div
                            key={lot.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <LotCard {...lot} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Link
                        href="/leiloes"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c9a05b]"
                    >
                        Ver todos os lotes <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedLotsSection;

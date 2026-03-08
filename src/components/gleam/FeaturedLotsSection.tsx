'use client';
import LotCard from "./LotCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const featuredLots = [
    {
        id: 1,
        title: "Casa de Luxo com Piscina e Área Gourmet Completa",
        location: "Gramado, RS",
        startingBid: "R$ 1.680.000",
        currentBid: "R$ 1.850.000",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
        status: "aberto" as const,
        endsIn: "2d 14h",
        category: "Imóvel",
    },
    {
        id: 2,
        title: "BMW X5 xDrive 2023 - Blindada Nível III-A",
        location: "São Paulo, SP",
        startingBid: "R$ 320.000",
        currentBid: "R$ 385.000",
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
        status: "aberto" as const,
        endsIn: "1d 8h",
        category: "Veículo",
    },
    {
        id: 3,
        title: "Apartamento Frente Mar - 4 Suítes Decorado",
        location: "Salvador, BA",
        startingBid: "R$ 2.250.000",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
        status: "em-breve" as const,
        category: "Imóvel",
    },
];

const FeaturedLotsSection = ({ serverLots }: { serverLots?: any[] }) => {
    const displayLots = serverLots && serverLots.length > 0 ? serverLots : featuredLots;

    return (
        <section className="py-24 bg-[#0a0f1a] border-y border-white/5">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Lotes em <span className="text-[#D4AF37]">Destaque</span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-xl">
                            Confira as melhores oportunidades selecionadas por nossos especialistas com preços altamente competitivos.
                        </p>
                    </div>
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                    >
                        Ver todos <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayLots.map((lot) => {
                        const mappedLot = lot.startingPrice !== undefined ? {
                            id: lot.id,
                            title: lot.title,
                            location: lot.location || 'Localização não informada',
                            startingBid: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lot.startingPrice),
                            currentBid: lot.currentBid ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lot.currentBid) : undefined,
                            imageUrl: lot.imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
                            status: (lot.status === 'OPEN' ? 'aberto' : lot.status === 'PENDING' ? 'em-breve' : 'encerrado') as any,
                            category: lot.category || 'Veículo',
                        } : lot;

                        return (
                            <LotCard key={lot.id} {...mappedLot} />
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedLotsSection;

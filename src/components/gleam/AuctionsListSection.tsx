'use client';
import { Gavel, Calendar, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AuctionsListSection({ auctions }: { auctions: any[] }) {
    if (!auctions || auctions.length === 0) return (
        <section className="py-24 bg-[#0a0f1a]">
            <div className="container max-w-7xl mx-auto px-4 text-center">
                <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl py-20">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Nenhum leilão aberto no momento</p>
                </div>
            </div>
        </section>
    );

    return (
        <section className="py-24 bg-[#0a0f1a]">
            <div className="container max-w-7xl mx-auto px-4 text-center">
                <div className="mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-1 w-12 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.4em]">Próximos Leilões</span>
                        <span className="h-1 w-12 bg-[#D4AF37] rounded-full"></span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white">Agenda de <span className="text-[#D4AF37]">Eventos</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {auctions.map((auction) => (
                        <div
                            key={auction.id}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group text-left"
                        >
                            <div className="h-48 bg-gray-900 relative overflow-hidden">
                                {auction.coverImage ? (
                                    <img
                                        src={auction.coverImage}
                                        alt={auction.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full opacity-20">
                                        <Gavel size={64} className="text-white" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-green-500 text-[#0a0f1a] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg shadow-green-500/20">
                                    {auction.status || 'Ativo'}
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-tight">
                                    {auction.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-8 line-clamp-2 font-medium">
                                    {auction.summary || 'Acompanhe este leilão exclusivo com as melhores oportunidades selecionadas.'}
                                </p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                        <span>{new Date(auction.startDate).toLocaleDateString('pt-BR')} às {new Date(auction.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                        <span>{auction.visitacaoLocal || 'Auditório Virtual'}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/patiorochaleiloes/leiloes/${auction.id}`}
                                    className="block w-full bg-[#1a2332] hover:bg-[#D4AF37] hover:text-[#0a0f1a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center transition-all shadow-xl"
                                >
                                    Acessar Catálogo
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

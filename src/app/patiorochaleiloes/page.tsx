import { prisma } from "@/lib/prisma";
// Note: Components like Navbar, HeroSection, etc. will be migrated as needed.
// This is the unified landing page for Pátio Rocha Leilões inside Rocha Tec.

export default async function LeilaoPage() {
    let featuredLots = [];
    let openAuctions = [];

    try {
        const p: any = prisma;
        featuredLots = await p.lot.findMany({
            where: { status: 'OPEN' },
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: { auction: true }
        });

        const dbAuctions = await p.auction.findMany({
            where: { status: { in: ['OPEN', 'LIVE', 'UPCOMING', 'EM_BREVE'] } },
            orderBy: { createdAt: 'desc' },
            include: { lots: { select: { id: true } } }
        });

        openAuctions = dbAuctions.map((a: any) => ({
            ...a,
            _count: { lots: a.lots ? a.lots.length : 0 }
        }));
    } catch (error) {
        console.error('Database connection error:', error);
    }

    return (
        <div className="min-h-screen bg-[#1a2332] text-white">
            <nav className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1a]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="text-[#D4AF37]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-widest text-[#D4AF37]">Pátio Rocha Leilões</h1>
                </div>
                <div className="flex gap-8 items-center">
                    <a href="#" className="text-sm font-bold hover:text-[#D4AF37] transition-colors">Leilões</a>
                    <a href="#" className="text-sm font-bold hover:text-[#D4AF37] transition-colors">Como Funciona</a>
                    <a href="/login" className="bg-[#D4AF37] text-[#0a0f1a] px-6 py-2.5 rounded-lg text-sm font-black hover:scale-105 transition-all">Acessar Painel</a>
                </div>
            </nav>

            <main>
                <section className="py-24 px-8 text-center bg-gradient-to-b from-[#0a0f1a] to-[#1a2332]">
                    <h2 className="text-6xl font-black mb-6">Oportunidades <span className="text-[#D4AF37]">Exclusivas</span> em Leilões</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">Transparência, agilidade e os melhores ativos do mercado. Participe dos nossos leilões online e presenciais.</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-[#D4AF37] text-black px-10 py-4 rounded-xl font-black text-lg">Ver Leilões Abertos</button>
                        <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-xl font-black text-lg">Cadastrar-se Agora</button>
                    </div>
                </section>

                <section className="py-20 px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h3 className="text-3xl font-black">Leilões em Destaque</h3>
                            <p className="text-gray-500 mt-2">Confira as melhores oportunidades selecionadas para você.</p>
                        </div>
                        <button className="text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-1">Ver todos</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {openAuctions.length > 0 ? (
                            openAuctions.map((auction: any) => (
                                <div key={auction.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group">
                                    <div className="h-48 bg-gray-800 relative">
                                        <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                            {auction.status}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-black mb-2 group-hover:text-[#D4AF37] transition-colors">{auction.title}</h4>
                                        <p className="text-sm text-gray-500 mb-6 line-clamp-2">{auction.summary}</p>
                                        <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                            <span>{auction._count.lots} Lotes</span>
                                            <span>Data: {new Date(auction.startDate).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-500 font-bold">Nenhum leilão aberto no momento.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="py-16 px-8 border-t border-white/10 bg-[#0a0f1a]">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 text-sm">Pátio Rocha Leilões © 2026 - Todos os direitos reservados</p>
                </div>
            </footer>
        </div>
    );
}

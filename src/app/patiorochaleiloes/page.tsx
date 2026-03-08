import Navbar from "@/components/gleam/Navbar";
import HeroSection from "@/components/gleam/HeroSection";
import CategoriesSection from "@/components/gleam/CategoriesSection";
import FeaturedLotsSection from "@/components/gleam/FeaturedLotsSection";
import AuctionsListSection from "@/components/gleam/AuctionsListSection";
import HowItWorksSection from "@/components/gleam/HowItWorksSection";
import Footer from "@/components/gleam/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Dynamic for now

export default async function Home() {
    // Integramos com o painel admin (pega do prisma)
    let featuredLots = [];
    let openAuctions = [];
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        // Fallback safe mapping
        openAuctions = dbAuctions.map((a: any) => ({
            ...a,
            _count: { lots: a.lots ? a.lots.length : 0 }
        }));
    } catch (error) {
        console.error('Database connection error:', error);
    }

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white selection:bg-[#D4AF37] selection:text-[#0a0f1a] font-sans">
            <Navbar />
            <main>
                <HeroSection />
                <CategoriesSection />
                <FeaturedLotsSection serverLots={featuredLots} />
                <AuctionsListSection auctions={openAuctions} />
                <HowItWorksSection />

                {/* Banner do Pátio */}
                <section className="relative w-full h-[400px] overflow-hidden">
                    <img
                        src="/assets/banner-patio.jpg"
                        alt="Pátio Rocha Leilões - Vista do Pátio"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/90 via-[#0a0f1a]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 text-center px-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 drop-shadow-lg">
                            Conheça Nosso Pátio
                        </h2>
                        <p className="text-white/80 text-base md:text-lg max-w-2xl mb-6 font-medium">
                            Estrutura completa para armazenamento e vistoria de veículos. Segurança e organização em mais de 10.000m² de área coberta.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-12 bg-[#D4AF37] rounded-full" />
                            <span className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest">Pátio Rocha Leilões</span>
                            <span className="h-1 w-12 bg-[#D4AF37] rounded-full" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

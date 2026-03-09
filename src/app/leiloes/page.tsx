'use client';
import Navbar from "@/components/leiloes/Navbar";
import HeroSection from "@/components/leiloes/HeroSection";
import CategoriesSection from "@/components/leiloes/CategoriesSection";
import FeaturedLotsSection from "@/components/leiloes/FeaturedLotsSection";
import HowItWorksSection from "@/components/leiloes/HowItWorksSection";
import Footer from "@/components/leiloes/Footer";
import './leiloes.css';

export default function LeiloesPage() {
    return (
        <div id="leiloes-root" className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
                <HeroSection />
                <CategoriesSection />
                <FeaturedLotsSection />
                <HowItWorksSection />

                {/* Banner Institucional */}
                <section className="relative w-full h-[500px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1950&q=80"
                        alt="Pátio Rocha Leilões - Infraestrutura"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#080c17]/80" />
                    <div className="relative z-10 h-full container max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
                        <div className="mb-6 h-1 w-24 bg-[#c9a05b] rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
                            Nossa <span className="text-[#c9a05b]">Estrutura</span>
                        </h2>
                        <p className="text-white/60 text-lg max-w-3xl mb-10 font-medium">
                            Contamos com mais de 20.000m² de área para armazenamento, vistoria e logística de veículos e bens diversos. Tecnologia de ponta e segurança 24h para seus lotes.
                        </p>
                        <div className="flex items-center gap-4 text-[#c9a05b] font-black text-xs uppercase tracking-[0.3em]">
                            <span className="h-[1px] w-12 bg-[#c9a05b]" />
                            Arremate Club
                            <span className="h-[1px] w-12 bg-[#c9a05b]" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

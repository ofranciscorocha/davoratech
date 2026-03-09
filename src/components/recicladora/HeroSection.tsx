'use client';
import { Recycle, ArrowDown } from "lucide-react";

const HeroSection = () => {
    return (
        <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background image - using the unsplash reference from the original build as fallback if local asset is missing */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[#1a4731]/80 backdrop-blur-[2px]" />
                <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80"
                    alt="Recycling Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 container text-center lg:text-left py-32 max-w-7xl mx-auto px-4">
                <img
                    src="/assets/logo-recicladora.png"
                    alt="Recicladora Rocha Logo"
                    className="h-28 md:h-36 w-auto mb-8 mx-auto lg:mx-0 animate-fade-up"
                />
                <p className="text-sm md:text-base text-white/80 font-bold uppercase tracking-[0.4em] mb-4 animate-fade-up">
                    Reciclar · Reutilizar · Reaproveitar · Reduzir · Recriar
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-up">
                    Soluções em reciclagem<br />
                    <span className="text-[#8ec448]">de salvados e sucatas</span>
                </h1>
                <p className="text-base md:text-lg text-white/70 max-w-xl mb-10 animate-fade-up">
                    Referência no mercado Reciclador em todo o Brasil com tecnologia, eficiência e compromisso ambiental.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up">
                    <a
                        href="#servicos"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[#76b139] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#8ec448] transition-all shadow-lg hover:scale-105"
                    >
                        <Recycle size={18} />
                        Nossos Serviços
                    </a>
                    <a
                        href="#contato"
                        className="inline-flex items-center gap-2 px-10 py-4 border-2 border-white/30 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Fale Conosco
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <a href="#sobre" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                <ArrowDown size={28} />
            </a>
        </section>
    );
};

export default HeroSection;

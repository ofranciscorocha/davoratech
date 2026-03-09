'use client';
import { Gavel } from "lucide-react";

export const Logo = () => {
    return (
        <div className="flex items-center gap-3">
            <img src="/assets/logo-patio.png" alt="Pátio Rocha Leilões" className="h-9 md:h-11 w-auto drop-shadow-lg" />
            <div className="hidden sm:block">
                <span className="text-white font-black text-lg tracking-tighter uppercase leading-none block">Pátio <span className="text-[#D4AF37]">Rocha</span></span>
                <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.2em]">Leilões Premium</span>
            </div>
        </div>
    );
};

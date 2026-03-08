'use client';
import { Gavel } from "lucide-react";

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20">
                <Gavel className="h-5 w-5 text-[#0a0f1a]" />
            </div>
            <div className="flex flex-col">
                <span className="font-heading text-lg font-black uppercase tracking-widest text-white leading-none">Pátio Rocha</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] leading-none mt-1">Leilões</span>
            </div>
        </div>
    );
};

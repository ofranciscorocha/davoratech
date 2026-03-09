'use client';
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Atuação", href: "#atuacao" },
    { label: "Parceiros", href: "#parceiros" },
    { label: "Certificados", href: "#certificados" },
    { label: "Contato", href: "#contato" },
    { label: "Painel Admin", href: "/recicladora/admin", isPremium: true },
];

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a4731]/95 backdrop-blur-md border-b border-white/10">
            <div className="container flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto px-4">
                <Link href="/recicladora" className="flex items-center gap-3">
                    <img src="/assets/logo-recicladora.png" alt="Recicladora Rocha" className="h-10 md:h-12 w-auto" />
                    <div className="hidden sm:block">
                        <span className="text-white font-black text-lg tracking-tighter uppercase leading-none block">Recicladora <span className="text-[#8ec448]">Rocha</span></span>
                        <span className="text-[#8ec448] text-[9px] font-bold uppercase tracking-[0.2em]">Sustentabilidade</span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all rounded-xl ${link.isPremium
                                    ? 'bg-[#8ec448] text-[#1a4731] hover:bg-[#76b139] shadow-lg shadow-[#8ec448]/20 active:scale-95'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden text-white p-2"
                    aria-label="Menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile nav */}
            {open && (
                <nav className="lg:hidden bg-[#1a4731] border-t border-white/10">
                    <div className="container py-4 flex flex-col gap-1 px-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;

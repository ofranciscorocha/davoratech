'use client';
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Atuação", href: "#atuacao" },
    { label: "Parceiros", href: "#parceiros" },
    { label: "Certificados", href: "#certificados" },
    { label: "Contato", href: "#contato" },
];

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a4731]/95 backdrop-blur-md border-b border-white/10">
            <div className="container flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto px-4">
                <a href="#inicio" className="flex items-center gap-3">
                    <img src="https://static.wixstatic.com/media/06093b_99f2e3a8907340d0a7a0b3f3b9e4a3b3~mv2.png/v1/fill/w_360,h_102,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo-white.png" alt="Recicladora Rocha" className="h-12 md:h-14 w-auto" />
                </a>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
                        >
                            {link.label}
                        </a>
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

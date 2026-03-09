'use client';
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";

const navLinks = [
    {
        label: "Leilões",
        href: "#",
        children: [
            { label: "Todos os Lotes", href: "/leiloes/lotes" },
            { label: "Imóveis", href: "/leiloes/lotes?category=imovel" },
            { label: "Veículos", href: "/leiloes/lotes?category=veiculo" },
            { label: "Motos", href: "/leiloes/lotes?category=moto" },
            { label: "Diversos", href: "/leiloes/lotes?category=diversos" },
        ],
    },
    { label: "Agenda", href: "/leiloes/agenda" },
    { label: "Como Participar", href: "/leiloes/como-participar" },
    { label: "Quem Somos", href: "/leiloes/quem-somos" },
    { label: "Contato", href: "/leiloes/contato" },
    { label: "Painel Admin", href: "/patiorochaleiloes/admin", isAdmin: true },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl">
            <div className="container max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
                <Link href="/patiorochaleiloes" className="flex items-center">
                    <Logo />
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-2 lg:flex">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white">
                                    {link.label}
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a] p-2 shadow-2xl">
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-[#D4AF37]"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${link.isAdmin
                                        ? 'bg-[#D4AF37] text-[#0a0f1a] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 active:scale-95'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-4 lg:flex">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#D4AF37] transition-all"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        Entrar
                    </Link>
                    <Link
                        href="/login"
                        className="bg-[#D4AF37] text-[#0a0f1a] px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20"
                    >
                        Cadastrar
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button className="text-white lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-white/10 bg-[#0a0f1a] lg:hidden p-4 space-y-2">
                    {navLinks.map((link) => (
                        <div key={link.label}>
                            <Link
                                href={link.href}
                                className="block rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/5"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                        <Link href="/login" className="w-full py-3 text-center text-gray-400 font-bold">
                            Entrar
                        </Link>
                        <Link href="/login" className="w-full bg-[#D4AF37] text-[#0a0f1a] py-3 text-center rounded-xl font-black uppercase tracking-widest">
                            Cadastrar
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

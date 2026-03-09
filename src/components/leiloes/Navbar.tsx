'use client';
import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    {
        label: "Leilões",
        href: "/leiloes",
        children: [
            { label: "Todos os Lotes", href: "/leiloes" },
            { label: "Imóveis", href: "/leiloes?categoria=imoveis" },
            { label: "Veículos", href: "/leiloes?categoria=veiculos" },
            { label: "Motos", href: "/leiloes?categoria=motos" },
            { label: "Diversos", href: "/leiloes?categoria=diversos" },
        ],
    },
    { label: "Agenda", href: "/leiloes" },
    { label: "Como Participar", href: "#como-participar" },
    { label: "Quem Somos", href: "#sobre" },
    { label: "Contato", href: "#contato" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080c17] backdrop-blur-md">
            <div className="container max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
                <Link href="/leiloes" className="flex items-center gap-2">
                    <img src="/arremate-logo-dark.png" alt="Arremate Club" className="h-10 w-auto" />
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button className="flex items-center gap-1 rounded-md px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80 transition-colors hover:text-white hover:bg-white/10">
                                    {link.label}
                                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#080c17] py-2 shadow-2xl"
                                        >
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:bg-white/5 hover:text-[#c9a05b]"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="rounded-md px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80 transition-colors hover:text-white hover:bg-white/10"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 lg:flex">
                    <Link href="/login" className="px-6 py-2 text-xs font-black uppercase tracking-widest text-white hover:text-[#c9a05b] transition-colors">Entrar</Link>
                    <Link href="/leiloes" className="bg-[#c9a05b] text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#b88a44] hover:scale-105 transition-all shadow-lg">Cadastre-se</Link>
                </div>

                {/* Mobile toggle */}
                <button className="text-white lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10 bg-[#080c17] lg:hidden"
                    >
                        <div className="container py-6 flex flex-col gap-2 px-4 text-center">
                            {navLinks.map((link) => (
                                <div key={link.label} className="py-2">
                                    <Link
                                        href={link.href}
                                        className="block text-sm font-black uppercase tracking-[0.2em] text-white hover:text-[#c9a05b]"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </div>
                            ))}
                            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
                                <Link href="/login" className="text-white font-black uppercase tracking-widest text-sm py-2">Acessar Painel</Link>
                                <Link href="/leiloes" className="bg-[#c9a05b] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm">Criar Conta</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

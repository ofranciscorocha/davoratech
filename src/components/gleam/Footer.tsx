'use client';
import { Gavel, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

const Footer = () => {
    return (
        <footer className="bg-[#05080f] border-t border-white/5 pt-20 pb-10">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-12 mb-20">
                    <div className="lg:col-span-4">
                        <Logo />
                        <p className="mt-6 text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                            Referência nacional no mercado de leilões, oferecendo segurança, tecnologia e as melhores oportunidades para quem busca investir com inteligência.
                        </p>
                        <div className="mt-8 flex gap-4">
                            {[Instagram, Facebook, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-[#0a0f1a] transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Navegação</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold">
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Leilões Ativos</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Como Participar</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Sobre Nós</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Dúvidas Frequentes</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Categorias</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold">
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Imóveis</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Veículos</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Motos</Link></li>
                            <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Heavy/Máquinas</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Atendimento</h4>
                        <ul className="space-y-5 text-sm text-gray-500 font-bold">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37]">
                                    <Mail size={16} />
                                </div>
                                contato@patiorochaleiloes.com.br
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37]">
                                    <Phone size={16} />
                                </div>
                                (75) 3030-4040
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37]">
                                    <MapPin size={16} />
                                </div>
                                Feira de Santana - Bahia
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
                        Pátio Rocha Leilões © 2026 · Todos os direitos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

'use client';
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-[#080c17] py-20 border-t border-white/10" id="contato">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/leiloes" className="mb-6 flex items-center gap-2">
                            <img src="/arremate-logo-dark.png" alt="Arremate Club" className="h-12 w-auto" />
                        </Link>
                        <p className="text-sm font-medium text-white/40 leading-relaxed uppercase tracking-tighter">
                            A maior e mais segura plataforma de leilões do Brasil. Tradição familiar com inovação tecnológica.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#c9a05b]">Links Rápidos</h4>
                        <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/leiloes" className="hover:text-white transition-colors">Leilões Ativos</Link></li>
                            <li><a href="#como-participar" className="hover:text-white transition-colors">Como Participar</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#c9a05b]">Principais Categorias</h4>
                        <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/leiloes?categoria=imoveis" className="hover:text-white transition-colors">Imóveis</Link></li>
                            <li><Link href="/leiloes?categoria=veiculos" className="hover:text-white transition-colors">Veículos</Link></li>
                            <li><Link href="/leiloes?categoria=motos" className="hover:text-white transition-colors">Motos</Link></li>
                            <li><Link href="/leiloes?categoria=diversos" className="hover:text-white transition-colors">Diversos</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#c9a05b]">Atendimento</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Mail className="h-4 w-4 text-[#c9a05b]" />
                                contato@patiorocha.com.br
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Phone className="h-4 w-4 text-[#c9a05b]" />
                                (75) 3000-0000
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <MapPin className="h-4 w-4 text-[#c9a05b]" />
                                Feira de Santana, BA
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/5 pt-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                    © {new Date().getFullYear()} Arremate Club. Excelência em Arrematação.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

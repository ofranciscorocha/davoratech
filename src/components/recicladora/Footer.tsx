const Footer = () => {
    return (
        <footer className="bg-[#1a4731] py-16 border-t border-white/10 overflow-hidden relative">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                        <img src="/assets/logo-recicladora.png" alt="Recicladora Rocha Logo" className="h-12 md:h-14 mb-6 opacity-80" />
                        <div className="text-left">
                            <p className="text-2xl font-black text-white tracking-widest">Recicladora <span className="text-[#8ec448]">Rocha</span></p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Reciclar, reutilizar, reaproveitar</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex gap-6 text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">
                            <a href="#inicio" className="hover:text-white transition-colors">Início</a>
                            <a href="#servicos" className="hover:text-white transition-colors">Serviços</a>
                            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
                        </div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest text-center md:text-right">
                            © {new Date().getFullYear()} Recicladora Rocha. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative green leaf-style accent */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#76b139]/20 rounded-full blur-[80px]" />
        </footer>
    );
};

export default Footer;

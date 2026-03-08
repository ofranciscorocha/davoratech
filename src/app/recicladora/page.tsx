'use client';

// Note: Components like Header, HeroSection, etc. will be migrated as needed.
// For now, creating the structure.

export default function RecicladoraPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-white">
            <nav className="p-6 border-b border-white/10 flex justify-between items-center">
                <h1 className="text-2xl font-black text-green-500">Recicladora Rocha</h1>
                <div className="flex gap-6">
                    <a href="#hero" className="text-sm font-bold opacity-70 hover:opacity-100">Início</a>
                    <a href="#services" className="text-sm font-bold opacity-70 hover:opacity-100">Serviços</a>
                    <a href="#contact" className="text-sm font-bold opacity-70 hover:opacity-100">Contato</a>
                    <a href="/login" className="bg-green-600 px-4 py-2 rounded-lg text-sm font-black">Área do Parceiro</a>
                </div>
            </nav>

            <main>
                <section id="hero" className="py-24 px-8 text-center max-w-4xl mx-auto">
                    <h2 className="text-5xl font-black mb-6">Gestão Inteligente para <span className="text-green-500">Reciclagem de Veículos</span></h2>
                    <p className="text-xl text-gray-400 mb-10 text-balance">Unificamos tecnologia e sustentabilidade para pátios de leilão e recicladoras em todo o Brasil. Gerencie fluxos, emita certificados e tenha controle total.</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-green-900/20">Saiba Mais</button>
                        <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-lg">Nossas Soluções</button>
                    </div>
                </section>

                <section id="services" className="py-24 px-8 bg-black/20">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-green-500 rounded-lg mb-6 flex items-center justify-center text-white">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <h3 className="text-xl font-black mb-4">Certificados Digitais</h3>
                            <p className="text-gray-400">Geração automática de certificados de prensa e descontaminação com validade jurídica.</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-green-500 rounded-lg mb-6 flex items-center justify-center text-white">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                            </div>
                            <h3 className="text-xl font-black mb-4">Gestão de Salvados</h3>
                            <p className="text-gray-400">Inventário completo de peças e materiais recicláveis com fotos e laudos técnicos.</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-green-500 rounded-lg mb-6 flex items-center justify-center text-white">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-xl font-black mb-4">Compliance Total</h3>
                            <p className="text-gray-400">Segurança de dados e conformidade total com as leis ambientais e do CONTRAN.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="p-12 text-center text-gray-500 border-t border-white/10">
                <p>Recicladora Rocha © 2026 - Tecnologia Ambiental para Leilões</p>
            </footer>
        </div>
    );
}

'use client';

export default function MarketingPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-4">
                        <div className="text-purple-500">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" /></svg>
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Rocha Marketing</h1>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-purple-900/20 transition-all">Iniciar Campanha</button>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-6xl font-black mb-8 tracking-tighter leading-[0.9]">Potencialize seus <span className="text-purple-500">Leilões</span> com Marketing de Dados</h2>
                        <p className="text-xl text-gray-400 mb-10">Software de automação para campanhas de WhatsApp, E-mail e SMS focado em atrair mais arrematantes para o seu pátio.</p>
                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1">
                                <h4 className="text-purple-400 font-black text-2xl mb-1">+15k</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase">Leads Qualificados</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1">
                                <h4 className="text-purple-400 font-black text-2xl mb-1">98%</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase">Taxa de Abertura</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 aspect-video rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-2xl mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/50">Ver Demonstração</span>
                        </div>
                    </div>
                </section>

                <section className="bg-white/5 rounded-[40px] p-12 border border-white/10 text-center">
                    <h3 className="text-3xl font-black mb-4">Escolha seu Canal de Disparo</h3>
                    <p className="text-gray-500 mb-12">Nossa inteligência artificial escolhe o melhor momento e canal para cada cliente.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.02]">
                            <div className="text-purple-500 mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7.9.9 0 0 1 1.1 1.3L12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6l.5-1.5a.9.9 0 0 1 1 0z" /><path d="M22 4L12 14.01l-3-3" /></svg>
                            </div>
                            <h4 className="text-xl font-black mb-2">WhatsApp Direct</h4>
                            <p className="text-sm text-gray-500">Envios em massa com inteligência anti-bloqueio.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.02]">
                            <div className="text-purple-500 mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <h4 className="text-xl font-black mb-2">Smart E-mail</h4>
                            <p className="text-sm text-gray-500">Templates dinâmicos com os lotes do dia.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.02]">
                            <div className="text-purple-500 mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </div>
                            <h4 className="text-xl font-black mb-2">SMS Corporate</h4>
                            <p className="text-sm text-gray-500">Alertas críticos de lances e finalização de leilões.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

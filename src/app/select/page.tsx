'use client';
import './select.css';

export default function SelectPage() {
    return (
        <div id="select-root" className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-white">ROCHA <span className="text-[#c5a059]">SELECT</span></h1>
            <p className="text-gray-400 max-w-md mx-auto mb-8 font-medium">O clube exclusivo para investimentos de alto padrão do Grupo Rocha.</p>
            <div className="w-24 h-1 bg-[#c5a059] mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="border border-white/10 p-10 rounded-2xl bg-white/5 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 text-[#c5a059]">Veículos Premium</h3>
                    <p className="text-sm text-gray-400">Acesso antecipado ao estoque de luxo e superesportivos.</p>
                </div>
                <div className="border border-white/10 p-10 rounded-2xl bg-white/5 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 text-[#c5a059]">Investimentos</h3>
                    <p className="text-sm text-gray-400">Oportunidades únicas em leilões e ativos imobiliários.</p>
                </div>
            </div>
        </div>
    );
}

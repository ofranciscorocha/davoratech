'use client';
import './licitacoes.css';

export default function LicitacoesPage() {
    return (
        <div id="licitacoes-root" className="p-8">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Portal de Licitações Rocha</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                    <h3 className="font-bold text-lg">Editais Abertos</h3>
                    <p className="text-3xl font-black mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="font-bold text-lg">Em Participação</h3>
                    <p className="text-3xl font-black mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-600">
                    <h3 className="font-bold text-lg">Finalizados</h3>
                    <p className="text-3xl font-black mt-2">0</p>
                </div>
            </div>
        </div>
    );
}

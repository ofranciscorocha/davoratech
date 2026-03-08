import { MapPin } from "lucide-react";

const states = ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA", "PA", "AP", "MG", "MT", "MS", "RO", "AC", "AM", "RR", "TO", "PR", "SC"];

const CoverageSection = () => {
    return (
        <section id="atuacao" className="py-24 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#1a4731]/5 text-[#1a4731] font-bold text-sm rounded-full mb-4">
                        Área de Atuação
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a4731] mb-6">
                        Presença no <span className="text-[#76b139]">Norte, Nordeste, Centro-Oeste e Sudeste</span>
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Prestamos serviço para o mercado segurador em 21 estados brasileiros.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4">
                        {states.map((state) => (
                            <div
                                key={state}
                                className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-default group"
                            >
                                <span className="font-black text-white text-sm group-hover:text-[#8ec448] transition-colors">
                                    {state}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-3 py-4 px-8 bg-gray-50 rounded-full w-fit mx-auto border border-gray-100">
                        <MapPin size={20} className="text-[#76b139]" />
                        <span className="text-gray-700 font-bold">Sede: Feira de Santana — BA</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoverageSection;

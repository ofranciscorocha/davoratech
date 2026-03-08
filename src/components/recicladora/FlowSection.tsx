import { AlertTriangle, FileText, Truck, SplitSquareHorizontal, ArrowRight, Factory } from "lucide-react";

const steps = [
    { icon: AlertTriangle, title: "Sinistro", desc: "Ocorrência do sinistro pelo veículo segurado" },
    { icon: FileText, title: "Orçamentos", desc: "Geração dos orçamentos e aprovação" },
    { icon: Truck, title: "Recolhimento", desc: "Coleta das sucatas com frota própria" },
    { icon: SplitSquareHorizontal, title: "Separação", desc: "Classificação: ferro, plástico, alumínio, bateria, pneus, chumbo" },
    { icon: Factory, title: "Destinação", desc: "Destinação correta dos materiais para siderúrgicas e parceiros" },
];

const FlowSection = () => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#1a4731]/10 text-[#1a4731] font-bold text-sm rounded-full mb-4">
                        Fluxo Operacional
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a4731]">
                        Do sinistro à <span className="text-[#76b139]">destinação final</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col lg:flex-row items-center">
                            <div className="flex flex-col items-center text-center w-full lg:w-48 px-4">
                                <div className="w-20 h-20 bg-[#1a4731] rounded-3xl flex items-center justify-center mb-6 shadow-xl transform transition-transform hover:scale-110">
                                    <step.icon className="text-white" size={32} />
                                </div>
                                <h3 className="font-black text-lg text-[#1a4731] mb-2">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="py-4 lg:py-0 lg:px-2 transform rotate-90 lg:rotate-0">
                                    <ArrowRight className="text-[#76b139]/30" size={32} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlowSection;

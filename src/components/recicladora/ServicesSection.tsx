import { Car, Recycle, Scissors, Factory, Truck, Wrench } from "lucide-react";

const services = [
    {
        icon: Car,
        title: "Salvados de Seguradoras",
        desc: "Recolhimento de salvados de seguradoras — AUTO/RE — com logística própria e rastreamento completo.",
    },
    {
        icon: Recycle,
        title: "Reciclagem de Sucatinhas",
        desc: "Recolhimento de peças descartadas pelos sinistros de veículos, separação e classificação dos materiais.",
    },
    {
        icon: Truck,
        title: "Coleta de Veículos",
        desc: "Coleta de veículos e maquinários em fim de vida útil: perda total, carbonizados e blindados.",
    },
    {
        icon: Scissors,
        title: "Descontaminação e Corte",
        desc: "Procedimento de descontaminação, retirada de peças e corte no pátio com equipamentos especializados.",
    },
    {
        icon: Factory,
        title: "Prensagem Industrial",
        desc: "Serviço de máquina prensa no pátio para compactação e preparação de material para siderúrgicas.",
    },
    {
        icon: Wrench,
        title: "Destinação de Resíduos",
        desc: "Separação e destinação correta de ferro, plástico, alumínio, baterias, pneus e chumbo.",
    },
];

const ServicesSection = () => {
    return (
        <section id="servicos" className="py-24 bg-[#1a4731]">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-white/10 text-white font-bold text-sm rounded-full mb-4 uppercase tracking-widest">
                        Nossos Serviços
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Soluções completas em{" "}
                        <span className="text-[#8ec448]">reciclagem veicular</span>
                    </h2>
                    <p className="text-white/70 text-lg">
                        Processos eficientes aliados à tecnologia para a destinação correta de veículos em fim de vida útil.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-[#8ec448] to-[#76b139] rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                                <service.icon className="text-white" size={22} />
                            </div>
                            <h3 className="font-bold text-xl text-white mb-3">
                                {service.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;

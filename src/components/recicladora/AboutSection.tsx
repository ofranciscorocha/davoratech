import { MapPin, Building2, Truck, Ruler } from "lucide-react";

const stats = [
    { icon: MapPin, value: "Feira de Santana/BA", label: "Maior entroncamento rodoviário do N/NE" },
    { icon: Building2, value: "11.000 m²", label: "Área coberta com galpões" },
    { icon: Ruler, value: "200.000 m²", label: "Área total aberta" },
    { icon: Truck, value: "09 Caminhões", label: "Frota própria para coleta" },
];

const AboutSection = () => {
    return (
        <section id="sobre" className="py-24 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#1a4731]/10 text-[#1a4731] font-bold text-sm rounded-full mb-4 uppercase tracking-widest">
                        Sobre Nós
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a4731] mb-6">
                        Estrutura e tecnologia a serviço da{" "}
                        <span className="text-[#76b139]">reciclagem</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Com sede na cidade de Feira de Santana/BA, a Recicladora Rocha possui estrutura própria com maquinários e galpões para os procedimentos completos de reciclagem, aliando tecnologia e eficiência da equipe.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#76b139]/30 hover:shadow-xl transition-all duration-300 text-center"
                        >
                            <div className="w-14 h-14 bg-[#1a4731] rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                                <stat.icon className="text-white" size={26} />
                            </div>
                            <h3 className="font-black text-xl text-[#1a4731] mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

import { ShieldCheck, FileCheck, Leaf, Landmark } from "lucide-react";

const certs = [
    { icon: Leaf, title: "PGRS", desc: "Plano de Gerenciamento de Resíduos Sólidos" },
    { icon: ShieldCheck, title: "Licenciamento Ambiental", desc: "Emitido pelo IMA — Instituto do Meio Ambiente" },
    { icon: FileCheck, title: "ISO 14001", desc: "Certificação internacional em andamento" },
    { icon: Landmark, title: "SINIR", desc: "Sistema Nacional de Informações sobre Resíduos" },
    { icon: ShieldCheck, title: "ANTT", desc: "Agência Nacional de Transporte e Trânsito" },
    { icon: Landmark, title: "DETRAN-BA", desc: "Departamento de Trânsito da Bahia" },
];

const CertificatesSection = () => {
    return (
        <section id="certificados" className="py-24 bg-[#1a4731]">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-white/10 text-white font-bold text-sm rounded-full mb-4">
                        Certificados
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Conformidade e <span className="text-[#8ec448]">responsabilidade ambiental</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {certs.map((cert, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-5 bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group"
                        >
                            <div className="w-12 h-12 bg-[#76b139] rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                <cert.icon className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-white mb-2">{cert.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{cert.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;

'use client';
import { Shield, Clock, Users, TrendingUp } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "100% Seguro",
        description: "Transações auditadas com total transparência e segurança jurídica para o arrematante.",
    },
    {
        icon: Clock,
        title: "Lances em Tempo Real",
        description: "Plataforma de alta performance para envio de lances instantâneos sem delay.",
    },
    {
        icon: Users,
        title: "Suporte Rocha",
        description: "Equipe especializada pronta para te auxiliar desde o cadastro até a retirada do bem.",
    },
    {
        icon: TrendingUp,
        title: "Melhores Ativos",
        description: "Curadoria rigorosa de veículos e imóveis com alto potencial de valorização e revenda.",
    },
];

const HowItWorksSection = () => {
    return (
        <section className="py-24 bg-[#0a0f1a] border-t border-white/5">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Por que o <span className="text-[#D4AF37]">Pátio Rocha?</span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Aliamos tecnologia de ponta e décadas de experiência no mercado de leilões para garantir a melhor experiência de arremate.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feat) => (
                        <div
                            key={feat.title}
                            className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center hover:bg-white/[0.08] transition-all group"
                        >
                            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 group-hover:scale-110 transition-transform shadow-lg shadow-[#D4AF37]/10">
                                <feat.icon className="h-6 w-6 text-[#D4AF37]" />
                            </div>
                            <h3 className="mb-3 font-bold text-lg text-white">
                                {feat.title}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;

'use client';
import { Shield, Clock, Users, Gavel } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Shield,
        title: "100% Seguro",
        description: "Transações protegidas e auditadas com total transparência jurídica em cada martelada.",
    },
    {
        icon: Clock,
        title: "Lances Instantâneos",
        description: "Acompanhe e dispute lances em tempo real com nossa tecnologia de baixa latência.",
    },
    {
        icon: Users,
        title: "Suporte Rocha",
        description: "Nossa equipe de especialistas está a postos para garantir que seu arremate seja perfeito.",
    },
    {
        icon: Gavel,
        title: "Melhor Avaliação",
        description: "Acesse bens com avaliações rigorosas e oportunidades reais abaixo do valor de mercado.",
    },
];

const HowItWorksSection = () => {
    return (
        <section className="py-24 bg-white" id="como-participar">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="text-[#c9a05b] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Por que o Pátio Rocha?</span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#0a1b3f] uppercase italic tracking-tighter">
                        Tradição, Segurança <span className="text-[#c9a05b]">e Tecnologia</span>
                    </h2>
                </motion.div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-10 text-center hover:bg-white hover:border-[#c9a05b]/30 hover:shadow-2xl transition-all group"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0a1b3f] shadow-lg group-hover:scale-110 group-hover:bg-[#c9a05b] transition-all">
                                <feat.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="mb-3 text-lg font-black text-[#0a1b3f] uppercase tracking-tighter">
                                {feat.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{feat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;

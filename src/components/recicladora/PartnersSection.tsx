const insurers = [
    { name: "Bradesco Seguros", logo: "https://logodownload.org/wp-content/uploads/2014/05/bradesco-seguros-logo-01.png" },
    { name: "Mapfre Seguros", logo: "https://logodownload.org/wp-content/uploads/2019/07/mapfre-logo-0.png" },
    { name: "Sompo Seguros", logo: "https://logodownload.org/wp-content/uploads/2019/09/sompo-seguros-logo.png" },
    { name: "HDI Seguros", logo: "https://logodownload.org/wp-content/uploads/2019/08/hdi-seguros-logo.png" },
    { name: "SulAmérica Auto", logo: "https://logodownload.org/wp-content/uploads/2019/08/sulamerica-logo.png" },
    { name: "Allianz Seguros", logo: "https://logodownload.org/wp-content/uploads/2019/08/allianz-logo.png" },
    { name: "Caixa Seguradora", logo: "https://logodownload.org/wp-content/uploads/2019/08/caixa-seguradora-logo.png" },
    { name: "Itaú Seguros", logo: "https://logodownload.org/wp-content/uploads/2014/04/itau-logo.png" },
    { name: "Porto Seguro", logo: "https://logodownload.org/wp-content/uploads/2019/08/porto-seguro-logo.png" },
    { name: "Azul Seguros", logo: "https://logodownload.org/wp-content/uploads/2019/08/azul-seguros-logo.png" },
];

const siderurgicas = [
    { name: "ArcelorMittal", logo: "https://logodownload.org/wp-content/uploads/2019/08/arcelormittal-logo.png" },
    { name: "Gerdau", logo: "https://logodownload.org/wp-content/uploads/2019/08/gerdau-logo.png" },
];

const PartnersSection = () => {
    return (
        <section id="parceiros" className="py-24 bg-gray-50 overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#1a4731]/10 text-[#1a4731] font-bold text-sm rounded-full mb-4">
                        Nossos Parceiros
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a4731] mb-6">
                        Confiança dos <span className="text-[#76b139]">maiores do mercado</span>
                    </h2>
                </div>
            </div>

            {/* Seguradoras */}
            <div className="container max-w-7xl mx-auto px-4 mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Seguradoras</h3>
            </div>

            {/* Visual marquee effect - using flex-nowrap and animation */}
            <div className="flex gap-6 animate-scroll whitespace-nowrap mb-12 py-4">
                {[...insurers, ...insurers].map((item, index) => (
                    <div key={`ins-${item.name}-${index}`} className="flex-shrink-0">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:border-[#76b139]/30 transition-all duration-300 w-48 h-36">
                            <img src={item.logo} alt={item.name} className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                            <span className="font-bold text-[10px] uppercase tracking-tighter text-gray-400 text-center leading-tight group-hover:text-[#1a4731]">{item.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Siderúrgicas */}
            <div className="container max-w-7xl mx-auto px-4 mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Siderúrgicas</h3>
            </div>

            <div className="flex gap-6 animate-scroll-reverse whitespace-nowrap py-4">
                {[...siderurgicas, ...siderurgicas, ...siderurgicas].map((item, index) => (
                    <div key={`sid-${item.name}-${index}`} className="flex-shrink-0">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:border-[#76b139]/30 transition-all duration-300 w-48 h-36">
                            <img src={item.logo} alt={item.name} className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                            <span className="font-bold text-[10px] uppercase tracking-tighter text-gray-400 text-center leading-tight">{item.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
        }
      `}</style>
        </section>
    );
};

export default PartnersSection;

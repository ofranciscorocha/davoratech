import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
    return (
        <section id="contato" className="py-24 bg-white relative overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#1a4731]/10 text-[#1a4731] font-bold text-sm rounded-full mb-4 uppercase tracking-widest">
                        Contato
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a4731] mb-6">
                        Fale com a <span className="text-[#76b139]">Recicladora Rocha</span>
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Entre em contato para solicitar orçamentos ou saber mais sobre nossos serviços.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
                    <a
                        href="tel:+557536267353"
                        className="group bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center shadow-sm hover:shadow-2xl hover:border-[#76b139]/30 transition-all"
                    >
                        <div className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                            <Phone className="text-white" size={28} />
                        </div>
                        <h3 className="font-black text-xl text-[#1a4731] mb-2 uppercase tracking-tighter">Telefone</h3>
                        <p className="text-gray-500 font-bold text-sm">(75) 3626-7353</p>
                    </a>

                    <a
                        href="mailto:recicladorarocha@recicladorarocha.com.br"
                        className="group bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center shadow-sm hover:shadow-2xl hover:border-[#76b139]/30 transition-all"
                    >
                        <div className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                            <Mail className="text-white" size={28} />
                        </div>
                        <h3 className="font-black text-xl text-[#1a4731] mb-2 uppercase tracking-tighter">E-mail</h3>
                        <p className="text-gray-500 font-bold text-xs break-all">recicladorarocha@recicladorarocha.com.br</p>
                    </a>

                    <div className="group bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center shadow-sm hover:shadow-2xl hover:border-[#76b139]/30 transition-all">
                        <div className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                            <MapPin className="text-white" size={28} />
                        </div>
                        <h3 className="font-black text-xl text-[#1a4731] mb-2 uppercase tracking-tighter">Localização</h3>
                        <p className="text-gray-500 font-bold text-sm">Feira de Santana — BA</p>
                    </div>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#76b139]/5 rounded-full blur-[120px] -z-10" />
        </section>
    );
};

export default ContactSection;

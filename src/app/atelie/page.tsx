import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import './atelie.css';

export default async function AtelieHome() {
    let products: any[] = [];
    let settings: any = {};

    try {
        if (prisma) {
            // @ts-ignore - AtelieProduct added to schema
            products = await prisma.atelieProduct.findMany({
                where: { active: true },
                orderBy: { createdAt: "desc" }
            });
            // @ts-ignore - AtelieSettings added to schema
            const settingsItems = await prisma.atelieSettings.findMany();
            settings = Object.fromEntries(settingsItems.map((s: any) => [s.key, s.value]));
        }
    } catch (e) {
        console.error("Failed to fetch Atelie data:", e);
    }

    // Fallback products if DB is empty or fails
    if (products.length === 0) {
        products = [
            {
                id: "1",
                title: "Taça de Cristal Lírio",
                description: "Pintada à mão com detalhes em ouro e flores de lírio.",
                price: 180.00,
                imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
                category: "Cristal"
            },
            {
                id: "2",
                title: "Prato de Porcelana Botânico",
                description: "Coleção inspirada na flora brasileira, detalhes finos em verde oliva.",
                price: 120.00,
                imageUrl: "https://images.unsplash.com/photo-1594913217511-9257697920c7?auto=format&fit=crop&q=80&w=800",
                category: "Porcelana"
            }
        ];
    }

    const logo = settings['logo'] || "/atelie/laura-logo.png";
    const banner = settings['banner'] || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1920";
    const aboutPhoto = settings['about_photo'] || "/atelie/laura-photo.jpg";

    return (
        <div id="atelie-root" className="font-sans selection:bg-accent selection:text-primary">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-secondary/50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/atelie" className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden border border-primary/20">
                                <Image src={logo} alt="Laura Verissimo Logo" fill className="object-cover" />
                            </div>
                            <h1 className="font-serif text-2xl tracking-tight text-primary">Laura Verissimo <span className="text-accent opacity-80">Ateliê</span></h1>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.2em] font-medium text-primary">
                        <Link href="#colecoes" className="hover:text-accent transition-colors">Coleções</Link>
                        <Link href="#sobre" className="hover:text-accent transition-colors">Sobre a Artista</Link>
                        <Link href="/" className="text-white hover:bg-primary/90 transition-all bg-primary px-6 py-2.5 rounded-full shadow-sm">Voltar ao Hub</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative w-full h-[90vh] flex items-center justify-center mt-20 overflow-hidden bg-primary">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={banner}
                        alt="Arte em Vidro"
                        fill
                        className="object-cover opacity-40 grayscale-[30%]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="mb-8 inline-block">
                        <div className="w-24 h-24 relative mx-auto mb-6">
                            <Image src={logo} alt="Logo" fill className="object-contain" />
                        </div>
                        <div className="h-px w-20 bg-secondary/30 mx-auto"></div>
                    </div>
                    <h2 className="font-serif text-5xl md:text-8xl font-light leading-[1.1] mb-8 text-secondary">
                        A essência da <span className="italic">arte</span> <br />
                        <span className="text-accent">em suas mãos</span>
                    </h2>
                    <p className="font-sans text-lg md:text-xl text-secondary/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Peças exclusivas em vidro, cristal e porcelana, pintadas à mão com a delicadeza de quem transforma objetos em memórias.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="#colecoes" className="inline-block bg-secondary text-primary px-10 py-5 uppercase tracking-widest text-xs font-bold hover:bg-white transition-all transform hover:-translate-y-1 duration-300 shadow-xl">
                            Explorar Acervo
                        </a>
                        <a href="#sobre" className="inline-block border border-secondary text-secondary px-10 py-5 uppercase tracking-widest text-xs font-bold hover:bg-secondary hover:text-primary transition-all duration-300">
                            Conheça a Artista
                        </a>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-px h-12 bg-secondary/30"></div>
                </div>
            </header>

            {/* About Section */}
            <section id="sobre" className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-accent transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                                <Image
                                    src={aboutPhoto}
                                    alt="Laura Verissimo trabalhando"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/5 -z-10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4 block">A Alma por trás do Pincel</span>
                                <h3 className="font-serif text-5xl md:text-6xl text-primary leading-tight">Laura Verissimo</h3>
                            </div>

                            <div className="space-y-6 text-ink-light text-lg leading-relaxed font-light">
                                <p>
                                    Com um olhar atento aos detalhes e uma paixão pela delicadeza, Laura transforma o ordinário em extraordinário através da pintura à mão em peças de vidro, cristal e porcelana.
                                </p>
                                <p>
                                    Cada pincelada é carregada de intenção, criando peças exclusivas que não apenas decoram, mas contam histórias e celebram os momentos mais especiais da vida.
                                </p>
                                <p>
                                    Seu ateliê é um refúgio de criatividade, onde a tradição se encontra com o design contemporâneo para trazer elegância e sofisticação à sua mesa e ao seu lar.
                                </p>
                            </div>

                            <div className="pt-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-px bg-accent"></div>
                                    <span className="italic font-serif text-xl text-primary">Artesanal, Exclusivo, Eterno.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Gallery */}
            <section id="colecoes" className="py-32 bg-cream">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-20">
                        <div className="max-w-xl">
                            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Portfólio</span>
                            <h3 className="font-serif text-5xl text-primary">Coleções em Destaque</h3>
                        </div>
                        <div className="hidden md:block w-32 h-px bg-primary/20 mb-4"></div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-white shadow-sm border border-secondary/30 rounded-sm">
                            <div className="w-16 h-16 relative mx-auto mb-6 opacity-20">
                                <Image src={logo} alt="Logo" fill className="object-contain grayscale" />
                            </div>
                            <p className="text-primary/60 italic font-light">Nossas novas coleções estão sendo catalogadas. Explore nosso ateliê em breve.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            {products.map((product: any) => (
                                <div key={product.id} className="group cursor-pointer flex flex-col">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-2xl">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center gap-4">
                                                <div className="w-12 h-12 relative opacity-30">
                                                    <Image src={logo} alt="Logo" fill className="object-contain" />
                                                </div>
                                                <span className="text-primary/40 font-serif text-sm">Arte Original</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/40 to-transparent h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="mt-8 text-center sm:text-left">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold px-2 py-1 bg-white inline-block">{product.category || 'Peça Exclusiva'}</span>
                                            <div className="text-primary font-medium tracking-wide text-sm">
                                                {product.price ? `R$ ${product.price.toFixed(2)}` : 'Sob Consulta'}
                                            </div>
                                        </div>
                                        <h4 className="font-serif text-2xl text-primary mb-3 group-hover:text-accent transition-colors">{product.title}</h4>
                                        <p className="text-sm text-ink-light line-clamp-2 leading-relaxed font-light mb-6">{product.description}</p>
                                        <button className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-primary/20 pb-1 hover:border-accent hover:text-accent transition-all inline-block text-primary">
                                            Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-primary text-secondary overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h3 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Gostaria de uma peça personalizada?</h3>
                    <p className="text-secondary/70 max-w-xl mx-auto mb-12 text-lg font-light leading-relaxed">
                        Realizamos projetos sob encomenda para ocasiões especiais, casamentos e presentes corporativos.
                    </p>
                    <a href="#" className="inline-block bg-accent text-primary px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-secondary transition-all transform hover:-translate-y-1 shadow-2xl">
                        Solicitar Orçamento
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-primary py-24 border-t border-secondary/30">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-20 h-20 relative mx-auto mb-10">
                        <Image src={logo} alt="Laura Verissimo Logo" fill className="object-contain" />
                    </div>
                    <h2 className="font-serif text-4xl mb-6">Laura Verissimo</h2>
                    <div className="w-12 h-px bg-accent mx-auto mb-8"></div>
                    <p className="text-xs tracking-[0.3em] uppercase text-accent font-bold mb-12">Ateliê de Pinturas Exclusivas</p>

                    <div className="flex justify-center gap-12 mb-16 text-xs uppercase tracking-widest font-medium text-primary/60">
                        <Link href="#colecoes" className="hover:text-primary transition-colors">Coleções</Link>
                        <Link href="#sobre" className="hover:text-primary transition-colors">A Artista</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
                    </div>

                    <div className="pt-12 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] text-primary/40 uppercase tracking-widest font-light">&copy; {new Date().getFullYear()} Laura Verissimo Ateliê. Todos os direitos reservados.</p>
                        <p className="text-[10px] text-primary/40 uppercase tracking-widest font-light hover:text-primary transition-colors cursor-pointer">
                            <Link href="/">Desenvolvido por Rocha Business Hub</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

'use client';
import Navbar from '@/components/leiloes/Navbar';
import Footer from '@/components/leiloes/Footer';
import { LotGallery } from '@/components/leiloes/lot-gallery';
import { BidForm } from '@/components/leiloes/bid-form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Truck, AlertTriangle, CheckCircle, Info, ChevronLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock function for demo purposes if DB not seeded
const getMockLot = (id: string) => ({
    id,
    lotNumber: '00' + id,
    title: 'Porshe 911 Carrera 2024 - 0km',
    category: 'Veículo',
    year: '2024/2024',
    status: 'OPEN',
    startingPrice: 890000,
    currentBid: 955000,
    incrementAmount: 5000,
    description: 'Veículo em estado de zero quilômetro. Completo, com teto solar, bancos em couro vermelho, rodas aro 20 exclusivas. Documentação pronta para transferência direta. Oportunidade única para colecionadores e entusiastas da marca.',
    images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80'
    ],
    auction: {
        title: 'Leilão de Veículos de Luxo #42',
        endDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'LIVE'
    },
    inspection: {
        engineStatus: 'WORKING',
        transmission: 'AUTOMATIC',
        bodywork: 'GOOD',
        upholstery: 'GOOD',
        notes: 'Veículo periciado com laudo cautelar aprovado 100%. Sem retoques ou detalhes de funilaria.'
    },
    logistics: {
        storageLocation: 'Setor A - Vaga 12',
        hasKeys: true,
        hasManual: true
    },
    model: '911 Carrera S',
    color: 'Prata GT',
    fuel: 'Gasolina',
    plate: 'RCH-2024',
    chassis: 'WP0ZZZ99Z...'
});

export default function LotDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [lot, setLot] = useState<any>(null);

    useEffect(() => {
        // In a real scenario, this would be a fetch or RPC call
        // For now, we use the mock to ensure the UI is perfect
        setLot(getMockLot(resolvedParams.id));
    }, [resolvedParams.id]);

    if (!lot) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-[#0a1b3f]">CARREGANDO LOTE...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-[#0a1b3f]">
            <Navbar />

            <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <Link href="/leiloes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a05b] mb-4 hover:gap-3 transition-all">
                            <ChevronLeft className="h-4 w-4" /> Voltar para o Catálogo
                        </Link>
                        <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-[#0a1b3f] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">LOTE {lot.lotNumber}</Badge>
                            <StatusBadge status={lot.status} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">{lot.title}</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{lot.category} • {lot.year}</p>
                    </div>

                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-[#c9a05b]/10 flex items-center justify-center text-[#c9a05b]">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Encerramento</span>
                            <span className="block text-sm font-black uppercase tracking-tighter">{formatDate(lot.auction.endDate)}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Gallery & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Gallery */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-gray-100"
                        >
                            <LotGallery images={lot.images} title={lot.title} />
                        </motion.div>

                        {/* Detailed Tabs */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
                            <Tabs defaultValue="details">
                                <TabsList className="w-full justify-start border-b border-gray-50 h-auto p-0 bg-transparent gap-10">
                                    <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-[#c9a05b] rounded-none pb-4 px-0 text-xs font-black uppercase tracking-[0.2em] text-gray-300 data-[state=active]:text-[#0a1b3f] transition-all">Informações</TabsTrigger>
                                    <TabsTrigger value="inspection" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-[#c9a05b] rounded-none pb-4 px-0 text-xs font-black uppercase tracking-[0.2em] text-gray-300 data-[state=active]:text-[#0a1b3f] transition-all">Laudo de Vistoria</TabsTrigger>
                                    <TabsTrigger value="logistics" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-[#c9a05b] rounded-none pb-4 px-0 text-xs font-black uppercase tracking-[0.2em] text-gray-300 data-[state=active]:text-[#0a1b3f] transition-all">Retirada</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="pt-10 space-y-8 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                        <DetailItem label="Marca/Modelo" value={lot.model || lot.title} />
                                        <DetailItem label="Ano/Modelo" value={lot.year} />
                                        <DetailItem label="Cor" value={lot.color} />
                                        <DetailItem label="Combustível" value={lot.fuel} />
                                        <DetailItem label="Placa" value={lot.plate} />
                                        <DetailItem label="Chassi" value={lot.chassis} />
                                    </div>
                                    <Separator className="bg-gray-50" />
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#c9a05b] mb-4">Descrição do Lote</h3>
                                        <div className="text-gray-500 font-medium leading-relaxed">
                                            {lot.description}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="inspection" className="pt-10 animate-in fade-in duration-500">
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <InspectionItem label="Motorização" value={lot.inspection.engineStatus} />
                                            <InspectionItem label="Transmissão" value={lot.inspection.transmission} />
                                            <InspectionItem label="Funilaria" value={lot.inspection.bodywork} />
                                            <InspectionItem label="Tapeçaria" value={lot.inspection.upholstery} />
                                        </div>
                                        {lot.inspection.notes && (
                                            <div className="bg-[#c9a05b]/5 border border-[#c9a05b]/10 p-6 rounded-3xl">
                                                <h4 className="text-[10px] font-black text-[#c9a05b] uppercase tracking-[0.3em] flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="h-4 w-4" /> Notas do Vistoriador
                                                </h4>
                                                <p className="text-sm font-medium text-gray-600 italic">"{lot.inspection.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="logistics" className="pt-10 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Localização</h4>
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#c9a05b]">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase tracking-tighter">{lot.logistics.storageLocation}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pátio Central Rocha</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Documentação & Chaves</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase text-gray-500">Chaves no Local</span>
                                                    {lot.logistics.hasKeys ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <span className="text-rose-500 text-[10px] font-black uppercase">Ausente</span>}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase text-gray-500">Manuais</span>
                                                    {lot.logistics.hasManual ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <span className="text-rose-500 text-[10px] font-black uppercase">Ausente</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 bg-[#0a1b3f] p-6 rounded-3xl flex gap-4 items-start">
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#c9a05b] shrink-0">
                                            <Truck className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-medium text-white/60 leading-relaxed uppercase tracking-widest">
                                            A retirada deve ser agendada via portal do arrematante em até 48h após a confirmação do pagamento integral do lote.
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Right Column: Bidding Interface */}
                    <div className="space-y-8">
                        <div className="sticky top-28">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
                                    <div className="bg-[#0a1b3f] text-[#c9a05b] p-4 text-center text-[10px] font-black uppercase tracking-[0.4em]">
                                        Painel de Arremate
                                    </div>
                                    <CardContent className="p-10">
                                        <div className="text-center mb-8">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] block mb-2">Valor Estimado</span>
                                            <div className="text-3xl font-black text-[#0a1b3f] tracking-tighter uppercase italic">
                                                {formatCurrency(lot.currentBid || lot.startingPrice)}
                                            </div>
                                        </div>

                                        <Separator className="bg-gray-50 mb-8" />

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lance Inicial</span>
                                                <span className="text-sm font-black text-[#0a1b3f] tracking-tighter">{formatCurrency(lot.startingPrice)}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Incremento</span>
                                                <span className="text-sm font-black text-emerald-600 tracking-tighter">+{formatCurrency(lot.incrementAmount)}</span>
                                            </div>
                                        </div>

                                        <BidForm
                                            lotId={lot.id}
                                            currentPrice={lot.currentBid || lot.startingPrice}
                                            increment={lot.incrementAmount}
                                        />

                                        <div className="mt-8 text-[9px] font-bold text-center text-gray-300 uppercase leading-relaxed tracking-widest">
                                            Ao confirmar, você declara estar ciente do <Link href="#" className="text-[#c9a05b] border-b border-[#c9a05b]/30">Edital nº 042/2024</Link> e das condições de venda.
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="group">
            <span className="block text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1 group-hover:text-[#c9a05b] transition-colors">{label}</span>
            <span className="block text-sm font-black uppercase tracking-tighter">{value}</span>
        </div>
    );
}

function InspectionItem({ label, value }: { label: string, value?: string | null }) {
    const mapValue = (v?: string | null) => {
        if (!v) return '-';
        const map: any = {
            'WORKING': 'Operacional', 'DAMAGED': 'Danificado', 'MISSING': 'Ausente', 'SEIZED': 'Travado',
            'MANUAL': 'Manual', 'AUTOMATIC': 'Automático', 'BROKEN': 'Quebrado',
            'GOOD': 'Excelente Estado', 'SCRATCHED': 'Riscos Leves', 'DENTED': 'Avarias Médias', 'TOTAL_LOSS': 'Sucata'
        };
        return map[v] || v;
    };

    return (
        <div className="flex justify-between items-center border-b border-gray-50 pb-3 group">
            <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-[#0a1b3f] transition-all tracking-widest">{label}</span>
            <span className="text-xs font-black uppercase italic text-[#0a1b3f] group-hover:text-[#c9a05b] transition-all tracking-tighter">{mapValue(value)}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'OPEN': 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        'PENDING': 'bg-[#c9a05b] text-white',
        'SOLD': 'bg-gray-400 text-white',
        'CLOSED': 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
    };
    const labels: any = {
        'OPEN': 'EM DISPUTA LIVE',
        'PENDING': 'AGUARDANDO ABERTURA',
        'SOLD': 'ARREMATADO',
        'CLOSED': 'ENCERRADO'
    };
    return (
        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${styles[status] || 'bg-gray-100'}`}>
            {labels[status] || status}
        </span>
    );
}

'use client';
import Navbar from '@/components/leiloes/Navbar';
import Footer from '@/components/leiloes/Footer';
import { LiveAuditorium } from '@/components/leiloes/live-auditorium';
import LotCard from '@/components/leiloes/LotCard';
import { Calendar, Info, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const getMockAuction = (id: string) => ({
    id,
    title: 'Grande Leilão de Veículos #42',
    description: 'Leilão comemorativo com mais de 50 lotes de veículos leves, utilitários e caminhões em excelente estado de conservação.',
    status: 'LIVE',
    type: 'Pátio Central',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    lots: [
        {
            id: 'l1',
            lotNumber: '001',
            title: 'Ford Ranger Limited 2023 - Diesel 4x4',
            status: 'OPEN',
            startingPrice: 180000,
            currentBid: 195000,
            incrementAmount: 1000,
            images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80']
        },
        {
            id: 'l2',
            lotNumber: '002',
            title: 'Mercedes-Benz C300 AMG Line 2022',
            status: 'OPEN',
            startingPrice: 240000,
            currentBid: 255000,
            incrementAmount: 2000,
            images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80']
        }
    ]
});

export default function AuctionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [auction, setAuction] = useState<any>(null);

    useEffect(() => {
        setAuction(getMockAuction(resolvedParams.id));
    }, [resolvedParams.id]);

    if (!auction) return <div className="min-h-screen bg-[#050b1a] flex items-center justify-center font-black text-[#c9a05b] uppercase tracking-[0.4em]">Sincronizando Leilão...</div>;

    if (auction.status === 'LIVE') {
        return (
            <div className="min-h-screen flex flex-col bg-[#050b1a]">
                <Navbar />
                <LiveAuditorium
                    auctionId={auction.id}
                    initialData={{
                        currentLot: auction.lots[0],
                        lots: auction.lots
                    }}
                    userName="Licitante Demo"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-[#0a1b3f]">
            <Navbar />
            <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 mb-10"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1 bg-[#0a1b3f] text-white rounded-full text-[9px] font-black uppercase tracking-widest">Leilão {auction.type}</span>
                                <span className="px-4 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">Ativo</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">{auction.title}</h1>
                            <p className="text-gray-400 font-medium max-w-3xl leading-relaxed">{auction.description}</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="h-5 w-5 text-[#c9a05b]" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações</span>
                            </div>
                            <p className="text-sm font-black uppercase tracking-tighter">{formatDate(auction.endDate)}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Lotes Disponíveis <span className="text-gray-200 ml-2">({auction.lots.length})</span></h2>
                    <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {auction.lots.map((lot: any, i: number) => (
                        <motion.div
                            key={lot.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <LotCard lot={lot} />
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

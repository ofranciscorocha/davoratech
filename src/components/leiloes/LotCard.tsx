'use client';
import { Clock, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface LotCardProps {
    id?: string | number;
    title?: string;
    location?: string;
    startingBid?: string;
    currentBid?: string;
    imageUrl?: string;
    status?: "aberto" | "em-breve" | "encerrado";
    endsIn?: string;
    category?: string;
    lot?: any;
}

const statusStyles = {
    aberto: "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    "em-breve": "bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    encerrado: "bg-gray-500 text-white",
};

const statusLabels = {
    aberto: "Lances Abertos",
    "em-breve": "Em Breve",
    encerrado: "Encerrado",
};

const LotCard = ({ id, title, location, startingBid, currentBid, imageUrl, status, endsIn, category, lot }: LotCardProps & { lot?: any }) => {
    const displayId = lot?.id || id;
    const displayTitle = lot?.title || title;
    const displayLocation = lot?.location || lot?.city || location;
    const displayStartingBid = lot?.startingPrice ? formatCurrency(lot.startingPrice) : startingBid;
    const displayCurrentBid = lot?.currentBid ? formatCurrency(lot.currentBid) : currentBid;
    const displayImageUrl = lot?.images?.[0] || lot?.imageUrl || imageUrl;
    const displayStatus = lot?.status?.toLowerCase() === 'open' ? 'aberto' : (status || 'aberto');
    const displayCategory = lot?.category || category;

    return (
        <Link
            href={`/leiloes/lote/${displayId}`}
            className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white transition-all hover:border-[#c9a05b]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-full"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img src={displayImageUrl} alt={displayTitle} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Modern Badges */}
                <div className="absolute left-6 top-6 flex flex-col gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${statusStyles[displayStatus as keyof typeof statusStyles] || statusStyles.aberto}`}>
                        {statusLabels[displayStatus as keyof typeof statusLabels] || "Ver Detalhes"}
                    </div>
                    {displayCategory && (
                        <div className="bg-[#0a1b3f]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                            {displayCategory}
                        </div>
                    )}
                </div>

                {endsIn && displayStatus === "aberto" && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-2xl bg-[#0a1b3f]/90 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-md border border-white/10">
                        <Clock className="h-3.5 w-3.5 text-[#c9a05b]" /> {endsIn}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-3 line-clamp-2 text-lg font-black text-[#0a1b3f] uppercase italic leading-tight tracking-tighter group-hover:text-[#c9a05b] transition-colors">{displayTitle}</h3>

                <div className="mb-6 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <MapPin className="h-3.5 w-3.5 text-[#c9a05b]" /> {displayLocation}
                </div>

                <div className="mt-auto space-y-4 pt-6 border-t border-gray-50 text-center">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">{displayCurrentBid ? "Reserva inicial" : "Lance Inicial"}</span>
                        <span className="text-xl font-black text-[#0a1b3f] tracking-tighter">{displayStartingBid}</span>
                    </div>

                    {displayCurrentBid ? (
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-1 border border-gray-100 group-hover:bg-[#c9a05b]/5 transition-colors">
                            <span className="text-[9px] font-black text-[#c9a05b] uppercase tracking-[0.3em]">Maior oferta atual</span>
                            <span className="text-2xl font-black text-[#c9a05b] tracking-tighter italic">{displayCurrentBid}</span>
                        </div>
                    ) : (
                        <div className="bg-gray-900 rounded-2xl p-4 text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#c9a05b] transition-all">
                            Dê seu lance agora
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default LotCard;

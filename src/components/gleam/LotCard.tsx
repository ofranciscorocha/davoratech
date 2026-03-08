'use client';
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface LotCardProps {
    id: string | number;
    title: string;
    location: string;
    startingBid: string;
    currentBid?: string;
    imageUrl: string;
    status: "aberto" | "em-breve" | "encerrado";
    endsIn?: string;
    category: string;
}

const statusStyles = {
    aberto: "bg-green-500/10 text-green-500 border-green-500/20",
    "em-breve": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    encerrado: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const statusLabels = {
    aberto: "Aberto para Lances",
    "em-breve": "Em Breve",
    encerrado: "Encerrado",
};

const LotCard = ({ id, title, location, startingBid, currentBid, imageUrl, status, endsIn, category }: LotCardProps) => {
    return (
        <Link
            href={`/patiorochaleiloes/lote/${id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/5"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80'}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute left-3 top-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${statusStyles[status]}`}>
                        {statusLabels[status]}
                    </span>
                </div>
                {endsIn && status === "aberto" && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                        <Clock className="h-3.5 w-3.5 text-[#D4AF37]" /> {endsIn}
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-5">
                <span className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">{category}</span>
                <h3 className="mb-2 line-clamp-2 font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors leading-tight">{title}</h3>
                <div className="mb-4 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                    <MapPin className="h-3.5 w-3.5" /> {location}
                </div>
                <div className="mt-auto pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Inicial</span>
                        <span className="font-black text-sm text-white">{startingBid}</span>
                    </div>
                    {currentBid && (
                        <div className="text-right">
                            <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Atual</span>
                            <span className="font-black text-sm text-[#D4AF37]">{currentBid}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default LotCard;

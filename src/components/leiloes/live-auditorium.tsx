'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { placeBid } from '@/app/actions/bid'
import { socket } from '@/lib/socket-client'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveAuditoriumProps {
    auctionId: string
    initialData: any
    userId?: string
    userName?: string
}

export function LiveAuditorium({ auctionId, initialData, userId, userName }: LiveAuditoriumProps) {
    const [currentLot, setCurrentLot] = useState(initialData.currentLot || initialData.lots[0])
    const [bids, setBids] = useState<any[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [timer, setTimer] = useState<string>('00:45')
    const [isOvertime, setIsOvertime] = useState(false)
    const [lastBidder, setLastBidder] = useState<string | null>(null)

    const audioBid = useRef<HTMLAudioElement | null>(null)
    const audioHammer = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true)
            socket.emit('join_auction', auctionId)
        })

        socket.on('disconnect', () => setIsConnected(false))

        socket.on(`auction:${auctionId}:bid`, (data: any) => {
            if (data.lotId === currentLot.id) {
                setCurrentLot((prev: any) => ({ ...prev, currentBid: data.amount }))
                setBids((prev) => [data, ...prev])
                setLastBidder(data.bidderName)
                if (audioBid.current) audioBid.current.play().catch(() => { })
            }
        })

        socket.on(`auction:${auctionId}:timer`, (data: any) => {
            // Logic for timer
        })

        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off(`auction:${auctionId}:bid`)
            socket.off(`auction:${auctionId}:timer`)
        }
    }, [auctionId, currentLot.id])

    const handleQuickBid = async () => {
        const nextBid = (currentLot.currentBid || currentLot.startingPrice) + (currentLot.incrementAmount || 50)
        const res = await placeBid(currentLot.id, nextBid, userName || 'Licitante Anônimo')

        if (!res.success) {
            toast.error(res.message)
        } else {
            toast.success("Lance enviado!")
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-[#050b1a] text-white">
            {/* Left: Video & Current Lot */}
            <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">

                {/* Header / Timer */}
                <div className="flex justify-between items-center bg-[#0a1b3f]/50 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/20">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">AO VIVO</span>
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Auditório Virtual <span className="text-[#c9a05b] font-black">Rocha</span></h2>
                    </div>
                    <div className={`text-3xl font-black italic tracking-tighter ${isOvertime ? 'text-rose-500' : 'text-white'}`}>
                        {timer}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
                    {/* Video Player Area */}
                    <div className="xl:col-span-8 aspect-video bg-black rounded-[2.5rem] border border-white/5 relative flex items-center justify-center overflow-hidden shadow-2xl">
                        <img src={currentLot.images?.[0] || '/placeholder.jpg'} alt="Lot" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="p-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Aguardando Transmissão</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Lot Details */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="bg-[#0a1b3f] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Badge className="bg-[#c9a05b] text-[#0a1b3f] mb-3 text-[9px] font-black uppercase tracking-widest border-none">LOTE {currentLot.lotNumber || '001'}</Badge>
                                    <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{currentLot.title}</h1>
                                </div>
                            </div>

                            <div className="mt-auto space-y-8">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Lance Atual</p>
                                    <p className="text-4xl font-black text-[#c9a05b] italic tracking-tighter">{formatCurrency(currentLot.currentBid || currentLot.startingPrice)}</p>
                                </div>

                                <Button
                                    onClick={handleQuickBid}
                                    className="w-full h-20 text-sm font-black uppercase tracking-[0.3em] bg-[#c9a05b] hover:bg-[#b88a44] text-white rounded-3xl shadow-xl shadow-[#c9a05b]/20 hover:scale-[1.02] transition-all"
                                >
                                    DAR LANCE: {formatCurrency((currentLot.currentBid || currentLot.startingPrice) + (currentLot.incrementAmount || 50))}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Bid Log */}
            <div className="w-full lg:w-[400px] bg-[#0a1b3f] border-l border-white/5 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/5 font-black text-[10px] uppercase tracking-[0.4em] text-[#c9a05b] bg-[#050b1a]">
                    Histórico <span className="text-white/20">Realtime</span>
                </div>
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {bids.map((bid, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"
                                >
                                    <div>
                                        <span className="font-black text-[10px] text-white uppercase tracking-widest block mb-1">{bid.bidderName || 'Licitante #' + i}</span>
                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <span className="font-black text-sm text-[#c9a05b] italic tracking-tighter">{formatCurrency(bid.amount)}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {bids.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white mb-4"></div>
                                <p className="text-[9px] font-black uppercase tracking-widest">Aguardando Lances...</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 bg-[#050b1a] border-t border-white/5">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#c9a05b]">
                        <span className="w-2 h-2 bg-[#c9a05b] rounded-full animate-pulse"></span>
                        Auditório Conectado
                    </div>
                </div>
            </div>
        </div>
    )
}

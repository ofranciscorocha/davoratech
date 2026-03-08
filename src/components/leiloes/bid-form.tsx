'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { placeBid } from '@/app/actions/bid'
import { toast } from 'sonner'
import { Gavel } from 'lucide-react'
import { socket } from '@/lib/socket-client'

interface BidFormProps {
    lotId: string
    currentPrice: number
    increment: number
}

export function BidForm({ lotId, currentPrice: initialPrice, increment }: BidFormProps) {
    const [currentPrice, setCurrentPrice] = useState(initialPrice)
    const [amount, setAmount] = useState(initialPrice + increment)
    const [name, setName] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [showNameInput, setShowNameInput] = useState(false)

    useEffect(() => {
        socket.on(`lot:${lotId}:bid`, (data: any) => {
            setCurrentPrice(data.amount)
            setAmount(data.amount + increment)
            toast.success(`Novo lance recebido: R$ ${data.amount.toLocaleString('pt-BR')}`)
        })

        return () => {
            socket.off(`lot:${lotId}:bid`)
        }
    }, [lotId, increment])

    async function handleBid() {
        if (!showNameInput) {
            setShowNameInput(true)
            toast.info("Por favor, digite seu nome para confirmar o lance.")
            return
        }

        if (!name) {
            toast.error("Digite seu nome para dar o lance.")
            return
        }

        setIsPending(true)
        const res = await placeBid(lotId, amount, name)
        setIsPending(false)

        if (res.success) {
            toast.success(res.message)
            setShowNameInput(false)
        } else {
            toast.error(res.message)
        }
    }

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Lance Atual</span>
                <span className="font-black text-emerald-600 text-2xl italic">R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {showNameInput && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                    <Input
                        placeholder="Seu Nome (para identificação)"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className="rounded-xl border-gray-100 bg-gray-50 mb-2 h-12 text-sm font-bold uppercase tracking-widest"
                        autoFocus
                    />
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a05b] font-black text-sm">R$</span>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                        className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg font-black italic text-[#0a1b3f]"
                    />
                </div>
                <Button
                    onClick={handleBid}
                    disabled={isPending}
                    className="h-14 bg-[#c9a05b] hover:bg-[#b88a44] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <Gavel className="mr-3 h-5 w-5" />
                    {isPending ? 'PROCESSANDO...' : 'CONFIRMAR LANCE'}
                </Button>
            </div>
            <p className="text-[10px] font-black text-center text-gray-300 uppercase tracking-widest">
                Incremento mínimo obrigatório: R$ {increment.toLocaleString('pt-BR')}
            </p>
        </div>
    )
}

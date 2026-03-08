'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function placeBid(lotId: string, amount: number, bidderName: string) {
    try {
        let user = await prisma.user.findFirst({
            where: { email: `${bidderName.toLowerCase().replace(/\s/g, '')}@example.com` }
        })

        if (!user) {
            user = await (prisma.user as any).create({
                data: {
                    name: bidderName,
                    email: `${bidderName.toLowerCase().replace(/\s/g, '')}@example.com`,
                    password: 'guest_password_123',
                    role: 'USER'
                }
            })
        }

        const lot = await prisma.lot.findUnique({
            where: { id: lotId },
            include: { auction: true }
        })

        if (!lot) return { success: false, message: 'Lote não encontrado.' }
        if ((lot as any).status !== 'OPEN' && (lot as any).auction.status !== 'LIVE' && (lot as any).status !== 'PENDING') {
            return { success: false, message: 'Lote não está aberto para lances.' }
        }

        const currentPrice = lot.currentBid || lot.startingPrice
        const minIncrement = lot.incrementAmount || 50
        const minBid = currentPrice + minIncrement

        if (amount < minBid) {
            return { success: false, message: `O lance deve ser de no mínimo ${minBid.toFixed(2)}` }
        }

        await prisma.$transaction(async (tx: any) => {
            await (tx as any).bid.create({
                data: {
                    amount,
                    lotId,
                    userId: user.id,
                    type: 'MANUAL'
                }
            })

            await tx.lot.update({
                where: { id: lotId },
                data: {
                    currentBid: amount,
                    winnerId: user.id,
                    status: 'OPEN'
                } as any
            })

            const now = new Date()
            const auctionEndTime = new Date(lot.auction.endDate)
            const timeRemaining = auctionEndTime.getTime() - now.getTime()
            const overtimeThreshold = 30000

            if (timeRemaining < overtimeThreshold) {
                const newEndDate = new Date(now.getTime() + 60000)
                await tx.auction.update({
                    where: { id: lot.auctionId },
                    data: { endDate: newEndDate }
                })
            }
        })

        try {
            await fetch('http://localhost:3001/api/socket-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'bid_update',
                    roomId: lot.auctionId,
                    data: {
                        lotId,
                        amount,
                        bidderName: user.name,
                        timestamp: new Date()
                    }
                })
            })
        } catch (err) {
            console.error('Socket notification failed:', err)
        }

        revalidatePath(`/auctions/${lot.auctionId}`)
        return { success: true, message: 'Lance realizado com sucesso!' }
    } catch (error) {
        console.error('Failed to place bid:', error)
        return { success: false, message: 'Erro ao processar o lance.' }
    }
}

import React from 'react'
import { prisma } from '@/lib/prisma'
import {
    Gavel,
    Package,
    Users,
    Lock,
    Mail,
    X,
    LayoutDashboard,
    PieChart
} from 'lucide-react'
import { DashboardChart } from '@/components/patiorochaleiloes/admin/DashboardChart'
import Link from 'next/link'

export default async function PatioAdminDashboard() {
    // Busca dados reais do banco
    const [
        activeAuctions,
        activeLots,
        closedAuctions,
        totalUsers,
        pendingUsers,
        pendingDocs
    ] = await Promise.all([
        prisma.auction.count({ where: { status: 'OPEN' } }),
        prisma.lot.count({ where: { status: 'OPEN' } }),
        prisma.auction.count({ where: { status: 'CLOSED' } }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'USER', status: 'PENDING' } }),
        prisma.userDocument.count({ where: { status: 'PENDING' } })
    ]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="w-5 h-5 text-[#333]" />
                <h1 className="text-[24px] font-normal text-[#333]">Dashboard</h1>
            </div>

            {/* Quick Stats Tabs */}
            <div className="bg-white border border-[#ddd] p-3 rounded-sm flex flex-wrap gap-6 text-[14px]">
                <div className="flex items-center gap-2 font-bold cursor-pointer hover:text-[#3c8dbc]">
                    <Users className="w-4 h-4" /> Pendente Desbloqueio ({pendingUsers})
                </div>
                <div className="flex items-center gap-2 font-bold cursor-pointer hover:text-[#3c8dbc]">
                    <Lock className="w-4 h-4" /> Habilitações Pendentes ({pendingDocs})
                </div>
                <div className="flex items-center gap-2 font-bold cursor-pointer hover:text-[#3c8dbc]">
                    <Mail className="w-4 h-4" /> Mensagens Pendentes (0)
                </div>
                <div className="flex items-center gap-2 font-bold cursor-pointer hover:text-[#3c8dbc]">
                    <X className="w-4 h-4" /> Solicitação de Exclusão (0)
                </div>
            </div>

            {/* 4 KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Leilões Ativos */}
                <Link href="/patiorochaleiloes/admin/auctions" className="bg-white border border-[#ddd] rounded-sm p-4 relative overflow-hidden h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="z-10 relative">
                        <div className="text-[38px] font-bold leading-none mb-2">{activeAuctions}</div>
                        <div className="text-[15px] text-[#333]">Leilões Ativos</div>
                    </div>
                    <Gavel className="absolute -right-4 top-4 w-[100px] h-[100px] text-gray-200 rotate-[-15deg] pointer-events-none" />
                </Link>

                {/* Lotes Ativos */}
                <Link href="/patiorochaleiloes/admin/lots" className="bg-white border border-[#ddd] rounded-sm p-4 relative overflow-hidden h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="z-10 relative">
                        <div className="text-[38px] font-bold leading-none mb-2">{activeLots}</div>
                        <div className="text-[15px] text-[#333]">Lotes Ativos</div>
                    </div>
                    <Package className="absolute -right-4 top-4 w-[100px] h-[100px] text-gray-200 pointer-events-none" />
                </Link>

                {/* Leilões Encerrados */}
                <Link href="/patiorochaleiloes/admin/auctions?status=CLOSED" className="bg-white border border-[#ddd] rounded-sm p-4 relative overflow-hidden h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="z-10 relative">
                        <div className="text-[38px] font-bold leading-none mb-2">{closedAuctions}</div>
                        <div className="text-[15px] text-[#333]">Leilões Encerrados</div>
                    </div>
                    <PieChart className="absolute -right-4 top-4 w-[100px] h-[100px] text-gray-200 pointer-events-none" />
                </Link>

                {/* Total Arrematantes */}
                <Link href="/patiorochaleiloes/admin/bidders" className="bg-white border border-[#ddd] rounded-sm p-4 relative overflow-hidden h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="z-10 relative">
                        <div className="text-[38px] font-bold leading-none mb-2">{totalUsers}</div>
                        <div className="text-[15px] text-[#333]">Total Arrematantes</div>
                    </div>
                    <Users className="absolute -right-4 top-4 w-[100px] h-[100px] text-gray-200 pointer-events-none" />
                </Link>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm mt-4">
                <div className="border-b border-[#f4f4f4] p-[10px] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#333]" />
                    <h3 className="text-[16px] font-bold m-0 text-[#333]">Últimos 15 Dias de Cadastros</h3>
                </div>
                <div className="p-[10px]">
                    <DashboardChart />
                </div>
            </div>
        </div>
    )
}

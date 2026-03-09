'use client'

import React, { useState, useEffect } from 'react'
import {
    Plus,
    FileText,
    Search,
    Calendar,
    Briefcase,
    Shield,
    Building2,
    Users,
    ChevronRight,
    Filter,
    MoreHorizontal,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileCheck2,
    XCircle,
    Gavel
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Status and Type Definitions
const statusMap: Record<string, any> = {
    PROSPECCAO: { label: 'Prospecção', color: 'bg-blue-100 text-blue-700', icon: Clock },
    DOCUMENTACAO: { label: 'Documentação', color: 'bg-orange-100 text-orange-700', icon: FileCheck2 },
    AVALIACAO: { label: 'Avaliação', color: 'bg-purple-100 text-purple-700', icon: Briefcase },
    PRONTO: { label: 'Pronto para Publicar', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    PUBLICADO: { label: 'Publicado', color: 'bg-green-100 text-green-700', icon: ExternalLink },
    SUSPENSO: { label: 'Suspenso', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    CANCELADO: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700', icon: XCircle }
}

const typeMap: Record<string, any> = {
    FINANCEIRA: { label: 'Financeira', icon: Building2 },
    SEGURADORA: { label: 'Seguradora', icon: Shield },
    PREFEITURA: { label: 'Prefeitura', icon: Building2 },
    TRANSITO: { label: 'Trânsito', icon: Briefcase },
    PUBLICO_ADM: { label: 'Público Adm.', icon: Users },
    ORG_PUBLICO: { label: 'Órgão Público', icon: Users },
    EXTRAJUDICIAL: { label: 'Extrajudicial', icon: FileText },
    JUDICIAL: { label: 'Judicial', icon: Gavel }
}

export default function InternalControlPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchItems = async () => {
            // Mock data to avoid DB errors and confirm UI works
            const mockItems = [
                { id: '1', title: 'Leilão de Teste 01', type: 'JUDICIAL', status: 'PROSPECCAO', processNumber: '0000001-01.2024.8.19.0001', tasks: 'Tarefa 1\nTarefa 2', documents: [], auctionDate: '2024-05-20' },
                { id: '2', title: 'Retorno de Financeira X', type: 'FINANCEIRA', status: 'DOCUMENTACAO', tasks: 'Checar gravame', documents: [{}], auctionDate: '2024-06-15' }
            ];
            setItems(mockItems);
            setLoading(false);

            /*
            try {
                const res = await fetch('/api/patiorochaleiloes/internal-control')
                const data = await res.json()
                setItems(Array.isArray(data) ? data : [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
            */
        }
        fetchItems()
    }, [])

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4 text-[#333]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#3c8dbc] rounded-sm flex items-center justify-center text-white">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-[24px] font-normal text-[#333]">Controle Interno</h1>
                        <div className="text-[12px] text-[#777] uppercase font-bold tracking-wider">Gestão Administrativa & Judicial</div>
                    </div>
                </div>
                <button className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 rounded-sm text-[14px] font-bold flex items-center gap-2 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> NOVO LEILÃO INTERNO
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-[#ddd] p-3 rounded-sm shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título, tipo ou número do processo..."
                        className="w-full pl-10 pr-4 py-2 border border-[#ddd] rounded-sm text-[14px] focus:border-[#3c8dbc] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border border-[#ddd] rounded-sm text-[13px] font-bold text-gray-600 flex items-center gap-2 bg-gray-50 hover:bg-white transition-colors">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>
            </div>

            {/* Items List */}
            <div className="bg-white border border-[#ddd] rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                        <tr className="bg-[#f9fafb] border-b border-[#ddd]">
                            <th className="px-4 py-3 font-bold text-[#333] uppercase w-[150px]">Status</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Título / Ref.</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase w-[150px]">Tipo</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase w-[150px]">Data Sugerida</th>
                            <th className="px-4 py-3 text-center font-bold text-[#333] uppercase w-[100px]">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-gray-400 italic">
                                    Carregando registros internos...
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-gray-400 italic">
                                    Nenhum leilão interno encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => {
                                const status = statusMap[item.status] || statusMap.PROSPECCAO;
                                const type = typeMap[item.type] || { label: item.type, icon: FileText };
                                return (
                                    <tr key={item.id} className="border-b border-[#eee] hover:bg-[#fcfcfc] transition-colors group">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={cn("px-2 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter flex items-center gap-1 w-fit", status.color)}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-[#333] group-hover:text-[#3c8dbc] transition-colors">{item.title}</div>
                                            {item.processNumber && <div className="text-[11px] text-[#777] font-medium mt-0.5">Proc: {item.processNumber}</div>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap">
                                                <type.icon className="w-4 h-4" />
                                                {type.label}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {item.auctionDate ? new Date(item.auctionDate).toLocaleDateString() : 'A definir'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="bg-[#3c8dbc] text-white p-1.5 rounded-sm hover:bg-[#367fa9] transition-colors shadow-sm">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function BadgeCount({ count, label, color }: { count: number, label: string, color: string }) {
    return (
        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1", color)}>
            {count} {label}
        </div>
    )
}

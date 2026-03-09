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
    FileCheck2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Status and Type Definitions
const statusMap = {
    PROSPECCAO: { label: 'Prospecção', color: 'bg-blue-100 text-blue-700', icon: Clock },
    DOCUMENTACAO: { label: 'Documentação', color: 'bg-orange-100 text-orange-700', icon: FileCheck2 },
    AVALIACAO: { label: 'Avaliação', color: 'bg-purple-100 text-purple-700', icon: Briefcase },
    PRONTO: { label: 'Pronto para Publicar', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    PUBLICADO: { label: 'Publicado', color: 'bg-green-100 text-green-700', icon: ExternalLink },
    SUSPENSO: { label: 'Suspenso', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    CANCELADO: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700', icon: XCircle }
}

const typeMap = {
    FINANCEIRA: { label: 'Financeira', icon: Building2 },
    SEGURADORA: { label: 'Seguradora', icon: Shield },
    PREFEITURA: { label: 'Prefeitura', icon: Building2 },
    TRANSITO: { label: 'Trânsito', icon: Briefcase },
    PUBLICO_ADM: { label: 'Público Adm.', icon: Users },
    ORG_PUBLICO: { label: 'Órgão Público', icon: Users },
    EXTRAJUDICIAL: { label: 'Extrajudicial', icon: FileText },
    JUDICIAL: { label: 'Judicial', icon: GavelIcon }
}

export default function InternalControlPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/patiorochaleiloes/internal-control')
                const data = await res.json()
                setItems(Array.isArray(data) ? data : [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [])

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4">
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
                    <select className="px-3 py-2 border border-[#ddd] rounded-sm text-[13px] font-bold text-gray-600 bg-gray-50 outline-none">
                        <option value="">Todos os Tipos</option>
                        <option value="JUDICIAL">Judicial</option>
                        <option value="FINANCEIRA">Financeira</option>
                        <option value="PREFEITURA">Prefeitura</option>
                    </select>
                </div>
            </div>

            {/* Items List */}
            <div className="bg-white border border-[#ddd] rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                        <tr className="bg-[#f9fafb] border-b border-[#ddd]">
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Status</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Título / Ref.</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Tipo</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Demandas/Vistorias</th>
                            <th className="px-4 py-3 font-bold text-[#333] uppercase">Data Sugerida</th>
                            <th className="px-4 py-3 text-center font-bold text-[#333] uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-gray-400 italic">
                                    Carregando registros internos...
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-gray-400 italic">
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
                                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                                                <type.icon className="w-4 h-4" />
                                                {type.label}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                <BadgeCount count={item.tasks?.split('\n').length || 0} label="Tarefas" color="bg-blue-50 text-blue-600" />
                                                <BadgeCount count={item.documents?.length || 0} label="Docs" color="bg-orange-50 text-orange-600" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {item.auctionDate ? new Date(item.auctionDate).toLocaleDateString() : 'A definir'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-sm text-gray-400 hover:text-[#3c8dbc] transition-all">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                <button className="bg-[#3c8dbc] text-white p-1.5 rounded-sm hover:bg-[#367fa9] transition-colors">
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

function GavelIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M14 7l-5 5m0 0l-4.5-4.5M9 12l4.5 4.5M21 21l-4-4m-4-11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function XCircle(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
    Save,
    ArrowLeft,
    FileText,
    Calendar,
    Scale,
    Truck,
    Briefcase,
    Upload,
    Trash,
    Plus,
    CheckCircle,
    Info,
    History
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const types = [
    'FINANCEIRA', 'SEGURADORA', 'PREFEITURA', 'TRANSITO',
    'PUBLICO_ADM', 'ORG_PUBLICO', 'EXTRAJUDICIAL', 'JUDICIAL'
]

const statusList = [
    'PROSPECCAO', 'DOCUMENTACAO', 'AVALIACAO', 'PRONTO',
    'PUBLICADO', 'SUSPENSO', 'CANCELADO'
]

export default function InternalControlDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('GERAL')
    const [loading, setLoading] = useState(id !== 'new')
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState<any>({
        title: '',
        type: 'FINANCEIRA',
        status: 'PROSPECCAO',
        demands: '',
        meetings: '',
        inspections: '',
        tasks: '',
        notes: '',
        processNumber: '',
        parties: '',
        officialLettersSent: '',
        importantDocsInfo: '',
        evaluationReportUrl: '',
        seizureInfo: '',
        seizedPropertyDocs: '',
        edictUrl: '',
        auctionDate: ''
    })

    useEffect(() => {
        if (id && id !== 'new') {
            fetch(`/api/patiorochaleiloes/internal-control/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setFormData({
                            ...data,
                            auctionDate: data.auctionDate ? data.auctionDate.split('T')[0] : ''
                        })
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        }
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            const url = id === 'new' ? '/api/patiorochaleiloes/internal-control' : `/api/patiorochaleiloes/internal-control/${id}`
            const method = id === 'new' ? 'POST' : 'PUT'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/patiorochaleiloes/admin/internal-control')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-20 text-center text-[#777] font-bold italic">Carregando detalhes do leilão interno...</div>

    return (
        <div className="space-y-4">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/patiorochaleiloes/admin/internal-control" className="p-2 hover:bg-gray-200 rounded-sm transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[22px] font-normal text-[#333]">
                            {id === 'new' ? 'Novo Leilão Interno' : 'Editar Controle Interno'}
                        </h1>
                        <div className="text-[11px] text-[#777] font-bold uppercase">ID: {id === 'new' ? '---' : id}</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push('/patiorochaleiloes/admin/internal-control')}
                        className="px-4 py-2 border border-[#ddd] bg-white text-gray-600 rounded-sm text-[13px] font-bold hover:bg-gray-50 transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded-sm text-[13px] font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                    </button>
                </div>
            </div>

            {/* Tabs & Form Layout */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Side: Main Form Sections */}
                <div className="flex-1 space-y-4">
                    {/* Status & Basic Info Card */}
                    <div className="bg-white border border-[#ddd] rounded-sm shadow-sm">
                        <div className="bg-[#f9fafb] border-b border-[#ddd] p-3 font-bold text-[#333] text-[14px]">Informações do Leilão</div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold text-gray-700">Título / Nome do Leilão</label>
                                <input
                                    className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#3c8dbc]"
                                    placeholder="Ex: 50º Leilão de Veículos Usados"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold text-gray-700">Tipo de Leilão</label>
                                <select
                                    className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#3c8dbc] bg-white"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold text-gray-700">Status Interno</label>
                                <select
                                    className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#3c8dbc] bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold text-gray-700">Data Sugerida (Leilão)</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] outline-none focus:border-[#3c8dbc]"
                                    value={formData.auctionDate}
                                    onChange={(e) => setFormData({ ...formData, auctionDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Tabs Card */}
                    <div className="bg-white border border-[#ddd] rounded-sm shadow-sm min-h-[400px]">
                        <div className="flex border-b border-[#ddd] bg-[#f9fafb]">
                            {[
                                { id: 'GERAL', label: 'Organização', icon: Briefcase },
                                { id: 'JUDICIAL', label: 'Andamento Judicial', icon: Scale, hidden: formData.type !== 'JUDICIAL' },
                                { id: 'VISTORIA', label: 'Vistoria & Logística', icon: Truck },
                                { id: 'DOCUMENTOS', label: 'Documentos', icon: FileText }
                            ].filter(t => !t.hidden).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-4 py-3 text-[13px] font-bold flex items-center gap-2 border-r border-[#ddd] transition-all",
                                        activeTab === tab.id ? "bg-white text-[#3c8dbc] border-t-[3px] border-t-[#3c8dbc]" : "text-gray-500 hover:bg-gray-100"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-5">
                            {activeTab === 'GERAL' && (
                                <div className="space-y-5 animate-in fade-in transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <h4 className="text-[14px] font-bold text-[#333] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#3c8dbc]" /> Demandas & Tarefas Internas</h4>
                                            <textarea
                                                className="w-full h-32 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] outline-none focus:border-[#3c8dbc]"
                                                placeholder="Descreva as demandas e tarefas para este leilão..."
                                                value={formData.demands}
                                                onChange={(e) => setFormData({ ...formData, demands: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[14px] font-bold text-[#333] flex items-center gap-2"><History className="w-4 h-4 text-[#3c8dbc]" /> Reuniões & Contatos</h4>
                                            <textarea
                                                className="w-full h-32 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] outline-none focus:border-[#3c8dbc]"
                                                placeholder="Anotações de reuniões com comitentes/órgãos..."
                                                value={formData.meetings}
                                                onChange={(e) => setFormData({ ...formData, meetings: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-[#eee]">
                                        <h4 className="text-[14px] font-bold text-[#333]">Observações Gerais</h4>
                                        <textarea
                                            className="w-full h-24 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] outline-none focus:border-[#3c8dbc]"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'JUDICIAL' && (
                                <div className="space-y-5 animate-in slide-in-from-right-2 transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold">Número do Processo</label>
                                            <input
                                                className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] focus:border-[#3c8dbc]"
                                                value={formData.processNumber}
                                                onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 lg:col-span-2">
                                            <label className="text-[13px] font-bold">Partes (Autor/Réu)</label>
                                            <input
                                                className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] focus:border-[#3c8dbc]"
                                                value={formData.parties}
                                                onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Ofícios & Documentos Enviados</label>
                                            <textarea
                                                className="w-full h-24 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] focus:border-[#3c8dbc]"
                                                value={formData.officialLettersSent}
                                                onChange={(e) => setFormData({ ...formData, officialLettersSent: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Laudo de Avaliação & Penhora</label>
                                            <textarea
                                                className="w-full h-24 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] focus:border-[#3c8dbc]"
                                                value={formData.seizureInfo}
                                                onChange={(e) => setFormData({ ...formData, seizureInfo: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-3 border-t border-[#eee]">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold">Documentos do Bem Penhorado</label>
                                            <input
                                                className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] focus:border-[#3c8dbc]"
                                                placeholder="Link ou breve descrição dos documentos anexos"
                                                value={formData.seizedPropertyDocs}
                                                onChange={(e) => setFormData({ ...formData, seizedPropertyDocs: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold">Link do Edital</label>
                                            <input
                                                className="w-full px-3 py-2 border border-[#ddd] rounded-sm text-[14px] focus:border-[#3c8dbc]"
                                                value={formData.edictUrl}
                                                onChange={(e) => setFormData({ ...formData, edictUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'VISTORIA' && (
                                <div className="space-y-4">
                                    <h4 className="text-[14px] font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-gray-500" /> Detalhes de Vistoria & Logística</h4>
                                    <textarea
                                        className="w-full h-48 px-3 py-2 border border-[#ddd] rounded-sm text-[13px] focus:border-[#3c8dbc]"
                                        placeholder="Registros detalhados de vistorias, fretes, pátios de origem..."
                                        value={formData.inspections}
                                        onChange={(e) => setFormData({ ...formData, inspections: e.target.value })}
                                    />
                                </div>
                            )}

                            {activeTab === 'DOCUMENTOS' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-sm border border-blue-100 mb-4">
                                        <div className="text-[13px] text-blue-700 font-medium">Pasta de documentos para controle interno.</div>
                                        <button className="bg-[#3c8dbc] text-white px-3 py-1 rounded-sm text-[12px] font-bold flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> UPLOAD DE DOCUMENTO
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <DocItem name="Edital Provisório.pdf" date="08/03/2026" />
                                        <DocItem name="Laudo de Avaliação.pdf" date="05/03/2026" />
                                        <DocItem name="Certidão de Penhora.jpg" date="01/03/2026" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Sidebar Actions / Summary */}
                <div className="w-full md:w-[320px] space-y-4">
                    <div className="bg-white border-t-[3px] border-t-orange-400 border border-[#ddd] rounded-sm shadow-sm p-4">
                        <h4 className="text-[14px] font-bold text-[#333] mb-4">Painel de Demandas</h4>
                        <div className="space-y-3">
                            <DemandCheck label="Analisar Documentos" checked={true} />
                            <DemandCheck label="Solicitar Edital" checked={false} />
                            <DemandCheck label="Agendar Vistoria" checked={false} />
                            <DemandCheck label="Definir Data do Leilão" checked={false} />
                        </div>
                        <button className="w-full mt-6 py-2 border-2 border-dashed border-[#ddd] rounded-sm text-[#777] text-[12px] font-bold hover:bg-gray-50 transition-colors">
                            + NOVA TAREFA
                        </button>
                    </div>

                    <div className="bg-[#f4f4f4] border border-[#ddd] rounded-sm p-4 text-[13px] text-gray-600">
                        <p className="font-bold text-[#333] mb-2 uppercase text-[12px]">Dica do Sistema</p>
                        Este painel é de <b>uso exclusivo interno</b>. Os leilões aqui cadastrados não estão disponíveis no site público até que o status seja alterado para "PUBLICADO" e vinculado a um leilão oficial.
                    </div>
                </div>
            </div>
        </div>
    )
}

function DocItem({ name, date }: { name: string, date: string }) {
    return (
        <div className="p-3 border border-[#ddd] rounded-sm flex items-center justify-between hover:border-[#3c8dbc] transition-colors bg-white shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-8 h-8 text-gray-300 flex-shrink-0" />
                <div className="overflow-hidden">
                    <div className="font-bold text-[13px] truncate">{name}</div>
                    <div className="text-[11px] text-[#999]">{date}</div>
                </div>
            </div>
            <button className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all">
                <Trash className="w-4 h-4" />
            </button>
        </div>
    )
}

function DemandCheck({ label, checked }: { label: string, checked: boolean }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-[#ddd] bg-white group-hover:border-[#3c8dbc]"
            )}>
                {checked && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <span className={cn("text-[13px] font-medium transition-colors", checked ? "line-through text-gray-400" : "text-gray-700")}>{label}</span>
        </label>
    )
}

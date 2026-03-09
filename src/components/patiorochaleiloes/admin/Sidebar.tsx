'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    AlertCircle,
    Gavel,
    Search,
    Lock,
    Users,
    Building2,
    Globe,
    Box,
    Calendar,
    Handshake,
    BarChart,
    Mail,
    FileText,
    HelpCircle,
    Image as ImageIcon,
    LogOut,
    Settings,
    ChevronDown,
    ChevronRight,
    ClipboardCheck
} from 'lucide-react'
import { useState } from 'react'

type SidebarSubItem = { href: string; label: string; icon?: any; };
type SidebarItem = { href: string; label: string; icon: any; subItems?: SidebarSubItem[] };
type SidebarGroup = { group: string; items: SidebarItem[] };

const sidebarItems: SidebarGroup[] = [
    {
        group: '',
        items: [
            { href: '/patiorochaleiloes/admin', label: 'Dashboard', icon: LayoutDashboard },
        ]
    },
    {
        group: 'AVISOS',
        items: [
            { href: '/patiorochaleiloes/admin/alerts', label: 'Alertas', icon: AlertCircle },
        ]
    },
    {
        group: 'GERENCIAR',
        items: [
            { href: '/patiorochaleiloes/admin/auctions', label: 'Leilões', icon: Gavel },
            { href: '/patiorochaleiloes/admin/lots', label: 'Consulta de Lotes', icon: Search },
            { href: '/patiorochaleiloes/admin/qualifications', label: 'Consulta de Habilitações', icon: Lock },
            { href: '/patiorochaleiloes/admin/bidders', label: 'Arrematantes', icon: Users },
            { href: '/patiorochaleiloes/admin/comitentes', label: 'Comitentes', icon: Building2 },
            { href: '/patiorochaleiloes/admin/vistorias', label: 'Vistorias', icon: ClipboardCheck },
            { href: '/patiorochaleiloes/admin/internal-control', label: 'Controle Interno', icon: FileText },
        ]
    },
    {
        group: 'LOGÍSTICA',
        items: [
            {
                href: '/patiorochaleiloes/admin/logistics', label: 'Logística', icon: Globe, subItems: [
                    { href: '/patiorochaleiloes/admin/logistics', label: 'Bens', icon: Box },
                    { href: '/patiorochaleiloes/admin/daily', label: 'Diárias', icon: Calendar },
                    { href: '/patiorochaleiloes/admin/suppliers', label: 'Fornecedores', icon: Handshake },
                    { href: '/patiorochaleiloes/admin/logistics-reports', label: 'Relatórios', icon: BarChart },
                ]
            },
        ]
    },
    {
        group: '',
        items: [
            { href: '/patiorochaleiloes/admin/general-reports', label: 'Relatórios Gerais', icon: BarChart },
            { href: '/patiorochaleiloes/admin/messages', label: 'Mensagens', icon: Mail },
        ]
    },
    {
        group: 'EMAILS MARKETING',
        items: [
            { href: '/patiorochaleiloes/admin/contacts', label: 'Contatos', icon: Users },
        ]
    },
    {
        group: 'CONTEÚDO DO SITE',
        items: [
            { href: '/patiorochaleiloes/admin/banners', label: 'Banners', icon: ImageIcon },
            { href: '/patiorochaleiloes/admin/pages', label: 'Páginas', icon: FileText },
            { href: '/patiorochaleiloes/admin/help', label: 'Ajuda ao Arrematante', icon: HelpCircle },
        ]
    },
    {
        group: 'CENTRAL DO CLIENTE',
        items: [
            { href: '/patiorochaleiloes/admin/settings', label: 'Configurações', icon: Settings },
        ]
    }
]

export function Sidebar() {
    const pathname = usePathname()
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        'Logística': true
    })

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
    }

    return (
        <div className="flex flex-col h-full w-[230px] bg-[#222d32] text-[#b8c7ce] select-none transition-all duration-300">
            {/* Logo Area - Restored to match original 1:1 */}
            <div className="flex h-[50px] items-center justify-center bg-[#367fa9] text-white px-2">
                <img
                    src="/assets/logo-patio-rocha.png"
                    alt="Pátio Rocha Leilões"
                    className="h-8 w-auto px-1"
                />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <nav className="mt-4 pb-10">
                    {sidebarItems.map((group, i) => (
                        <div key={i} className="mb-1">
                            {group.group && (
                                <h4 className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#4b646f] bg-[#1a2226]">
                                    {group.group}
                                </h4>
                            )}
                            <ul className="flex flex-col">
                                {group.items.map((item) => {
                                    const hasSubItems = item.subItems && item.subItems.length > 0;
                                    const isItemActive = pathname === item.href || (hasSubItems && item.subItems?.some(s => pathname.startsWith(s.href)));
                                    const isOpen = openMenus[item.label];

                                    return (
                                        <li key={item.label} className="w-full">
                                            {hasSubItems ? (
                                                <div>
                                                    <button
                                                        onClick={() => toggleMenu(item.label)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-4 py-[12px] text-[14px] transition-colors",
                                                            "hover:bg-[#1e282c] hover:text-white border-l-[3px] border-transparent",
                                                            isItemActive ? "bg-[#1e282c] border-l-[#3c8dbc] text-white" : ""
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="h-[14px] w-[14px]" />
                                                            <span>{item.label}</span>
                                                        </div>
                                                        {isOpen ? <ChevronDown className="h-[14px] w-[14px]" /> : <ChevronRight className="h-[14px] w-[14px]" />}
                                                    </button>
                                                    {isOpen && (
                                                        <ul className="bg-[#2c3b41] py-1">
                                                            {item.subItems?.map(sub => {
                                                                const isSubActive = pathname === sub.href;
                                                                return (
                                                                    <li key={sub.href}>
                                                                        <Link
                                                                            href={sub.href}
                                                                            className={cn(
                                                                                "flex items-center gap-2 pl-8 pr-4 py-2 text-[14px] transition-colors",
                                                                                isSubActive ? "text-white" : "text-[#8aa4af] hover:text-white"
                                                                            )}
                                                                        >
                                                                            <RecordIcon className="h-3 w-3" />
                                                                            <span>{sub.label}</span>
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-[12px] text-[14px] transition-colors",
                                                        "hover:bg-[#1e282c] hover:text-white border-l-[3px] border-transparent",
                                                        isItemActive ? "bg-[#1e282c] border-l-[#3c8dbc] text-white" : ""
                                                    )}
                                                >
                                                    <item.icon className="h-[14px] w-[14px]" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}

function RecordIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="currentColor" viewBox="0 0 16 16" {...props}>
            <circle cx="8" cy="8" r="4" />
        </svg>
    )
}

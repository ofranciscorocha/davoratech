'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Mail,
    Zap,
    BarChart3,
    Users,
    LayoutGrid,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SystemCard } from '@/components/SystemCard';
import { Agenda } from '@/components/Agenda';
import { cn } from '@/lib/utils';
import { useLogo } from '@/context/LogoContext';
import { useSystems, System } from '@/context/SystemsContext';
import { useUI } from '@/context/UIContext';
import * as LucideIcons from 'lucide-react';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSystemCard({ system, viewMode }: { system: System; viewMode: 'grid' | 'list' }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: system.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    const IconComponent = (LucideIcons as any)[system.icon] || LucideIcons.HelpCircle;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none h-full cursor-grab active:cursor-grabbing">
            <SystemCard
                title={system.title}
                description={system.description}
                icon={IconComponent}
                logoUrl={system.logoUrl}
                href={system.href}
                status={system.status}
                labels={system.labels}
                viewMode={viewMode}
            />
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { systems, reorderSystems } = useSystems();
    const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useUI();
    const [scrolled, setScrolled] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        router.push('/login');
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = systems.findIndex((item) => item.id === active.id);
            const newIndex = systems.findIndex((item) => item.id === over.id);
            const newSystems = arrayMove(systems, oldIndex, newIndex);
            reorderSystems(newSystems);
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Sidebar / Navigation */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 h-20 z-100 transition-all duration-300",
                scrolled ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/10" : "bg-transparent border-b border-white/5"
            )}>
                <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 md:hidden text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Rocha <span className="text-gold">Tec</span></h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden lg:flex items-center bg-slate-800/50 border border-white/5 rounded-full px-4 py-2 gap-3 focus-within:border-gold/30 transition-all">
                            <Search className="w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar ferramentas..."
                                className="bg-transparent border-none outline-none text-sm w-48"
                            />
                        </div>

                        <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />
                        </button>

                        <div className="hidden sm:block h-8 w-px bg-white/10" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-xs md:text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[110] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/10 z-[120] md:hidden flex flex-col p-6"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h1 className="text-xl font-bold tracking-tight">Rocha <span className="text-gold">Tec</span></h1>
                                <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-4">
                                <button className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 text-gold font-bold transition-all border border-white/10">
                                    <LayoutGrid className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                                    <Bell className="w-5 h-5" />
                                    <span>Notificações</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                                    <Settings className="w-5 h-5" />
                                    <span>Configurações</span>
                                </button>
                            </nav>

                            <div className="pt-6 border-t border-white/5">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sair do Hub</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-black mb-2 tracking-tight">
                            Olá, <span className="text-gold">Francisco</span>
                        </h2>
                        <p className="text-slate-400">
                            Bem-vindo ao seu ecossistema de negócios. Selecione uma ferramenta para começar.
                        </p>
                    </motion.div>
                </header>

                {/* Quick Stats or Highlights */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Sistemas Ativos', value: '1', icon: LayoutGrid, color: 'text-blue-400' },
                        { label: 'Uso Mensal', value: '84%', icon: BarChart3, color: 'text-gold' },
                        { label: 'Novidades', value: '2', icon: Zap, color: 'text-emerald-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-black">{stat.value}</div>
                        </motion.div>
                    ))}
                </section>

                {/* Agenda */}
                <section className="mb-12">
                    <Agenda />
                </section>

                {/* System Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-300">Meus Sistemas</h3>
                            <div className="hidden sm:block flex-1 w-32 h-px bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white/10 text-gold shadow-sm" : "text-slate-500 hover:text-white")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white/10 text-gold shadow-sm" : "text-slate-500 hover:text-white")}
                            >
                                <LucideIcons.List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={systems.map(s => s.id)}
                            strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
                        >
                            <div className={cn("gap-8", viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
                                {systems.map((system) => (
                                    <SortableSystemCard key={system.id} system={system} viewMode={viewMode} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </section>
            </main>

            {/* Background Glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
        </div>
    );
}

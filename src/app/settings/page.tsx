'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Trash2,
    Image as ImageIcon,
    Settings,
    Save,
    Check
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLogo } from '@/context/LogoContext';
import { useSystems, System } from '@/context/SystemsContext';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export default function SettingsPage() {
    const { logoUrl, setLogoUrl } = useLogo();
    const { systems, updateSystem, resetSystems, reorderSystems } = useSystems();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [editingSystem, setEditingSystem] = useState<string | null>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('O arquivo é muito grande. O limite é 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLogoUrl(base64String);
                triggerSaveEffect();
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerSaveEffect = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 800);
    };

    const resetLogo = () => {
        if (confirm('Deseja restaurar a logo padrão?')) {
            setLogoUrl('/logo.png');
            triggerSaveEffect();
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 z-50">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6 text-gold" />
                            <h1 className="text-xl font-bold tracking-tight">Configurações do Rocha Tec</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-500",
                            saved ? "bg-emerald-500/20 text-emerald-400 opacity-100" : "opacity-0"
                        )}>
                            <Check className="w-4 h-4" />
                            <span>Alterações salvas</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Section: Manage Systems */}
                    <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-gold/10 text-gold">
                                    <LucideIcons.LayoutGrid className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Gerenciar Ecossistema</h2>
                                    <p className="text-slate-400 text-sm">Personalize os nomes, links e ícones dos seus sistemas.</p>
                                </div>
                            </div>
                            <button
                                onClick={resetSystems}
                                className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                            >
                                Resetar para Padrão
                            </button>
                        </div>

                        <div className="space-y-4">
                            {systems.map((system, index) => {
                                const IconComponent = (LucideIcons as any)[system.icon] || LucideIcons.HelpCircle;
                                const isEditing = editingSystem === system.id;

                                return (
                                    <div
                                        key={system.id}
                                        className={cn(
                                            "p-6 rounded-3xl border border-white/5 bg-slate-800/20 transition-all",
                                            isEditing ? "border-gold/30 bg-slate-800/40" : "hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    {/* Reorder Buttons */}
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            disabled={index === 0}
                                                            onClick={() => {
                                                                const newSystems = [...systems];
                                                                [newSystems[index - 1], newSystems[index]] = [newSystems[index], newSystems[index - 1]];
                                                                reorderSystems(newSystems);
                                                            }}
                                                            className="p-1 hover:bg-white/5 rounded-md disabled:opacity-20 text-slate-500 hover:text-gold transition-colors"
                                                        >
                                                            <LucideIcons.ChevronUp size={16} />
                                                        </button>
                                                        <button
                                                            disabled={index === systems.length - 1}
                                                            onClick={() => {
                                                                const newSystems = [...systems];
                                                                [newSystems[index + 1], newSystems[index]] = [newSystems[index], newSystems[index + 1]];
                                                                reorderSystems(newSystems);
                                                            }}
                                                            className="p-1 hover:bg-white/5 rounded-md disabled:opacity-20 text-slate-500 hover:text-gold transition-colors"
                                                        >
                                                            <LucideIcons.ChevronDown size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="p-3 rounded-2xl bg-white/5">
                                                        {system.logoUrl ? (
                                                            <img src={system.logoUrl} alt={system.title} className="w-12 h-12 object-contain" />
                                                        ) : (
                                                            <IconComponent className="w-8 h-8 text-gold" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    {isEditing ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <input
                                                                type="text"
                                                                value={system.title}
                                                                onChange={(e) => updateSystem(system.id, { title: e.target.value })}
                                                                className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-gold/50"
                                                                placeholder="Nome do Sistema"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={system.href}
                                                                onChange={(e) => updateSystem(system.id, { href: e.target.value })}
                                                                className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-gold/50"
                                                                placeholder="URL"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h3 className="font-bold">{system.title}</h3>
                                                            <p className="text-xs text-slate-500 truncate mt-0.5">{system.href}</p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {system.labels?.map((label, lIdx) => (
                                                                    <span
                                                                        key={lIdx}
                                                                        className="text-[10px] uppercase font-black px-2 py-1 rounded-md"
                                                                        style={{ backgroundColor: label.color + '20', color: label.color, border: `1px solid ${label.color}40` }}
                                                                    >
                                                                        {label.text}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => setEditingSystem(isEditing ? null : system.id)}
                                                    className={cn(
                                                        "px-6 py-2 rounded-xl text-sm font-bold transition-all shrink-0",
                                                        isEditing ? "bg-gold text-slate-950 hover:bg-gold/90" : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                                                    )}
                                                >
                                                    {isEditing ? "Salvar" : "Editar"}
                                                </button>
                                            </div>

                                            {isEditing && (
                                                <div className="pt-6 border-t border-white/5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-default">Etiquetas (Labels)</label>
                                                        <button
                                                            onClick={() => {
                                                                const text = prompt('Texto da etiqueta:');
                                                                const color = prompt('Cor em HEX (ex: #FFD700):', '#FFD700');
                                                                if (text && color) {
                                                                    updateSystem(system.id, { labels: [...(system.labels || []), { text, color }] });
                                                                }
                                                            }}
                                                            className="text-[10px] font-black uppercase text-gold hover:text-white transition-colors flex items-center gap-1"
                                                        >
                                                            <LucideIcons.Plus size={12} />
                                                            Adicionar
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {system.labels?.length === 0 && <p className="text-xs text-slate-600 italic">Nenhuma etiqueta definida.</p>}
                                                        {system.labels?.map((label, lIdx) => (
                                                            <div
                                                                key={lIdx}
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-slate-900 group/label"
                                                                style={{ borderColor: label.color + '40' }}
                                                            >
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                                                                <span className="text-xs font-bold text-slate-300">{label.text}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const newLabels = system.labels.filter((_, i) => i !== lIdx);
                                                                        updateSystem(system.id, { labels: newLabels });
                                                                    }}
                                                                    className="opacity-0 group-hover/label:opacity-100 transition-opacity ml-1 text-slate-500 hover:text-red-400"
                                                                >
                                                                    <LucideIcons.X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </motion.div>
            </main>

            {/* Background Decor */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        </div >
    );
}

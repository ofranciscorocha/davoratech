'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Label } from '@/context/SystemsContext';

interface SystemCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    logoUrl?: string;
    href: string;
    status: 'active' | 'coming_soon' | 'maintenance';
    color?: string;
    labels?: Label[];
    viewMode?: 'grid' | 'list';
}

export function SystemCard({ title, description, icon: Icon, logoUrl, href, status, color, labels = [], viewMode = 'grid' }: SystemCardProps) {
    const isActive = status === 'active';
    const router = useRouter();

    const handleClick = () => {
        if (!isActive) return;
        if (href.startsWith('http')) {
            window.open(href, '_blank');
        } else {
            router.push(href);
        }
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                whileHover={isActive ? { x: 8 } : {}}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={cn(
                    "relative p-4 rounded-2xl border bg-slate-900/40 backdrop-blur-md transition-all flex items-center justify-between group",
                    isActive
                        ? "border-white/10 hover:border-gold/50 cursor-pointer shadow-md hover:shadow-gold/10"
                        : "border-white/5 opacity-60 grayscale"
                )}
                onClick={handleClick}
            >
                <div className="flex items-center gap-6">
                    <div className={cn(
                        "p-3 rounded-2xl shrink-0 bg-gradient-to-br w-16 h-16 flex items-center justify-center",
                        isActive ? "from-gold/20 to-gold/5 text-gold" : "from-slate-700 to-slate-800 text-slate-400"
                    )}>
                        {logoUrl ? (
                            <img src={logoUrl} alt={title} className="w-10 h-10 object-contain" />
                        ) : (
                            <Icon className="w-8 h-8" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                            {!isActive && (
                                <span className="text-[10px] uppercase font-black tracking-widest bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                                    Em breve
                                </span>
                            )}
                            {labels.map((label, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md"
                                    style={{ backgroundColor: label.color + '20', color: label.color, border: `1px solid ${label.color}40` }}
                                >
                                    {label.text}
                                </span>
                            ))}
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{description}</p>
                    </div>
                </div>

                {isActive && (
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 group-hover:text-gold group-hover:bg-gold/10 shrink-0 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                )}
                {isActive && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                )}
            </motion.div>
        );
    }

    // Default Grid view
    return (
        <motion.div
            whileHover={isActive ? { y: -8, scale: 1.02 } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
                "relative p-8 rounded-[2.5rem] border bg-slate-900/40 backdrop-blur-md transition-all h-full flex flex-col group",
                isActive
                    ? "border-white/10 hover:border-gold/50 cursor-pointer shadow-xl hover:shadow-gold/10"
                    : "border-white/5 opacity-60 grayscale",
            )}
            onClick={handleClick}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "p-4 rounded-2xl bg-gradient-to-br min-w-24 h-24 flex items-center justify-center",
                    isActive ? "from-gold/20 to-gold/5 text-gold" : "from-slate-700 to-slate-800 text-slate-400"
                )}>
                    {logoUrl ? (
                        <img src={logoUrl} alt={title} className="w-16 h-16 object-contain" />
                    ) : (
                        <Icon className="w-12 h-12" />
                    )}
                </div>
                {isActive && (
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 group-hover:text-gold transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    {!isActive && (
                        <span className="text-[10px] uppercase font-black tracking-widest bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                            Em breve
                        </span>
                    )}
                    {labels.map((label, idx) => (
                        <span
                            key={idx}
                            className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md"
                            style={{ backgroundColor: label.color + '20', color: label.color, border: `1px solid ${label.color}40` }}
                        >
                            {label.text}
                        </span>
                    ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-[2.5rem]" />
            )}
        </motion.div>
    );
}

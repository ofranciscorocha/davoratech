'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal, Activity, Shield, Wifi } from 'lucide-react';

interface SurveillanceHUDProps {
    title: string;
    subtitle?: string;
    status?: 'operational' | 'alert' | 'offline';
    className?: string;
    children?: React.ReactNode;
}

export const SurveillanceHUD: React.FC<SurveillanceHUDProps> = ({
    title,
    subtitle,
    status = 'operational',
    className,
    children
}) => {
    const [scanLine, setScanLine] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanLine(prev => (prev > 100 ? 0 : prev + 0.5));
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const statusColors = {
        operational: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
        alert: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
        offline: 'text-rose-400 border-rose-500/30 bg-rose-500/5'
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-sm p-1",
                className
            )}
        >
            {/* Scanline Effect */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
                style={{
                    background: `linear-gradient(to bottom, transparent ${scanLine}%, #fff ${scanLine}%, transparent ${scanLine + 1}%)`,
                    backgroundSize: '100% 10px'
                }}
            />

            {/* Matrix-like Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none grid grid-cols-12 gap-1 p-2">
                {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 border border-white/20 rounded-sm" />
                ))}
            </div>

            {/* HUD Header */}
            <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/40">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">System Integrity</span>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-3 h-1 rounded-full bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            ))}
                        </div>
                    </div>

                    <div className={cn(
                        "px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest",
                        statusColors[status]
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", status === 'operational' ? 'bg-emerald-500' : status === 'alert' ? 'bg-amber-500' : 'bg-rose-500')} />
                        {status}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 min-h-[400px]">
                {children}
            </div>

            {/* HUD Footer Decor */}
            <div className="relative z-20 px-6 py-3 border-t border-white/5 bg-slate-900/20 flex items-center justify-between">
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                        <Activity className="w-3 h-3" />
                        LATENCY: 14MS
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                        <Shield className="w-3 h-3" />
                        ENCRYPTION: AES-256
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                        <Wifi className="w-3 h-3" />
                        PROXY: ACTIVE (CHILE-04)
                    </div>
                </div>
                <div className="text-[9px] text-slate-600 font-mono">
                    ROCHA_SYS_V2.4.0
                </div>
            </div>
        </div>
    );
};

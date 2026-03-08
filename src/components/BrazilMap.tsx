'use client';

import { useState, useMemo, useCallback } from 'react';
import { BRAZIL_STATES, BRAZIL_VIEWBOX } from '@/data/brazil-map-paths';

interface StateData {
    sigla: string;
    nome: string;
    quantidade: number;
}

interface BrazilMapProps {
    stateData: StateData[];
    onStateClick?: (sigla: string) => void;
    selectedState?: string;
    formatNumber: (n: number) => string;
}

function getHeatColor(intensity: number): string {
    if (intensity <= 0) return 'rgba(15, 23, 42, 0.6)';
    const r = Math.round(15 + intensity * (245 - 15));
    const g = Math.round(23 + intensity * (158 - 23));
    const b = Math.round(42 + (1 - intensity) * (11 - 42));
    const alpha = 0.4 + intensity * 0.6;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function BrazilMap({ stateData, onStateClick, selectedState, formatNumber }: BrazilMapProps) {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const maxQty = useMemo(() => Math.max(...stateData.map(s => s.quantidade), 1), [stateData]);

    const dataMap = useMemo(() => {
        const map = new Map<string, StateData>();
        stateData.forEach(s => map.set(s.sigla, s));
        return map;
    }, [stateData]);

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    const hoveredData = hoveredState ? dataMap.get(hoveredState) : null;
    const hoveredInfo = hoveredState ? BRAZIL_STATES.find(s => s.sigla === hoveredState) : null;

    return (
        <div className="relative w-full" style={{ maxWidth: 900, margin: '0 auto' }}>
            <svg
                viewBox={BRAZIL_VIEWBOX}
                className="w-full"
                onMouseMove={handleMouseMove}
                style={{ filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.05))' }}
            >
                <defs>
                    <filter id="stateGlow" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {BRAZIL_STATES.map((state) => {
                    const data = dataMap.get(state.sigla);
                    const qty = data?.quantidade || 0;
                    const intensity = maxQty > 0 ? qty / maxQty : 0;
                    const isHovered = hoveredState === state.sigla;
                    const isSelected = selectedState === state.sigla;
                    const fill = getHeatColor(intensity);
                    const strokeColor = isSelected ? 'rgba(245,158,11,1)' : isHovered ? 'rgba(245,158,11,0.8)' : 'rgba(255,255,255,0.3)';
                    const strokeW = isHovered || isSelected ? 2 : 1;

                    return (
                        <g key={state.sigla}>
                            <path
                                d={state.path}
                                fill={fill}
                                stroke={strokeColor}
                                strokeWidth={strokeW}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="cursor-pointer transition-all duration-200"
                                style={{ filter: isHovered ? 'url(#stateGlow)' : 'none' }}
                                onMouseEnter={() => setHoveredState(state.sigla)}
                                onMouseLeave={() => setHoveredState(null)}
                                onClick={() => onStateClick?.(state.sigla)}
                            />
                            <text
                                x={state.labelX}
                                y={state.labelY}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={isHovered || isSelected ? '#fff' : 'rgba(255,255,255,0.8)'}
                                fontSize={isHovered ? '11' : '9'}
                                fontWeight="bold"
                                fontFamily="monospace"
                                className="pointer-events-none select-none"
                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                            >
                                {state.sigla}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {hoveredState && hoveredData && (
                <div
                    className="absolute pointer-events-none z-50"
                    style={{
                        left: Math.min(tooltipPos.x + 15, 600),
                        top: tooltipPos.y - 10,
                    }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-400 font-black text-sm">{hoveredData.sigla}</span>
                            <span className="text-slate-400 text-[11px]">—</span>
                            <span className="text-slate-300 text-[11px] font-medium">{hoveredInfo?.nome}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-white font-black text-lg">{formatNumber(hoveredData.quantidade)}</span>
                            <span className="text-slate-500 text-[10px] font-mono">veículos</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                                style={{ width: `${(hoveredData.quantidade / maxQty) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-[9px] font-mono text-slate-500">
                {[0.1, 0.4, 0.7, 1.0].map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-3 rounded" style={{ background: getHeatColor(v) }} />
                        <span>{['Baixa', 'Média', 'Alta', 'Máxima'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

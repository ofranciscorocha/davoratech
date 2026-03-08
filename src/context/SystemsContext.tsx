'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
const SYSTEM_CACHE_VERSION = 'v4'; // Increment to force reset

export interface Label {
    text: string;
    color: string;
}

export interface System {
    id: string;
    title: string;
    description: string;
    icon: string;
    logoUrl?: string;
    href: string;
    status: 'active' | 'coming_soon' | 'maintenance';
    order: number;
    labels: Label[];
}

interface SystemsContextType {
    systems: System[];
    updateSystem: (id: string, updates: Partial<System>) => void;
    reorderSystems: (newSystems: System[]) => void;
    resetSystems: () => void;
}

const SystemsContext = createContext<SystemsContextType | undefined>(undefined);

export function SystemsProvider({ children }: { children: React.ReactNode }) {
    const [systems, setSystems] = useState<System[]>([]);

    useEffect(() => {
        const loadSystems = async () => {
            const data = await import('@/data/systems.json');
            const defaultSystems = data.default as System[];
            const savedSystemsRaw = localStorage.getItem('rocha_hub_systems');
            const savedVersion = localStorage.getItem('rocha_hub_version');

            if (savedSystemsRaw && savedVersion === SYSTEM_CACHE_VERSION) {
                const savedSystems = JSON.parse(savedSystemsRaw) as System[];

                // Merge and ensure all fields are present
                const merged = defaultSystems.map(def => {
                    const saved = savedSystems.find(s => s.id === def.id);
                    if (saved) {
                        return {
                            ...def, // Take defaults (especially href and status)
                            ...saved, // Overwrite with saved (order, labels)
                            // But always force update some critical fields from JSON if needed
                            href: def.href,
                            status: def.status,
                            description: def.description
                        };
                    }
                    return def;
                });

                // Sort by order
                const sorted = merged.sort((a, b) => (a.order || 0) - (b.order || 0));
                
                // CRITICAL: Force clear if critical systems are missing or links are still localhost
                const hasOldLinks = sorted.some(s => s.href.includes('localhost'));
                if (hasOldLinks) {
                    localStorage.removeItem('rocha_hub_systems');
                    const fresh = [...defaultSystems].sort((a, b) => (a.order || 0) - (b.order || 0));
                    setSystems(fresh);
                    localStorage.setItem('rocha_hub_systems', JSON.stringify(fresh));
                } else {
                    setSystems(sorted);
                    localStorage.setItem('rocha_hub_systems', JSON.stringify(sorted));
                    localStorage.setItem('rocha_hub_version', SYSTEM_CACHE_VERSION);
                }
            } else {
                const sorted = [...defaultSystems].sort((a, b) => (a.order || 0) - (b.order || 0));
                setSystems(sorted);
                localStorage.setItem('rocha_hub_systems', JSON.stringify(sorted));
                localStorage.setItem('rocha_hub_version', SYSTEM_CACHE_VERSION);
            }
        };

        loadSystems();
    }, []);

    const updateSystem = (id: string, updates: Partial<System>) => {
        const newSystems = systems.map((sys) =>
            sys.id === id ? { ...sys, ...updates } : sys
        );
        const sorted = [...newSystems].sort((a, b) => (a.order || 0) - (b.order || 0));
        setSystems(sorted);
        localStorage.setItem('rocha_hub_systems', JSON.stringify(sorted));
    };

    const reorderSystems = (newSystems: System[]) => {
        // Assign new order values based on array position
        const reordered = newSystems.map((sys, index) => ({
            ...sys,
            order: index + 1
        }));
        setSystems(reordered);
        localStorage.setItem('rocha_hub_systems', JSON.stringify(reordered));
    };

    const resetSystems = () => {
        import('@/data/systems.json').then((data) => {
            const defaultSystems = data.default as System[];
            const sorted = [...defaultSystems].sort((a, b) => (a.order || 0) - (b.order || 0));
            setSystems(sorted);
            localStorage.removeItem('rocha_hub_systems');
        });
    };

    return (
        <SystemsContext.Provider value={{ systems, updateSystem, reorderSystems, resetSystems }}>
            {children}
        </SystemsContext.Provider>
    );
}

export function useSystems() {
    const context = useContext(SystemsContext);
    if (context === undefined) {
        throw new Error('useSystems must be used within a SystemsProvider');
    }
    return context;
}

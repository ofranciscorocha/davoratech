'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoContextType {
    logoUrl: string;
    setLogoUrl: (url: string) => void;
}

const DEFAULT_LOGO = '/logo.png';

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: React.ReactNode }) {
    const [logoUrl, setLogoUrlState] = useState<string>(DEFAULT_LOGO);

    useEffect(() => {
        const savedLogo = localStorage.getItem('rocha_hub_logo');
        if (savedLogo) {
            setLogoUrlState(savedLogo);
        }
    }, []);

    const setLogoUrl = (url: string) => {
        setLogoUrlState(url);
        localStorage.setItem('rocha_hub_logo', url);
    };

    return (
        <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>
            {children}
        </LogoContext.Provider>
    );
}

export function useLogo() {
    const context = useContext(LogoContext);
    if (context === undefined) {
        throw new Error('useLogo must be used within a LogoProvider');
    }
    return context;
}

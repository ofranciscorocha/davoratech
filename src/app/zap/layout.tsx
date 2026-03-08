'use client';

import './zap.css';
import { ThemeProvider } from '@/components/ThemeProvider'; // I need to check if this exists or if I need to migrate it

export default function ZapLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="rocha-zap-root" className="min-h-screen bg-slate-950 text-white antialiased overflow-x-hidden">
            {children}
        </div>
    );
}

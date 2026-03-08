'use client';
import './zap.css';
import Sidebar from '@/components/zap/Sidebar';

export default function ZapLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="rocha-zap-root">
            {children}
        </div>
    );
}

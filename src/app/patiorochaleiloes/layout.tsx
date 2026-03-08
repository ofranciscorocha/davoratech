'use client';
import './leiloes.css';

export default function LeiloesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="leiloes-root" className="antialiased">
            {children}
        </div>
    );
}

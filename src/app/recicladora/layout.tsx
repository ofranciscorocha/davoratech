'use client';
import './recicladora.css';

export default function RecicladoraLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="recicladora-root" className="antialiased">
            {children}
        </div>
    );
}

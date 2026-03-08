'use client';
import { useState, useEffect } from 'react';

interface MainHeaderProps {
    title?: string;
}

export default function MainHeader({ title }: MainHeaderProps) {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('zap-theme');
        const root = document.getElementById('rocha-zap-root');
        if (savedTheme === 'light' && root) {
            root.classList.add('light-theme');
            setIsLight(true);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.getElementById('rocha-zap-root');
        if (!root) return;

        if (isLight) {
            root.classList.remove('light-theme');
            localStorage.setItem('zap-theme', 'dark');
            setIsLight(false);
        } else {
            root.classList.add('light-theme');
            localStorage.setItem('zap-theme', 'light');
            setIsLight(true);
        }
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <div className="search-bar-container">
                    <span className="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Pesquisar mensagens ou tarefas... (Ctrl+K)"
                    />
                </div>
            </div>

            <div className="header-right">
                {/* THEME TOGGLE */}
                <button className="theme-toggle" onClick={toggleTheme} title={isLight ? "Ativar Modo Escuro" : "Ativar Modo Claro"}>
                    {isLight ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    )}
                </button>

                <button className="header-icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </button>

                <div className="user-profile-badge">
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '0.8rem' }}>R</div>
                    <div className="profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Francisco Rocha</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>ADMINISTRADOR</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

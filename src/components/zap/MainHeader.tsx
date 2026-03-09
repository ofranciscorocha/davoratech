'use client';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useUI } from '@/context/UIContext';

interface MainHeaderProps {
    title?: string;
}

export default function MainHeader({ title }: MainHeaderProps) {
    const [isLight, setIsLight] = useState(false);
    const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useUI();

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
                <button
                    className="mobile-trigger"
                    onClick={toggleSidebar}
                >
                    <Menu size={24} />
                </button>
                <div className="search-bar-container">
                    <span className="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Pesquisar mensagens ou tarefas..."
                    />
                </div>
            </div>

            <div className="header-right">
                <button className="header-action-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </button>

                <button className="header-action-btn theme-btn" onClick={toggleTheme}>
                    {isLight ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    )}
                </button>

                <div className="user-profile-badge">
                    <div className="avatar">R</div>
                    <div className="profile-info">
                        <span className="name">Francisco Rocha</span>
                        <span className="role">ADMINISTRADOR</span>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="mobile-backdrop"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <style jsx>{`
                .mobile-trigger {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    margin-right: 12px;
                }
                .mobile-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    z-index: 999;
                }
                @media (max-width: 1024px) {
                    .mobile-trigger { display: flex; }
                    .main-header { padding: 0 20px; }
                    .search-bar-container { display: none; }
                    .user-profile-badge .profile-info { display: none; }
                }
                .main-header {
                    height: 80px;
                    padding: 0 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border-color);
                    position: sticky;
                    top: 0;
                    z-index: 90;
                }
                .search-bar-container {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 320px;
                    height: 44px;
                    transition: all 0.3s ease;
                }
                .search-bar-container:focus-within {
                    border-color: var(--gold-primary);
                    background: rgba(255, 255, 255, 0.08);
                    width: 400px;
                }
                .search-bar-container input {
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-size: 0.85rem;
                    width: 100%;
                    outline: none;
                }
                .header-right { display: flex; align-items: center; gap: 16px; }
                .header-action-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .header-action-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--gold-primary);
                    border-color: var(--border-color);
                }
                .user-profile-badge {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 14px;
                    border: 1px solid var(--border-color);
                }
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    background: var(--gold-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-weight: 800;
                    font-size: 0.85rem;
                }
                .profile-info { display: flex; flex-direction: column; }
                .profile-info .name { font-size: 0.75rem; font-weight: 800; color: #fff; }
                .profile-info .role { font-size: 0.6rem; font-weight: 700; color: var(--gold-primary); opacity: 0.8; }
            `}</style>
        </header>
    );
}

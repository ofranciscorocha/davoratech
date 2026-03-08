'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import MenuBuilder from '@/components/zap/MenuBuilder';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [whatsappStatus, setWhatsappStatus] = useState('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        fetchSettings();
        checkWhatsApp();
        const interval = setInterval(checkWhatsApp, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/zap/settings');
            const data = await res.json();
            const map: any = {};
            (data.settings || []).forEach((s: any) => { map[s.key] = s.value; });
            setSettings(map);
        } catch (e) { }
        setLoading(false);
    };

    const checkWhatsApp = async () => {
        try {
            const res = await fetch('/api/zap/whatsapp/status');
            const data = await res.json();
            setWhatsappStatus(data.status || 'disconnected');
            setQrCode(data.qrCode || null);
            if (data.status === 'connected') setConnecting(false);
        } catch (e) { }
    };

    const handleWhatsAppAction = async (action: 'init' | 'disconnect') => {
        if (action === 'init') setConnecting(true);
        try {
            await fetch('/api/zap/whatsapp/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            setTimeout(checkWhatsApp, 1000);
        } catch (e) {
            setConnecting(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveOneSetting = async (key: string, value: string) => {
        setSaving(true);
        try {
            await fetch('/api/zap/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
        } catch (e) { }
        setSaving(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <MainHeader />
                <div className="dashboard-viewport">
                    <div className="page-header">
                        <div>
                            <h1>Configurações</h1>
                            <p className="subtitle">Gerencie sua conectividade e inteligência artificial.</p>
                        </div>
                    </div>

                    <div className="page-body">
                        <div className="toolbar" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '32px', paddingBottom: '0' }}>
                            <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>Geral & Conectividade</button>
                            <button className={`tab-btn ${activeTab === 'flow' ? 'active' : ''}`} onClick={() => setActiveTab('flow')}>Fluxos de Menus</button>
                        </div>

                        {activeTab === 'general' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3>Conexão WhatsApp</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className={`status-indicator status-${whatsappStatus === 'connected' ? 'active' : 'inactive'}`}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{whatsappStatus}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', textAlign: 'center' }}>
                                        {whatsappStatus === 'connected' ? (
                                            <div style={{ color: 'var(--trend-up)' }}>
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                                <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>WhatsApp Conectado</p>
                                                <button
                                                    onClick={() => handleWhatsAppAction('disconnect')}
                                                    style={{ marginTop: '24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--trend-down)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                >
                                                    Desconectar Instância
                                                </button>
                                            </div>
                                        ) : qrCode ? (
                                            <div>
                                                <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                                                </div>
                                                <p style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Escaneie o código acima com seu WhatsApp</p>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleWhatsAppAction('init')}
                                                disabled={connecting}
                                            >
                                                {connecting ? 'Iniciando...' : 'Conectar Novo WhatsApp'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h3>Inteligência Artificial</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                                        <div className="form-group">
                                            <label>Backend de IA</label>
                                            <select
                                                className="form-input"
                                                value={settings.ai_backend || 'openai'}
                                                onChange={(e) => {
                                                    updateSetting('ai_backend', e.target.value);
                                                    saveOneSetting('ai_backend', e.target.value);
                                                }}
                                            >
                                                <option value="openai">OpenAI (Nuvem)</option>
                                                <option value="localai">Rocha Deep (Local)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Chave API OpenAI</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                placeholder="sk-..."
                                                value={settings.openai_api_key || ''}
                                                onBlur={(e) => saveOneSetting('openai_api_key', e.target.value)}
                                                onChange={(e) => updateSetting('openai_api_key', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do Sistema (White Label)</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={settings.system_name || 'ROCHA ZAP'}
                                                onBlur={(e) => saveOneSetting('system_name', e.target.value)}
                                                onChange={(e) => updateSetting('system_name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card">
                                <MenuBuilder />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx>{`
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    padding: 12px 24px;
                    font-weight: 700;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .tab-btn.active {
                    color: var(--gold-primary);
                    border-bottom-color: var(--gold-primary);
                }
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .status-active { background: var(--trend-up); box-shadow: 0 0 10px var(--trend-up); }
                .status-inactive { background: var(--trend-down); }
            `}</style>
        </div>
    );
}

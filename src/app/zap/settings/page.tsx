'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MenuBuilder from '@/components/zap/MenuBuilder';
import '../zap.css';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [whatsappStatus, setWhatsappStatus] = useState('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchSettings();
        checkWhatsApp();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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
        } catch (e) { }
    };

    const connectWhatsApp = async () => {
        setConnecting(true);
        setQrCode(null);
        try {
            const res = await fetch('/api/zap/whatsapp/connect', { method: 'POST' });
            const data = await res.json();
            setWhatsappStatus(data.status || 'initializing');
            setQrCode(data.qrCode || null);

            const poll = setInterval(async () => {
                try {
                    const r = await fetch('/api/zap/whatsapp/status');
                    const d = await r.json();
                    setWhatsappStatus(d.status || 'disconnected');
                    if (d.qrCode) setQrCode(d.qrCode);
                    if (d.status === 'connected' || d.status === 'error') {
                        clearInterval(poll);
                        setConnecting(false);
                        if (d.status === 'connected') showToast('WhatsApp conectado!');
                    }
                } catch (pollErr) { }
            }, 3000);
        } catch (e) {
            setConnecting(false);
            showToast('Erro ao conectar', 'error');
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const settingsArray = Object.entries(settings).map(([key, value]) => ({
                key,
                value: String(value ?? ''),
                category: key.startsWith('openai_') || key.startsWith('ai_') ? 'api' :
                    key.startsWith('whatsapp_') ? 'whatsapp' : 'general'
            }));

            const res = await fetch('/api/zap/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: settingsArray }),
            });

            if (!res.ok) throw new Error('Falha ao salvar');
            showToast('Configurações salvas com sucesso!');
        } catch (e) {
            showToast('Erro ao salvar', 'error');
        }
        setSaving(false);
    };

    return (
        <div id="rocha-zap-root">
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="page-header">
                        <div>
                            <h1 className="flex items-center gap-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                Configurações Avançadas
                            </h1>
                            <p className="subtitle">Parametrização global e conectividade estratégica</p>
                        </div>
                        <button className="bg-[#c9a05b] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all disabled:opacity-50" onClick={saveSettings} disabled={saving}>
                            {saving ? 'Sincronizando...' : 'Salvar Alterações'}
                        </button>
                    </div>

                    <div className="page-body">
                        <div className="flex gap-8 border-b border-white/5 mb-8">
                            <button className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-[#c9a05b] text-[#c9a05b]' : 'border-transparent text-gray-500'}`} onClick={() => setActiveTab('general')}>Geral & IA</button>
                            <button className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'flow' ? 'border-[#c9a05b] text-[#c9a05b]' : 'border-transparent text-gray-500'}`} onClick={() => setActiveTab('flow')}>Fluxos de Atendimento</button>
                        </div>

                        {loading ? (
                            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-[#c9a05b]/20 border-t-[#c9a05b] rounded-full animate-spin"></div></div>
                        ) : activeTab === 'general' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* WhatsApp Connection */}
                                <div className="card space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white uppercase text-xs tracking-widest">WhatsApp Business</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${whatsappStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {whatsappStatus}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center py-4">
                                        {whatsappStatus === 'connected' ? (
                                            <div className="text-center space-y-4">
                                                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                                </div>
                                                <p className="text-sm text-gray-400 font-bold">Instância conectada e operacional</p>
                                                <button className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline" onClick={() => fetch('/api/zap/whatsapp/disconnect', { method: 'POST' }).then(checkWhatsApp)}>Desconectar</button>
                                            </div>
                                        ) : qrCode ? (
                                            <div className="text-center space-y-4">
                                                <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl">
                                                    <img src={`/api/zap/whatsapp/qr?t=${Date.now()}`} className="w-48 h-48" alt="QR Code" />
                                                </div>
                                                <p className="text-xs text-gray-500 font-bold">Escaneie com seu WhatsApp para conectar</p>
                                            </div>
                                        ) : (
                                            <button className="bg-white/5 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all" onClick={connectWhatsApp} disabled={connecting}>
                                                {connecting ? 'Gerando QR Code...' : 'Iniciar Nova Conexão'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* AI Intelligence */}
                                <div className="card space-y-6">
                                    <h3 className="font-bold text-white uppercase text-xs tracking-widest">Inteligência Artificial</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase">Provedor</label>
                                            <select className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" value={settings.ai_backend || 'openai'} onChange={e => updateSetting('ai_backend', e.target.value)}>
                                                <option value="openai">OpenAI (GPT-4o)</option>
                                                <option value="localai">Rocha Deep (Local)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase">Chave API OpenAI</label>
                                            <input type="password" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" placeholder="sk-..." value={settings.openai_api_key || ''} onChange={e => updateSetting('openai_api_key', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.audio_responses === 'enabled'} onChange={e => updateSetting('audio_responses', e.target.checked ? 'enabled' : 'disabled')} />
                                                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#c9a05b] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                            <div>
                                                <span className="text-white text-xs font-bold block">Respostas por Áudio</span>
                                                <span className="text-[10px] text-gray-500">O robô enviará áudios curtos personalizados</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <MenuBuilder />
                        )}
                    </div>
                </main>
            </div>

            {/* Toast port */}
            {toast && (
                <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-2xl shadow-2xl z-[500] font-bold text-sm animate-slide-up ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

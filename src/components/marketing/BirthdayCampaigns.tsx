'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cake, Save, CheckCircle2, Calendar, Users, Send, Loader2, Clock } from 'lucide-react';

const API_BASE = '/api/marketing';

export const BirthdayCampaigns: React.FC = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [sending, setSending] = useState<number | null>(null);
    const [sentIds, setSentIds] = useState<number[]>([]);
    const [settings, setSettings] = useState({
        enabled: true,
        autoSendTime: '08:00',
        channel: 'whatsapp' as 'whatsapp' | 'email' | 'sms',
        message: 'Olá {nome}! 🎂🎉\n\nA equipe Pátio Rocha Leilões deseja a você um Feliz Aniversário!\nMuitas felicidades, saúde e sucesso!\n\nUm grande abraço! 🎈',
        emailSubject: 'Feliz Aniversário! 🎂',
        selectedGroupIds: [] as number[],
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE}/contacts`).then(r => setContacts(r.data)).catch(() => { });
        axios.get(`${API_BASE}/groups`).then(r => setGroups(r.data)).catch(() => { });

        const savedSettings = localStorage.getItem('birthday_settings');
        if (savedSettings) {
            try { setSettings(JSON.parse(savedSettings)); } catch { }
        }
    }, []);

    const saveSettings = () => {
        localStorage.setItem('birthday_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleGroup = (id: number) => {
        setSettings(prev => ({
            ...prev,
            selectedGroupIds: prev.selectedGroupIds.includes(id)
                ? prev.selectedGroupIds.filter(gid => gid !== id)
                : [...prev.selectedGroupIds, id]
        }));
    };

    const sendManual = async (contact: any) => {
        setSending(contact.id);
        try {
            const personalMessage = settings.message.replace('{nome}', contact.name);
            await axios.post(`${API_BASE}/campaigns`, {
                name: `Aniversário - ${contact.name}`,
                type: settings.channel,
                sendMode: 'individual',
                recipient: contact.email || '',
                phone: contact.phone || '',
                subject: settings.emailSubject,
                content: personalMessage,
                scheduleType: 'immediate',
            });
            setSentIds(prev => [...prev, contact.id]);
        } catch (e: any) {
            alert('Erro ao enviar: ' + (e.response?.data?.error || e.message));
        } finally {
            setSending(null);
        }
    };

    const contactsWithBirthday = contacts.filter(c => c.birthDate);
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayBirthdays = contactsWithBirthday.filter(c => {
        try {
            const d = new Date(c.birthDate);
            const cStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return cStr === todayStr;
        } catch { return false; }
    });

    const weekBirthdays = contactsWithBirthday.filter(c => {
        try {
            const d = new Date(c.birthDate);
            const thisYear = new Date(today.getFullYear(), d.getMonth(), d.getDate());
            const diff = (thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 7;
        } catch { return false; }
    });

    const monthBirthdays = contactsWithBirthday.filter(c => {
        try {
            const d = new Date(c.birthDate);
            return d.getMonth() === today.getMonth();
        } catch { return false; }
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black text-gray-800">🎂 Aniversários</h2>
                <p className="text-gray-500 mt-1">Campanha automática às {settings.autoSendTime}h ou envie manualmente</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-pink-100 rounded-xl flex items-center justify-center shrink-0"><Cake className="w-5 h-5 text-pink-600" /></div>
                        <div><p className="text-2xl font-black text-gray-800">{todayBirthdays.length}</p><p className="text-sm text-gray-500">Hoje</p></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center shrink-0"><Calendar className="w-5 h-5 text-purple-600" /></div>
                        <div><p className="text-2xl font-black text-gray-800">{weekBirthdays.length}</p><p className="text-sm text-gray-500">Semana</p></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center shrink-0"><Calendar className="w-5 h-5 text-blue-600" /></div>
                        <div><p className="text-2xl font-black text-gray-800">{monthBirthdays.length}</p><p className="text-sm text-gray-500">Mês</p></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-teal-100 rounded-xl flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-teal-600" /></div>
                        <div><p className="text-2xl font-black text-gray-800">{contactsWithBirthday.length}</p><p className="text-sm text-gray-500">Total</p></div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 p-6">
                <h3 className="text-lg font-bold text-pink-700 flex items-center gap-2 mb-4">🎉 Aniversariantes de Hoje</h3>
                {todayBirthdays.length > 0 ? (
                    <div className="space-y-2">
                        {todayBirthdays.map(c => (
                            <div key={c.id} className="bg-white rounded-xl p-4 border border-pink-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center shrink-0"><Cake className="w-5 h-5 text-pink-500" /></div>
                                    <div><p className="font-bold text-gray-900">{c.name}</p><p className="text-xs text-gray-500">{c.phone || c.email || '-'}</p></div>
                                </div>
                                {sentIds.includes(c.id) ? (
                                    <span className="flex items-center gap-1 text-green-600 font-bold text-sm"><CheckCircle2 className="w-4 h-4" /> Enviado!</span>
                                ) : (
                                    <button onClick={() => sendManual(c)} disabled={sending === c.id} className="bg-pink-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-pink-600 flex items-center gap-2 disabled:opacity-50">
                                        {sending === c.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar Parabéns</>}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : <p className="text-pink-400 text-sm italic">Nenhum aniversariante hoje.</p>}
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/10 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-white">⚙️ Configuração Automática</h3>
                <div className="space-y-4">
                    <textarea
                        value={settings.message}
                        onChange={e => setSettings({ ...settings, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 min-h-[100px] text-white outline-none focus:border-[#c5a059]"
                    />
                    <button onClick={saveSettings} className="bg-[#c5a059] text-[#0a0f1a] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#c5a059]/20">
                        {saved ? 'Salvo!' : 'Salvar Configuração'}
                    </button>
                </div>
            </div>
        </div>
    );
};

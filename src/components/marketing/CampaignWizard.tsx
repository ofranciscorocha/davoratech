'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X, Send, Mail, MessageCircle, Smartphone, Calendar, Sparkles, Loader2, Bold, Italic, Underline
} from 'lucide-react';

const API_BASE = '/api/marketing';

interface CampaignWizardProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ onClose, onSuccess, initialData }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);
    const [emailAccounts, setEmailAccounts] = useState<any[]>([]);

    // State variables for the form
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState<'email' | 'whatsapp' | 'sms'>(initialData?.type || 'whatsapp');
    const [sendMode, setSendMode] = useState<'group' | 'individual'>(initialData?.groupId ? 'group' : 'individual');
    const [recipient, setRecipient] = useState(initialData?.recipient || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [selectedGroupId, setSelectedGroupId] = useState<string>(initialData?.groupId ? String(initialData?.groupId) : '');
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>(initialData?.scheduleType || 'immediate');
    const [scheduledDate, setScheduledDate] = useState(initialData?.scheduledDate || '');
    const [selectedEmailAccount, setSelectedEmailAccount] = useState(initialData?.emailAccountId || '');

    useEffect(() => {
        // Load groups
        axios.get(`${API_BASE}/groups`).then(r => {
            if (Array.isArray(r.data)) setGroups(r.data);
        }).catch(() => { });

        // Load email accounts
        axios.get(`${API_BASE}/settings/email-accounts`).then(r => {
            if (Array.isArray(r.data)) {
                setEmailAccounts(r.data);
                if (r.data.length > 0 && !selectedEmailAccount) setSelectedEmailAccount(r.data[0].id);
            }
        }).catch(() => { });
    }, [selectedEmailAccount]);

    const handleSend = async () => {
        if (!name || (!recipient && !selectedGroupId && sendMode !== 'individual') || !content) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE}/campaigns`, {
                name,
                type,
                sendMode,
                recipient,
                phone,
                groupId: selectedGroupId ? parseInt(selectedGroupId) : null,
                subject,
                content,
                scheduleType,
                scheduledDate: scheduleType === 'scheduled' ? scheduledDate : null,
                emailAccountId: type === 'email' ? selectedEmailAccount : null
            });
            onSuccess();
        } catch (e: any) {
            alert('Erro ao criar campanha: ' + (e.response?.data?.error || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">🚀 Nova Campanha</h2>
                        <p className="text-sm text-gray-500 font-medium">Passo {step} de 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <label className="block">
                                <span className="text-sm font-bold text-gray-700 ml-1">Nome da Campanha *</span>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Promoção de Natal 2024" className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all" />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setType('whatsapp')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'whatsapp' ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}><MessageCircle className="w-6 h-6" /></div>
                                    <span className={`font-black uppercase tracking-wider text-xs ${type === 'whatsapp' ? 'text-green-700' : 'text-gray-500'}`}>WhatsApp</span>
                                </button>
                                <button onClick={() => setType('email')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'email' ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}><Mail className="w-6 h-6" /></div>
                                    <span className={`font-black uppercase tracking-wider text-xs ${type === 'email' ? 'text-blue-700' : 'text-gray-500'}`}>Email</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gray-50 p-2 rounded-2xl flex gap-2">
                                <button onClick={() => setSendMode('individual')} className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${sendMode === 'individual' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Individual</button>
                                <button onClick={() => setSendMode('group')} className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${sendMode === 'group' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Por Grupo</button>
                            </div>

                            {sendMode === 'individual' ? (
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-700 ml-1">{type === 'email' ? 'Email do Destinatário' : 'Telefone do Destinatário'}</span>
                                        <input
                                            type="text"
                                            value={type === 'email' ? recipient : phone}
                                            onChange={e => type === 'email' ? setRecipient(e.target.value) : setPhone(e.target.value)}
                                            placeholder={type === 'email' ? "email@exemplo.com" : "(11) 99999-9999"}
                                            className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-700 ml-1">Selecionar Grupo</span>
                                    <select value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all cursor-pointer">
                                        <option value="">Selecione um grupo...</option>
                                        {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g._count?.contacts || 0} contatos)</option>)}
                                    </select>
                                </label>
                            )}

                            {type === 'email' && (
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-700 ml-1">Conta de Email</span>
                                        <select value={selectedEmailAccount} onChange={e => setSelectedEmailAccount(e.target.value)} className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all cursor-pointer">
                                            {emailAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.email} ({acc.service})</option>)}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-700 ml-1">Assunto do Email</span>
                                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto cativante..." className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all" />
                                    </label>
                                </div>
                            )}

                            <label className="block">
                                <span className="text-sm font-bold text-gray-700 ml-1">Conteúdo da Mensagem</span>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    rows={5}
                                    placeholder="Escreva sua mensagem aqui..."
                                    className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all resize-none"
                                />
                                <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">{content.length} caracteres</p>
                            </label>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setScheduleType('immediate')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${scheduleType === 'immediate' ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                    <Send className={`w-8 h-8 ${scheduleType === 'immediate' ? 'text-teal-600' : 'text-gray-400'}`} />
                                    <span className={`font-black uppercase tracking-wider text-xs ${scheduleType === 'immediate' ? 'text-teal-700' : 'text-gray-500'}`}>Enviar Agora</span>
                                </button>
                                <button onClick={() => setScheduleType('scheduled')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${scheduleType === 'scheduled' ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                    <Calendar className={`w-8 h-8 ${scheduleType === 'scheduled' ? 'text-amber-600' : 'text-gray-400'}`} />
                                    <span className={`font-black uppercase tracking-wider text-xs ${scheduleType === 'amber-700' ? 'text-amber-700' : 'text-gray-500'}`}>Agendar</span>
                                </button>
                            </div>

                            {scheduleType === 'scheduled' && (
                                <label className="block animate-in zoom-in-95 duration-300">
                                    <span className="text-sm font-bold text-gray-700 ml-1">Data e Hora de Envio</span>
                                    <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="mt-1.5 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-medium transition-all" />
                                </label>
                            )}

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Resumo da Campanha</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Nome:</span><span className="font-bold text-gray-900">{name}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Canal:</span><span className="font-bold text-gray-900 capitalize">{type}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Envio:</span><span className="font-bold text-gray-900">{sendMode === 'group' ? 'Grupo Selecionado' : 'Manual'}</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all">Voltar</button>
                    )}
                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="flex-[2] bg-gray-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl">Próximo Passo</button>
                    ) : (
                        <button onClick={handleSend} disabled={loading} className="flex-[2] bg-teal-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-teal-700 flex items-center justify-center gap-3 transition-all shadow-xl shadow-teal-100 disabled:opacity-50">
                            {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> Processando...</> : <><Send className="w-6 h-6" /> Finalizar e Criar</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

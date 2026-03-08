'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, X, Save, CheckCircle2 } from 'lucide-react';

const API_BASE = '/api/marketing';

interface ContactFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        groupId: '',
        birthDate: '',
        personType: 'PF',
    });

    useEffect(() => {
        axios.get(`${API_BASE}/groups`).then(res => setGroups(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert('Nome é obrigatório');
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/contacts`, { ...formData, groupId: formData.groupId || null });
            setSuccess(true);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (error) {
            alert('Erro ao criar contato');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-12 text-center max-w-md w-full shadow-2xl">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Contato Criado!</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-teal-600">
                        <UserPlus /> Novo Contato
                    </h3>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder="Nome" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500" required />
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setFormData({ ...formData, personType: 'PF' })} className={`flex-1 p-3 rounded-xl border-2 font-bold ${formData.personType === 'PF' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 text-gray-400'}`}>PF</button>
                        <button type="button" onClick={() => setFormData({ ...formData, personType: 'PJ' })} className={`flex-1 p-3 rounded-xl border-2 font-bold ${formData.personType === 'PJ' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 text-gray-400'}`}>PJ</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
                        <input type="text" placeholder="Telefone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
                    </div>
                    <select value={formData.groupId} onChange={e => setFormData({ ...formData, groupId: e.target.value })} className="w-full border rounded-lg px-4 py-3">
                        <option value="">Sem grupo</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all disabled:opacity-50">
                        {loading ? 'Salvando...' : 'Salvar Contato'}
                    </button>
                </form>
            </div>
        </div>
    );
};

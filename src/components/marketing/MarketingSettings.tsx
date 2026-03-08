'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Smartphone, PlusCircle, Upload, Trash2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { WhatsAppPairing } from './WhatsAppPairing';

const API_BASE = '/api/marketing';

export function MarketingSettings() {
    const [logo, setLogo] = useState<string | null>(null);
    const [emailLogo, setEmailLogo] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        setLogo(localStorage.getItem('marketing_logo'));
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogo(base64);
                localStorage.setItem('marketing_logo', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmailLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadSuccess(false);
        try {
            const formData = new FormData();
            formData.append('logo', file);
            const res = await axios.post(`${API_BASE}/upload/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setEmailLogo(res.data.fullUrl);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err: any) {
            alert('Erro ao enviar logo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <WhatsAppPairing />

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 font-bold text-marketing-gold">
                    <Mail className="w-5 h-5" />
                    <h4>Logo dos Templates de E-mail</h4>
                </div>
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full sm:w-64 h-32 rounded-2xl bg-[#0a192f] flex items-center justify-center overflow-hidden">
                        {emailLogo ? <img src={emailLogo} className="max-h-full p-4" alt="Logo" /> : <span className="text-white/20">Sem logo</span>}
                    </div>
                    <label className="flex-1 w-full p-6 border-2 border-dashed border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer text-center">
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <span className="text-sm font-bold text-gray-500 uppercase">Trocar logo dos emails</span>
                        <input type="file" className="hidden" onChange={handleEmailLogoUpload} />
                    </label>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold">
                    <ImageIcon className="w-5 h-5" />
                    <h4>Logo da Sidebar</h4>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 items-center">
                    <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center relative group overflow-hidden">
                        {logo ? <img src={logo} className="p-4" alt="Logo" /> : <ImageIcon className="w-10 h-10 text-gray-200" />}
                    </div>
                    <label className="flex-1 w-full p-6 border-2 border-dashed border-gray-100 rounded-3xl hover:bg-gray-50 cursor-pointer text-center">
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <span className="text-sm font-bold text-gray-500 uppercase">Trocar logo do sistema</span>
                        <input type="file" className="hidden" onChange={handleLogoUpload} />
                    </label>
                </div>
            </div>
        </div>
    );
}

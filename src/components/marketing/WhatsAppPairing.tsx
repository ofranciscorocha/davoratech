'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, RefreshCw, Smartphone, RotateCcw } from 'lucide-react';
import QRCode from 'react-qr-code';

const API_BASE = '/api/marketing';

export const WhatsAppPairing: React.FC = () => {
    const [data, setData] = useState<{ status: string; qr: string | null } | null>(null);
    const [resetting, setResetting] = useState(false);

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE}/whatsapp/status`);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch WhatsApp status');
        }
    };

    const handleReset = async () => {
        setResetting(true);
        try {
            await axios.post(`${API_BASE}/whatsapp/reset`);
            setTimeout(() => {
                fetchStatus();
                setResetting(false);
            }, 4000);
        } catch (error) {
            setResetting(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="p-8 text-center text-gray-500">Carregando status do WhatsApp...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-[#075e54] text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Smartphone />
                    WhatsApp Marketing
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${data.status === 'connected' ? 'bg-white text-green-600' : 'bg-white/20 text-white'}`}>
                    {data.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
            </div>

            <div className="p-8 flex flex-col items-center gap-6">
                {data.status === 'connected' ? (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                        <h4 className="text-2xl font-bold">Conectado!</h4>
                        <p className="text-gray-500">O sistema está pronto para enviar mensagens.</p>
                    </div>
                ) : data.qr ? (
                    <div className="text-center space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg inline-block">
                            <QRCode value={data.qr} size={256} />
                        </div>
                        <p className="text-gray-500 text-sm">Escaneie o QR Code no seu WhatsApp</p>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <RefreshCw className="w-10 h-10 text-gray-300 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500">Gerando QR Code...</p>
                    </div>
                )}

                {data.status !== 'connected' && (
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 border border-red-100 disabled:opacity-50"
                    >
                        <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
                        {resetting ? 'Resetando...' : 'Resetar Conexão'}
                    </button>
                )}
            </div>
        </div>
    );
};

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Mail, MessageCircle, Smartphone, CheckCircle2, XCircle, Filter, RefreshCw } from 'lucide-react';

const API_BASE = '/api/marketing';

interface DeliveryLog {
    id: number;
    channel: string;
    status: string;
    error: string | null;
    sentAt: string;
    contactName: string | null;
    campaignName: string | null;
}

export const DeliveryReports: React.FC = () => {
    const [logs, setLogs] = useState<DeliveryLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/logs`);
            setLogs(res.data);
        } catch (e) {
            console.error('Error fetching logs:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-800">📊 Relatórios</h2>
                    <p className="text-gray-500 mt-1">Histórico de envios</p>
                </div>
                <button onClick={fetchData} className="text-teal-600 font-bold flex items-center gap-2">
                    <RefreshCw className={loading ? 'animate-spin' : ''} /> Atualizar
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left">Canal</th>
                            <th className="px-5 py-3 text-left">Contato</th>
                            <th className="px-5 py-3 text-left">Status</th>
                            <th className="px-5 py-3 text-left">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-5 py-3 capitalize">{log.channel}</td>
                                <td className="px-5 py-3 font-bold">{log.contactName}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-gray-400">{new Date(log.sentAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

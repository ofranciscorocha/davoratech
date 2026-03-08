'use client';
import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api/marketing';

interface ImportWizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: number; total: number } | null>(null);
    const [groupsList, setGroupsList] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');

    React.useEffect(() => {
        axios.get(`${API_BASE}/groups`).then(res => setGroupsList(res.data));
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        if (selectedGroupId) formData.append('groupId', selectedGroupId);

        try {
            const response = await axios.post(`${API_BASE}/contacts/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
            onSuccess();
        } catch (error) {
            alert('Falha ao importar contatos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0a192f] text-white">
                    <h3 className="text-xl font-bold">Importar Contatos</h3>
                    <button onClick={onClose}><X /></button>
                </div>

                <div className="p-8 space-y-6">
                    {!result ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Pasta de Destino</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                >
                                    <option value="">Sem Pasta (Geral)</option>
                                    {groupsList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>

                            <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer">
                                <Upload className="mx-auto w-10 h-10 text-gray-300 mb-2" />
                                <p className="text-sm font-bold text-gray-500 uppercase">{file ? file.name : 'Selecionar Planilha'}</p>
                                <input type="file" className="hidden" accept=".xlsx, .csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            </label>

                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                            >
                                {loading ? 'Importando...' : 'Iniciar Importação'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-6">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                            <h4 className="text-2xl font-bold">Sucesso!</h4>
                            <p className="text-gray-500">Importados {result.success} contatos.</p>
                            <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Concluído</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

'use client';
import { useState } from 'react';
import './crm.css';

export default function CRMPage() {
    const [activeTab, setActiveTab] = useState('leads');

    return (
        <div id="crm-root" className="p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Rocha CRM</h1>
                <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Novo Lead</button>
                </div>
            </div>

            <div className="crm-card">
                <div className="border-b mb-6">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`pb-4 px-2 ${activeTab === 'leads' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-500'}`}
                        >
                            Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('pipeline')}
                            className={`pb-4 px-2 ${activeTab === 'pipeline' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-500'}`}
                        >
                            Pipeline
                        </button>
                    </nav>
                </div>

                <div className="py-20 text-center text-gray-400">
                    Nenhum dado encontrado no momento.
                </div>
            </div>
        </div>
    );
}

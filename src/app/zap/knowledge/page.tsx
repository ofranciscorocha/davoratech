'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';
import MainHeader from '@/components/zap/MainHeader';
import '../zap.css';

export default function KnowledgePage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchKnowledge(); }, []);

    const fetchKnowledge = async () => {
        try {
            const res = await fetch('/api/zap/knowledge');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <MainHeader />
                <div className="dashboard-viewport">
                    <div className="page-header-premium">
                        <div className="header-info">
                            <div className="title-row">
                                <div className="icon-box-premium">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                                </div>
                                <h1>Base de Conhecimento</h1>
                            </div>
                            <p className="subtitle">Ensine a IA sobre seu negócio, produtos e serviços.</p>
                        </div>
                        <button className="btn-create-premium">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Adicionar Documento
                        </button>
                    </div>

                    <div className="knowledge-grid-premium">
                        {loading ? (
                            <div className="loading-state-premium"><div className="spinner-premium"></div></div>
                        ) : categories.length === 0 ? (
                            <div className="empty-card-premium">
                                <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2zM6 13h4m-4-4h12m-12 8h12" /></svg></div>
                                <h3>Sem documentos ainda</h3>
                                <p>Sua IA precisa de contexto para responder bem. Comece adicionando informações.</p>
                            </div>
                        ) : (
                            categories.map(cat => (
                                <div key={cat.id} className="knowledge-card-premium">
                                    <div className="cat-header">
                                        <div className="cat-icon-box">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        </div>
                                        <div className="cat-badge">Sincronizado</div>
                                    </div>
                                    <div className="cat-body">
                                        <h4>{cat.name}</h4>
                                        <p>{cat.description || 'Contém as regras de negócio e informações estruturadas para a IA.'}</p>
                                        <div className="doc-count-premium">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            8 Arquivos
                                        </div>
                                    </div>
                                    <div className="cat-footer">
                                        <button className="btn-text-premium">Ver Documentos →</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .knowledge-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
                    .knowledge-card-premium {
                        background: var(--bg-card);
                        border: 1px solid var(--glass-border);
                        border-radius: 28px;
                        padding: 30px;
                        transition: var(--transition);
                        backdrop-filter: blur(10px);
                        display: flex;
                        flex-direction: column;
                    }
                    .knowledge-card-premium:hover { border-color: var(--gold-primary); transform: translateY(-5px); background: var(--bg-card-hover); }
                    
                    .cat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                    .cat-icon-box {
                        width: 48px;
                        height: 48px;
                        background: var(--bg-tertiary);
                        border: 1px solid var(--border-color);
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--gold-primary);
                    }
                    .cat-badge { font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.1); padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }

                    .cat-body h4 { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0 0 8px; }
                    .cat-body p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }
                    .doc-count-premium { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); }

                    .cat-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); }
                    .btn-text-premium { background: transparent; border: none; font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); cursor: pointer; transition: var(--transition); padding: 0; }
                    .btn-text-premium:hover { opacity: 0.8; transform: translateX(5px); }
                `}</style>
            </main>
        </div>
    );
}

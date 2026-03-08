'use client';
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, Gem, ArrowRight } from 'lucide-react';
import './select.css';

export default function SelectPage() {
    return (
        <div id="select-root">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="logo">ROCHA SELECT</div>
                    <div className="nav-links">
                        <Link href="/auth/login" className="login-link">Login</Link>
                        <Link href="/register" className="register-btn">Cadastrar Revenda</Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-overlay" />
                    <div className="hero-content">
                        <span className="eyebrow">EXCLUSIVO PARA LOJISTAS</span>
                        <h1 className="title">
                            O Marketplace B2B Mais <span className="gold-text">Premium</span> do Brasil
                        </h1>
                        <p className="subtitle">
                            Acesse um estoque validado de veículos com procedência de leilão.
                            Margem real e negociação direta, sem intermediários.
                        </p>
                        <div className="cta-group">
                            <Link href="/register" className="btn-primary">
                                Solicitar Acesso <ArrowRight size={20} />
                            </Link>
                            <Link href="/auth/login" className="btn-secondary">
                                Já sou Parceiro
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Value Proposition */}
                <section className="features">
                    <div className="container">
                        <div className="feature-grid">
                            <div className="feature-card">
                                <div className="icon-wrapper"><Lock /></div>
                                <h3>100% Fechado</h3>
                                <p>Ambiente seguro e exclusivo. Apenas CNPJs validados têm acesso aos preços e detalhes.</p>
                            </div>
                            <div className="feature-card">
                                <div className="icon-wrapper"><CheckCircle /></div>
                                <h3>Procedência</h3>
                                <p>Veículos periciados e com laudo. Transparência total nas observações internas e externas.</p>
                            </div>
                            <div className="feature-card">
                                <div className="icon-wrapper"><Gem /></div>
                                <h3>Oportunidades</h3>
                                <p>Carros selecionados a dedo ("Cherry Picked") para garantir giro rápido na sua loja.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Rocha Select. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

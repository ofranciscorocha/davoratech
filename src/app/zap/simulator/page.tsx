'use client';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/zap/Sidebar';

export default function SimulatorPage() {
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: 'Olá! Eu sou o assistente virtual do Rocha Zap. Como posso ajudar você hoje?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage, time: userTime }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/zap/ia/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error('Falha na resposta da IA');

            const data = await response.json();
            const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, time: aiTime }]);
        } catch (error) {
            const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erro ao conectar com o robô. Verifique se o servidor está rodando e a chave OpenAI configurada.', time: errorTime }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content" style={{ display: 'flex', flexDirection: 'column', background: '#efeae2', height: '100vh', padding: 0 }}>
                {/* Whatsapp Header */}
                <div className="bg-[#07132e] text-white px-6 py-4 flex items-center gap-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-[#c9a05b] rounded-xl flex items-center justify-center text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <div>
                        <div className="font-bold">Simulador de Atendimento</div>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">IA Operacional</div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[80%] p-3 rounded-xl shadow-sm relative min-w-[100px] animate-slide-up ${msg.role === 'user' ? 'ml-auto bg-[#d9fdd3] text-[#111b21]' : 'mr-auto bg-white text-[#111b21]'}`}
                        >
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                            <div className="text-[10px] text-gray-500 text-right mt-1">{msg.time}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="mr-auto bg-white p-3 rounded-xl text-xs text-gray-400 italic">Digitando...</div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="bg-[#f0f2f5] p-4 flex gap-3 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem para testar a IA..."
                        className="flex-1 bg-white border-none px-6 py-4 rounded-full text-sm outline-none shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-[#c9a05b] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </main>
        </div>
    );
}

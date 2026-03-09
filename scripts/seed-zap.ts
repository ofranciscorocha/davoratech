import { getDatabase } from '../src/lib/zap/database.js';

const db = getDatabase();
const tenantId = 'tenant-master';

async function seedZap() {
    console.log('Seeding Rocha Zap data...');

    // 1. Strategic Agents
    const agents = [
        {
            id: 'agent-comercial',
            name: 'COMERCIAL',
            type: 'commercial',
            description: 'Especialista em fechamento de vendas e apresentação de produtos.',
            system_prompt: 'Você é o Agente Comercial da Rocha. Seu objetivo é converter leads em clientes. Seja persuasivo, profissional e focado em benefícios. Sempre tente agendar uma reunião ou fechar a venda.',
            temperature: 0.7,
            is_active: 1
        },
        {
            id: 'agent-qualificador',
            name: 'QUALIFICADOR',
            type: 'qualifier',
            description: 'Focado em entender as necessidades do lead e filtrar interesse.',
            system_prompt: 'Você é o Agente Qualificador da Rocha. Seu papel é fazer perguntas estratégicas para entender se o lead tem o perfil ideal (BANT). Identifique Orçamento, Autoridade, Necessidade e Tempo.',
            temperature: 0.5,
            is_active: 1
        },
        {
            id: 'agent-sucesso',
            name: 'SUCESSO DO CLIENTE',
            type: 'success',
            description: 'Suporte pós-venda e manutenção de relacionamento.',
            system_prompt: 'Você é o Agente de Sucesso do Cliente da Rocha. Sua missão é garantir a melhor experiência possível. Resolva dúvidas técnicos ou operacionais com empatia e agilidade.',
            temperature: 0.3,
            is_active: 1
        }
    ];

    for (const agent of agents) {
        db.prepare(`
            INSERT OR REPLACE INTO agents (id, tenant_id, name, type, description, system_prompt, temperature, max_tokens, is_active, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(agent.id, tenantId, agent.name, agent.type, agent.description, agent.system_prompt, agent.temperature, 500, agent.is_active);
    }

    // 2. Knowledge Base Categories (Initial entries)
    const knowledgeItems = [
        {
            title: 'Politica de Preços 2026',
            category: 'Preços',
            content: 'Nossos preços variam conforme o volume. Planos a partir de R$ 299/mês para Rocha Zap.',
        },
        {
            title: 'Missão Rocha',
            category: 'Institucional',
            content: 'Transformar a comunicação empresarial através de Inteligência Artificial acessível.',
        },
        {
            title: 'Configuração de WhatsApp',
            category: 'Suporte',
            content: 'Para conectar, basta escanear o QR Code no dashboard. Mantenha o celular carregado.',
        }
    ];

    for (const item of knowledgeItems) {
        db.prepare(`
            INSERT INTO knowledge_base (tenant_id, title, category, content)
            VALUES (?, ?, ?, ?)
        `).run(tenantId, item.title, item.category, item.content);
    }

    // 3. Audio Settings
    db.prepare(`
        INSERT OR REPLACE INTO settings (tenant_id, key, value, description, category)
        VALUES (?, ?, ?, ?, ?)
    `).run(tenantId, 'auto_reply_audio', 'true', 'Ativa a conversão de texto em áudio para respostas automáticas', 'ai_behavior');

    console.log('Rocha Zap Seed completed!');
}

seedZap();

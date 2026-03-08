import OpenAI from 'openai';
import { getDatabase } from './database';

let openaiClient: OpenAI | null = null;

export function getOpenAI() {
    if (!openaiClient) {
        try {
            const db = getDatabase();
            const apiKeyRecord = db.prepare("SELECT value FROM settings WHERE key = 'openai_api_key'").get();
            const backendRecord = db.prepare("SELECT value FROM settings WHERE key = 'ai_backend'").get();
            const baseUrlRecord = db.prepare("SELECT value FROM settings WHERE key = 'localai_base_url'").get();

            const backend = backendRecord?.value || 'openai';

            let baseUrl = undefined;
            if (backend === 'localai') {
                baseUrl = baseUrlRecord?.value || 'http://localhost:8080/v1';
                if (baseUrl.endsWith(':8080')) baseUrl += '/v1';
            }

            let apiKey = 'localai';
            if (backend === 'openai') {
                apiKey = process.env.OPENAI_API_KEY || '';
                if (!apiKey && apiKeyRecord?.value && apiKeyRecord.value.trim() !== '') {
                    apiKey = apiKeyRecord.value.trim();
                }
            } else if (apiKeyRecord?.value && apiKeyRecord.value.trim() !== '') {
                apiKey = apiKeyRecord.value.trim();
            }

            openaiClient = new OpenAI({
                apiKey: apiKey || 'missing-key',
                baseURL: baseUrl,
                dangerouslyAllowBrowser: true
            });
        } catch (e) {
            console.error('[AI] CRITICAL ERROR during OpenAI client initialization:', e);
            return null;
        }
    }
    return openaiClient;
}

export async function chatCompletion(messages: any[], agentType = 'success', knowledgeContext = '', extraInstructions = '') {
    const client = getOpenAI();
    if (!client) throw new Error('AI Client not initialized');

    try {
        const db = getDatabase();
        const agent = db.prepare('SELECT * FROM agents WHERE type = ? AND is_active = 1').get(agentType);
        const backendRecord = db.prepare("SELECT value FROM settings WHERE key = 'ai_backend'").get();
        const isLocalAI = backendRecord?.value === 'localai';
        const modelSetting = db.prepare("SELECT value FROM settings WHERE key = 'openai_model'").get();
        const localModelSetting = db.prepare("SELECT value FROM settings WHERE key = 'localai_model'").get();
        const model = isLocalAI ? (localModelSetting?.value || 'gpt-4') : (modelSetting?.value || 'gpt-4o-mini');

        let systemPrompt = agent?.system_prompt || 'Você é um assistente prestativo da Rocha.';
        if (knowledgeContext) systemPrompt += `\n\nBASE DE CONHECIMENTO:\n${knowledgeContext}`;
        if (extraInstructions) systemPrompt += `\n\n${extraInstructions}`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            temperature: agent?.temperature || 0.7,
            max_tokens: agent?.max_tokens || 500,
        });

        return {
            content: response.choices[0].message.content,
            tokens: response.usage?.total_tokens || 0,
        };
    } catch (e: any) {
        console.error('[AI] Chat completion error:', e.message);
        throw e;
    }
}

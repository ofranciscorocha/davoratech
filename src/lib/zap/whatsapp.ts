/* WhatsApp client manager for Rocha Business Hub */
import { getDatabase } from './database';
import fs from 'fs';
import path from 'path';

const clients: Record<string, any> = {};
let globalMessageHandlers: Array<Function> = [];

export function getWhatsAppStatus(tenantId: string) {
    if (!tenantId) return { error: 'tenantId required' };
    const clientData = clients[tenantId];
    if (!clientData) return { status: 'disconnected', qrCode: null, info: null, groups: [] };

    return {
        status: clientData.status,
        qrCode: clientData.qrCode,
        info: clientData.info,
        groups: clientData.groups,
    };
}

export function getWhatsAppClient(tenantId: string) {
    return clients[tenantId]?.client;
}

export function onMessage(handler: Function) {
    globalMessageHandlers.push(handler);
}

export async function initWhatsApp(tenantId: string) {
    if (!tenantId) throw new Error('tenantId required for WhatsApp initialization');

    // Dynamic import for whatsapp-web.js
    const { Client, LocalAuth } = await import('whatsapp-web.js');

    if (clients[tenantId] && (clients[tenantId].status === 'connected' || clients[tenantId].status === 'initializing')) {
        return getWhatsAppStatus(tenantId);
    }

    const dataPath = path.join(process.cwd(), 'data', `whatsapp-auth-${tenantId}`);

    clients[tenantId] = {
        status: 'initializing',
        qrCode: null,
        info: null,
        groups: [],
        connectionTimestamp: 0,
        processedMessages: new Set(),
        client: new Client({
            authStrategy: new LocalAuth({ clientId: `tenant-${tenantId}`, dataPath }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        })
    };

    const clientData = clients[tenantId];
    const client = clientData.client;

    client.on('qr', (qr: string) => {
        clientData.qrCode = qr;
        clientData.status = 'qr_ready';
    });

    client.on('ready', async () => {
        clientData.status = 'connected';
        clientData.qrCode = null;
        clientData.info = client.info;
        clientData.connectionTimestamp = Math.floor(Date.now() / 1000);
        console.log(`[WhatsApp][${tenantId}] Ready!`);
    });

    client.on('authenticated', () => {
        clientData.status = 'authenticated';
    });

    client.on('disconnected', async () => {
        clientData.status = 'disconnected';
        delete clients[tenantId];
    });

    client.on('message', async (msg: any) => {
        if (msg.fromMe) return;

        // Basic message processing logic
        for (const handler of globalMessageHandlers) {
            try { await handler({ tenantId, rawMessage: msg }); } catch (e) { }
        }
    });

    client.initialize().catch((error: any) => {
        console.error(`[WhatsApp][${tenantId}] Init FAILED:`, error?.message);
        delete clients[tenantId];
    });

    return getWhatsAppStatus(tenantId);
}

export async function sendTextMessage(tenantId: string, phoneOrChatId: string, text: string) {
    const client = getWhatsAppClient(tenantId);
    if (!client) throw new Error(`WhatsApp not connected for tenant ${tenantId}`);

    const chatId = phoneOrChatId.includes('@') ? phoneOrChatId : `${phoneOrChatId}@c.us`;
    await client.sendMessage(chatId, text);
}

export async function sendAudioMessage(tenantId: string, phoneOrChatId: string, audioBuffer: Buffer) {
    const client = getWhatsAppClient(tenantId);
    if (!client) throw new Error(`WhatsApp not connected for tenant ${tenantId}`);

    const { MessageMedia } = await import('whatsapp-web.js');
    const chatId = phoneOrChatId.includes('@') ? phoneOrChatId : `${phoneOrChatId}@c.us`;
    const media = new MessageMedia('audio/ogg; codecs=opus', audioBuffer.toString('base64'));
    await client.sendMessage(chatId, media, { sendAudioAsVoice: true });
}

export async function disconnectWhatsApp(tenantId: string) {
    const clientData = clients[tenantId];
    if (clientData?.client) {
        await clientData.client.destroy();
        delete clients[tenantId];
        console.log(`[WhatsApp][${tenantId}] Client destroyed and removed`);
    }
}

export async function autoInitAllTenants() {
    try {
        const db = getDatabase();
        const rows = db.prepare('SELECT DISTINCT id as tenant_id FROM tenants').all();
        for (const row of rows) {
            const authPath = path.join(process.cwd(), 'data', `whatsapp-auth-${row.tenant_id}`);
            if (fs.existsSync(authPath)) {
                await initWhatsApp(row.tenant_id);
            }
        }
    } catch (error) { }
}

if (typeof window === 'undefined') {
    autoInitAllTenants();
}

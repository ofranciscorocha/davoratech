import { NextResponse } from 'next/server';
import { sendTextMessage, sendAudioMessage } from '@/lib/zap/whatsapp';
import { saveMessage, getOrCreateConversation, activateHumanTakeover, deactivateHumanTakeover } from '@/lib/zap/agents';
import { chatCompletion } from '@/lib/zap/openai';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const headerList = await headers();
        const tenantId = headerList.get('x-tenant-id') || 'tenant-master';

        const body = await request.json();
        const { phone, message, type = 'text', isHumanTakeover, resumeBot } = body;

        if (!phone || !message) {
            return NextResponse.json({ error: 'phone and message required' }, { status: 400 });
        }

        const { contact, conversation } = getOrCreateConversation(tenantId, phone, null, null);

        if (isHumanTakeover) activateHumanTakeover(tenantId, conversation.id);
        if (resumeBot) deactivateHumanTakeover(tenantId, conversation.id);

        // Save message as human operator
        saveMessage(tenantId, conversation.id, contact.id, 'human_operator', message, {
            type,
            isFromHuman: true,
        });

        if (type === 'audio') {
            // Simplified: assuming audio logic is handled or bypassed for now
            // await sendAudioMessage(tenantId, phone, audioBuffer);
        } else {
            await sendTextMessage(tenantId, phone, message);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[WhatsApp] Send error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

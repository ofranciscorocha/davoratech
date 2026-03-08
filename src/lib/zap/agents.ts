import { getDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';

// Get or create conversation for a contact - scoped by tenant
export function getOrCreateConversation(tenantId: string, contactPhone: string, contactName?: string | null, pushname?: string | null) {
    const db = getDatabase();

    // Get or create contact - MUST be isolated by tenant
    let contact = db.prepare('SELECT * FROM contacts WHERE phone = ? AND tenant_id = ?').get(contactPhone, tenantId);
    if (!contact) {
        const contactId = uuidv4();
        const defaultAgent = db.prepare("SELECT value FROM settings WHERE key = 'default_agent' AND tenant_id = ?").get(tenantId);
        db.prepare(`
          INSERT INTO contacts (id, tenant_id, phone, name, pushname, agent_type, first_contact, last_contact)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run(contactId, tenantId, contactPhone, contactName || pushname || contactPhone, pushname, defaultAgent?.value || 'success');
        contact = db.prepare('SELECT * FROM contacts WHERE id = ? AND tenant_id = ?').get(contactId, tenantId);
    } else {
        db.prepare("UPDATE contacts SET last_contact = datetime('now'), pushname = COALESCE(?, pushname), total_messages = total_messages + 1 WHERE id = ? AND tenant_id = ?")
            .run(pushname, contact.id, tenantId);
    }

    // Get or create conversation - MUST be isolated by tenant
    let conversation = db.prepare("SELECT * FROM conversations WHERE contact_id = ? AND status = 'active' AND tenant_id = ?").get(contact.id, tenantId);
    if (!conversation) {
        const convId = uuidv4();
        db.prepare(`
          INSERT INTO conversations (id, tenant_id, contact_id, current_agent) VALUES (?, ?, ?, ?)
        `).run(convId, tenantId, contact.id, contact.agent_type || 'success');
        conversation = db.prepare('SELECT * FROM conversations WHERE id = ? AND tenant_id = ?').get(convId, tenantId);
    }

    return { contact, conversation };
}

// Check if bot is paused for human takeover
export function isBotPaused(tenantId: string, conversationId: string) {
    const db = getDatabase();
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND tenant_id = ?').get(conversationId, tenantId);
    if (!conv || !conv.is_human_takeover) return false;

    if (conv.human_takeover_until) {
        const until = new Date(conv.human_takeover_until);
        if (new Date() > until) {
            // Takeover expired, resume bot
            db.prepare("UPDATE conversations SET is_human_takeover = 0, human_takeover_until = NULL WHERE id = ? AND tenant_id = ?").run(conversationId, tenantId);
            return false;
        }
        return true;
    }
    return true;
}

// Activate human takeover
export function activateHumanTakeover(tenantId: string, conversationId: string) {
    const db = getDatabase();
    const durationSetting = db.prepare("SELECT value FROM settings WHERE key = 'human_takeover_duration' AND tenant_id = ?").get(tenantId);
    const durationMinutes = parseInt(durationSetting?.value || '60');
    const until = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

    db.prepare("UPDATE conversations SET is_human_takeover = 1, human_takeover_until = ? WHERE id = ? AND tenant_id = ?").run(until, conversationId, tenantId);
}

// Deactivate human takeover
export function deactivateHumanTakeover(tenantId: string, conversationId: string) {
    const db = getDatabase();
    db.prepare("UPDATE conversations SET is_human_takeover = 0, human_takeover_until = NULL WHERE id = ? AND tenant_id = ?").run(conversationId, tenantId);
}

// Save message to database
export function saveMessage(tenantId: string, conversationId: string, contactId: string, sender: string, content: string, options: any = {}) {
    const db = getDatabase();
    db.prepare(`
    INSERT INTO messages (id, tenant_id, conversation_id, contact_id, sender, type, content, is_from_bot, is_from_human, agent_type, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
        uuidv4(),
        tenantId,
        conversationId,
        contactId,
        sender,
        options.type || 'text',
        content,
        options.isFromBot ? 1 : 0,
        options.isFromHuman ? 1 : 0,
        options.agentType || null
    );

    db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ? AND tenant_id = ?").run(conversationId, tenantId);
}

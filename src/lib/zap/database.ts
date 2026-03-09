import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import path from 'path';
import fs from 'fs';

// Database path remains in the data folder of the root project
const DB_PATH = path.join(process.cwd(), 'data', 'rochazap.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: any;

export function getDatabase() {
  try {
    if (!db) {
      db = new Database(DB_PATH);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
      initializeDatabase(db);
    }
    return db;
  } catch (error) {
    console.error('[DB] CRITICAL ERROR:', error);
    throw error;
  }
}

function initializeDatabase(db: any) {
  // Initial schema creation (already has logic from Rocha Zap)
  db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo_url TEXT,
        custom_name TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        phone TEXT NOT NULL,
        name TEXT,
        pushname TEXT,
        profile_pic TEXT,
        tags TEXT DEFAULT '[]',
        notes TEXT DEFAULT '',
        qualified INTEGER DEFAULT 0,
        lead_score INTEGER DEFAULT 0,
        agent_type TEXT DEFAULT 'success',
        is_blocked INTEGER DEFAULT 0,
        first_contact TEXT,
        last_contact TEXT,
        total_messages INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(tenant_id, phone)
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        channel TEXT DEFAULT 'whatsapp',
        status TEXT DEFAULT 'active',
        current_agent TEXT DEFAULT 'success',
        is_human_takeover INTEGER DEFAULT 0,
        human_takeover_until TEXT,
        summary TEXT DEFAULT '',
        sentiment TEXT DEFAULT 'neutral',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (contact_id) REFERENCES contacts(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        contact_id TEXT,
        channel TEXT DEFAULT 'whatsapp',
        sender TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        content TEXT NOT NULL,
        media_url TEXT,
        media_type TEXT,
        is_from_bot INTEGER DEFAULT 0,
        is_from_human INTEGER DEFAULT 0,
        agent_type TEXT,
        tokens_used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (contact_id) REFERENCES contacts(id)
      );

      CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        content TEXT NOT NULL,
        source_file TEXT,
        tags TEXT DEFAULT '[]',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        system_prompt TEXT NOT NULL,
        temperature REAL DEFAULT 0.7,
        max_tokens INTEGER DEFAULT 500,
        is_active INTEGER DEFAULT 1,
        trigger_keywords TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(tenant_id, type)
      );

      CREATE TABLE IF NOT EXISTS settings (
        tenant_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'general',
        updated_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (tenant_id, key)
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        contact_id TEXT,
        contact_name TEXT,
        contact_phone TEXT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration INTEGER DEFAULT 30,
        status TEXT DEFAULT 'pending',
        agent_type TEXT DEFAULT 'commercial',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

  // Master seed
  const masterTenantId = 'tenant-master';
  db.prepare("INSERT OR IGNORE INTO tenants (id, name, slug) VALUES (?, ?, ?)")
    .run(masterTenantId, 'Master Admin', 'master');

  // Seed Agents if empty
  const agentCount = db.prepare("SELECT count(*) as count FROM agents").get().count;
  if (agentCount === 0) {
    console.log('[DB] Seeding default agents...');
    const agents = [
      { id: 'agent-comercial', name: 'COMERCIAL', type: 'commercial', desc: 'Focado em vendas e conversão.', prompt: 'Você é o Agente Comercial da Rocha. Seu foco é converter leads em clientes. Seja persuasivo e profissional.' },
      { id: 'agent-qualificador', name: 'QUALIFICADOR', type: 'qualifier', desc: 'Identifica o perfil do lead.', prompt: 'Você é o Agente Qualificador da Rocha. Identifique se o lead possui orçamento, autoridade e necessidade.' },
      { id: 'agent-sucesso', name: 'SUCESSO DO CLIENTE', type: 'success', desc: 'Suporte e relacionamento.', prompt: 'Você é o Agente de Sucesso do Cliente. Resolva dúvidas com empatia e agilidade.' }
    ];

    for (const a of agents) {
      db.prepare(`
        INSERT INTO agents (id, tenant_id, name, type, description, system_prompt, temperature, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 0.7, 1)
      `).run(a.id, masterTenantId, a.name, a.type, a.desc, a.prompt);
    }
  }

  // Seed Default Settings
  db.prepare("INSERT OR IGNORE INTO settings (tenant_id, key, value, category) VALUES (?, ?, ?, ?)")
    .run(masterTenantId, 'auto_reply_audio', 'false', 'ai_behavior');

  // Seed Knowledge Base if empty
  const kbCount = db.prepare("SELECT count(*) as count FROM knowledge_base").get().count;
  if (kbCount === 0) {
    console.log('[DB] Seeding default knowledge base...');
    const items = [
      { title: 'Sobre a Rocha', cat: 'Institucional', content: 'A Rocha é líder em automação Inteligente para negócios.' },
      { title: 'Preços Rocha Zap', cat: 'Vendas', content: 'Planos a partir de R$ 299/mês.' },
      { title: 'Suporte Técnico', cat: 'Suporte', content: 'Atendimento via WhatsApp ou Ticket.' }
    ];
    for (const item of items) {
      db.prepare(`INSERT INTO knowledge_base (tenant_id, title, category, content) VALUES (?, ?, ?, ?)`)
        .run(masterTenantId, item.title, item.cat, item.content);
    }
  }
}

export default getDatabase;

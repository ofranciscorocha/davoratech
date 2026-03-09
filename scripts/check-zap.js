import { getDatabase } from '../src/lib/zap/database.js';

async function checkZapStatus() {
    try {
        const db = getDatabase();

        console.log('--- AGENTS ---');
        const agents = db.prepare('SELECT * FROM agents').all();
        console.table(agents);

        console.log('\n--- KNOWLEDGE BASE ---');
        const knowledge = db.prepare('SELECT * FROM knowledge_base').all();
        console.table(knowledge);

        console.log('\n--- SETTINGS ---');
        const settings = db.prepare('SELECT * FROM settings').all();
        console.table(settings);

    } catch (error) {
        console.error('Error checking Zap status:', error);
    }
}

checkZapStatus();

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/zap/database';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const db = getDatabase();

        const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);

        if (user) {
            return NextResponse.json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    tenantId: user.tenant_id
                }
            });
        }

        return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

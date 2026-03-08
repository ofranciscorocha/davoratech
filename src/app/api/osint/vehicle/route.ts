import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Informe a placa, chassi ou motor.' },
                { status: 400 }
            );
        }

        const cleanQuery = query.trim().toUpperCase();

        const scriptPath = path.join(process.cwd(), 'scripts', 'osint', 'vehicle_lookup.py');
        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json(
                { error: 'Script de consulta veicular não encontrado.' },
                { status: 503 }
            );
        }

        const isWindows = process.platform === 'win32';
        const pythonExecutable = isWindows
            ? path.join(process.cwd(), '.venv', 'Scripts', 'python.exe')
            : path.join(process.cwd(), '.venv', 'bin', 'python');

        if (!fs.existsSync(pythonExecutable)) {
            return NextResponse.json(
                { error: 'Ambiente Python não configurado.' },
                { status: 500 }
            );
        }

        console.log(`[OSINT] Vehicle lookup: ${cleanQuery}`);

        const { stdout, stderr } = await execPromise(
            `"${pythonExecutable}" "${scriptPath}" "${cleanQuery}"`,
            { timeout: 30000 }
        );

        if (stderr && !stderr.includes('Warning')) {
            console.error(`[Vehicle Script Error]: ${stderr}`);
        }

        try {
            const result = JSON.parse(stdout);
            if (result.error) {
                return NextResponse.json({ error: result.error }, { status: 400 });
            }
            return NextResponse.json(result);
        } catch (parseError) {
            console.error(`[Vehicle Parse Error]: ${stdout}`);
            return NextResponse.json(
                { error: 'Erro ao processar dados da consulta veicular.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        if (error.stdout) {
            try {
                const result = JSON.parse(error.stdout);
                return NextResponse.json(result);
            } catch (e) { /* not JSON */ }
        }

        console.error(`[Vehicle Error]: ${error.message}`);
        return NextResponse.json(
            { error: 'Erro interno na consulta veicular.' },
            { status: 500 }
        );
    }
}

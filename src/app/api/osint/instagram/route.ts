import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const { profile } = await request.json();

        if (!profile) {
            return NextResponse.json(
                { error: 'Perfil não fornecido' },
                { status: 400 }
            );
        }

        // Clean username (remove @ and domain if full URL)
        let username = profile;
        if (username.includes('instagram.com/')) {
            username = username.split('instagram.com/')[1].split('/')[0].split('?')[0];
        }
        username = username.replace('@', '').trim();

        // Verify if Python script exists
        const scriptPath = path.join(process.cwd(), 'scripts', 'osint', 'insta_scraper.py');
        if (!fs.existsSync(scriptPath)) {
            console.error(`Script não encontrado: ${scriptPath}`);
            return NextResponse.json(
                { error: 'Serviço de OSINT indisponível no momento. Script não encontrado.' },
                { status: 503 }
            );
        }

        console.log(`[OSINT] Iniciando raspagem para o perfil: ${username}`);

        // Determine the path to the python executable in the local .venv
        const isWindows = process.platform === 'win32';
        const pythonExecutable = isWindows
            ? path.join(process.cwd(), '.venv', 'Scripts', 'python.exe')
            : path.join(process.cwd(), '.venv', 'bin', 'python');

        if (!fs.existsSync(pythonExecutable)) {
            console.error(`Python venv não encontrado: ${pythonExecutable}`);
            return NextResponse.json(
                { error: 'Ambiente Python não configurado.' },
                { status: 500 }
            );
        }

        // Execute Python script
        // Using an arbitrary timeout to prevent hanging the server
        const { stdout, stderr } = await execPromise(`"${pythonExecutable}" "${scriptPath}" ${username}`, { timeout: 45000 });

        if (stderr && !stderr.includes('Warning')) {
            console.error(`[OSINT Script Error]: ${stderr}`);
            // Don't fail immediately, sometimes stderr has non-fatal warnings from Python libs
        }

        try {
            const result = JSON.parse(stdout);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error(`[OSINT Parse Error]: Failed to parse Python output: ${stdout}`);
            return NextResponse.json(
                { error: 'Erro ao processar dados. O perfil pode ser privado ou o Instagram bloqueou a requisição.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        // If the process failed but produced output, try to parse it
        if (error.stdout) {
            try {
                const result = JSON.parse(error.stdout);
                return NextResponse.json(result);
            } catch (e) {
                // Not JSON
            }
        }

        console.error(`[OSINT Error]: ${error.message}`);
        return NextResponse.json(
            {
                error: error.message.includes('timeout')
                    ? 'A busca demorou muito. O Instagram pode estar instável ou o perfil é muito grande.'
                    : 'Erro interno do servidor ao processar a investigação.'
            },
            { status: 500 }
        );
    }
}

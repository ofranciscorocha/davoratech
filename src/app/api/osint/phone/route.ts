import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const { number } = await request.json();

        if (!number) {
            return NextResponse.json(
                { error: 'Número não fornecido' },
                { status: 400 }
            );
        }

        // Verify if Python script exists
        const scriptPath = path.join(process.cwd(), 'scripts', 'osint', 'phone_lookup.py');
        if (!fs.existsSync(scriptPath)) {
            console.error(`Script não encontrado: ${scriptPath}`);
            return NextResponse.json(
                { error: 'Serviço de Phone Trace indisponível.' },
                { status: 503 }
            );
        }

        // Determine the path to the python executable
        const isWindows = process.platform === 'win32';
        const pythonExecutable = isWindows
            ? path.join(process.cwd(), '.venv', 'Scripts', 'python.exe')
            : path.join(process.cwd(), '.venv', 'bin', 'python');

        if (!fs.existsSync(pythonExecutable)) {
            return NextResponse.json(
                { error: 'Ambiente de inteligência Python não configurado.' },
                { status: 500 }
            );
        }

        // Execute Python script
        const { stdout, stderr } = await execPromise(`"${pythonExecutable}" "${scriptPath}" ${number}`, { timeout: 15000 });

        if (stderr) {
            console.error(`[Phone OSINT Script Error]: ${stderr}`);
        }

        try {
            const result = JSON.parse(stdout);
            return NextResponse.json(result);
        } catch (parseError) {
            return NextResponse.json(
                { error: 'Erro ao processar dados de telecomunicações.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error(`[Phone API Error]: ${error.message}`);
        return NextResponse.json(
            { error: 'Erro interno no Signal Intercept Protocol.' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import process from 'process';

interface VehicleData {
    placa: string;
    marca: string;
    modelo: string;
    subModelo: string;
    versao: string;
    ano: string;
    anoModelo: string;
    cor: string;
    municipio: string;
    uf: string;
    situacao: string;
    chassi: string;
    dataAtualizacao: string;
    codigoRetorno: string;
    mensagemRetorno: string;
    extra: Record<string, string>;
    fipe?: FipeData;
}

interface FipeData {
    codigoFipe: string;
    valor: string;
    marca: string;
    modelo: string;
    anoModelo: number;
    combustivel: string;
    mesReferencia: string;
    dataConsulta: string;
}

const cache = new Map<string, { data: VehicleData; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 min cache for scraped data

const PLATE_FORMATS = [
    /^[A-Z]{3}[0-9]{4}$/i,
    /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i,
    /^[A-Z]{3}[0-9]{2}[A-Z][0-9]$/i,
];

function isValidPlate(plate: string): boolean {
    return PLATE_FORMATS.some(f => f.test(plate));
}

function cleanPlate(plate: string): string {
    return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

// Emulate a standard Chrome on Windows
const WINDOWS_CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const rawPlate = searchParams.get('placa') || '';
    const plate = cleanPlate(rawPlate);

    if (!plate || !isValidPlate(plate)) {
        return NextResponse.json({ success: false, error: 'Formato de placa inválido' }, { status: 400 });
    }

    const cached = cache.get(plate);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ success: true, source: 'cache', data: cached.data });
    }

    let browser = null;

    try {
        // Launch headless browser pointing to a local chrome installation for better evasion
        browser = await puppeteer.launch({
            executablePath: WINDOWS_CHROME_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Dynamic User Agents to prevent rate limiting
        const UAs = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        ];
        const randomUA = UAs[Math.floor(Math.random() * UAs.length)];

        await page.setUserAgent(randomUA);
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.google.com/'
        });

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR', 'pt', 'en-US', 'en'] });
            // @ts-ignore
            window.chrome = { runtime: {} };
        });

        // Random delay between 500ms and 1500ms before hitting the page to avoid automated burst detection
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 1000) + 500));

        // Disable images & CSS to save bandwidth and speed up
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        let data: any = null;

        try {
            // Attempt 1: Keplaca
            const response = await page.goto(`https://keplaca.com/placa/${plate}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
            if (response && response.status() !== 429 && response.status() !== 403) {
                await page.waitForSelector('table', { timeout: 5000 }).catch(() => { });
                data = await page.evaluate((placaStr) => {
                    const result: any = { placa: placaStr, extra: {} };
                    document.querySelectorAll('td').forEach((td, i, arr) => {
                        if (i % 2 === 0 && arr[i + 1]) {
                            const key = td.innerText.trim().replace(':', '').toUpperCase();
                            const val = arr[i + 1].innerText.trim();
                            if (key.includes('MARCA')) result.marca = val;
                            else if (key.includes('MODELO')) result.modelo = val;
                            else if (key === 'ANO') {
                                if (val.includes('/')) {
                                    const parts = val.split('/');
                                    result.ano = parts[0].trim();
                                    result.anoModelo = parts[1].trim();
                                } else result.ano = result.anoModelo = val;
                            }
                            else if (key.includes('COR')) result.cor = val;
                            else if (key.includes('MUNICÍPIO')) result.municipio = val;
                            else if (key.includes('ESTADO') || key.includes('UF')) result.uf = val;
                            else if (key.includes('SITUAÇÃO')) result.situacao = val;
                            else if (key.includes('CHASSI')) result.chassi = val;
                            else if (key.includes('COMBUSTÍVEL')) result.extra.combustivel = val;
                            else if (key.includes('POTENCIA') || key.includes('POTÊNCIA')) result.extra.potencia = val;
                            else if (key.includes('SEGMENTO')) result.extra.tipo = val;
                        }
                    });
                    const fipeMatch = document.body.innerText.match(/\b\d{5,6}-\d\b/);
                    if (fipeMatch) result.extra.codigoFipe = fipeMatch[0];
                    return result;
                }, plate);
            }
        } catch (e) {
            console.warn(`[ConsultCar] Keplaca failed for ${plate}, trying fallback...`);
        }

        if (!data || (!data.marca && !data.modelo)) {
            // Attempt 2: TabelaFipeBrasil (Different DOM Strategy to bypass minimal CF)
            try {
                await page.goto(`https://www.tabelafipebrasil.com/placa/${plate}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
                await page.waitForSelector('table', { timeout: 5000 }).catch(() => { });
                data = await page.evaluate((placaStr) => {
                    const result: any = { placa: placaStr, extra: {} };
                    document.querySelectorAll('table tr').forEach(tr => {
                        const cols = tr.querySelectorAll('td');
                        if (cols.length >= 2) {
                            const key = cols[0].textContent?.trim().replace(':', '').toUpperCase() || '';
                            const val = cols[1].textContent?.trim() || '';
                            if (key.includes('MARCA')) result.marca = val;
                            else if (key.includes('MODELO')) result.modelo = val;
                            else if (key === 'ANO') {
                                if (val.includes('/')) {
                                    const parts = val.split('/');
                                    result.ano = parts[0].trim();
                                    result.anoModelo = parts[1].trim();
                                } else result.ano = result.anoModelo = val;
                            }
                            else if (key.includes('COR')) result.cor = val;
                            else if (key.includes('MUNICIPIO')) result.municipio = val;
                            else if (key.includes('ESTADO') || key.includes('UF')) result.uf = val;
                            else if (key.includes('SITUAÇÃO')) result.situacao = val;
                            else if (key.includes('CHASSI')) result.chassi = val;
                            else if (typeof key === 'string' && /^[0-9]{5,6}-[0-9]$/.test(key)) {
                                result.extra.codigoFipe = key;
                            }
                        }
                    });
                    return result;
                }, plate);
            } catch (e) {
                console.warn(`[ConsultCar] Fallback also failed for ${plate}`);
            }
        }

        if (!data.marca && !data.modelo) {
            throw new Error('Não foi possível extrair dados reais da placa informada.');
        }

        const vehicleData: VehicleData = {
            placa: plate,
            marca: data.marca || 'DESCONHECIDA',
            modelo: data.modelo || 'DESCONHECIDO',
            subModelo: data.modelo || '',
            versao: `${data.ano || ''}/${data.anoModelo || ''}`,
            ano: data.ano || '',
            anoModelo: data.anoModelo || '',
            cor: data.cor || 'NÃO INFORMADA',
            municipio: data.municipio || '',
            uf: data.uf || '',
            situacao: data.situacao || 'Sem restrição',
            chassi: data.chassi || '***',
            dataAtualizacao: new Date().toISOString(),
            codigoRetorno: '0',
            mensagemRetorno: 'Consulta realizada com sucesso',
            extra: data.extra || {}
        };

        // Attempt to enrich with FIPE data directly based on the extracted fipe code
        const fipeCode = vehicleData.extra?.codigoFipe;
        if (fipeCode && fipeCode.length >= 8) {
            try {
                const fipeRes = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${fipeCode}`, { signal: AbortSignal.timeout(5000) });
                if (fipeRes.ok) {
                    const fipeJson = await fipeRes.json();
                    if (Array.isArray(fipeJson) && fipeJson.length > 0) {
                        const entry = fipeJson[0];
                        vehicleData.fipe = {
                            codigoFipe: entry.codigoFipe || fipeCode,
                            valor: entry.valor || '',
                            marca: entry.marca || '',
                            modelo: entry.modelo || '',
                            anoModelo: entry.anoModelo || 0,
                            combustivel: entry.combustivel || '',
                            mesReferencia: entry.mesReferencia || '',
                            dataConsulta: entry.dataConsulta || '',
                        };
                    }
                }
            } catch (e) { }
        }

        cache.set(plate, { data: vehicleData, timestamp: Date.now() });

        // Cleanup cache
        if (cache.size > 500) {
            const now = Date.now();
            for (const [key, val] of cache) {
                if (now - val.timestamp > CACHE_TTL) cache.delete(key);
            }
        }

        return NextResponse.json({ success: true, source: 'scraper', data: vehicleData });

    } catch (error: any) {
        console.error(`[ConsultCar] Scraper error for ${plate}:`, error.message || error);
        return NextResponse.json(
            { success: false, error: `Falha na consulta: ${error.message || 'Erro interno'}` },
            { status: 500 }
        );
    } finally {
        if (browser) await browser.close();
    }
}

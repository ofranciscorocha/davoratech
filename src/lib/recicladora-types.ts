export type VehicleStatus = 'recebido' | 'em_analise' | 'prensado' | 'certificado_emitido';

export interface Vehicle {
    id: string;
    placa: string;
    modelo: string;
    ano: number;
    chassi: string;
    seguradora: string;
    sinistro: string;
    tipo_sinistro: string;
    local_retirada: string;
    data_retirada: string;
    peso_total: number;
    materiais: {
        sucata_ferrosa: number;
        aluminio: number;
        plastico: number;
        fiacao_eletrica: number;
        vidro: number;
        oleo: number;
        borracha: number;
        tecido_espuma: number;
        bateria: number;
    };
    status: VehicleStatus;
    fotos: string[];
    documentos: { nome: string; dataUrl: string; tipo: string }[];
    historico: { status: VehicleStatus; data: string; observacao: string }[];
    createdAt: string;
    updatedAt: string;
}

export interface AppConfig {
    empresaNome: string;
    empresaCNPJ: string;
    empresaEndereco: string;
    fotosFolderId: string;
    termosFolderId: string;
    numeracaoAtual: number;
    anoAtual: number;
    logoUrl: string;
}

export const STATUS_LABELS: Record<VehicleStatus, string> = {
    recebido: 'Recebido',
    em_analise: 'Em Análise',
    prensado: 'Prensado',
    certificado_emitido: 'Certificado Emitido',
};

export const STATUS_COLORS: Record<VehicleStatus, string> = {
    recebido: '#3B82F6',
    em_analise: '#F59E0B',
    prensado: '#8B5CF6',
    certificado_emitido: '#10B981',
};

export const DEFAULT_CONFIG: AppConfig = {
    empresaNome: 'ROCHA & CASTELO BRANCO LTDA',
    empresaCNPJ: '09.055.117/0001-47',
    empresaEndereco: 'ROD 324 SALVADOR-FEIRA Nº 13225 KM 96 FEIRA DE SANTANA - BA',
    fotosFolderId: '',
    termosFolderId: '',
    numeracaoAtual: 1,
    anoAtual: new Date().getFullYear(),
    logoUrl: '',
};

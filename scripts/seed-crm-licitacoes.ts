import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding CRM and Licitações data...');

    // 1. CRM Leads
    await prisma.crmLead.createMany({
        data: [
            {
                name: 'Carlos Oliveira',
                headline: 'Diretor de Logística @ TransBrasil',
                company: 'TransBrasil Logística',
                location: 'São Paulo, SP',
                email: 'carlos@transbrasil.com',
                phone: '(11) 98888-7777',
                status: 'qualified',
                photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
            },
            {
                name: 'Mariana Santos',
                headline: 'Gerente de Compras @ Indústria Metalúrgica',
                company: 'Metalúrgica S.A.',
                location: 'Curitiba, PR',
                email: 'mariana@metalurgica.com',
                phone: '(41) 99999-8888',
                status: 'new',
                photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
            },
            {
                name: 'Roberto Amaral',
                headline: 'CEO @ TechSolutions',
                company: 'TechSolutions LTDA',
                location: 'Belo Horizonte, MG',
                email: 'roberto@techsolutions.com',
                phone: '(31) 97777-6666',
                status: 'new',
                photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
            }
        ],
    });

    // 2. Licitações Bids
    await prisma.licitacaoBid.createMany({
        data: [
            {
                title: 'Aquisição de Mobiliário Escolar',
                portal: 'Compras.gov.br',
                object: 'Aquisição de mesas e cadeiras para rede municipal de ensino.',
                value: 'R$ 450.000,00',
                match: '98%',
                startDate: new Date('2026-03-20T09:00:00Z'),
                status: 'OPEN',
            },
            {
                title: 'Serviços de Manutenção Predial',
                portal: 'PNCP Nacional',
                object: 'Manutenção preventiva e corretiva de edifícios públicos.',
                value: 'R$ 1.200.000,00',
                match: '92%',
                startDate: new Date('2026-03-25T14:00:00Z'),
                status: 'UPCOMING',
            },
            {
                title: 'Fornecimento de Insumos Hospitalares',
                portal: 'Licitações-e (BB)',
                object: 'Fornecimento de materiais de consumo para hospitais regionais.',
                value: 'R$ 890.000,00',
                match: '85%',
                startDate: new Date('2026-03-15T10:00:00Z'),
                status: 'LIVE',
            }
        ],
    });

    // 3. Licitações Documents (Optional, depends on schema)
    // Assuming a generic approach for documents if needed later.

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

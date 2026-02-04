import { FunnelStage, KPI, Lead, FunnelData, Alert } from './types';

export const KPIS: KPI[] = [
  { id: '1', label: 'Pipeline Total', value: 'R$ 42.5M', change: 12.5, trend: 'up', color: 'border-t-agro-opp text-agro-opp' },
  { id: '2', label: 'Conversão MQL » SAL', value: '38.2%', change: -2.1, trend: 'down', color: 'border-t-red-500 text-red-500' },
  { id: '3', label: 'Ciclo de Vendas', value: '45 dias', change: 5.4, trend: 'up', color: 'border-t-green-500 text-green-500' },
  { id: '4', label: 'Ticket Médio', value: 'R$ 185k', change: 1.2, trend: 'up', color: 'border-t-blue-500 text-blue-500' },
];

export const FUNNEL_DATA: FunnelData[] = [
  { stage: FunnelStage.MQL, count: 2450, value: 0, color: '#7C3AED', conversionRate: 100, avgTimeDays: 2 },
  { stage: FunnelStage.SAL, count: 980, value: 0, color: '#3B82F6', conversionRate: 40, avgTimeDays: 5 },
  { stage: FunnelStage.SQL, count: 320, value: 65000000, color: '#10B981', conversionRate: 32.6, avgTimeDays: 14 },
  { stage: FunnelStage.OPPORTUNITY, count: 115, value: 42500000, color: '#06B6D4', conversionRate: 35.9, avgTimeDays: 24 },
];

// Helper to generate realistic Brazilian agro data
const generateLeads = (count: number): Lead[] => {
  const FIRST_NAMES = ['Roberto', 'Juliana', 'Pedro', 'Carlos', 'Mariana', 'Fernanda', 'Ricardo', 'Lucas', 'Ana', 'Paulo', 'Eduardo', 'Gabriela', 'Luiz', 'Marcos', 'João', 'Antônio'];
  const LAST_NAMES = ['Meneghetti', 'Camargo', 'Rezende', 'Sperotto', 'Totti', 'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Ferreira', 'Almeida', 'Costa'];
  const COMPANIES_PREFIX = ['Fazenda', 'Sítio', 'Agropecuária', 'Granja', 'Estância', 'Grupo'];
  const COMPANIES_SUFFIX = ['Santa Helena', 'Boa Vista', 'Progresso', 'Esperança', 'Vitória', 'São João', 'Aurora', 'Primavera', 'Ouro Verde', 'Bela Vista'];
  const ORIGINS = ['Indicação', 'Evento Agrofel', 'Inbound', 'Facebook', 'Whatsapp', 'Linkedin', 'Field Sales'];
  const REGIONS = ['Passo Fundo', 'Cruz Alta', 'Ijuí', 'Santa Maria', 'Bagé', 'Pelotas', 'Uruguaiana', 'Santo Ângelo'];

  return Array.from({ length: count }).map((_, i) => {
    // Distribute stages somewhat realistically
    const rand = Math.random();
    let stage = FunnelStage.MQL;
    if (rand > 0.8) stage = FunnelStage.OPPORTUNITY;
    else if (rand > 0.6) stage = FunnelStage.SQL;
    else if (rand > 0.4) stage = FunnelStage.SAL;

    const score = Math.floor(Math.random() * 60) + 40; // 40-100
    
    return {
      id: `gen-${i}`,
      name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      company: `${COMPANIES_PREFIX[Math.floor(Math.random() * COMPANIES_PREFIX.length)]} ${COMPANIES_SUFFIX[Math.floor(Math.random() * COMPANIES_SUFFIX.length)]}`,
      stage: stage,
      score: score,
      ticket: stage === FunnelStage.MQL ? 0 : Math.floor(Math.random() * 500000) + 50000,
      lastInteractionDays: Math.floor(Math.random() * 30),
      origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)],
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    };
  });
};

const STATIC_LEADS: Lead[] = [
  { id: '1', name: 'Roberto Meneghetti', company: 'Fazenda Santa Helena', stage: FunnelStage.OPPORTUNITY, score: 95, ticket: 450000, lastInteractionDays: 1, origin: 'Indicação', region: 'Passo Fundo' },
  { id: '2', name: 'Juliana Camargo', company: 'AgroSul Grãos', stage: FunnelStage.OPPORTUNITY, score: 88, ticket: 320000, lastInteractionDays: 3, origin: 'Evento Agrofel', region: 'Cruz Alta' },
  { id: '3', name: 'Pedro Rezende', company: 'Sementes Rezende', stage: FunnelStage.SQL, score: 72, ticket: 150000, lastInteractionDays: 8, origin: 'Inbound', region: 'Ijuí' },
  { id: '4', name: 'Carlos Sperotto', company: 'Granja do Sol', stage: FunnelStage.MQL, score: 45, ticket: 0, lastInteractionDays: 12, origin: 'Facebook', region: 'Santa Maria' },
  { id: '5', name: 'Mariana Totti', company: 'Fazenda Boa Vista', stage: FunnelStage.SAL, score: 65, ticket: 0, lastInteractionDays: 2, origin: 'Whatsapp', region: 'Bagé' },
];

export const LEADS_MOCK: Lead[] = [...STATIC_LEADS, ...generateLeads(80)];

export const ALERTS: Alert[] = [
  { id: '1', type: 'critical', message: 'Leads > 7 dias sem interação', metric: '14 leads' },
  { id: '2', type: 'warning', message: 'Oportunidades travadas > 14 dias', metric: 'R$ 2.4M em risco' },
  { id: '3', type: 'info', message: 'Concentração em MQL', metric: '68% da base' },
];
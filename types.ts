export enum FunnelStage {
  MQL = 'MQL',
  SAL = 'SAL',
  SQL = 'SQL',
  OPPORTUNITY = 'OPORTUNIDADE'
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string; // Fazenda/Agroindústria
  avatar?: string;
  stage: FunnelStage;
  score: number;
  ticket: number;
  lastInteractionDays: number;
  origin: string;
  region: string;
}

export interface FunnelData {
  stage: FunnelStage;
  count: number;
  value: number;
  color: string;
  conversionRate: number;
  avgTimeDays: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  metric: string;
}

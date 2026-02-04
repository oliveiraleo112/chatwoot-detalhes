import React, { useState, useEffect } from 'react';
import { KPIS, FUNNEL_DATA, LEADS_MOCK, ALERTS } from './data';
import { FunnelStage } from './types';
import Sidebar from './components/Sidebar';
import Funnel3D from './components/Funnel3D';
import DrillDown from './components/DrillDown';
import { HelpIcon, Modal } from './components/Shared';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

function App() {
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  
  // State for generic detail modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: <></> });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handler to open generic modals for KPIs and Charts
  const openDetail = (title: string, type: string) => {
    setModalContent({
      title,
      body: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Esta é uma visão detalhada do indicador <strong>{title}</strong>. 
            Aqui você encontraria tabelas históricas, quebra por vendedor, análise de cohort e exportação de dados.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
             <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Análise de IA (Simulada)</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">
               O indicador apresenta tendência {type === 'up' ? 'positiva' : 'negativa'} nos últimos 30 dias. 
               Recomendamos focar na região de Passo Fundo para otimizar este resultado.
             </p>
          </div>
          {/* Mock Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Semana</th>
                  <th className="px-6 py-3">Valor</th>
                  <th className="px-6 py-3">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                  <td className="px-6 py-4">Semana 10</td>
                  <td className="px-6 py-4">R$ 1.2M</td>
                  <td className="px-6 py-4 text-green-500">+5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                  <td className="px-6 py-4">Semana 09</td>
                  <td className="px-6 py-4">R$ 1.1M</td>
                  <td className="px-6 py-4 text-red-500">-2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans pl-[280px] transition-colors duration-300">
      <Sidebar />
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalContent.title}>
        {modalContent.body}
      </Modal>

      <main className="max-w-[1600px] mx-auto">
        
        {/* Glass Header */}
        <div className="sticky top-0 z-20 glass-header px-8 py-6 mb-8 flex justify-between items-center transition-all">
          <div className="cursor-pointer hover:opacity-80" onClick={() => openDetail('Configurações do Dashboard', 'neutral')}>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Pipeline de Vendas
              <HelpIcon text="Painel principal de Revenue Operations." />
            </h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-wide">Safra 2024/2025 • Atualizado há 15min</p>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Intelligent Alerts Scorecard (Clickable) */}
             <div className="flex gap-3">
              {ALERTS.map(alert => (
                <div 
                  key={alert.id} 
                  onClick={() => openDetail(`Detalhes do Alerta: ${alert.message}`, 'warning')}
                  className={`glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border-l-4 shadow-sm cursor-pointer hover:brightness-95 active:scale-95 transition-all ${
                    alert.type === 'critical' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' : 
                    alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10' : 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'critical' ? 'bg-red-500 animate-pulse' : 
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 opacity-80 flex items-center gap-1">
                      {alert.message}
                      <HelpIcon text="Clique para ver a lista de leads afetados." />
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">{alert.metric}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-agro-sql transition-all hover:scale-105"
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className="px-8 pb-12">
          {/* KPIs - Clickable Cards */}
          <div className="grid grid-cols-4 gap-8 mb-12">
            {KPIS.map(kpi => (
              <div 
                key={kpi.id} 
                onClick={() => openDetail(kpi.label, kpi.trend)}
                className={`
                  relative overflow-hidden rounded-2xl p-6 cursor-pointer
                  bg-white dark:bg-agro-card 
                  dark:bg-gradient-to-b dark:from-agro-card dark:to-agro-cardDark 
                  shadow-premium hover:shadow-2xl hover:-translate-y-1 active:translate-y-0
                  border-t-4 ${kpi.color.split(' ')[0]} 
                  transition-all duration-300 smooth-transition group
                `}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-full text-gray-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <p className="text-sm font-semibold tracking-wide text-gray-500 dark:text-slate-400 uppercase letter-spacing-wide">{kpi.label}</p>
                    <HelpIcon text={`Clique para detalhar: ${kpi.label}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl ${
                    kpi.trend === 'up' 
                      ? 'bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                      : kpi.trend === 'down' 
                        ? 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                        : 'bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                  }`}>
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '•'} {Math.abs(kpi.change)}%
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{kpi.value}</h3>
                <div className="mt-2 text-xs text-gray-400 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">vs. mês anterior</div>
              </div>
            ))}
          </div>

          {/* Main Funnel Section */}
          <div className="bg-white dark:bg-agro-card rounded-3xl shadow-premium border border-gray-100 dark:border-slate-700/50 p-10 mb-12 relative overflow-hidden transition-colors">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agro-mql via-agro-sal to-agro-opp opacity-70" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
               <div className="cursor-pointer" onClick={() => openDetail('Funil de Conversão', 'up')}>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   Funil de Conversão
                   <HelpIcon text="Fluxo de leads desde a entrada até o fechamento. Clique nas etapas para ver os leads." />
                 </h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Snapshot diário em tempo real</p>
               </div>
               <button 
                 onClick={() => openDetail('Histórico do Funil', 'neutral')}
                 className="text-sm text-agro-sal dark:text-agro-sal font-semibold hover:underline flex items-center gap-1"
               >
                 Ver histórico completo
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
               </button>
            </div>
            
            <Funnel3D 
              data={FUNNEL_DATA} 
              selectedStage={selectedStage}
              onStageClick={setSelectedStage} 
            />
          </div>

          {/* Secondary Charts Grid - Made Clickable */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Conversion Benchmark */}
            <div 
              onClick={() => openDetail('Taxa de Conversão por Etapa', 'down')}
              className="bg-white dark:bg-agro-card rounded-2xl p-8 shadow-premium border border-gray-100 dark:border-slate-700/50 transition-all hover:border-agro-sql/30 cursor-pointer hover:shadow-2xl group"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                <span className="w-1 h-6 bg-agro-sql rounded-full"></span>
                Taxa de Conversão vs Meta 2025
                <HelpIcon text="Benchmark de conversão comparado com a meta estipulada para o ano fiscal." />
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </div>
              </h3>
              <div className="h-[280px] pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={FUNNEL_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" width={100} tick={{fontSize: 12, fontWeight: 600, fill: darkMode ? '#94a3b8' : '#64748B'}} />
                    <ReferenceLine x={35} stroke="#10B981" strokeDasharray="4 4" label={{ position: 'top', value: 'Meta (35%)', fill: '#10B981', fontSize: 11, fontWeight: 700 }} />
                    <defs>
                      {FUNNEL_DATA.map((entry, index) => (
                        <linearGradient key={`grad-bar-${index}`} id={`grad-bar-${index}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Bar dataKey="conversionRate" barSize={16} radius={[0, 8, 8, 0]}>
                      {FUNNEL_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#grad-bar-${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time in Stage */}
            <div 
              onClick={() => openDetail('Tempo Médio por Etapa', 'neutral')}
              className="bg-white dark:bg-agro-card rounded-2xl p-8 shadow-premium border border-gray-100 dark:border-slate-700/50 transition-all hover:border-agro-sal/30 cursor-pointer hover:shadow-2xl group"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                <span className="w-1 h-6 bg-agro-sal rounded-full"></span>
                Tempo Médio por Etapa (Dias)
                <HelpIcon text="Média de dias que um lead permanece estagnado em cada etapa." />
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </div>
              </h3>
              <div className="space-y-8">
                {FUNNEL_DATA.map((item) => (
                  <div key={item.stage} className="flex items-center">
                    <div className="w-24 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.stage}</div>
                    <div className="flex-1 bg-gray-100 dark:bg-slate-700/50 rounded-full h-4 overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full relative group transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${Math.min(item.avgTimeDays * 3, 100)}%`, 
                          backgroundColor: item.color 
                        }}
                      >
                        {/* Shimmer Effect */}
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-bold text-gray-700 dark:text-gray-200">{item.avgTimeDays}d</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <DrillDown 
        isOpen={!!selectedStage} 
        onClose={() => setSelectedStage(null)} 
        stage={selectedStage}
        leads={LEADS_MOCK}
      />
    </div>
  );
}

export default App;
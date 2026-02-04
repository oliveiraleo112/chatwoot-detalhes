import React from 'react';
import { motion } from 'framer-motion';
import { FunnelStage, Lead } from '../types';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DrillDownProps {
  isOpen: boolean;
  onClose: () => void;
  stage: FunnelStage | null;
  leads: Lead[];
}

const DrillDown: React.FC<DrillDownProps> = ({ isOpen, onClose, stage, leads }) => {
  const filteredLeads = leads.filter(l => l.stage === stage).sort((a, b) => b.score - a.score);

  // Mock timeline data for the mini chart
  const timelineData = [
    { day: 'D-6', leads: 40 },
    { day: 'D-5', leads: 45 },
    { day: 'D-4', leads: 38 },
    { day: 'D-3', leads: 52 },
    { day: 'D-2', leads: 58 },
    { day: 'D-1', leads: 65 },
    { day: 'Hoje', leads: 72 },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[420px] bg-white dark:bg-[#0f172a] shadow-2xl z-50 border-l border-gray-200 dark:border-slate-800 flex flex-col"
    >
      {stage && (
        <>
          <div className="p-6 flex-none border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stage}</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Detalhamento da etapa</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Action Header */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 bg-agro-sal text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all hover:scale-[1.02]">
                Atribuir em Massa
              </button>
              <button className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Exportar
              </button>
            </div>

            {/* Mini Chart */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Volume Recente (7 Dias)</h3>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Leads List - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0b1120] custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Leads ({filteredLeads.length})
              </h3>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400 font-medium">Ordenar por:</span>
                <span className="font-bold text-agro-sal cursor-pointer hover:underline">Score</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                <div key={lead.id} className="group p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg dark:hover:shadow-black/40 transition-all cursor-pointer hover:border-agro-sal/40 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800 ${
                        lead.score >= 80 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                        lead.score >= 50 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-br from-red-400 to-red-600'
                      }`}>
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-agro-sal transition-colors">{lead.name}</h4>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        lead.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        lead.score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {lead.score} pts
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 mt-1">{lead.lastInteractionDays}d sem contato</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
                     <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                       <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                       {lead.region}
                     </span>
                     {lead.ticket > 0 && <span className="text-xs font-bold text-gray-700 dark:text-gray-200">R$ {lead.ticket.toLocaleString()}</span>}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Nenhum lead nesta etapa.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DrillDown;
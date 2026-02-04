import React from 'react';
import { HelpIcon } from './Shared';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-slate-800 p-6 flex flex-col z-30 transition-colors duration-300">
      <div className="mb-10 flex items-center gap-3 px-2 cursor-pointer hover:opacity-80 transition-opacity" title="Voltar para Home">
        <div className="w-10 h-10 bg-gradient-to-br from-agro-sal to-agro-mql rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">Agrofel</h1>
          <span className="text-xs font-bold text-agro-sql uppercase tracking-widest">Sales OS</span>
        </div>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Date Filter */}
        <div className="space-y-3 group">
          <div className="flex items-center">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2 group-hover:text-agro-sal transition-colors">Período</label>
            <HelpIcon text="Filtra todas as métricas pela data de criação ou atualização do lead." />
          </div>
          <div className="relative">
            <select className="w-full p-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-agro-sal focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800">
              <option>Safra 24/25 (Atual)</option>
              <option>Último Trimestre</option>
              <option>Este Mês</option>
              <option>Personalizado</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-3">
          <div className="flex items-center">
             <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Região (IBGE)</label>
             <HelpIcon text="Baseado na localização da propriedade rural cadastrada no CRM." />
          </div>
          <div className="space-y-2">
            {['Passo Fundo', 'Cruz Alta', 'Ijuí', 'Santa Maria'].map((region, idx) => (
              <label key={region} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer w-5 h-5 rounded border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 text-agro-sql focus:ring-agro-sql transition-all checked:bg-agro-sql checked:border-agro-sql" defaultChecked={idx < 2} />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Line */}
        <div className="space-y-3">
          <div className="flex items-center">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Linha de Produto</label>
            <HelpIcon text="Filtra oportunidades que contêm produtos destas categorias." />
          </div>
           <div className="relative">
            <select className="w-full p-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-agro-sal focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800">
              <option>Todos os Produtos</option>
              <option>Sementes</option>
              <option>Defensivos</option>
              <option>Fertilizantes</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-gray-100 dark:border-slate-800/80"></div>

        {/* Health Status */}
        <div className="space-y-3">
          <div className="flex items-center">
             <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Health Status</label>
             <HelpIcon text="Saúde do lead baseada em: dias sem interação e completude do perfil." />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 transition-all uppercase hover:scale-105">Crítico</button>
            <button className="py-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold hover:bg-yellow-100 dark:hover:bg-yellow-500/20 border border-yellow-100 dark:border-yellow-500/20 transition-all uppercase hover:scale-105">Atenção</button>
            <button className="py-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold hover:bg-green-100 dark:hover:bg-green-500/20 border border-green-100 dark:border-green-500/20 transition-all uppercase hover:scale-105">Ok</button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => alert('Abrir perfil do usuário')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-agro-mql to-agro-sql flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-700 shadow-sm">
            SR
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Senior RevOps</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@agrofel.com</p>
          </div>
          <div className="ml-auto text-gray-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
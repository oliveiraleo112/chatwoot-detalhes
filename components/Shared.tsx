import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

// --- Help/Info Icon with Portal Tooltip ---
interface HelpIconProps {
  text: string;
}

export const HelpIcon: React.FC<HelpIconProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placeAbove: true });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      // Check distance from top of screen to decide placement
      const placeAbove = rect.top > 120; 
      
      setCoords({
        top: placeAbove ? rect.top - 8 : rect.bottom + 8, // 8px gap
        left: rect.left + rect.width / 2,
        placeAbove
      });
      setIsVisible(true);
    }
  };

  return (
    <>
      <div 
        ref={iconRef}
        className="relative inline-flex items-center justify-center ml-2 z-10 w-4 h-4 rounded-full border border-gray-400 dark:border-slate-500 text-gray-400 dark:text-slate-500 text-[10px] font-bold cursor-help hover:border-agro-sal hover:text-agro-sal hover:bg-agro-sal/10 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
      >
        ?
      </div>
      
      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none flex flex-col items-center"
          style={{ 
            top: coords.top, 
            left: coords.left,
            transform: coords.placeAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
          }}
        >
          {/* Tooltip Content */}
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium py-2 px-3 rounded-lg shadow-xl max-w-[220px] text-center animate-[fadeIn_0.2s_ease-out]">
            {text}
          </div>
          
          {/* Arrow */}
          {coords.placeAbove && (
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900 dark:border-t-white -mt-[1px]"></div>
          )}
          {!coords.placeAbove && (
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-900 dark:border-b-white -mb-[1px] order-first"></div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

// --- Generic Detail Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900">Fechar</button>
          <button className="px-4 py-2 text-sm font-bold bg-agro-sal text-white rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/20">Ver Relatório Completo</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
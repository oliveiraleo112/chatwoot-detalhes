import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelStage, FunnelData } from '../types';

interface Funnel3DProps {
  data: FunnelData[];
  onStageClick: (stage: FunnelStage) => void;
  selectedStage: FunnelStage | null;
}

const Funnel3D: React.FC<Funnel3DProps> = ({ data, onStageClick, selectedStage }) => {
  const [hoveredStage, setHoveredStage] = useState<FunnelStage | null>(null);

  // Geometry calculations for a trapezoidal funnel
  const width = 600;
  const height = 400;
  const topWidth = 500;
  const bottomWidth = 100;
  const gap = 8;
  const totalSteps = data.length;
  const stepHeight = (height - (gap * (totalSteps - 1))) / totalSteps;

  return (
    <div className="relative w-full flex justify-center py-8 funnel-3d-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {data.map((item, index) => (
            <linearGradient key={`grad-${index}`} id={`grad-${item.stage}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={item.color} stopOpacity="0.9" />
              {/* Horizontal gradient shift for luminosity (+15% simulated via lighter opacity/blend) */}
              <stop offset="100%" stopColor={item.color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>

        <AnimatePresence>
          {data.map((item, index) => {
            // Calculate trapezoid coordinates
            const y1 = index * (stepHeight + gap);
            const y2 = y1 + stepHeight;
            
            const w1 = topWidth - ((topWidth - bottomWidth) * (index / totalSteps));
            const w2 = topWidth - ((topWidth - bottomWidth) * ((index + 1) / totalSteps));
            
            const x1 = (width - w1) / 2;
            const x2 = (width - w2) / 2;
            
            const points = `${x1},${y1} ${x1 + w1},${y1} ${x2 + w2},${y2} ${x2},${y2}`;
            
            const isSelected = selectedStage === item.stage;
            const isHovered = hoveredStage === item.stage;

            return (
              <g 
                key={item.stage} 
                onClick={() => onStageClick(item.stage)}
                onMouseEnter={() => setHoveredStage(item.stage)}
                onMouseLeave={() => setHoveredStage(null)}
                className="cursor-pointer funnel-slice"
              >
                {/* 3D Depth Effect (Shadow Layer) */}
                <motion.polygon
                  points={points}
                  fill="rgba(0,0,0,0.3)"
                  transform={`translate(0, 12)`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />

                {/* Main Shape */}
                <motion.polygon
                  points={points}
                  fill={`url(#grad-${item.stage})`}
                  stroke="white"
                  strokeWidth={isSelected ? 3 : 0.5}
                  strokeOpacity={0.2}
                  rx="4" // SVG polygon doesn't support rx directly, handled by style if rect, here purely visual
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: isHovered || isSelected ? 1.05 : 1,
                    opacity: 1,
                    filter: isHovered ? 'url(#glow)' : 'none',
                    strokeOpacity: isHovered ? 0.8 : 0.2
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Data Labels - Left (Count) */}
                <foreignObject x={x1 - 120} y={y1 + (stepHeight/2) - 25} width="100" height="50">
                  <div className="text-right pr-4 h-full flex flex-col justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest transition-colors">{item.stage}</span>
                    <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight transition-colors drop-shadow-md">{item.count.toLocaleString('pt-BR')}</span>
                  </div>
                </foreignObject>

                {/* Data Labels - Right (Conversion) */}
                <foreignObject x={x1 + w1 + 20} y={y1 + (stepHeight/2) - 30} width="160" height="60">
                  <div className="text-left pl-4 h-full flex flex-col justify-center">
                    <div className="flex items-baseline gap-2">
                       <span className="text-gray-900 dark:text-white font-extrabold text-xl transition-colors">{item.conversionRate}%</span>
                       {index > 0 && <span className="text-[10px] text-gray-400 font-medium">vs anterior</span>}
                    </div>
                    {item.value > 0 && (
                      <div className="mt-1">
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(item.value)}
                        </span>
                      </div>
                    )}
                  </div>
                </foreignObject>

                {/* Surface Shine/Gloss Effect */}
                <motion.path
                  d={`M ${x1 + 40},${y1} L ${x1 + w1 - 40},${y1} L ${x2 + w2 - 40},${y2} L ${x2 + 40},${y2} Z`}
                  fill="url(#grad-shine)"
                  fillOpacity={0.05}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default Funnel3D;
import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreCircle({ score, size = 56, label }: { score: number, size?: number, label?: string }) {
  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return '#059669';
    if (s >= 50) return '#D97706';
    return '#DC2626';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="#E8E8E6"
            strokeWidth="5" 
            fill="transparent" 
          />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke={getColor(score)} 
            strokeWidth="5" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-semibold text-[#171717]">{score}</span>
      </div>
      {label && <span className="mt-1.5 text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">{label}</span>}
    </div>
  );
}

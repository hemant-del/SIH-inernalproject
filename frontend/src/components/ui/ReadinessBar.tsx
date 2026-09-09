import React from 'react';
import { motion } from 'framer-motion';

export default function ReadinessBar({ score, label, colorScheme = 'navy' }: { score: number, label?: string, colorScheme?: 'navy' | 'success' | 'saffron' }) {
  const colors = {
    navy: 'bg-[#171717]',
    success: 'bg-[#059669]',
    saffron: 'bg-[#D97706]'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#171717]">{label}</span>
          <span className="text-sm font-semibold text-[#171717]">{score}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-[#E8E8E6] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[colorScheme]}`}
        />
      </div>
    </div>
  );
}

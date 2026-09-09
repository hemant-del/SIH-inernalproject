import React from 'react';

export default function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const styles = {
    LOW: 'bg-[#ECFDF5] text-[#059669]',
    MEDIUM: 'bg-[#FFFBEB] text-[#D97706]',
    HIGH: 'bg-[#FEF2F2] text-[#DC2626]'
  };

  const labels = {
    LOW: 'Low risk',
    MEDIUM: 'Medium risk',
    HIGH: 'High risk'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

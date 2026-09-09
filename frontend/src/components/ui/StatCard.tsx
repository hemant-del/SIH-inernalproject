import React from 'react';

interface StatCardProps {
  icon: any;
  value: string | number;
  label: string;
  trend?: string;
}

export default function StatCard({ icon: Icon, value, label, trend }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-[#6B7280]" />
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#171717] tracking-[-0.01em]">{value}</div>
        <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
        {trend && <p className="text-xs text-[#059669] font-medium mt-1">{trend}</p>}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, CheckCircle2, IndianRupee, Clock, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

export default function Schemes() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSchemes()
      .then((data: any[]) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Failed to fetch schemes:', err);
        setError('Failed to load schemes. Is the backend running?');
        setLoading(false);
      });
  }, []);

  const filtered = schemes.filter(s => {
    const term = searchTerm.toLowerCase();
    const purposes: string[] = s.eligible_purposes || [];
    return s.name.toLowerCase().includes(term) || purposes.some((t: string) => t.toLowerCase().includes(term));
  });

  const formatTenure = (months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const rem = months % 12;
      return rem > 0 ? `${years}y ${rem}m` : `${years} years`;
    }
    return `${months} months`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em]">Explore Schemes</h1>
          <p className="text-sm text-[#6B7280] mt-1">Discover government and private credit programs</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E8E6] rounded-md text-sm text-[#171717] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717] transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] rounded-md px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-[#F0F0EE] rounded-lg h-56 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-[#6B7280]">
              No schemes found matching your search.
            </div>
          ) : (
            filtered.map((scheme, i) => (
              <motion.div 
                key={scheme.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-[#E8E8E6] rounded-lg p-5 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#D4D4D2] transition-all duration-150 flex flex-col h-full"
              >
                <h3 className="text-base font-semibold text-[#171717] mb-2">{scheme.name}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-grow">{scheme.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm font-medium text-[#171717]">
                    <IndianRupee className="w-4 h-4 mr-1 text-[#9CA3AF]" />
                    <span>Up to {(scheme.max_loan / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-[#171717]">
                    <Clock className="w-4 h-4 mr-1 text-[#9CA3AF]" />
                    <span>{formatTenure(scheme.max_tenure_months)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded-sm">
                      {scheme.interest_rate}%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(scheme.eligible_purposes || []).map((tag: string) => (
                    <span key={tag} className="text-[11px] font-medium text-[#6B7280] bg-[#F5F5F3] px-2 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-2 text-sm font-medium text-[#171717] bg-[#F5F5F3] hover:bg-[#E8E8E6] rounded-md transition-colors flex items-center justify-center gap-1">
                  View Details <ChevronDown className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

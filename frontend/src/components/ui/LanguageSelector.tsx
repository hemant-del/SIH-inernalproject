import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useAppContext();
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
      <Globe className="w-3.5 h-3.5" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
        className="bg-transparent border-none outline-none cursor-pointer focus:ring-0 font-medium text-[13px] text-[#6B7280] hover:text-[#171717] transition-colors"
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
      </select>
    </div>
  );
}

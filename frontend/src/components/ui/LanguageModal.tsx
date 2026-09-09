import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Globe } from 'lucide-react';

export default function LanguageModal() {
  const [show, setShow] = useState(false);
  const { setLanguage } = useAppContext();

  useEffect(() => {
    const stored = localStorage.getItem('creditgps_lang');
    const dismissed = localStorage.getItem('creditgps_lang_dismissed');
    if (!stored && !dismissed) {
      setShow(true);
    }
  }, []);

  const selectLang = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    localStorage.setItem('creditgps_lang', lang);
    localStorage.setItem('creditgps_lang_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-6">
        <div className="text-center mb-6">
          <Globe className="w-8 h-8 text-[#0D6E4F] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#171717]">Choose Your Language</h2>
          <p className="text-sm text-[#6B7280] mt-1">अपनी भाषा चुनें</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => selectLang('en')}
            className="w-full py-3 px-4 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm font-medium text-[#171717] hover:bg-[#E8E8E6] transition-colors text-left flex items-center justify-between">
            <span>English</span>
            <span className="text-[#6B7280] text-xs">EN</span>
          </button>
          <button onClick={() => selectLang('hi')}
            className="w-full py-3 px-4 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm font-medium text-[#171717] hover:bg-[#E8E8E6] transition-colors text-left flex items-center justify-between">
            <span>हिन्दी</span>
            <span className="text-[#6B7280] text-xs">HI</span>
          </button>
        </div>
      </div>
    </div>
  );
}

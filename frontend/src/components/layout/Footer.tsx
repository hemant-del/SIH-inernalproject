import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[#E8E8E6] bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-[#171717] rounded-[4px] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">C</span>
              </div>
              <span className="font-medium text-sm text-[#171717]">{t('footer.tagline')}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/about" className="text-[#6B7280] hover:text-[#171717] transition-colors">{t('footer.about')}</Link>
              <Link to="/schemes" className="text-[#6B7280] hover:text-[#171717] transition-colors">{t('footer.schemes')}</Link>
              <Link to="/calculator" className="text-[#6B7280] hover:text-[#171717] transition-colors">{t('footer.calculator')}</Link>
              <Link to="/contact" className="text-[#6B7280] hover:text-[#171717] transition-colors">{t('footer.contact')}</Link>
            </div>
          </div>
          <div className="text-[#9CA3AF] text-xs max-w-md text-left md:text-right leading-relaxed">
            <p>{t('footer.disclaimer')}</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} CreditGPS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

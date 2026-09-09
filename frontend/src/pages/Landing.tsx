import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { MessageSquare, Calculator, MapPin, FileCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function Landing() {
  const { t } = useTranslation();
  const [schemeCount, setSchemeCount] = useState(0);

  useEffect(() => {
    api.getSchemes().then((data: any) => {
      setSchemeCount(Array.isArray(data) ? data.length : data?.schemes?.length || 0);
    }).catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#FAFAF8]">
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-[#171717] mb-6">
            {t('hero.title').split('.')[0]}. <span className="text-[#0D6E4F]">{t('hero.title').split('.')[1] || "We'll find the path."}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/ai-talk" className="inline-flex items-center justify-center px-6 py-3 bg-[#171717] text-white hover:bg-[#2D2D2D] rounded-md text-sm font-medium transition-colors">
              {t('btn.talkToAI')} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/schemes" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#171717] border border-[#E8E8E6] hover:bg-[#F5F5F3] rounded-md text-sm font-medium transition-colors">
              {t('btn.explore')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-b border-[#E8E8E6] bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem icon={ShieldCheck} value={schemeCount > 0 ? `${schemeCount}` : '-'} label={t('nav.schemes')} />
          <StatItem icon={MapPin} value="50+" label={t('nav.partners')} />
          <StatItem icon={Calculator} value="3.5%" label="Min Interest" />
          <StatItem icon={CheckCircle2} value="180" label="Max Months" />
        </div>
      </section>

      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em] mb-2">How CreditGPS Works</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto">Your end-to-end companion for securing credit easily and transparently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={MessageSquare} title="1. AI Talk" desc="Chat with our intelligent assistant in your language to discover eligibility and find the best schemes." delay={0} />
            <FeatureCard icon={Calculator} title="2. Smart Analytics" desc="Check affordability, simulate what-if scenarios, and get a clear picture of your financial health." delay={0.15} />
            <FeatureCard icon={FileCheck} title="3. Document Readiness" desc="Upload documents for instant OCR extraction and readiness scoring before applying." delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#171717] text-center px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-white tracking-[-0.01em] mb-6">Ready to find your perfect credit scheme?</h2>
          <Link to="/ai-talk" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#171717] hover:bg-[#F5F5F3] rounded-md text-sm font-medium transition-colors">
            {t('btn.talkToAI')}
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatItem({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="text-center">
      <Icon className="w-5 h-5 text-[#6B7280] mx-auto mb-2" />
      <p className="text-2xl font-semibold text-[#171717]">{value}</p>
      <p className="text-sm text-[#6B7280]">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay = 0 }: { icon: any; title: string; desc: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay }}
      className="bg-white border border-[#E8E8E6] rounded-lg p-6 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all">
      <div className="mb-4"><Icon className="w-5 h-5 text-[#6B7280]" /></div>
      <h3 className="text-lg font-medium text-[#171717] mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

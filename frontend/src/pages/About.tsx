import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Target, Users, Brain, Shield, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#171717] mb-3">{t('about.title')}</h1>
        <p className="text-[#6B7280] text-base leading-relaxed">{t('about.overview')}</p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#171717] mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-[#0D6E4F]" /> {t('about.problemTitle')}</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed">{t('about.problemDesc')}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#171717] mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-[#0D6E4F]" /> {t('about.missionTitle')}</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed">{t('about.missionDesc')}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#171717] mb-4">{t('about.featuresTitle')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Brain, key: 'about.feature1' },
            { icon: CheckCircle2, key: 'about.feature2' },
            { icon: BookOpen, key: 'about.feature3' },
            { icon: Shield, key: 'about.feature4' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="bg-white border border-[#E8E8E6] rounded-lg p-4 flex items-start gap-3">
              <Icon className="w-5 h-5 text-[#0D6E4F] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#171717]">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#171717] mb-3 flex items-center gap-2"><Brain className="w-5 h-5 text-[#0D6E4F]" /> {t('about.aiTitle')}</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed">{t('about.aiDesc')}</p>
      </section>

      <section className="bg-[#FEF9EE] border border-[#F5E6C8] rounded-lg p-5">
        <h2 className="text-lg font-semibold text-[#92400E] mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> {t('about.disclaimerTitle')}</h2>
        <p className="text-sm text-[#92400E]/80 leading-relaxed">{t('about.disclaimerDesc')}</p>
      </section>
    </div>
  );
}

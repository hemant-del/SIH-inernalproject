import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi';

interface CreditProfile {
  purpose?: string;
  business_type?: string;
  loan_amount?: number;
  project_cost?: number;
  annual_income?: number;
  age?: number;
  education_status?: string;
  state?: string;
  district?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  userProfile: CreditProfile | null;
  setUserProfile: (profile: CreditProfile | null) => void;
  recommendations: any[];
  setRecommendations: (recs: any[]) => void;
  selectedScheme: any | null;
  setSelectedScheme: (scheme: any | null) => void;
  selectedPartner: any | null;
  setSelectedPartner: (partner: any | null) => void;
  journeyStep: number;
  advanceJourney: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('creditgps_lang');
    return (stored === 'hi' ? 'hi' : 'en') as Language;
  });
  const [userProfile, setUserProfile] = useState<CreditProfile | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [journeyStep, setJourneyStep] = useState<number>(0);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('creditgps_lang', lang);
  };

  const advanceJourney = () => setJourneyStep((prev) => Math.min(prev + 1, 7));

  return (
    <AppContext.Provider value={{ language, setLanguage, userProfile, setUserProfile, recommendations, setRecommendations, selectedScheme, setSelectedScheme, selectedPartner, setSelectedPartner, journeyStep, advanceJourney }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

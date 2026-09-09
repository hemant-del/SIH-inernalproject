import { useAppContext } from '../context/AppContext';
import en from '../data/i18n/en.json';
import hi from '../data/i18n/hi.json';

const translations: Record<string, any> = { en, hi, hinglish: en };

export const useTranslation = () => {
  const { language } = useAppContext();
  
  const t = (key: string): string => {
    const langData = translations[language] || translations['en'];
    return langData[key] || key;
  };
  
  return { t };
};

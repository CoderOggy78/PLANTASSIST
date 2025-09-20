
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, TranslationKey } from '@/lib/i18n';

type Language = 'en' | 'hi' | 'mr' | 'gu';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LOCALIZATION_STORAGE_KEY = 'plantassist-language';

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LOCALIZATION_STORAGE_KEY) as Language | null;
    if (storedLanguage && ['en', 'hi', 'mr', 'gu'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LOCALIZATION_STORAGE_KEY, lang);
  };
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['en'][key];
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

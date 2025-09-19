
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider, MessageFormatElement } from 'next-intl';

import enMessages from '@/locales/en.json';
import siMessages from '@/locales/si.json';

type Locale = 'en' | 'si';

const messages: Record<Locale, Record<string, string | MessageFormatElement[]>> = {
  en: enMessages,
  si: siMessages,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof enMessages) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale) {
      setLocale(storedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };
  
  const t = (key: keyof typeof enMessages) => {
    const message = (messages[locale] as any)[key] || (messages['en'] as any)[key];
    return message || key;
  };


  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      <IntlProvider messages={messages[locale]} locale={locale}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

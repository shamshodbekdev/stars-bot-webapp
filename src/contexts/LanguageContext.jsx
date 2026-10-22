import { createContext, useContext, useState, useEffect } from 'react';
import uzbek from '../locales/uzbek.json';
import kril from '../locales/kril-uzbek.json';
import russian from '../locales/rus.json';

const translations = {
  uz: uzbek,
  kril: kril,
  ru: russian,
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uz';
  });

  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    return !localStorage.getItem('language');
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageSelector(false);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        showLanguageSelector,
        setShowLanguageSelector,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

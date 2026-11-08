/**
 * i18n: three locales, persisted choice, `t('a.b', { name })` lookups with
 * {placeholder} interpolation. Missing keys fall back to Uzbek, then the key.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import uz from '../locales/uzbek.json';
import kril from '../locales/kril-uzbek.json';
import ru from '../locales/rus.json';
import { storage } from '../utils/storage';

const translations = { uz, kril, ru };
const DEFAULT_LANGUAGE = 'uz';

/** Language list shown in the selector and settings. */
export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", desc: 'Lotin alifbosi', htmlLang: 'uz' },
  { code: 'kril', label: 'Ўзбекча', desc: 'Кирилл алифбоси', htmlLang: 'uz-Cyrl' },
  { code: 'ru', label: 'Русский', desc: 'Русский язык', htmlLang: 'ru' },
];

const LanguageContext = createContext(null);

const lookup = (dict, key) => key.split('.').reduce((obj, k) => obj?.[k], dict);

/**
 * Translate a key in a specific language (independent of the current one).
 * Missing keys fall back to Uzbek, then to the key itself.
 */
export function translate(lang, key, vars) {
  let value = lookup(translations[lang], key) ?? lookup(translations[DEFAULT_LANGUAGE], key);
  if (typeof value !== 'string') return value ?? key;
  if (vars) value = value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
  return value;
}

export function LanguageProvider({ children }) {
  const saved = storage.get('language');
  const [language, setLanguage] = useState(translations[saved] ? saved : DEFAULT_LANGUAGE);
  // First launch: no saved choice yet -> show the language selector
  const [showLanguageSelector, setShowLanguageSelector] = useState(!translations[saved]);

  useEffect(() => {
    const meta = LANGUAGES.find((l) => l.code === language);
    document.documentElement.lang = meta?.htmlLang || 'uz';
  }, [language]);

  const t = useCallback((key, vars) => translate(language, key, vars), [language]);

  const changeLanguage = useCallback((code) => {
    if (!translations[code]) return;
    setLanguage(code);
    storage.set('language', code);
    setShowLanguageSelector(false);
  }, []);

  const value = useMemo(
    () => ({ language, t, changeLanguage, showLanguageSelector }),
    [language, t, changeLanguage, showLanguageSelector],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

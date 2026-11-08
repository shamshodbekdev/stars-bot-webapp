/**
 * First-launch language picker. Texts preview in the highlighted language
 * before the choice is saved.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Languages } from 'lucide-react';
import { LANGUAGES, translate, useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';
import { cn } from '../utils/cn';
import { haptic } from '../lib/telegram';

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const [selected, setSelected] = useState(language);
  const tr = (key) => translate(selected, key);

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-fg text-inverse">
        <Languages size={24} />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{tr('language.title')}</h1>
      <p className="mt-1 text-sm text-muted">{tr('language.subtitle')}</p>

      <div className="mt-8 space-y-2" role="radiogroup">
        {LANGUAGES.map((lang) => {
          const active = lang.code === selected;
          return (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                haptic.select();
                setSelected(lang.code);
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border bg-surface p-4 text-left transition-colors',
                active ? 'border-fg' : 'border-line hover:border-fg/20',
              )}
            >
              <span>
                <span className="block font-medium">{lang.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{lang.desc}</span>
              </span>
              <span
                className={cn(
                  'grid h-6 w-6 place-items-center rounded-full border-2 transition-colors',
                  active ? 'border-fg bg-fg text-inverse' : 'border-fg/20',
                )}
              >
                {active && <Check size={13} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <Button fullWidth size="lg" onClick={() => changeLanguage(selected)}>
          {tr('language.continue')}
        </Button>
      </div>
    </motion.main>
  );
}

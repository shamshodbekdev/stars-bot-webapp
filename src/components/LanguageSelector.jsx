import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'uz', label: "O'zbekcha", desc: "O'zbek tili (lotin)" },
  { code: 'kril', label: "Узбекча", desc: "O'zbek tili (kirill)" },
  { code: 'ru', label: "Русский", desc: "Русский язык" },
];

export default function LanguageSelector() {
  const { changeLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-tg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {t('language.title')}
          </h1>
          <p className="text-sm text-tg-hint">
            {t('language.subtitle')}
          </p>
        </div>

        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full bg-tg-secondaryBg rounded-xl p-4 text-left border border-tg-hint/5 hover:border-tg-hint/20 transition-colors"
            >
              <p className="font-semibold text-base">{lang.label}</p>
              <p className="text-xs text-tg-hint mt-0.5">{lang.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Sticky page header with a back button. Goes back in history when there is
 * one, otherwise to the home screen (e.g. when a page was opened directly).
 */
export function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate('/', { replace: true }));
}

export default function Header({ title, showBack = true, right }) {
  const goBack = useGoBack();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-2">
        <div className="w-10">
          {showBack && (
            <button
              type="button"
              onClick={goBack}
              aria-label={t('common.back')}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-fg/5 active:bg-fg/10"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <h1 className="flex-1 truncate text-center text-base font-semibold">{title}</h1>
        <div className="flex w-10 justify-end">{right}</div>
      </div>
    </header>
  );
}

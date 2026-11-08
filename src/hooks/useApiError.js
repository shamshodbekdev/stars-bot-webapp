import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/** Maps an ApiError to a translated message (falls back to a generic one). */
export function useApiError() {
  const { t } = useLanguage();
  return useCallback(
    (err) => {
      const key = `errors.${err?.code}`;
      const msg = t(key);
      return msg === key ? t('errors.generic') : msg;
    },
    [t],
  );
}

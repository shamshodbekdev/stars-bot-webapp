import { useCallback, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { cleanUsername, isValidUsername } from '../utils/format';

/**
 * State + validation for RecipientField.
 * `validate()` returns the resolved username (without @) or null on error.
 */
export function useRecipient() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [recipient, setRecipientState] = useState({ mode: 'self', username: '' });
  const [error, setError] = useState('');

  const setRecipient = useCallback((next) => {
    setRecipientState(next);
    setError('');
  }, []);

  const validate = useCallback(() => {
    if (recipient.mode === 'self') {
      if (!user?.username) {
        setError(t('recipient.self_no_username'));
        return null;
      }
      return user.username;
    }
    const name = cleanUsername(recipient.username);
    if (!name) {
      setError(t('validation.username_required'));
      return null;
    }
    if (!isValidUsername(name)) {
      setError(t('validation.username_invalid'));
      return null;
    }
    return name;
  }, [recipient, user, t]);

  const reset = useCallback(() => setRecipient({ mode: 'self', username: '' }), [setRecipient]);

  /** Display string for summaries */
  const display =
    recipient.mode === 'self'
      ? user?.username
        ? `@${user.username}`
        : t('recipient.self')
      : `@${cleanUsername(recipient.username)}`;

  return { recipient, setRecipient, error, validate, reset, display };
}

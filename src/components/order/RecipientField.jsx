import { AtSign, User, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import Segmented from '../ui/Segmented';
import Input from '../ui/Input';

/**
 * "Who receives it?" control shared by Stars, Premium and Gift.
 * value: { mode: 'self' | 'other', username: string }
 */
export default function RecipientField({ value, onChange, error, layoutId }) {
  const { t } = useLanguage();
  const { user } = useUser();

  return (
    <div className="space-y-3">
      <Segmented
        layoutId={layoutId}
        value={value.mode}
        onChange={(mode) => onChange({ ...value, mode })}
        options={[
          { value: 'self', label: t('recipient.self'), icon: User },
          { value: 'other', label: t('recipient.other'), icon: Users },
        ]}
      />

      {value.mode === 'other' ? (
        <Input
          icon={AtSign}
          placeholder={t('recipient.placeholder')}
          value={value.username}
          onChange={(e) => onChange({ ...value, username: e.target.value })}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={33}
          error={error}
          hint={t('recipient.hint')}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-fg/[0.06] text-sm font-semibold">
            {(user?.first_name || '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.first_name || t('common.guest')}</p>
            <p className="truncate text-xs text-muted">
              {user?.username ? `@${user.username}` : t('recipient.no_username')}
            </p>
          </div>
        </div>
      )}
      {value.mode === 'self' && error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

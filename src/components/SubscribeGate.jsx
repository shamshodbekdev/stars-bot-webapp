/**
 * Force subscribe screen (majburiy obuna). Shown instead of the whole app
 * while the server answers not_subscribed. One button per channel still to
 * join, then "Tekshirish" re-checks live. Also re-checks by itself when the
 * user comes back to the app (e.g. after joining the channel in Telegram).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, ChevronRight, RefreshCw, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useApiError } from '../hooks/useApiError';
import { haptic, openTelegramLink } from '../lib/telegram';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

export default function SubscribeGate() {
  const { t } = useLanguage();
  const { subscription, checkSubscription } = useUser();
  const { showToast } = useToast();
  const apiError = useApiError();
  const [checking, setChecking] = useState(false);
  const busy = useRef(false);
  const channels = subscription?.channels ?? [];

  const check = useCallback(
    async ({ quiet = false } = {}) => {
      if (busy.current) return;
      busy.current = true;
      if (!quiet) setChecking(true);
      try {
        const ok = await checkSubscription();
        if (ok) {
          haptic.notify('success');
          showToast(t('subscribe.success'), 'success');
        } else if (!quiet) {
          showToast(t('subscribe.not_yet'), 'error');
        }
      } catch (err) {
        if (!quiet) showToast(apiError(err), 'error');
      } finally {
        busy.current = false;
        setChecking(false);
      }
    },
    [checkSubscription, showToast, apiError, t],
  );

  // Back from the channel → check without bothering the user on failure.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') check({ quiet: true });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [check]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-fg text-inverse">
        <BellRing size={24} />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{t('subscribe.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('subscribe.subtitle')}</p>

      <div className="mt-8 space-y-2">
        {channels.map((ch) => (
          <button
            key={ch.url}
            type="button"
            onClick={() => {
              haptic.select();
              openTelegramLink(ch.url);
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-fg/20"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg/5">
              <Send size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{ch.title}</span>
              <span className="mt-0.5 block text-xs text-muted">{t('subscribe.join')}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-muted" />
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <p className="mb-3 text-center text-xs text-muted">{t('subscribe.hint')}</p>
        <Button fullWidth size="lg" icon={RefreshCw} loading={checking} onClick={() => check()}>
          {t('subscribe.check')}
        </Button>
      </div>
    </motion.main>
  );
}

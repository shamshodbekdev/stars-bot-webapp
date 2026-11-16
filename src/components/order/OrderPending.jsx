/**
 * Full-screen status of the order the user just placed.
 *
 * Orders are delivered by an admin within 5 minutes. This screen counts the
 * 5 minutes down and polls POST /api/order/status, switching to:
 *   completed → "Buyurtmangiz bajarildi!"
 *   refunded  → "Buyurtma bekor qilindi" (money is back on the balance)
 *   still pending at 0:00 → "Buyurtma kechikdi" + support button
 * The bot sends the same news to the user's chat, so closing early is fine.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Clock, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { clearPendingOrder, usePendingOrder } from '../../hooks/usePendingOrder';
import { api } from '../../utils/api';
import { formatNumber, formatSom } from '../../utils/format';
import { haptic, openTelegramLink } from '../../lib/telegram';
import { LINKS } from '../../config';
import Button from '../ui/Button';
import { Summary, SummaryRow } from './Summary';

const TOTAL_SECONDS = 300;
const POLL_MS = 5000;

const pad = (n) => String(n).padStart(2, '0');
const mmss = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

/** Circular countdown (SVG ring + mm:ss). */
function CountdownRing({ seconds, total }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const progress = total > 0 ? seconds / total : 0;
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-fg/[0.08]" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-amber-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <Clock size={18} className="mx-auto mb-1 text-amber-500" />
          <span className="block text-3xl font-semibold tabular-nums tracking-tight">{mmss(seconds)}</span>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ tone, icon: Icon }) {
  const tones = {
    success: 'bg-emerald-500/10 text-emerald-500',
    danger: 'bg-red-500/10 text-red-500',
    warning: 'bg-amber-500/10 text-amber-500',
  };
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`mx-auto grid h-24 w-24 place-items-center rounded-full ${tones[tone]}`}
    >
      <Icon size={44} strokeWidth={2.2} />
    </motion.span>
  );
}

export default function OrderPending() {
  const pending = usePendingOrder();
  const { t } = useLanguage();
  const { refresh } = useUser();
  const [order, setOrder] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const deadline = useRef(0);
  const lastStatus = useRef(null);

  const som = t('common.som');

  // A new order arrived from usePurchase()
  useEffect(() => {
    if (!pending) {
      setOrder(null);
      return;
    }
    setOrder(pending);
    lastStatus.current = pending.status;
    const eta = Number.isFinite(pending.eta_seconds) ? pending.eta_seconds : TOTAL_SECONDS;
    deadline.current = pending.receivedAt + eta * 1000;
    setSecondsLeft(eta);
  }, [pending]);

  const isPending = order?.status === 'pending' || order?.status === 'processing';

  // 1-second countdown
  useEffect(() => {
    if (!order || !isPending) return undefined;
    const tick = () => setSecondsLeft(Math.max(0, Math.round((deadline.current - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order, isPending]);

  // Poll the server for the admin's decision
  useEffect(() => {
    if (!order?.id || !isPending) return undefined;
    let cancelled = false;
    const poll = async () => {
      try {
        const { order: fresh } = await api.orderStatus({ orderId: order.id });
        if (cancelled || !fresh) return;
        if (fresh.status === 'pending' || fresh.status === 'processing') {
          // keep the countdown in sync with the server clock
          deadline.current = Date.now() + (fresh.eta_seconds ?? 0) * 1000;
        }
        if (fresh.status !== lastStatus.current) {
          lastStatus.current = fresh.status;
          if (fresh.status === 'completed') haptic.notify('success');
          if (fresh.status === 'refunded' || fresh.status === 'failed') haptic.notify('error');
          refresh();
        }
        setOrder((prev) => (prev ? { ...prev, ...fresh } : prev));
      } catch {
        /* network hiccup: try again on the next tick */
      }
    };
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [order?.id, isPending, refresh]);

  const close = useCallback(() => {
    clearPendingOrder();
    refresh();
  }, [refresh]);

  // Lock page scroll while open
  useEffect(() => {
    if (!order) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [order]);

  const product = (() => {
    if (!order) return '';
    if (order.type === 'stars') return `${formatNumber(order.quantity)} Stars`;
    if (order.type === 'premium') {
      return `Telegram Premium · ${t('premium_page.months_count', { n: order.months ?? order.quantity })}`;
    }
    if (order.type === 'gift' && order.gift_id) return t(`gifts.items.${order.gift_id}.name`);
    return '';
  })();

  let view;
  if (!order) view = null;
  else if (order.status === 'completed') view = 'completed';
  else if (order.status === 'refunded' || order.status === 'failed') view = 'refunded';
  else if (secondsLeft <= 0) view = 'late';
  else view = 'pending';

  return createPortal(
    <AnimatePresence>
      {order && (
        <motion.div
          key="order-pending"
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          className="fixed inset-0 z-[60] flex flex-col bg-bg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col overflow-y-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={close}
                aria-label={t('common.close')}
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-fg/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  {view === 'pending' && <CountdownRing seconds={secondsLeft} total={TOTAL_SECONDS} />}
                  {view === 'completed' && <StatusIcon tone="success" icon={Check} />}
                  {view === 'refunded' && <StatusIcon tone="danger" icon={X} />}
                  {view === 'late' && <StatusIcon tone="warning" icon={AlertTriangle} />}

                  <h2 className="mt-6 text-xl font-semibold tracking-tight">{t(`pending.title_${view}`)}</h2>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{t(`pending.text_${view}`)}</p>
                  {view === 'pending' && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      {t('pending.badge')}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8">
                <Summary>
                  <SummaryRow label={t('pending.order_no')} value={`#${order.id}`} />
                  {product && <SummaryRow label={t('order.product')} value={product} />}
                  {order.target_username && (
                    <SummaryRow label={t('order.recipient')} value={`@${order.target_username}`} />
                  )}
                  <SummaryRow label={t('order.total')} value={formatSom(order.price, som)} strong />
                </Summary>
                <p className="mt-3 px-1 text-center text-xs text-muted">{t('pending.bot_note')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {view === 'late' && (
                <Button fullWidth size="lg" icon={MessageCircle} onClick={() => openTelegramLink(LINKS.admin)}>
                  {t('pending.contact_support')}
                </Button>
              )}
              <Button
                fullWidth
                size="lg"
                variant={view === 'late' ? 'secondary' : view === 'completed' ? 'success' : 'primary'}
                onClick={close}
              >
                {view === 'pending' ? t('pending.close_wait') : t('pending.done')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

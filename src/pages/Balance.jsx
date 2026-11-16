/**
 * Balance top-up wizard (accent: emerald) — fully automatic, no receipt.
 * 1. Amount  ->  server reserves a free card (user pays exactly the amount)
 * 2. Payment (card number, exact amount, countdown)
 * 3. Waiting (polls the server until the transfer is detected)
 *   -> Success  |  Expired
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Check, CircleCheck, Clock, Copy, CreditCard, Home as HomeIcon, RotateCcw, TimerOff, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../components/ui/Toast';
import { useApiError } from '../hooks/useApiError';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import StepIndicator from '../components/ui/StepIndicator';
import StepTransition from '../components/ui/StepTransition';
import { api } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import { digitsOnly, formatNumber, formatSom } from '../utils/format';
import { cn } from '../utils/cn';
import { haptic } from '../lib/telegram';
import { MIN_DEPOSIT, PAYMENT_POLL_INTERVAL } from '../config';

const PRESETS = [10000, 25000, 50000, 100000, 200000];
const MAX_DEPOSIT_DIGITS = 9;
const WAITING = 3;
const SUCCESS = 4;
const EXPIRED = 5;
const NO_CARDS_TOAST_MS = 6000;

function formatTimer(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function Balance() {
  const { t } = useLanguage();
  const { refresh } = useUser();
  const { showToast } = useToast();
  const errorMessage = useApiError();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null); // response of /auto-payment
  const [deadline, setDeadline] = useState(0); // local ms timestamp (avoids clock skew)
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null); // { credited, balance } on success
  const [noCards, setNoCards] = useState(0); // amount that got NO_FREE_CARDS (0 = none)

  const som = t('common.som');
  const value = Number(amount) || 0;
  const paymentRef = useRef(null);
  paymentRef.current = payment;

  /* ---------------------------- countdown ---------------------------- */

  useEffect(() => {
    if (!deadline || step === SUCCESS || step === EXPIRED) return undefined;
    const tick = () => setSecondsLeft((deadline - Date.now()) / 1000);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, step]);

  /* ----------------------------- polling ----------------------------- */

  const checkStatus = useCallback(async () => {
    const current = paymentRef.current;
    if (!current) return;
    const data = await api.autoPaymentStatus({ paymentId: current.payment_id });
    if (data.status === 'paid') {
      setResult({ credited: data.credited_amount ?? current.amount, balance: data.balance });
      setStep(SUCCESS);
      haptic.notify('success');
      refresh?.();
    } else if (data.status === 'expired' || data.status === 'cancelled') {
      setStep(EXPIRED);
      haptic.notify('warning');
    }
  }, [refresh]);

  useEffect(() => {
    if (step !== WAITING) return undefined;
    let stopped = false;
    let timer;
    const loop = async () => {
      try {
        await checkStatus();
      } catch {
        /* network hiccup — keep polling */
      }
      if (!stopped) timer = setTimeout(loop, PAYMENT_POLL_INTERVAL);
    };
    loop();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [step, checkStatus]);

  /* ---------------------------- Step 1: amount ---------------------------- */

  const selectAmount = (next) => {
    setAmount(next);
    setAmountError('');
    setNoCards(0);
  };

  const handleAmountNext = async () => {
    let msg = '';
    if (!amount) msg = t('validation.amount_required');
    else if (value < MIN_DEPOSIT) msg = t('validation.deposit_min', { min: formatSom(MIN_DEPOSIT, som) });
    setAmountError(msg);
    if (msg) return haptic.notify('error');

    setLoading(true);
    try {
      const data = await api.createAutoPayment({ amount: value });
      setPayment(data);
      setDeadline(Date.now() + (data.expires_in ?? 600) * 1000);
      setStep(2);
      haptic.notify('success');
    } catch (err) {
      if (err?.code === 'NO_FREE_CARDS') {
        setNoCards(value);
        showToast(errorMessage(err), 'warning', NO_CARDS_TOAST_MS);
      } else {
        haptic.notify('error');
        showToast(errorMessage(err), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------- Step 2: payment ---------------------------- */

  const handleCopy = async (text, message) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? message : t('balance_page.copy_error'), ok ? 'success' : 'error');
    if (ok) {
      haptic.notify('success');
      setCopied(text);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** Back to the amount: free the card so other users can use it. */
  const backToAmount = () => {
    const current = paymentRef.current;
    if (current) api.cancelAutoPayment({ paymentId: current.payment_id }).catch(() => {});
    setPayment(null);
    setDeadline(0);
    setStep(1);
  };

  const restart = () => {
    setPayment(null);
    setDeadline(0);
    setResult(null);
    setStep(1);
  };

  const handleStepClick = (s) => {
    if (s === 1) backToAmount();
    else setStep(s);
  };

  // Countdown hit zero on screen: ask the server once (it may have just been paid).
  useEffect(() => {
    if (step !== 2 || !deadline || secondsLeft > 0) return;
    checkStatus().catch(() => {});
  }, [step, deadline, secondsLeft, checkStatus]);

  const cardRaw = payment?.card_number?.replace(/\s/g, '') ?? '';
  const exact = payment?.amount ?? 0;
  const lowTime = secondsLeft > 0 && secondsLeft < 120;

  const timerRow = (
    <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Clock size={16} />
        {t('balance_page.time_left')}
      </span>
      <span className={cn('font-mono text-base font-semibold tabular-nums', lowTime && 'text-red-500')}>
        {formatTimer(secondsLeft)}
      </span>
    </div>
  );

  const showSteps = step <= WAITING;

  return (
    <Page>
      <Header title={t('balance_page.title')} />

      {showSteps && (
        <StepIndicator
          step={step}
          onStepClick={loading ? undefined : handleStepClick}
          labels={[t('steps.amount'), t('steps.payment'), t('steps.confirm')]}
        />
      )}

      <Section>
        <StepTransition step={step}>
          {/* ---------- Step 1: amount ---------- */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10">
                  <Wallet size={22} className="text-emerald-500" />
                </span>
                <div>
                  <h2 className="font-semibold">{t('balance_page.amount_title')}</h2>
                  <p className="text-sm text-muted">{t('balance_page.amount_subtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset, i) => {
                  const active = value === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        haptic.select();
                        selectAmount(String(preset));
                      }}
                      className={cn(
                        'flex h-14 flex-col items-center justify-center rounded-xl border transition-colors',
                        i === PRESETS.length - 1 && 'col-span-2',
                        active
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-line bg-surface hover:border-fg/20',
                      )}
                    >
                      <span className="text-[15px] font-semibold">{formatNumber(preset)}</span>
                      <span className="text-[11px] text-muted">{som}</span>
                    </button>
                  );
                })}
              </div>

              <Input
                label={t('balance_page.custom_amount')}
                inputMode="numeric"
                placeholder={formatNumber(100000)}
                value={amount ? formatNumber(amount) : ''}
                onChange={(e) => selectAmount(digitsOnly(e.target.value).slice(0, MAX_DEPOSIT_DIGITS))}
                suffix={som}
                error={amountError}
                hint={t('balance_page.amount_hint', { min: formatSom(MIN_DEPOSIT, som) })}
              />

              {noCards > 0 && (
                <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {t('balance_page.no_cards_title')} · {formatSom(noCards, som)}
                    </div>
                    <p className="mt-1 text-muted">{t('errors.NO_FREE_CARDS')}</p>
                  </div>
                </div>
              )}

              <Button fullWidth size="lg" loading={loading} onClick={handleAmountNext}>
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* ---------- Step 2: card + exact amount ---------- */}
          {step === 2 && payment && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-4">
                <div className="text-sm text-muted">{t('balance_page.exact_amount')}</div>
                <button
                  type="button"
                  onClick={() => handleCopy(String(exact), t('balance_page.amount_copied'))}
                  className="mt-1 flex w-full items-center justify-between gap-3"
                >
                  <span className="text-2xl font-bold tabular-nums">{formatSom(exact, som)}</span>
                  {copied === String(exact) ? (
                    <Check size={18} className="text-emerald-500" />
                  ) : (
                    <Copy size={18} className="text-muted" />
                  )}
                </button>
              </div>

              <Card>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted">
                  <CreditCard size={16} className="text-emerald-500" />
                  {t('balance_page.card')}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(cardRaw, t('balance_page.copied'))}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-fg/[0.04] px-4 py-3.5 transition-colors hover:bg-fg/[0.06]"
                >
                  <span className="font-mono text-base font-semibold tracking-wider sm:text-lg">
                    {payment.card_number}
                  </span>
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 text-xs font-medium',
                      copied === cardRaw ? 'text-emerald-500' : 'text-muted',
                    )}
                  >
                    {copied === cardRaw ? <Check size={16} /> : <Copy size={16} />}
                    {copied === cardRaw ? t('balance_page.copied_short') : t('balance_page.copy')}
                  </span>
                </button>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{t('balance_page.holder')}</span>
                  <span className="font-medium">{payment.card_holder}</span>
                </div>
              </Card>

              {timerRow}

              <p className="px-1 text-xs text-muted">{t('balance_page.payment_note')}</p>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={backToAmount}>
                  {t('common.back')}
                </Button>
                <Button size="lg" className="flex-[2]" icon={Check} onClick={() => setStep(WAITING)}>
                  {t('balance_page.sent_money')}
                </Button>
              </div>
            </div>
          )}

          {/* ---------- Step 3: waiting for the transfer ---------- */}
          {step === WAITING && payment && (
            <div className="flex flex-col items-center pt-4 text-center">
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
                <Clock size={36} className="text-emerald-500" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{t('balance_page.waiting_title')}</h2>
              <p className="mt-2 max-w-xs text-sm text-muted">{t('balance_page.waiting_text')}</p>

              <div className="mt-6 w-full space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                  <span className="text-sm text-muted">{t('balance_page.amount')}</span>
                  <span className="font-semibold">{formatSom(exact, som)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                  <span className="text-sm text-muted">{t('balance_page.card')}</span>
                  <span className="font-mono text-sm font-semibold">{payment.card_number}</span>
                </div>
                {timerRow}
              </div>

              <Button variant="secondary" fullWidth size="lg" className="mt-6" onClick={() => setStep(2)}>
                {t('balance_page.show_card')}
              </Button>
            </div>
          )}

          {/* ---------- Success ---------- */}
          {step === SUCCESS && (
            <div className="flex flex-col items-center pt-8 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10">
                <CircleCheck size={40} className="text-emerald-500" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{t('balance_page.success_title')}</h2>
              <p className="mt-2 max-w-xs text-sm text-muted">
                {t('balance_page.success_text', { amount: formatSom(result?.credited ?? exact, som) })}
              </p>

              {result?.balance != null && (
                <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                  <span className="text-sm text-muted">{t('balance_page.new_balance')}</span>
                  <span className="font-semibold">{formatSom(result.balance, som)}</span>
                </div>
              )}

              <Button fullWidth size="lg" icon={HomeIcon} className="mt-6" onClick={() => navigate('/')}>
                {t('balance_page.back_home')}
              </Button>
            </div>
          )}

          {/* ---------- Expired ---------- */}
          {step === EXPIRED && (
            <div className="flex flex-col items-center pt-8 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-amber-500/10">
                <TimerOff size={36} className="text-amber-500" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{t('balance_page.expired_title')}</h2>
              <p className="mt-2 max-w-xs text-sm text-muted">{t('balance_page.expired_text')}</p>

              <Button fullWidth size="lg" icon={RotateCcw} className="mt-6" onClick={restart}>
                {t('balance_page.try_again')}
              </Button>
              <Button variant="secondary" fullWidth size="lg" icon={HomeIcon} className="mt-3" onClick={() => navigate('/')}>
                {t('balance_page.back_home')}
              </Button>
            </div>
          )}
        </StepTransition>
      </Section>
    </Page>
  );
}

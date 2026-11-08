/**
 * Stars purchase wizard (accent: amber).
 * 1. Recipient  2. Amount  3. Confirm
 */
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecipient } from '../hooks/useRecipient';
import { usePurchase } from '../hooks/usePurchase';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StepIndicator from '../components/ui/StepIndicator';
import StepTransition from '../components/ui/StepTransition';
import RecipientField from '../components/order/RecipientField';
import { Summary, SummaryRow } from '../components/order/Summary';
import BalanceRow from '../components/order/BalanceRow';
import { STARS } from '../config';
import { cn } from '../utils/cn';
import { digitsOnly, formatNumber, formatSom } from '../utils/format';
import { haptic } from '../lib/telegram';

export default function Stars() {
  const { t } = useLanguage();
  const { recipient, setRecipient, error: recipientError, validate, reset, display } = useRecipient();
  const { purchase, loading } = usePurchase();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState(String(STARS.presets[1]));
  const [amountError, setAmountError] = useState('');

  const quantity = Number(amount) || 0;
  const total = quantity * STARS.pricePerStar;
  const som = t('common.som');

  // Step 1 -> 2
  const handleRecipientNext = () => {
    const name = validate();
    if (!name) return haptic.notify('error');
    setUsername(name);
    setStep(2);
  };

  // Step 2 -> 3
  const handleAmountNext = () => {
    let msg = '';
    if (!amount) msg = t('validation.amount_required');
    else if (quantity < STARS.min) msg = t('validation.stars_min', { min: STARS.min });
    else if (quantity > STARS.max) msg = t('validation.stars_max', { max: formatNumber(STARS.max) });
    setAmountError(msg);
    if (msg) return haptic.notify('error');
    setStep(3);
  };

  const handleConfirm = async () => {
    const ok = await purchase({ type: 'stars', username, quantity, price: total });
    if (ok) {
      reset();
      setAmount(String(STARS.presets[1]));
      setStep(1);
    }
  };

  return (
    <Page>
      <Header title={t('stars_page.title')} />
      <StepIndicator
        step={step}
        onStepClick={setStep}
        labels={[t('steps.recipient'), t('steps.amount'), t('steps.confirm')]}
      />

      <Section>
        <StepTransition step={step}>
          {/* ---------- Step 1: recipient ---------- */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/10">
                  <Star size={22} className="fill-amber-500 text-amber-500" />
                </span>
                <div>
                  <h2 className="font-semibold">{t('stars_page.hero_title')}</h2>
                  <p className="text-sm text-muted">{t('stars_page.hero_subtitle')}</p>
                </div>
              </div>
              <RecipientField
                layoutId="stars-recipient"
                value={recipient}
                onChange={setRecipient}
                error={recipientError}
              />
              <Button fullWidth size="lg" onClick={handleRecipientNext}>
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* ---------- Step 2: amount ---------- */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {STARS.presets.map((preset) => {
                  const active = quantity === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        haptic.select();
                        setAmount(String(preset));
                        setAmountError('');
                      }}
                      className={cn(
                        'flex h-16 flex-col items-center justify-center rounded-xl border transition-colors',
                        active
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-line bg-surface hover:border-fg/20',
                      )}
                    >
                      <span className="flex items-center gap-1 text-[15px] font-semibold">
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        {formatNumber(preset)}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted">
                        {formatSom(preset * STARS.pricePerStar, som)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Input
                label={t('stars_page.custom_amount')}
                icon={Star}
                inputMode="numeric"
                placeholder={String(STARS.min)}
                value={amount}
                onChange={(e) => {
                  setAmount(digitsOnly(e.target.value).slice(0, 7));
                  setAmountError('');
                }}
                suffix={t('stars_page.stars')}
                error={amountError}
                hint={t('stars_page.amount_hint', { min: STARS.min, price: STARS.pricePerStar })}
              />

              <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                <span className="text-sm text-muted">{t('order.total')}</span>
                <span className="font-semibold">{formatSom(total, som)}</span>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  {t('common.back')}
                </Button>
                <Button size="lg" className="flex-1" onClick={handleAmountNext}>
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}

          {/* ---------- Step 3: confirm ---------- */}
          {step === 3 && (
            <div className="space-y-4">
              <Summary>
                <SummaryRow label={t('order.recipient')} value={display} />
                <SummaryRow
                  label={t('order.quantity')}
                  value={`${formatNumber(quantity)} ${t('stars_page.stars')}`}
                />
                <SummaryRow label={t('order.price_per_unit')} value={formatSom(STARS.pricePerStar, som)} />
                <BalanceRow price={total} />
                <SummaryRow label={t('order.total')} value={formatSom(total, som)} strong />
              </Summary>
              <p className="px-1 text-xs text-muted">{t('order.delivery_note')}</p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                  onClick={() => setStep(2)}
                >
                  {t('common.back')}
                </Button>
                <Button size="lg" className="flex-1" loading={loading} onClick={handleConfirm}>
                  {t('common.confirm')}
                </Button>
              </div>
            </div>
          )}
        </StepTransition>
      </Section>
    </Page>
  );
}

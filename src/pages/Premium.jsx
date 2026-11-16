/**
 * Telegram Premium purchase wizard (accent: violet).
 * 1. Recipient  2. Duration  3. Confirm
 */
import { useState } from 'react';
import { Check, FileUp, Mic, ShieldOff, Sparkles } from 'lucide-react';
import { PremiumIcon } from '../components/icons/TelegramIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecipient } from '../hooks/useRecipient';
import { usePurchase } from '../hooks/usePurchase';
import { useShopConfig } from '../hooks/useShopConfig';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import StepIndicator from '../components/ui/StepIndicator';
import StepTransition from '../components/ui/StepTransition';
import RecipientField from '../components/order/RecipientField';
import { Summary, SummaryRow } from '../components/order/Summary';
import BalanceRow from '../components/order/BalanceRow';
import { DiscountBadge, PriceTag } from '../components/order/Price';
import { cn } from '../utils/cn';
import { formatSom } from '../utils/format';
import { haptic } from '../lib/telegram';

const FEATURES = [
  { icon: Sparkles, key: 'stickers' },
  { icon: FileUp, key: 'uploads' },
  { icon: ShieldOff, key: 'no_ads' },
  { icon: Mic, key: 'voice' },
];

export default function Premium() {
  const { t } = useLanguage();
  const { recipient, setRecipient, error: recipientError, validate, reset, display } = useRecipient();
  const { purchase, loading } = usePurchase();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const { premiumPlans, discounts, ready: pricesReady } = useShopConfig();
  const discount = discounts.premium || 0;
  const [planMonths, setPlanMonths] = useState(6);
  // Always the current server price for the chosen duration.
  const plan = premiumPlans.find((p) => p.months === planMonths)
    || premiumPlans.find((p) => p.popular) || premiumPlans[0];

  const som = t('common.som');
  const months = (n) => t('premium_page.months_count', { n });

  const handleRecipientNext = () => {
    const name = validate();
    if (!name) return haptic.notify('error');
    setUsername(name);
    setStep(2);
  };

  const handleConfirm = async () => {
    const ok = await purchase({ type: 'premium', username, months: plan.months, price: plan.price });
    if (ok) {
      reset();
      setStep(1);
    }
  };

  return (
    <Page>
      <Header title={t('premium_page.title')} />
      <StepIndicator
        step={step}
        onStepClick={setStep}
        labels={[t('steps.recipient'), t('steps.duration'), t('steps.confirm')]}
      />

      <Section>
        <StepTransition step={step}>
          {/* ---------- Step 1: recipient ---------- */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/10">
                    <PremiumIcon size={32} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">Telegram Premium</h2>
                    <p className="text-sm text-muted">{t('premium_page.hero_subtitle')}</p>
                  </div>
                  {discount > 0 && <DiscountBadge percent={discount} />}
                </div>
                <ul className="grid grid-cols-1 gap-y-2.5 min-[400px]:grid-cols-2 min-[400px]:gap-x-3">
                  {FEATURES.map(({ icon: Icon, key }) => (
                    <li key={key} className="flex items-center gap-2 text-sm text-muted">
                      <Icon size={15} className="shrink-0 text-violet-500" />
                      <span>{t(`premium_page.features.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <RecipientField
                layoutId="premium-recipient"
                value={recipient}
                onChange={setRecipient}
                error={recipientError}
              />
              <Button fullWidth size="lg" onClick={handleRecipientNext}>
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* ---------- Step 2: duration ---------- */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2" role="radiogroup">
                {premiumPlans.map((p) => {
                  const active = plan.months === p.months;
                  return (
                    <button
                      key={p.months}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        haptic.select();
                        setPlanMonths(p.months);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                        active ? 'border-violet-500 bg-violet-500/[0.06]' : 'border-line bg-surface hover:border-fg/20',
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                          active ? 'border-violet-500 bg-violet-500' : 'border-fg/20',
                        )}
                      >
                        {active && <Check size={12} strokeWidth={3} className="text-white" />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold">{months(p.months)}</span>
                          {p.popular && (
                            <span className="rounded-md bg-violet-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                              {t('premium_page.popular')}
                            </span>
                          )}
                        </span>
                        {p.bonus > 0 && (
                          <span className="mt-0.5 block text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {t('premium_page.save', { percent: p.bonus })}
                          </span>
                        )}
                      </span>
                      <span className="text-right">
                        {p.basePrice > p.price && (
                          <span className="block text-[11px] text-muted line-through">{formatSom(p.basePrice, som)}</span>
                        )}
                        <span className="block font-semibold">{formatSom(p.price, som)}</span>
                        {p.months > 1 && (
                          <span className="block text-[11px] text-muted">
                            {t('premium_page.per_month', {
                              price: formatSom(Math.round(p.price / p.months), som),
                            })}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  {t('common.back')}
                </Button>
                <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
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
                <SummaryRow label={t('order.product')} value="Telegram Premium" />
                <SummaryRow label={t('order.duration')} value={months(plan.months)} />
                {discount > 0 && (
                  <SummaryRow label={t('order.discount')} value={<DiscountBadge percent={discount} />} />
                )}
                <BalanceRow price={plan.price} />
                <SummaryRow
                  label={t('order.total')}
                  value={<PriceTag price={plan.price} basePrice={plan.basePrice} som={som} />}
                  strong
                />
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
                <Button size="lg" className="flex-1" loading={loading} disabled={!pricesReady} onClick={handleConfirm}>
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

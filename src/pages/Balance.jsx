/**
 * Balance top-up wizard (accent: emerald).
 * 1. Amount  2. Payment (card details)  3. Receipt upload  ->  Pending screen
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Copy, CreditCard, Home as HomeIcon, ImagePlus, Send, Trash2, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
import { MAX_RECEIPT_SIZE, MIN_DEPOSIT, PAYMENT_CARD } from '../config';

const PRESETS = [10000, 25000, 50000, 100000, 200000];
const MAX_DEPOSIT_DIGITS = 9;
const PENDING = 4;

export default function Balance() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const errorMessage = useApiError();
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const som = t('common.som');
  const value = Number(amount) || 0;

  // Create / revoke an object URL for the receipt preview
  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ---------------------------- Step 1: amount ---------------------------- */

  const selectAmount = (next) => {
    setAmount(next);
    setAmountError('');
  };

  const handleAmountNext = () => {
    let msg = '';
    if (!amount) msg = t('validation.amount_required');
    else if (value < MIN_DEPOSIT) msg = t('validation.deposit_min', { min: formatSom(MIN_DEPOSIT, som) });
    setAmountError(msg);
    if (msg) return haptic.notify('error');
    setStep(2);
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

  /* --------------------------- Step 3: receipt ---------------------------- */

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      showToast(t('validation.receipt_type'), 'error');
      return;
    }
    if (picked.size > MAX_RECEIPT_SIZE) {
      showToast(t('validation.receipt_size', { mb: MAX_RECEIPT_SIZE / 1024 / 1024 }), 'error');
      return;
    }
    setFile(picked);
    setFileError('');
    haptic.select();
  };

  const removeFile = () => {
    setFile(null);
    showToast(t('balance_page.receipt_removed'), 'info');
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileError(t('validation.receipt_required'));
      haptic.notify('error');
      return;
    }
    setLoading(true);
    try {
      await api.submitDeposit({ amount: value, file });
      haptic.notify('success');
      showToast(t('balance_page.receipt_sent'), 'success');
      setStep(PENDING);
    } catch (err) {
      haptic.notify('error');
      showToast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const cardNumberRaw = PAYMENT_CARD.number.replace(/\s/g, '');

  return (
    <Page>
      <Header title={t('balance_page.title')} />

      {step !== PENDING && (
        <StepIndicator
          step={step}
          onStepClick={loading ? undefined : setStep}
          labels={[t('steps.amount'), t('steps.payment'), t('steps.receipt')]}
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

              <Button fullWidth size="lg" onClick={handleAmountNext}>
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* ---------- Step 2: payment details ---------- */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                <span className="text-sm text-muted">{t('balance_page.to_pay')}</span>
                <span className="text-lg font-semibold">{formatSom(value, som)}</span>
              </div>

              <Card>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted">
                  <CreditCard size={16} className="text-emerald-500" />
                  {t('balance_page.card')}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(cardNumberRaw, t('balance_page.copied'))}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-fg/[0.04] px-4 py-3.5 transition-colors hover:bg-fg/[0.06]"
                >
                  <span className="font-mono text-base font-semibold tracking-wider sm:text-lg">
                    {PAYMENT_CARD.number}
                  </span>
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 text-xs font-medium',
                      copied === cardNumberRaw ? 'text-emerald-500' : 'text-muted',
                    )}
                  >
                    {copied === cardNumberRaw ? <Check size={16} /> : <Copy size={16} />}
                    {copied === cardNumberRaw ? t('balance_page.copied_short') : t('balance_page.copy')}
                  </span>
                </button>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{t('balance_page.holder')}</span>
                  <span className="font-medium">{PAYMENT_CARD.holder}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{t('balance_page.amount')}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(String(value), t('balance_page.amount_copied'))}
                    className="flex items-center gap-1.5 font-medium"
                  >
                    {formatSom(value, som)}
                    {copied === String(value) ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} className="text-muted" />
                    )}
                  </button>
                </div>
              </Card>

              <p className="px-1 text-xs text-muted">{t('balance_page.payment_note')}</p>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  {t('common.back')}
                </Button>
                <Button size="lg" className="flex-[2]" icon={Check} onClick={() => setStep(3)}>
                  {t('balance_page.sent_money')}
                </Button>
              </div>
            </div>
          )}

          {/* ---------- Step 3: receipt ---------- */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold">{t('balance_page.receipt_title')}</h2>
                <p className="text-sm text-muted">{t('balance_page.receipt_subtitle')}</p>
              </div>

              <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {file && preview ? (
                <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                  <img src={preview} alt={t('balance_page.receipt')} className="max-h-72 w-full object-contain" />
                  <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
                    <span className="min-w-0 truncate text-xs text-muted">{file.name}</span>
                    <div className="flex shrink-0 gap-1">
                      <Button size="sm" variant="ghost" disabled={loading} onClick={() => fileInput.current?.click()}>
                        {t('balance_page.change')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        disabled={loading}
                        onClick={removeFile}
                        aria-label={t('common.delete')}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className={cn(
                    'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-10 transition-colors',
                    fileError ? 'border-red-500/60' : 'border-fg/20 hover:border-fg/40',
                  )}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10">
                    <ImagePlus size={22} className="text-emerald-500" />
                  </span>
                  <span className="text-sm font-medium">{t('balance_page.upload')}</span>
                  <span className="text-xs text-muted">{t('balance_page.upload_hint')}</span>
                </button>
              )}
              {fileError && <p className="-mt-2 text-xs text-red-500">{fileError}</p>}

              <div className="flex items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                <span className="text-sm text-muted">{t('balance_page.amount')}</span>
                <span className="font-semibold">{formatSom(value, som)}</span>
              </div>

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
                <Button size="lg" className="flex-[2]" icon={Send} loading={loading} onClick={handleSubmit}>
                  {t('balance_page.submit')}
                </Button>
              </div>
            </div>
          )}

          {/* ---------- Pending ---------- */}
          {step === PENDING && (
            <div className="flex flex-col items-center pt-8 text-center">
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
                <Clock size={36} className="text-emerald-500" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{t('balance_page.pending_title')}</h2>
              <p className="mt-2 max-w-xs text-sm text-muted">{t('balance_page.pending_text')}</p>

              <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-fg/[0.04] px-4 py-3">
                <span className="text-sm text-muted">{t('balance_page.amount')}</span>
                <span className="font-semibold">{formatSom(value, som)}</span>
              </div>

              <Button fullWidth size="lg" icon={HomeIcon} className="mt-6" onClick={() => navigate('/')}>
                {t('balance_page.back_home')}
              </Button>
            </div>
          )}
        </StepTransition>
      </Section>
    </Page>
  );
}

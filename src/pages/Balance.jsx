/**
 * Top-up page (accent: emerald): card details, amount, receipt upload.
 */
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, CreditCard, ImagePlus, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { useApiError } from '../hooks/useApiError';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { api } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';
import { digitsOnly, formatNumber, formatSom } from '../utils/format';
import { cn } from '../utils/cn';
import { haptic } from '../lib/telegram';
import { MAX_RECEIPT_SIZE, MIN_DEPOSIT, PAYMENT_CARD } from '../config';

const PRESETS = [50000, 100000, 200000, 500000];

export default function Balance() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const errorMessage = useApiError();
  const fileInput = useRef(null);

  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const som = t('common.som');

  // Create / revoke an object URL for the receipt preview
  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(PAYMENT_CARD.number.replace(/\s/g, ''));
    showToast(ok ? t('balance_page.copied') : t('balance_page.copy_error'), ok ? 'success' : 'error');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    setErrors((prev) => ({ ...prev, file: '' }));
    showToast(t('balance_page.receipt_added'), 'info');
  };

  const removeFile = () => {
    setFile(null);
    showToast(t('balance_page.receipt_removed'), 'info');
  };

  const validate = () => {
    const next = {};
    const value = Number(amount);
    if (!amount) next.amount = t('validation.amount_required');
    else if (value < MIN_DEPOSIT) next.amount = t('validation.deposit_min', { min: formatSom(MIN_DEPOSIT, som) });
    if (!file) next.file = t('validation.receipt_required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      haptic.notify('error');
      showToast(t('validation.fix_errors'), 'error');
      return;
    }
    setLoading(true);
    try {
      await api.submitDeposit({ amount: Number(amount), file });
      showToast(t('balance_page.receipt_sent'), 'success');
      setAmount('');
      setFile(null);
    } catch (err) {
      showToast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header title={t('balance_page.title')} />

      <Section>
        {/* Card */}
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted">
            <CreditCard size={16} className="text-emerald-500" />
            {t('balance_page.card')}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-fg/[0.04] px-4 py-3.5 transition-colors hover:bg-fg/[0.06]"
          >
            <span className="font-mono text-lg font-semibold tracking-wider">{PAYMENT_CARD.number}</span>
            <span className={cn('flex items-center gap-1 text-xs font-medium', copied ? 'text-emerald-500' : 'text-muted')}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t('balance_page.copied_short') : t('balance_page.copy')}
            </span>
          </button>
          <p className="mt-3 text-sm">
            <span className="text-muted">{t('balance_page.holder')}: </span>
            <span className="font-medium">{PAYMENT_CARD.holder}</span>
          </p>
        </div>

        {/* Amount */}
        <div>
          <Input
            label={t('balance_page.amount')}
            inputMode="numeric"
            placeholder="100 000"
            value={amount ? formatNumber(amount) : ''}
            onChange={(e) => {
              setAmount(digitsOnly(e.target.value).slice(0, 9));
              setErrors((prev) => ({ ...prev, amount: '' }));
            }}
            suffix={som}
            error={errors.amount}
            hint={t('balance_page.amount_hint', { min: formatSom(MIN_DEPOSIT, som) })}
          />
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  haptic.select();
                  setAmount(String(p));
                  setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                className={cn(
                  'h-9 rounded-lg border text-xs font-medium transition-colors',
                  Number(amount) === p
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-line bg-surface text-muted hover:text-fg',
                )}
              >
                {formatNumber(p / 1000)}k
              </button>
            ))}
          </div>
        </div>

        {/* Receipt */}
        <div>
          <p className="mb-2 text-sm font-medium">{t('balance_page.receipt')}</p>
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {file && preview ? (
            <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
              <img src={preview} alt={t('balance_page.receipt')} className="max-h-64 w-full object-contain" />
              <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
                <span className="min-w-0 truncate text-xs text-muted">{file.name}</span>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => fileInput.current?.click()}>
                    {t('balance_page.change')}
                  </Button>
                  <Button size="sm" variant="ghost" icon={Trash2} onClick={removeFile} aria-label={t('common.delete')} />
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 transition-colors',
                errors.file ? 'border-red-500/60' : 'border-fg/20 hover:border-fg/40',
              )}
            >
              <ImagePlus size={24} className="text-muted" />
              <span className="text-sm font-medium">{t('balance_page.upload')}</span>
              <span className="text-xs text-muted">{t('balance_page.upload_hint')}</span>
            </button>
          )}
          {errors.file && <p className="mt-1.5 text-xs text-red-500">{errors.file}</p>}
        </div>

        {/* How it works */}
        <ol className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex gap-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {n}
              </span>
              <span className="pt-0.5 text-muted">{t(`balance_page.how.step${n}`)}</span>
            </li>
          ))}
        </ol>

        <Button fullWidth size="lg" icon={Send} loading={loading} onClick={handleSubmit}>
          {t('balance_page.submit')}
        </Button>
      </Section>
    </Page>
  );
}

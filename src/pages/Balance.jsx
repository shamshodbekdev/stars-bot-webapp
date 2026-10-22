import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Wallet, Copy, Upload } from 'lucide-react';
import { formatSom } from '../utils/format';

export default function Balance() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');

  const cardNumber = '8600 1234 5678 9012';
  const cardHolder = 'SHAMSHODBEK X.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
      showToast(t('balance_page.copied'), 'success');
    } catch {
      showToast(t('balance_page.copy_error'), 'error');
    }
  };

  const handleSubmit = () => {
    if (!amount) {
      showToast(t('balance_page.amount_required'), 'error');
      return;
    }
    showToast(t('balance_page.receipt_sent'), 'success');
  };

  return (
    <Page>
      <Header title={t('balance_page.title')} showBack />

      <div className="p-4 space-y-4">
        <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={18} className="text-tg-hint" />
            <span className="text-sm font-semibold">{t('balance_page.card')}</span>
          </div>
          <div className="flex items-center justify-between bg-tg-bg rounded-xl px-3 py-3">
            <span className="font-mono font-bold text-base">{cardNumber}</span>
            <button onClick={handleCopy} className="p-2 hover:bg-tg-hint/10 rounded-lg transition-colors">
              <Copy size={16} className="text-tg-hint" />
            </button>
          </div>
          <p className="text-xs text-tg-hint mt-3">{cardHolder}</p>
        </div>

        <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
          <label className="text-sm font-semibold block mb-3">{t('balance_page.amount')}</label>
          <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-3">
            <input
              type="number"
              placeholder="50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent outline-none flex-1 text-base font-semibold"
            />
            <span className="text-sm text-tg-hint">{t('common.som')}</span>
          </div>
          {amount && (
            <p className="text-xs text-tg-hint mt-2">
              {t('balance_page.amount_hint')}: {formatSom(amount)}
            </p>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
            {t('balance_page.payment_info')}
          </p>
          <ol className="text-xs text-amber-800 dark:text-amber-300 space-y-1 list-decimal list-inside">
            <li>{t('balance_page.step1')}</li>
            <li>{t('balance_page.step2')}</li>
            <li>{t('balance_page.step3')}</li>
          </ol>
        </div>

        <Button fullWidth size="lg" onClick={handleSubmit} icon={Upload}>
          {t('balance_page.send_receipt')}
        </Button>
      </div>
    </Page>
  );
}

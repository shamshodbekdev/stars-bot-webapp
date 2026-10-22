import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Crown, User, Check } from 'lucide-react';
import { formatSom } from '../utils/format';

export default function Premium() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [months, setMonths] = useState(3);
  const [step, setStep] = useState(1);

  const prices = { 3: 160000, 6: 290000, 12: 400000 };
  const totalPrice = prices[months];

  const handleConfirm = () => {
    showToast(t('toast.premium_gift'), 'success');
    setTimeout(() => setStep(1), 1500);
  };

  return (
    <Page>
      <Header title={t('premium_page.title')} showBack />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-tg-secondaryBg text-tg-hint'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-gray-900 dark:bg-white' : 'bg-tg-hint/20'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <label className="text-sm font-semibold block mb-3">
                {t('premium_page.username')}
              </label>
              <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-3">
                <User size={18} className="text-tg-hint" />
                <input
                  type="text"
                  placeholder={t('premium_page.username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
            </div>
            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              {t('common.next')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <label className="text-sm font-semibold block mb-3">{t('premium_page.months')}</label>
              <div className="space-y-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      months === m ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-tg-bg text-tg-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Crown size={18} />
                      <span className="font-semibold">{m} {t('premium_page.month')}</span>
                    </div>
                    <span className="font-bold">{formatSom(prices[m])}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <h3 className="font-bold mb-4">{t('premium_page.confirm_title')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.username')}</span>
                  <span className="font-semibold">{username ? `@${username}` : t('stars_page.myself')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.months')}</span>
                  <span className="font-semibold">{months} {t('premium_page.month')}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-tg-hint/10">
                  <span className="text-tg-hint">{t('premium_page.price')}</span>
                  <span className="font-bold">{formatSom(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.balance')}</span>
                  <span className="font-semibold">0 {t('common.som')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                {t('premium_page.confirm')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Star, User, Check } from 'lucide-react';
import { formatSom } from '../utils/format';

export default function Stars() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [step, setStep] = useState(1);

  const amounts = [50, 100, 250, 500, 1000, 2500];
  const pricePerStar = 90;
  const totalPrice = quantity * pricePerStar;

  const handleConfirm = () => {
    showToast(t('toast.order_created'), 'success');
    setTimeout(() => setStep(1), 1500);
  };

  return (
    <Page>
      <Header title={t('stars_page.title')} showBack />

      {/* Progress indicator */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-tg-secondaryBg text-tg-hint'
                }`}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step > s ? 'bg-gray-900 dark:bg-white' : 'bg-tg-hint/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-tg-hint text-center mt-2">
          {step === 1 && t('stars_page.step1')}
          {step === 2 && t('stars_page.step2')}
          {step === 3 && t('stars_page.step3')}
        </p>
      </div>

      <div className="p-4">
        {/* Step 1: Username */}
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <label className="text-sm font-semibold block mb-3">
                {t('stars_page.username')}
              </label>
              <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-3">
                <User size={18} className="text-tg-hint" />
                <input
                  type="text"
                  placeholder={t('stars_page.username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
              <p className="text-xs text-tg-hint mt-2">
                {t('stars_page.username_hint')}
              </p>
            </div>
            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              {t('common.next')}
            </Button>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <label className="text-sm font-semibold block mb-3">
                {t('stars_page.amount')}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setQuantity(a)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                      quantity === a
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-tg-bg text-tg-text hover:bg-tg-hint/10'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-3">
                <Star size={18} className="text-amber-500" />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-transparent outline-none flex-1 text-sm font-semibold"
                  min={50}
                />
                <span className="text-xs text-tg-hint">{t('stars_page.stars')}</span>
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

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <h3 className="font-bold mb-4">{t('stars_page.confirm_title')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('stars_page.receiver')}</span>
                  <span className="font-semibold">
                    {username ? `@${username}` : t('stars_page.myself')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('stars_page.amount')}</span>
                  <span className="font-semibold">{quantity} {t('stars_page.stars')}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-tg-hint/10">
                  <span className="text-tg-hint">{t('stars_page.price')}</span>
                  <span className="font-bold">{formatSom(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('stars_page.balance')}</span>
                  <span className="font-semibold">0 {t('common.som')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                {t('stars_page.confirm')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

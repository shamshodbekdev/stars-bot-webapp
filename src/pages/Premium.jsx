import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Crown, User, Check, Star, FileText, Shield } from 'lucide-react';
import { formatSom } from '../utils/format';

const PREMIUM_PLANS = [
  { months: 1, price: 75000, bonus: null, popular: false },
  { months: 3, price: 160000, bonus: '5%', popular: false },
  { months: 6, price: 290000, bonus: '10%', popular: true },
  { months: 12, price: 400000, bonus: '20%', popular: false },
];

const PREMIUM_FEATURES = [
  { icon: Star, text: { uz: 'Maxsus stikerlar', kril: 'Махсус стикерлар', ru: 'Особые стикеры' } },
  { icon: FileText, text: { uz: '4 GB fayl yuklash', kril: '4 ГБ файл юклаш', ru: 'Загрузка файлов 4 ГБ' } },
  { icon: Shield, text: { uz: 'Reklamasiz', kril: 'Рекламасиз', ru: 'Без рекламы' } },
];

export default function Premium() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(PREMIUM_PLANS[1]);
  const [step, setStep] = useState(1);

  const handleConfirm = () => {
    showToast(t('toast.premium_gift'), 'success');
    setTimeout(() => {
      setStep(1);
      setUsername('');
    }, 1500);
  };

  return (
    <Page>
      <Header title={t('premium_page.title')} showBack />

      {/* Progress — minimal */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                step >= s ? 'bg-gray-900 dark:bg-white' : 'bg-tg-hint/20'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-tg-hint mt-2 text-center">
          {step === 1 && '1/3 · ' + t('premium_page.step1')}
          {step === 2 && '2/3 · ' + t('premium_page.step2')}
          {step === 3 && '3/3 · ' + t('premium_page.step3')}
        </p>
      </div>

      <div className="p-4">
        {/* ===== Step 1: Username ===== */}
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            {/* Intro card — minimal */}
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Crown size={24} className="text-violet-500" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Telegram Premium</h2>
                  <p className="text-xs text-tg-hint">
                    {t('premium_page.hero_subtitle')}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {PREMIUM_FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Icon size={16} className="text-violet-500" />
                      <span className="text-tg-hint">{f.text[language]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Username input */}
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
              <p className="text-xs text-tg-hint mt-2">
                {t('premium_page.username_hint')}
              </p>
            </div>

            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              {t('common.next')}
            </Button>
          </div>
        )}

        {/* ===== Step 2: Plan ===== */}
        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <label className="text-sm font-semibold block mb-3">
                {t('premium_page.months')}
              </label>
              <div className="space-y-2">
                {PREMIUM_PLANS.map((plan) => (
                  <button
                    key={plan.months}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedPlan.months === plan.months
                        ? 'border-gray-900 dark:border-white bg-tg-bg'
                        : 'border-tg-hint/10 bg-tg-bg hover:border-tg-hint/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        selectedPlan.months === plan.months
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-tg-secondaryBg text-tg-hint'
                      }`}>
                        {selectedPlan.months === plan.months ? (
                          <Check size={16} />
                        ) : (
                          <Crown size={16} />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">
                          {plan.months} {t('premium_page.month')}
                        </p>
                        {plan.bonus && (
                          <p className="text-xs text-emerald-500 font-semibold">
                            -{plan.bonus} tejash
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatSom(plan.price)}</p>
                      {plan.popular && (
                        <p className="text-[10px] text-violet-500 font-semibold">
                          POPULAR
                        </p>
                      )}
                    </div>
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

        {/* ===== Step 3: Confirm ===== */}
        {step === 3 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Crown size={24} className="text-violet-500" />
                </div>
                <div>
                  <h3 className="font-bold">{t('premium_page.confirm_title')}</h3>
                  <p className="text-xs text-tg-hint">
                    {selectedPlan.months} {t('premium_page.month')} Premium
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-tg-hint/10">
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.receiver')}</span>
                  <span className="font-semibold">
                    {username ? `@${username}` : t('premium_page.myself')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.months')}</span>
                  <span className="font-semibold">
                    {selectedPlan.months} {t('premium_page.month')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tg-hint">{t('premium_page.price')}</span>
                  <span className="font-bold">{formatSom(selectedPlan.price)}</span>
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

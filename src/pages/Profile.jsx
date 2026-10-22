import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useLanguage } from '../contexts/LanguageContext';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import {
  ChevronRight, Settings, Wallet, Star, Gift, TrendingUp
} from 'lucide-react';
import { formatSom } from '../utils/format';

export default function Profile() {
  const { user } = useTelegram();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Page>
      <Header title={t('profile.title')} showBack />

      <div className="px-4 py-4">
        <div className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 flex items-center justify-center text-white dark:text-gray-900 text-xl font-bold">
              {user?.first_name?.[0] || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-tg-hint truncate">
                @{user?.username || 'username'}
              </p>
              <p className="text-xs text-tg-hint mt-0.5">
                {t('profile.id')}: {user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        {[
          { icon: Wallet, label: t('profile.balance'), value: formatSom(0) },
          { icon: Star, label: t('profile.stars'), value: '0' },
          { icon: Gift, label: t('profile.referrals'), value: '0' },
          { icon: TrendingUp, label: t('profile.orders'), value: '0' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/5">
              <Icon size={18} className="text-tg-hint mb-2" />
              <p className="text-xs text-tg-hint">{item.label}</p>
              <p className="font-semibold mt-0.5">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="px-4">
        <h2 className="text-xs font-bold text-tg-hint mb-2 uppercase tracking-wider">
          {t('profile.manage')}
        </h2>
        <div className="bg-tg-secondaryBg rounded-2xl border border-tg-hint/5 overflow-hidden">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-tg-hint/10 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Settings size={18} className="text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('profile.settings')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('profile.settings_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>

          <button
            onClick={() => navigate('/balance')}
            className="w-full flex items-center gap-3 px-4 py-4 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Wallet size={18} className="text-emerald-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('profile.deposit')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('profile.deposit_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
        </div>
      </div>
    </Page>
  );
}

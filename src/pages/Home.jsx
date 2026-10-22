import { useTelegram } from '../hooks/useTelegram';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/layout/Page';
import { formatSom } from '../utils/format';
import { Star, Crown, Gift, TrendingUp, ChevronRight, Wallet } from 'lucide-react';

export default function Home() {
  const { user } = useTelegram();
  const { t } = useLanguage();
  const navigate = useNavigate();

const services = [
  {
    path: '/premium',
    icon: Crown,
    title: t('home.premium'),
    desc: t('home.premium_desc'),
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10'
  },
  {
    path: '/stars',
    icon: Star,
    title: t('home.stars'),
    desc: t('home.stars_desc'),
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10'
  },
  {
    path: '/gift',
    icon: Gift,
    title: t('home.gift'),
    desc: t('home.gift_desc'),
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10'
  },
];

  return (
    <Page>
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-tg-hint font-medium">
              {t('home.greeting')}
            </p>
            <h1 className="text-2xl font-bold mt-0.5">
              {user?.first_name || 'Mehmon'}
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 flex items-center justify-center text-white dark:text-gray-900 font-bold">
            {user?.first_name?.[0] || 'S'}
          </div>
        </div>
      </div>

      {/* Balans */}
      <div className="px-4 mb-6">
        <div className="bg-gray-900 dark:bg-white rounded-2xl p-5 text-white dark:text-gray-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-70">{t('home.balance')}</span>
            <Wallet size={18} className="opacity-70" />
          </div>
          <div className="text-3xl font-bold tracking-tight mb-4">
            {formatSom(0)}
          </div>
          <button
            onClick={() => navigate('/balance')}
            className="w-full bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-900/20 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            {t('home.deposit')}
          </button>
        </div>
      </div>

      {/* Xizmatlar */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold text-tg-hint mb-3 uppercase tracking-wider">
          {t('home.services')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(service.path)}
                className="bg-tg-secondaryBg rounded-2xl p-4 text-left border border-tg-hint/5 hover:border-tg-hint/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={service.color} />
                </div>
                <p className="font-semibold text-base">{service.title}</p>
                <p className="text-xs text-tg-hint mt-0.5">{service.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Statistika */}
      <div className="px-4">
        <div className="bg-tg-secondaryBg rounded-2xl border border-tg-hint/5">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-between p-4 border-b border-tg-hint/10"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-tg-hint" />
              <span className="text-sm font-semibold">{t('home.statistics')}</span>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
          <div className="grid grid-cols-3 p-4">
            {[
              { label: t('home.orders'), value: '0' },
              { label: t('home.referrals'), value: '0' },
              { label: t('home.stars_count'), value: '0' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-tg-hint mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

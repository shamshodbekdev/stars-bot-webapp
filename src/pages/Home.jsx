/**
 * Home: greeting, balance card, services (Premium, Stars, Gift) and stats.
 * Neutral page — each service carries its own accent.
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Crown, Gift, Plus, RefreshCw, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import Page, { Section } from '../components/layout/Page';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import Avatar from '../components/ui/Avatar';
import { formatNumber, formatSom } from '../utils/format';

const SERVICES = [
  { path: '/premium', icon: Crown, key: 'premium', iconClass: 'text-violet-500', bg: 'bg-violet-500/10' },
  { path: '/stars', icon: Star, key: 'stars', iconClass: 'text-amber-500 fill-amber-500', bg: 'bg-amber-500/10' },
  { path: '/gift', icon: Gift, key: 'gift', iconClass: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function Home() {
  const { t } = useLanguage();
  const { user, profile, loading, error, refresh } = useUser();
  const navigate = useNavigate();

  const stats = [
    { label: t('stats.orders'), value: profile?.orders },
    { label: t('stats.referrals'), value: profile?.referrals },
    { label: t('stats.stars'), value: profile?.stars },
  ];

  return (
    <Page>
      <Section className="pt-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted">{t('home.greeting')}</p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {user?.first_name || t('common.guest')}
            </h1>
          </div>
          <button type="button" onClick={() => navigate('/profile')} aria-label={t('nav.profile')}>
            <Avatar user={user} size={44} />
          </button>
        </div>

        {/* Balance */}
        <div className="rounded-2xl bg-fg p-5 text-inverse">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-60">{t('home.balance')}</span>
            {error && (
              <button type="button" onClick={refresh} aria-label={t('common.retry')} className="opacity-60">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
          <div className="mt-2 h-9 text-3xl font-semibold tracking-tight">
            {loading ? (
              <Skeleton className="h-8 w-40 bg-inverse/10" />
            ) : (
              formatSom(profile?.balance ?? 0, t('common.som'))
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/balance')}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-inverse/10 text-sm font-semibold transition-colors hover:bg-inverse/15"
          >
            <Plus size={16} />
            {t('home.deposit')}
          </button>
        </div>

        {/* Services */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted">
            {t('home.services')}
          </h2>
          <div className="space-y-2">
            {SERVICES.map(({ path, icon: Icon, key, iconClass, bg }, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <Card onClick={() => navigate(path)} className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${bg}`}>
                    <Icon size={22} className={iconClass} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t(`home.services_list.${key}.title`)}</span>
                    <span className="block truncate text-sm text-muted">
                      {t(`home.services_list.${key}.desc`)}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-muted/60" />
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <Card padded={false}>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex w-full items-center justify-between border-b border-line px-4 py-3"
          >
            <span className="text-sm font-medium">{t('home.statistics')}</span>
            <ChevronRight size={18} className="text-muted/60" />
          </button>
          <div className="grid grid-cols-3 divide-x divide-line py-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 px-2">
                {loading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <span className="text-xl font-semibold">{formatNumber(s.value ?? 0)}</span>
                )}
                <span className="truncate text-xs text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {error && !loading && (
          <Button variant="secondary" fullWidth icon={RefreshCw} onClick={refresh}>
            {t('common.retry')}
          </Button>
        )}
      </Section>
    </Page>
  );
}

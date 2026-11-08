/**
 * Profile (accent: blue): identity, stats and shortcuts.
 */
import { useNavigate } from 'react-router-dom';
import { Copy, LifeBuoy, ListOrdered, Settings, Star, Users, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../components/ui/Toast';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import Avatar from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { ListGroup, ListItem } from '../components/ui/List';
import { copyToClipboard } from '../utils/clipboard';
import { formatNumber, formatSom } from '../utils/format';
import { openTelegramLink } from '../lib/telegram';
import { LINKS } from '../config';

export default function Profile() {
  const { t } = useLanguage();
  const { user, profile, loading } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || t('common.guest');

  const copyId = async () => {
    if (!user?.id) return;
    const ok = await copyToClipboard(String(user.id));
    showToast(ok ? t('profile.id_copied') : t('balance_page.copy_error'), ok ? 'success' : 'error');
  };

  const stats = [
    { icon: Wallet, label: t('stats.balance'), value: formatSom(profile?.balance ?? 0, t('common.som')) },
    { icon: ListOrdered, label: t('stats.orders'), value: formatNumber(profile?.orders ?? 0) },
    { icon: Star, label: t('stats.stars'), value: formatNumber(profile?.stars ?? 0) },
    { icon: Users, label: t('stats.referrals'), value: formatNumber(profile?.referrals ?? 0) },
  ];

  return (
    <Page>
      <Header title={t('profile.title')} />

      <Section>
        {/* Identity */}
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
          <Avatar user={user} size={56} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{fullName}</p>
            <p className="truncate text-sm text-muted">
              {user?.username ? `@${user.username}` : t('recipient.no_username')}
            </p>
            {user?.id && (
              <button
                type="button"
                onClick={copyId}
                className="mt-1 inline-flex items-center gap-1 text-xs text-blue-500"
              >
                ID: {user.id}
                <Copy size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-line bg-surface p-4">
              <Icon size={18} className="mb-3 text-blue-500" />
              <p className="text-xs text-muted">{label}</p>
              {loading ? (
                <Skeleton className="mt-1.5 h-5 w-20" />
              ) : (
                <p className="mt-0.5 truncate font-semibold">{value}</p>
              )}
            </div>
          ))}
        </div>

        <ListGroup title={t('profile.manage')}>
          <ListItem
            icon={Wallet}
            iconClassName="text-blue-500"
            title={t('profile.deposit')}
            subtitle={t('profile.deposit_hint')}
            onClick={() => navigate('/balance')}
          />
          <ListItem
            icon={Settings}
            iconClassName="text-blue-500"
            title={t('profile.settings')}
            subtitle={t('profile.settings_hint')}
            onClick={() => navigate('/settings')}
          />
          <ListItem
            icon={LifeBuoy}
            iconClassName="text-blue-500"
            title={t('settings.support_chat')}
            subtitle={t('settings.support_chat_hint')}
            onClick={() => openTelegramLink(LINKS.supportChat)}
          />
        </ListGroup>
      </Section>
    </Page>
  );
}

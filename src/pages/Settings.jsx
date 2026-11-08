/**
 * Settings: language, notifications, appearance, support, account.
 */
import { useState } from 'react';
import {
  Bell, Check, Globe, Info, MessageCircle, Monitor, Moon, Sun, Trash2, UserRound,
} from 'lucide-react';
import { useLanguage, LANGUAGES, translate } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/ui/Toast';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import Segmented from '../components/ui/Segmented';
import Switch from '../components/ui/Switch';
import { ListGroup, ListItem } from '../components/ui/List';
import { cn } from '../utils/cn';
import { storage } from '../utils/storage';
import { haptic, openTelegramLink } from '../lib/telegram';
import { APP_VERSION, LINKS } from '../config';

export default function Settings() {
  const { t, language, changeLanguage } = useLanguage();
  const { mode, setMode } = useTheme();
  const { showToast } = useToast();

  const [sheet, setSheet] = useState(null); // 'language' | 'about' | 'delete' | null
  const [notifications, setNotifications] = useState(() => storage.get('notifications') !== 'off');

  const closeSheet = () => setSheet(null);
  const currentLanguage = LANGUAGES.find((l) => l.code === language);

  const handleLanguage = (code) => {
    closeSheet();
    if (code === language) return;
    changeLanguage(code);
    // Confirm in the newly selected language
    showToast(translate(code, 'settings.language_changed'), 'success');
  };

  const handleNotifications = (on) => {
    haptic.select();
    setNotifications(on);
    storage.set('notifications', on ? 'on' : 'off');
    showToast(on ? t('settings.notifications_on_toast') : t('settings.notifications_off_toast'), 'info');
  };

  const handleTheme = (next) => {
    setMode(next);
    showToast(t(`settings.theme_toast.${next}`), 'info');
  };

  const handleDelete = () => {
    closeSheet();
    showToast(t('settings.delete_toast'), 'warning');
    openTelegramLink(LINKS.admin);
  };

  return (
    <Page>
      <Header title={t('settings.title')} />

      <Section className="space-y-6">
        <ListGroup title={t('settings.general')}>
          <ListItem
            icon={Globe}
            title={t('settings.language')}
            subtitle={currentLanguage?.label}
            onClick={() => setSheet('language')}
          />
          <ListItem
            icon={Bell}
            title={t('settings.notifications')}
            subtitle={notifications ? t('settings.on') : t('settings.off')}
            right={
              <Switch checked={notifications} onChange={handleNotifications} label={t('settings.notifications')} />
            }
          />
        </ListGroup>

        <section>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted">
            {t('settings.appearance')}
          </h2>
          <Segmented
            layoutId="theme-mode"
            value={mode}
            onChange={handleTheme}
            options={[
              { value: 'auto', label: t('settings.theme.auto'), icon: Monitor },
              { value: 'light', label: t('settings.theme.light'), icon: Sun },
              { value: 'dark', label: t('settings.theme.dark'), icon: Moon },
            ]}
          />
          <p className="mt-2 px-1 text-xs text-muted">{t('settings.theme_hint')}</p>
        </section>

        <ListGroup title={t('settings.support')}>
          <ListItem
            icon={MessageCircle}
            title={t('settings.support_chat')}
            subtitle={t('settings.support_chat_hint')}
            onClick={() => openTelegramLink(LINKS.supportChat)}
          />
          <ListItem
            icon={UserRound}
            title={t('settings.admin')}
            subtitle={t('settings.admin_hint')}
            onClick={() => openTelegramLink(LINKS.admin)}
          />
          <ListItem
            icon={Info}
            title={t('settings.about')}
            subtitle={t('settings.about_hint')}
            onClick={() => setSheet('about')}
          />
        </ListGroup>

        <ListGroup title={t('settings.account')}>
          <ListItem
            icon={Trash2}
            danger
            title={t('settings.delete')}
            subtitle={t('settings.delete_hint')}
            onClick={() => setSheet('delete')}
          />
        </ListGroup>

        <p className="text-center text-xs text-muted">
          Stars Bot · {t('settings.version')} {APP_VERSION}
        </p>
      </Section>

      {/* Language sheet */}
      <BottomSheet isOpen={sheet === 'language'} onClose={closeSheet} title={t('settings.language')}>
        <div className="space-y-2">
          {LANGUAGES.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguage(lang.code)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors',
                  active ? 'border-fg bg-surface' : 'border-line bg-surface hover:border-fg/20',
                )}
              >
                <span>
                  <span className="block font-medium">{lang.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{lang.desc}</span>
                </span>
                {active && (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-fg text-inverse">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* About sheet */}
      <BottomSheet isOpen={sheet === 'about'} onClose={closeSheet} title={t('settings.about')}>
        <p className="mb-4 text-sm text-muted">{t('settings.about_text')}</p>
        <dl className="mb-4 divide-y divide-line rounded-xl border border-line bg-surface px-4 text-sm">
          {[
            [t('settings.version'), APP_VERSION],
            [t('settings.developer'), LINKS.adminUsername],
            [t('settings.support_hours'), '24/7'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <Button fullWidth variant="secondary" onClick={closeSheet}>
          {t('common.close')}
        </Button>
      </BottomSheet>

      {/* Delete confirmation */}
      <BottomSheet isOpen={sheet === 'delete'} onClose={closeSheet} title={t('settings.delete_confirm_title')}>
        <p className="mb-5 text-sm text-muted">{t('settings.delete_confirm_text')}</p>
        <div className="space-y-2">
          <Button fullWidth variant="danger" icon={Trash2} onClick={handleDelete}>
            {t('settings.delete_yes')}
          </Button>
          <Button fullWidth variant="secondary" onClick={closeSheet}>
            {t('common.cancel')}
          </Button>
        </div>
      </BottomSheet>
    </Page>
  );
}

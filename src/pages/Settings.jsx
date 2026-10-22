import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTelegram } from '../hooks/useTelegram';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import {
  Globe, Bell, Moon, Sun, Shield, Trash2, Info, ChevronRight,
  Check, MessageCircle, FileText
} from 'lucide-react';

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", desc: "O'zbek tili (lotin)" },
  { code: 'kril', label: "Узбекча", desc: "O'zbek tili (kirill)" },
  { code: 'ru', label: "Русский", desc: "Русский язык" },
];

export default function Settings() {
  const { t, language, changeLanguage } = useLanguage();
  const { WebApp, theme } = useTelegram();
  const { showToast } = useToast();

  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [showAbout, setShowAbout] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setShowLanguageSheet(false);
    showToast(t('settings.language_changed'), 'success');
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    showToast(
      notifications ? t('settings.notifications_off_toast') : t('settings.notifications_on_toast'),
      'info'
    );
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      WebApp?.setHeaderColor('secondary_bg_color');
    } else {
      document.documentElement.classList.remove('dark');
      WebApp?.setHeaderColor('bg_color');
    }
    showToast(
      newMode ? t('settings.dark_on_toast') : t('settings.dark_off_toast'),
      'info'
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    showToast(t('toast.delete_account'), 'warning');
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <Page>
      <Header title={t('settings.title')} showBack />

      <div className="px-4 py-4">
        <h2 className="text-xs font-bold text-tg-hint mb-2 uppercase tracking-wider">
          {t('settings.main')}
        </h2>
        <div className="bg-tg-secondaryBg rounded-2xl border border-tg-hint/5 overflow-hidden">
          <button
            onClick={() => setShowLanguageSheet(true)}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-tg-hint/10 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Globe size={18} className="text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.language')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{currentLang?.label}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>

          <div className="w-full flex items-center gap-3 px-4 py-4 border-b border-tg-hint/10">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bell size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.notifications')}</p>
              <p className="text-xs text-tg-hint mt-0.5">
                {notifications ? t('settings.notifications_on') : t('settings.notifications_off')}
              </p>
            </div>
            <button
              onClick={handleNotificationsToggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifications ? 'bg-emerald-500' : 'bg-tg-hint/30'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="w-full flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              {darkMode ? (
                <Moon size={18} className="text-violet-500" />
              ) : (
                <Sun size={18} className="text-violet-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.dark_mode')}</p>
              <p className="text-xs text-tg-hint mt-0.5">
                {darkMode ? t('settings.dark_on') : t('settings.dark_off')}
              </p>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-emerald-500' : 'bg-tg-hint/30'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-xs font-bold text-tg-hint mb-2 uppercase tracking-wider">
          {t('settings.support')}
        </h2>
        <div className="bg-tg-secondaryBg rounded-2xl border border-tg-hint/5 overflow-hidden">
          <button
            onClick={() => {
              WebApp?.openTelegramLink('https://t.me/starsrkhim_chat');
            }}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-tg-hint/10 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MessageCircle size={18} className="text-cyan-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.support_chat')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('settings.support_chat_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>

          <button
            onClick={() => {
              WebApp?.openTelegramLink('https://t.me/starsrkhim_admin');
            }}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-tg-hint/10 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield size={18} className="text-emerald-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.admin')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('settings.admin_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="w-full flex items-center gap-3 px-4 py-4 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-500/10 flex items-center justify-center">
              <Info size={18} className="text-tg-hint" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{t('settings.about')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('settings.about_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-xs font-bold text-tg-hint mb-2 uppercase tracking-wider">
          {t('settings.account')}
        </h2>
        <div className="bg-tg-secondaryBg rounded-2xl border border-tg-hint/5 overflow-hidden">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-4 active:bg-tg-hint/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-red-500">{t('settings.delete')}</p>
              <p className="text-xs text-tg-hint mt-0.5">{t('settings.delete_hint')}</p>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 text-center">
        <p className="text-xs text-tg-hint">Stars Bot</p>
        <p className="text-xs text-tg-hint mt-1">{t('settings.version')} 1.0.0</p>
      </div>

      {/* Bottom sheets */}
      <BottomSheet isOpen={showLanguageSheet} onClose={() => setShowLanguageSheet(false)}>
        <h3 className="text-lg font-bold mb-4">{t('settings.language')}</h3>
        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                language === lang.code
                  ? 'border-gray-900 dark:border-white bg-tg-secondaryBg'
                  : 'border-tg-hint/10 bg-tg-bg hover:bg-tg-secondaryBg'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold">{lang.label}</p>
                <p className="text-xs text-tg-hint mt-0.5">{lang.desc}</p>
              </div>
              {language === lang.code && (
                <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                  <Check size={14} className="text-white dark:text-gray-900" />
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showAbout} onClose={() => setShowAbout(false)}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stars Bot</h3>
          <p className="text-sm text-tg-hint mb-6">
            Telegram Stars, Premium va raqamlarni sotib olish uchun eng qulay bot
          </p>
          <div className="bg-tg-secondaryBg rounded-xl p-4 text-left space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">{t('settings.version')}</span>
              <span className="font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">{t('settings.developer')}</span>
              <span className="font-semibold">@starsrkhim_admin</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">{t('settings.support_247')}</span>
              <span className="font-semibold">24/7</span>
            </div>
          </div>
          <Button fullWidth onClick={() => setShowAbout(false)}>
            {t('settings.close')}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('settings.delete_confirm_title')}</h3>
          <p className="text-sm text-tg-hint mb-6">
            {t('settings.delete_confirm_text')}
          </p>
          <div className="space-y-2">
            <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
              {t('settings.delete_yes')}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setShowDeleteConfirm(false)}>
              {t('settings.cancel')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </Page>
  );
}

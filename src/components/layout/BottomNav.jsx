import { Home, Star, Crown, Gift, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLanguage();

  const items = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/stars', icon: Star, label: t('nav.stars') },
    { path: '/premium', icon: Crown, label: t('nav.premium') },
    { path: '/gift', icon: Gift, label: t('nav.gift') },     // ← Nomer o'rniga Gift
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-tg-secondaryBg border-t border-tg-hint/10">
      <div className="flex justify-around py-2 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon
                size={22}
                className={cn(
                  'transition-colors',
                  isActive ? 'text-tg-text' : 'text-tg-hint'
                )}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={cn(
                  'text-[10px]',
                  isActive ? 'font-bold text-tg-text' : 'font-medium text-tg-hint'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

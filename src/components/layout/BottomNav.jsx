import { Crown, Gift, Home, Star, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';
import { haptic } from '../../lib/telegram';

const ITEMS = [
  { path: '/', icon: Home, key: 'nav.home' },
  { path: '/stars', icon: Star, key: 'nav.stars' },
  { path: '/premium', icon: Crown, key: 'nav.premium' },
  { path: '/gift', icon: Gift, key: 'nav.gift' },
  { path: '/profile', icon: User, key: 'nav.profile' },
];

// Sub-pages that highlight a parent tab
const PARENT = { '/settings': '/profile', '/balance': '/profile' };

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const activePath = PARENT[pathname] || pathname;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/85 pb-safe backdrop-blur-xl">
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {ITEMS.map(({ path, icon: Icon, key }) => {
          const active = activePath === path;
          return (
            <li key={path}>
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  // Ignore taps on the current screen only; sub-pages (e.g.
                  // /settings) still navigate back to their parent tab.
                  if (pathname === path) return;
                  haptic.select();
                  navigate(path);
                }}
                className={cn(
                  'relative flex h-full w-full flex-col items-center justify-center gap-1 transition-colors',
                  active ? 'text-fg' : 'text-muted',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-fg"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className={cn('text-[10px]', active ? 'font-semibold' : 'font-medium')}>{t(key)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

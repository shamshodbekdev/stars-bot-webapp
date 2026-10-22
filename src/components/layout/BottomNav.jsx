import { Home, Star, Crown, Phone, Gift, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const items = [
  { path: '/', icon: Home, label: 'Asosiy' },
  { path: '/stars', icon: Star, label: 'Stars' },
  { path: '/premium', icon: Crown, label: 'Premium' },
  { path: '/numbers', icon: Phone, label: 'Nomer' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-tg-bg/95 backdrop-blur-lg border-t border-tg-hint/10">
      <div className="flex justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-500/10 rounded-xl"
                />
              )}
              <Icon
                size={22}
                className={isActive ? 'text-primary-500' : 'text-tg-hint'}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-primary-500' : 'text-tg-hint'
                }`}
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

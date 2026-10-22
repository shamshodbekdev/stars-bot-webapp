import { useTelegram } from '../hooks/useTelegram';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import {
  User, Wallet, Star, Gift, TrendingUp, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { formatSom } from '../utils/format';

export default function Profile() {
  const { user } = useTelegram();

  const menuItems = [
    { icon: Wallet, label: 'Balans', value: formatSom(0) },
    { icon: Star, label: 'Stars', value: '0' },
    { icon: Gift, label: 'Referallar', value: '0' },
    { icon: TrendingUp, label: 'Buyurtmalar', value: '0' },
  ];

  return (
    <Page>
      <Header title="Profil" showBack />

      {/* User card */}
      <div className="px-4 py-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.first_name?.[0] || 'S'}
            </div>
            <div>
              <p className="font-bold text-lg">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-tg-hint">
                @{user?.username || 'username'}
              </p>
              <p className="text-xs text-tg-hint mt-1">
                ID: {user?.id}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistika */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i}>
                <Icon size={18} className="text-primary-500 mb-2" />
                <p className="text-xs text-tg-hint">{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sozlamalar */}
      <div className="px-4">
        <Card>
          {[
            { icon: Settings, label: "Sozlamalar" },
            { icon: LogOut, label: "Chiqish" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                className="flex items-center gap-3 w-full py-3 border-b border-tg-hint/10 last:border-0"
              >
                <Icon size={18} className="text-tg-hint" />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                <ChevronRight size={18} className="text-tg-hint" />
              </button>
            );
          })}
        </Card>
      </div>
    </Page>
  );
}

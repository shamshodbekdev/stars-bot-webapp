import { useTelegram } from '../hooks/useTelegram';
import Page from '../components/layout/Page';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Star, Crown, Phone, Gift, Wallet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatSom } from '../utils/format';

export default function Home() {
  const { user } = useTelegram();
  const navigate = useNavigate();

  const services = [
    { path: '/stars', icon: Star, title: 'Stars', desc: 'Sotib olish' },
    { path: '/premium', icon: Crown, title: 'Premium', desc: 'Sotib olish' },
    { path: '/numbers', icon: Phone, title: 'Nomer', desc: 'Olish' },
    { path: '/gift', icon: Gift, title: 'Gift', desc: 'Market' },
  ];

  return (
    <Page>
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-bold">
            {user?.first_name?.[0] || 'S'}
          </div>
          <div>
            <h1 className="text-lg font-bold">
              Salom, {user?.first_name || 'Mehmon'}!
            </h1>
            <p className="text-sm text-tg-hint">
              Stars Bot ga xush kelibsiz
            </p>
          </div>
        </div>
      </div>

      {/* Balans kartochkasi */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Balansingiz</span>
            <Wallet size={20} className="opacity-90" />
          </div>
          <div className="text-3xl font-bold">{formatSom(0)}</div>
          <div className="mt-4">
            <Button
              onClick={() => navigate('/balance')}
              variant="secondary"
              size="sm"
              fullWidth
            >
              Pul kiritish
            </Button>
          </div>
        </div>
      </div>

      {/* Xizmatlar */}
      <div className="px-4 mb-4">
        <h2 className="text-sm font-semibold text-tg-hint mb-3">Xizmatlar</h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.path} onClick={() => navigate(service.path)}>
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-primary-500" />
                </div>
                <p className="font-semibold">{service.title}</p>
                <p className="text-xs text-tg-hint">{service.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Statistika */}
      <div className="px-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-primary-500" />
            <span className="text-sm font-semibold">Statistika</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-tg-hint">Buyurtmalar</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-tg-hint">Referallar</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-tg-hint">Stars</p>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}

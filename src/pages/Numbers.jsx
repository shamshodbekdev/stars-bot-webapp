import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { Phone } from 'lucide-react';

export default function Numbers() {
  return (
    <Page>
      <Header title="Nomer olish" showBack />
      <div className="p-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={18} className="text-primary-500" />
            <span className="text-sm font-medium">Davlatlar ro'yxati</span>
          </div>
          <p className="text-xs text-tg-hint">Tez orada...</p>
        </Card>
      </div>
    </Page>
  );
}

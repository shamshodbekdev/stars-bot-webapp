import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Wallet } from 'lucide-react';

export default function Balance() {
  return (
    <Page>
      <Header title="Pul kiritish" showBack />
      <div className="p-4 space-y-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={18} className="text-primary-500" />
            <span className="text-sm font-medium">Karta raqami</span>
          </div>
          <p className="text-xs text-tg-hint">Tez orada...</p>
        </Card>
        <Button fullWidth size="lg">Chek yuborish</Button>
      </div>
    </Page>
  );
}

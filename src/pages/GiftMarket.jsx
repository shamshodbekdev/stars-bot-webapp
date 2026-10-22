import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { Gift } from 'lucide-react';

export default function GiftMarket() {
  return (
    <Page>
      <Header title="Gift Market" showBack />
      <div className="p-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Gift size={18} className="text-primary-500" />
            <span className="text-sm font-medium">Sovg'alar</span>
          </div>
          <p className="text-xs text-tg-hint">Tez orada...</p>
        </Card>
      </div>
    </Page>
  );
}

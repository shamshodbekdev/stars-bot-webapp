import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Crown } from 'lucide-react';
import { useState } from 'react';

export default function Premium() {
  const [months, setMonths] = useState(3);
  return (
    <Page>
      <Header title="Premium" showBack />
      <div className="p-4 space-y-4">
        <Card>
          <label className="text-sm font-medium block mb-3">Muddat</label>
          <div className="grid grid-cols-3 gap-2">
            {[3, 6, 12].map((m) => (
              <button key={m} onClick={() => setMonths(m)}
                className={`py-2.5 rounded-xl font-medium text-sm ${
                  months === m ? 'bg-primary-500 text-white' : 'bg-tg-bg'
                }`}>{m} oy</button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-tg-hint">Narx</span>
            <span className="font-semibold">—</span>
          </div>
        </Card>
        <Button fullWidth size="lg">Tasdiqlash</Button>
      </div>
    </Page>
  );
}

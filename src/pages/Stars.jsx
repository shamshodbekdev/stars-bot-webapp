import { useState } from 'react';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Star, User } from 'lucide-react';

export default function Stars() {
  const [quantity, setQuantity] = useState(50);
  const [username, setUsername] = useState('');

  const amounts = [50, 100, 250, 500, 1000, 2500];

  return (
    <Page>
      <Header title="Stars sotib olish" showBack />

      <div className="p-4 space-y-4">
        {/* Username */}
        <Card>
          <label className="text-sm font-medium block mb-2">
            Qabul qiluvchi username
          </label>
          <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-2.5">
            <User size={18} className="text-tg-hint" />
            <input
              type="text"
              placeholder="@username yoki bo'sh qoldiring"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
        </Card>

        {/* Miqdor */}
        <Card>
          <label className="text-sm font-medium block mb-3">
            Stars miqdori
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {amounts.map((a) => (
              <button
                key={a}
                onClick={() => setQuantity(a)}
                className={`py-2.5 rounded-xl font-medium text-sm transition-all ${
                  quantity === a
                    ? 'bg-primary-500 text-white'
                    : 'bg-tg-bg text-tg-text'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-tg-bg rounded-xl px-3 py-2.5">
            <Star size={18} className="text-yellow-500" />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
        </Card>

        {/* Narx */}
        <Card>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-tg-hint">Narx</span>
            <span className="font-semibold">4 500 so'm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-tg-hint">Balans</span>
            <span className="font-semibold">0 so'm</span>
          </div>
        </Card>

        <Button fullWidth size="lg">
          Tasdiqlash
        </Button>
      </div>
    </Page>
  );
}

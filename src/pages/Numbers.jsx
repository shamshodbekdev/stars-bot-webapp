import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import { Search, ChevronRight, Phone } from 'lucide-react';
import { formatSom } from '../utils/format';

const countries = [
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', price: 12000 },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷', price: 15000 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', price: 18000 },
  { code: 'US', name: 'United States', flag: '🇺🇸', price: 20000 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', price: 22000 },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', price: 14000 },
];

export default function Numbers() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = () => {
    showToast(t('toast.number_buy'), 'info');
    setSelected(null);
    setTimeout(() => showToast(t('toast.number_success'), 'success'), 1500);
  };

  return (
    <Page>
      <Header title={t('numbers_page.title')} showBack />

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 bg-tg-secondaryBg rounded-xl px-3 py-3 border border-tg-hint/5">
          <Search size={18} className="text-tg-hint" />
          <input
            type="text"
            placeholder={t('numbers_page.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelected(country)}
              className="w-full flex items-center justify-between p-4 bg-tg-secondaryBg rounded-xl border border-tg-hint/5 hover:border-tg-hint/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">{country.name}</p>
                  <p className="text-xs text-tg-hint">{country.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{formatSom(country.price)}</span>
                <ChevronRight size={18} className="text-tg-hint" />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-tg-hint text-sm">
            {t('numbers_page.not_found')}
          </div>
        )}
      </div>

      <BottomSheet isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selected.flag}</span>
              <div>
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-sm text-tg-hint">{selected.code}</p>
              </div>
            </div>
            <div className="space-y-2 py-4 border-y border-tg-hint/10">
              <div className="flex justify-between text-sm">
                <span className="text-tg-hint">{t('numbers_page.price')}</span>
                <span className="font-semibold">{formatSom(selected.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tg-hint">{t('numbers_page.balance')}</span>
                <span className="font-semibold">0 {t('common.som')}</span>
              </div>
            </div>
            <Button fullWidth size="lg" onClick={handleBuy} icon={Phone}>
              {t('numbers_page.buy')}
            </Button>
          </div>
        )}
      </BottomSheet>
    </Page>
  );
}

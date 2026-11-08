/**
 * Gift market (accent: rose): search, categories, grid and a purchase sheet.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, Search, Send, Star, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecipient } from '../hooks/useRecipient';
import { usePurchase } from '../hooks/usePurchase';
import Page, { Section } from '../components/layout/Page';
import Header from '../components/layout/Header';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import GiftImage from '../components/ui/GiftImage';
import RecipientField from '../components/order/RecipientField';
import { GIFTS, CATEGORIES } from '../data/gifts';
import { cn } from '../utils/cn';
import { formatSom } from '../utils/format';
import { haptic } from '../lib/telegram';

const MESSAGE_LIMIT = 255;

export default function GiftMarket() {
  const { t } = useLanguage();
  const { recipient, setRecipient, error: recipientError, validate, reset } = useRecipient();
  const { purchase, loading } = usePurchase();

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  const som = t('common.som');
  const giftName = (gift) => t(`gifts.items.${gift.id}.name`);

  // Filter by category and by the translated name
  const gifts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GIFTS.filter(
      (g) =>
        (category === 'all' || g.category === category) &&
        (!q || t(`gifts.items.${g.id}.name`).toLowerCase().includes(q)),
    );
  }, [category, query, t]);

  const closeSheet = () => {
    if (loading) return;
    setSelected(null);
  };

  const openGift = (gift) => {
    haptic.impact('light');
    reset();
    setMessage('');
    setSelected(gift);
  };

  const handleBuy = async () => {
    const username = validate();
    if (!username) return haptic.notify('error');
    const ok = await purchase({
      type: 'gift',
      giftId: selected.id,
      username,
      message: message.trim(),
      price: selected.price,
    });
    if (ok) setSelected(null);
  };

  return (
    <Page>
      <Header title={t('gift_page.title')} />

      <Section className="space-y-3">
        {/* Search */}
        <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 focus-within:border-fg/40">
          <Search size={18} className="shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('gift_page.search')}
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/60 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label={t('common.clear')} className="text-muted">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
          <div className="flex gap-2">
            {CATEGORIES.map((id) => {
              const active = category === id;
              const count = id === 'all' ? GIFTS.length : GIFTS.filter((g) => g.category === id).length;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    haptic.select();
                    setCategory(id);
                  }}
                  className={cn(
                    'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
                    active ? 'border-fg bg-fg text-inverse' : 'border-line bg-surface text-muted hover:text-fg',
                  )}
                >
                  {t(`gifts.categories.${id}`)}
                  <span className={cn('text-xs', active ? 'opacity-60' : 'opacity-70')}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {gifts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PackageSearch size={36} strokeWidth={1.5} className="mb-3 text-muted/60" />
            <p className="font-medium">{t('gift_page.empty_title')}</p>
            <p className="mt-1 text-sm text-muted">{t('gift_page.empty_text')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-1 min-[420px]:grid-cols-3">
            {gifts.map((gift, i) => (
              <motion.button
                key={gift.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openGift(gift)}
                className="rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:border-rose-500/40"
              >
                <GiftImage src={gift.image} alt={giftName(gift)} className="mb-3 rounded-xl bg-fg/[0.03] p-2" />
                <p className="truncate text-sm font-semibold">{giftName(gift)}</p>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-rose-500">{formatSom(gift.price, som)}</span>
                  <span className="flex items-center gap-0.5 text-xs text-muted">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    {gift.stars}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </Section>

      {/* Purchase sheet */}
      <BottomSheet isOpen={Boolean(selected)} onClose={closeSheet} title={selected ? giftName(selected) : ''}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <GiftImage
                src={selected.image}
                alt={giftName(selected)}
                eager
                className="w-24 shrink-0 rounded-2xl border border-line bg-surface p-2"
              />
              <div className="min-w-0">
                <p className="text-sm text-muted">{t(`gifts.items.${selected.id}.desc`)}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{formatSom(selected.price, som)}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  {t('gift_page.stars_value', { n: selected.stars })}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">{t('gift_page.recipient')}</p>
              <RecipientField
                layoutId="gift-recipient"
                value={recipient}
                onChange={setRecipient}
                error={recipientError}
              />
            </div>

            <div>
              <label htmlFor="gift-message" className="mb-2 flex justify-between text-sm font-medium">
                {t('gift_page.message')}
                <span className="font-normal text-muted">{t('common.optional')}</span>
              </label>
              <textarea
                id="gift-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_LIMIT))}
                placeholder={t('gift_page.message_placeholder')}
                rows={3}
                className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[15px] outline-none placeholder:text-muted/60 focus:border-fg/40"
              />
              <p className="mt-1 text-right text-xs text-muted">
                {message.length}/{MESSAGE_LIMIT}
              </p>
            </div>

            <Button fullWidth size="lg" icon={Send} loading={loading} onClick={handleBuy}>
              {t('gift_page.send', { price: formatSom(selected.price, som) })}
            </Button>
          </div>
        )}
      </BottomSheet>
    </Page>
  );
}

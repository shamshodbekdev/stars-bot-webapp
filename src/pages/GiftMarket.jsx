import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTelegram } from '../hooks/useTelegram';
import { useToast } from '../components/ui/Toast';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import { GIFTS, CATEGORIES } from '../data/gifts';
import { formatSom } from '../utils/format';
import { Search, Star, Send, User, Check, Image as ImageIcon } from 'lucide-react';

// Lazy-loaded gift image
function GiftImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="aspect-square bg-tg-bg rounded-xl mb-3 flex items-center justify-center overflow-hidden relative p-2">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-tg-hint/10 animate-pulse" />
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center text-tg-hint">
          <ImageIcon size={32} className="opacity-30" />
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function GiftMarket() {
  const { t, language } = useLanguage();
  const { user } = useTelegram();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedGift, setSelectedGift] = useState(null);
  const [recipient, setRecipient] = useState('self');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [message, setMessage] = useState('');

  const filteredGifts = useMemo(() => {
    let list = GIFTS;
    if (activeCategory !== 'all') {
      list = list.filter(g => g.category === activeCategory);
    }
    if (search) {
      list = list.filter(g =>
        g.name[language].toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [activeCategory, search, language]);

  const handleBuy = () => {
    if (recipient === 'someone' && !recipientUsername.trim()) {
      showToast('Username kiriting', 'error');
      return;
    }
    showToast(`Sovg'a yuborilmoqda...`, 'info');
    setTimeout(() => {
      showToast('Sovg\'a muvaffaqiyatli yuborildi!', 'success');
      setSelectedGift(null);
      setRecipient('self');
      setRecipientUsername('');
      setMessage('');
    }, 1500);
  };

  return (
    <Page>
      <Header title="Gift Market" showBack />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 bg-tg-secondaryBg rounded-xl px-3 py-3 border border-tg-hint/5">
          <Search size={18} className="text-tg-hint" />
          <input
            type="text"
            placeholder="Sovg'a qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-tg-secondaryBg text-tg-hint'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Gifts grid */}
      <div className="px-4 pb-6">
        {filteredGifts.length === 0 ? (
          <div className="text-center py-12 text-tg-hint text-sm">
            Giftlar topilmadi
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredGifts.map((gift, i) => (
              <motion.button
                key={gift.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedGift(gift)}
                className="bg-tg-secondaryBg rounded-2xl p-3 text-center border border-tg-hint/5 hover:border-tg-hint/20 transition-colors"
              >
                <GiftImage src={gift.image} alt={gift.name[language]} />
                <p className="font-semibold text-sm">{gift.name[language]}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs text-tg-hint">{gift.stars}</span>
                </div>
                <p className="font-bold text-sm mt-1">{formatSom(gift.price)}</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Gift detail sheet */}
      <BottomSheet isOpen={!!selectedGift} onClose={() => setSelectedGift(null)}>
        {selectedGift && (
          <div className="space-y-5">
            {/* Gift preview */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-tg-secondaryBg rounded-2xl flex items-center justify-center overflow-hidden mb-4 relative">
                <GiftImage src={selectedGift.image} alt={selectedGift.name[language]} />
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="text-sm text-tg-hint">{selectedGift.stars}</span>
              </div>
              <p className="text-2xl font-bold">{formatSom(selectedGift.price)}</p>
            </div>

            {/* Recipient */}
            <div>
              <p className="text-sm font-semibold mb-2">Kimga yuborilsin?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRecipient('self')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-sm transition-colors ${
                    recipient === 'self'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-tg-secondaryBg text-tg-text'
                  }`}
                >
                  <User size={16} />
                  O'zimga
                </button>
                <button
                  onClick={() => setRecipient('someone')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-sm transition-colors ${
                    recipient === 'someone'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-tg-secondaryBg text-tg-text'
                  }`}
                >
                  <Send size={16} />
                  Boshqaga
                </button>
              </div>
              {recipient === 'self' && (
                <p className="text-xs text-tg-hint mt-2 flex items-center gap-1">
                  <Check size={12} className="text-emerald-500" />
                  @{user?.username || 'sizning'}'ga yuboriladi
                </p>
              )}
            </div>

            {/* Username input */}
            {recipient === 'someone' && (
              <div>
                <input
                  type="text"
                  placeholder="@username"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="w-full bg-tg-secondaryBg rounded-xl px-4 py-3 text-sm outline-none"
                />
                <p className="text-xs text-tg-hint mt-1.5">
                  Qabul qiluvchining Telegram @username
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <p className="text-sm font-semibold mb-2">Xabar qo'shish</p>
              <textarea
                placeholder="Yaxshi so'zlar yozing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={255}
                rows={3}
                className="w-full bg-tg-secondaryBg rounded-xl px-4 py-3 text-sm outline-none resize-none"
              />
              <p className="text-xs text-tg-hint text-right mt-1">
                {message.length}/255
              </p>
            </div>

            {/* Buy button */}
            <Button fullWidth size="lg" onClick={handleBuy} icon={Send}>
              Yuborish · {formatSom(selectedGift.price)}
            </Button>
          </div>
        )}
      </BottomSheet>
    </Page>
  );
}

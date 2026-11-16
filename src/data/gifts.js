/**
 * Gift catalogue. Display names and descriptions live in the locale files
 * under `gifts.items.<id>`. Images are static PNGs (first frame of Telegram's
 * own Star Gift artwork) served from /icons/gifts on the web root. `price` is a
 * fallback only: live prices (admin-set, with discount) come from GET /api/config.
 */
export const GIFTS = [
  { id: 'bear', image: '/icons/gifts/bear.png', stars: 15, price: 3900, category: 'regular' },
  { id: 'heart', image: '/icons/gifts/heart.png', stars: 15, price: 3900, category: 'regular' },
  { id: 'rose', image: '/icons/gifts/rose.png', stars: 25, price: 6500, category: 'regular' },
  { id: 'gift', image: '/icons/gifts/gift.png', stars: 25, price: 6500, category: 'regular' },
  { id: 'champagne', image: '/icons/gifts/champagne.png', stars: 50, price: 13000, category: 'regular' },
  { id: 'rocket', image: '/icons/gifts/rocket.png', stars: 50, price: 13000, category: 'unique' },
  { id: 'flower', image: '/icons/gifts/flower.png', stars: 50, price: 13000, category: 'regular' },
  { id: 'cake', image: '/icons/gifts/cake.png', stars: 50, price: 13000, category: 'regular' },
  { id: 'diamond', image: '/icons/gifts/diamond.png', stars: 100, price: 26000, category: 'unique' },
  { id: 'ring', image: '/icons/gifts/ring.png', stars: 100, price: 26000, category: 'unique' },
  { id: 'cup', image: '/icons/gifts/cup.png', stars: 100, price: 26000, category: 'unique' },
];

/** Category ids; labels are in locales under `gifts.categories.<id>`. */
export const CATEGORIES = ['all', 'regular', 'unique'];

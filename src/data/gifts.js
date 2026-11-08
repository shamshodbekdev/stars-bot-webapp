/**
 * Gift catalogue. Display names and descriptions live in the locale files
 * under `gifts.items.<id>`. Images are served from /gifts on the web root.
 */
export const GIFTS = [
  { id: 'bear', image: '/gifts/bear_small.webp', stars: 15, price: 3900, category: 'regular' },
  { id: 'heart', image: '/gifts/heart_small.webp', stars: 15, price: 3900, category: 'regular' },
  { id: 'rose', image: '/gifts/rose_small.webp', stars: 25, price: 6500, category: 'regular' },
  { id: 'gift', image: '/gifts/gift_small.webp', stars: 25, price: 6500, category: 'regular' },
  { id: 'champagne', image: '/gifts/champagne_small.webp', stars: 50, price: 13000, category: 'regular' },
  { id: 'rocket', image: '/gifts/rocket_small.webp', stars: 50, price: 13000, category: 'unique' },
  { id: 'flower', image: '/gifts/flower_small.webp', stars: 50, price: 13000, category: 'regular' },
  { id: 'cake', image: '/gifts/Cake_small.webp', stars: 50, price: 13000, category: 'regular' },
  { id: 'diamond', image: '/gifts/diamond_small.webp', stars: 100, price: 26000, category: 'unique' },
  { id: 'ring', image: '/gifts/ring_small.webp', stars: 100, price: 26000, category: 'unique' },
  { id: 'cup', image: '/gifts/cubic_small.webp', stars: 100, price: 26000, category: 'unique' },
];

/** Category ids; labels are in locales under `gifts.categories.<id>`. */
export const CATEGORIES = ['all', 'regular', 'unique'];

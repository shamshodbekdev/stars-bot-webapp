/**
 * App-wide configuration. Business values live here so they can be changed
 * in one place. Override the API URL with VITE_API_URL in a .env file.
 */

/** Backend base URL. When empty the app runs in demo mode (see utils/api.js). */
export const API_URL = import.meta.env.VITE_API_URL || '';

/** Payment card for manual top-ups. */
export const PAYMENT_CARD = {
  number: '8600 1234 5678 9012',
  holder: 'SHAMSHODBEK X.',
};

/** Support links. */
export const LINKS = {
  supportChat: 'https://t.me/starsrkhim_chat',
  admin: 'https://t.me/starsrkhim_admin',
  adminUsername: '@starsrkhim_admin',
};

export const APP_VERSION = '1.1.0';

/** Telegram Stars pricing. */
export const STARS = {
  pricePerStar: 180, // so'm — must match bot/app/services/shop_catalog.py (server rejects mismatches)
  min: 50,
  max: 1000000,
  presets: [50, 100, 250, 500, 1000, 2500],
};

/**
 * Telegram Premium plans. `bonus` is the saving in percent.
 * Fragment can only gift 3, 6 or 12 months; prices must match the server catalog.
 */
export const PREMIUM_PLANS = [
  { months: 3, price: 160000, bonus: 5, popular: false },
  { months: 6, price: 290000, bonus: 10, popular: true },
  { months: 12, price: 400000, bonus: 20, popular: false },
];

/** Minimum top-up amount in so'm. */
export const MIN_DEPOSIT = 1000;

/** Max receipt image size (bytes). */
export const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

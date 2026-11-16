/**
 * App-wide configuration. Business values live here so they can be changed
 * in one place. Override the API URL with VITE_API_URL in a .env file.
 */

/** Backend base URL. When empty the app runs in demo mode (see utils/api.js). */
export const API_URL = import.meta.env.VITE_API_URL || '';

/** Support links. */
export const LINKS = {
  supportChat: 'https://t.me/starsrkhim_chat',
  admin: 'https://t.me/starsrkhim_admin',
  adminUsername: '@starsrkhim_admin',
};

export const APP_VERSION = '1.1.0';

/** Telegram Stars pricing. */
export const STARS = {
  // Fallback/demo only: real prices come from GET /api/config (hooks/useShopConfig.js).
  pricePerStar: 180, // so'm
  min: 50,
  max: 1000000,
  presets: [50, 100, 250, 500, 1000, 2500],
};

/**
 * Telegram Premium plans. `bonus` is the saving in percent.
 * Premium is sold for 3, 6 or 12 months. `price` / `bonus` are demo fallbacks:
 * live prices and the real saving come from GET /api/config (hooks/useShopConfig.js).
 */
export const PREMIUM_PLANS = [
  { months: 3, price: 160000, bonus: 5, popular: false },
  { months: 6, price: 290000, bonus: 10, popular: true },
  { months: 12, price: 400000, bonus: 20, popular: false },
];

/** Minimum top-up amount in so'm. */
export const MIN_DEPOSIT = 1000;

/** How often the top-up page asks the server whether the transfer arrived (ms). */
export const PAYMENT_POLL_INTERVAL = 4000;

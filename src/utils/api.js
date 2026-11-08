/**
 * API client.
 *
 * - When VITE_API_URL is set, requests go to the real backend and carry the
 *   Telegram initData in the `X-Telegram-Init-Data` header so the server can
 *   verify the user.
 * - When it is not set, the app runs in DEMO mode: calls resolve locally with
 *   a short delay so every loading state can be exercised. Nothing is sent
 *   anywhere in demo mode.
 *
 * Errors are thrown as ApiError with a `code` that maps to a translation key
 * under `errors.*` (e.g. "insufficient_balance").
 */
import { API_URL } from '../config';
import { getInitData } from '../lib/telegram';

export const DEMO_MODE = !API_URL;

export class ApiError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

const TIMEOUT_MS = 15000;

async function request(endpoint, { method = 'GET', body, form } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = { 'X-Telegram-Init-Data': getInitData() };
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: form || (body ? JSON.stringify(body) : undefined),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.code || 'server', data.message);
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
}

/* ----------------------------- Demo backend ----------------------------- */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const demo = {
  profile: { balance: 0, orders: 0, referrals: 0, stars: 0 },

  async getProfile() {
    await wait(500);
    return { ...this.profile };
  },

  /** Purchases are charged from the balance, like the real backend would. */
  async createOrder({ price }) {
    await wait(900);
    if (this.profile.balance < price) throw new ApiError('insufficient_balance');
    this.profile.balance -= price;
    this.profile.orders += 1;
    return { id: Date.now(), status: 'pending' };
  },

  async submitDeposit() {
    await wait(1200);
    return { id: Date.now(), status: 'review' };
  },
};

/* ------------------------------ Public API ------------------------------ */

export const api = {
  /** { balance, orders, referrals, stars } */
  getProfile: () => (DEMO_MODE ? demo.getProfile() : request('/user')),

  /** type: "stars" | "premium" | "gift" */
  createOrder: (order) =>
    DEMO_MODE ? demo.createOrder(order) : request('/orders', { method: 'POST', body: order }),

  /** Sends the top-up amount and the receipt image for admin review. */
  submitDeposit: ({ amount, file }) => {
    if (DEMO_MODE) return demo.submitDeposit();
    const form = new FormData();
    form.append('amount', String(amount));
    form.append('receipt', file);
    return request('/deposits', { method: 'POST', form });
  },
};

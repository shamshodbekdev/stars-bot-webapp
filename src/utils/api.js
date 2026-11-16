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
// Purchases wait for Fragment (up to ~60s). Aborting earlier would show an error
// for an order that may still succeed, and invite the user to pay twice.
const PURCHASE_TIMEOUT_MS = 70000;

async function request(endpoint, { method = 'GET', body, form, timeout = TIMEOUT_MS } = {}) {
  // Outside Telegram (or on a client that sent no initData) the server can only
  // answer 401 — fail fast with a typed error the UI already knows how to show.
  let initData = '';
  try {
    initData = getInitData() || '';
  } catch {
    /* treat as missing */
  }
  if (!initData) throw new ApiError('unauthorized');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = { 'X-Telegram-Init-Data': initData };
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

  /** Fake automatic top-up: "paid" ~8 s after the user presses "I have sent". */
  payments: {},

  async createAutoPayment({ amount }) {
    await wait(700);
    const payment = {
      payment_id: Date.now(),
      status: 'pending',
      amount,
      unique_amount: amount,
      card_number: '9860 0000 0000 0000',
      card_holder: 'DEMO',
      expires_in: 600,
      createdAt: Date.now(),
    };
    this.payments[payment.payment_id] = payment;
    return { ...payment };
  },

  async autoPaymentStatus({ paymentId }) {
    await wait(300);
    const p = this.payments[paymentId];
    if (!p) throw new ApiError('not_found');
    if (p.status === 'pending' && Date.now() - p.createdAt > 8000) {
      p.status = 'paid';
      this.profile.balance += p.unique_amount;
    }
    return { ...p, credited_amount: p.status === 'paid' ? p.unique_amount : null, balance: this.profile.balance };
  },

  async cancelAutoPayment({ paymentId }) {
    const p = this.payments[paymentId];
    if (p && p.status === 'pending') p.status = 'cancelled';
    return { status: p ? p.status : 'cancelled' };
  },
};

/* ------------------------------ Public API ------------------------------ */

/** Backend endpoint + body for each order type (see bot/app/api.py). */
function orderRequest(order) {
  switch (order.type) {
    case 'stars':
      return ['/stars/buy', { username: order.username, quantity: order.quantity, price: order.price }];
    case 'premium':
      return ['/premium/buy', { username: order.username, months: order.months, price: order.price }];
    case 'gift':
      return ['/gift/buy', {
        gift_id: order.giftId, recipient: order.username, message: order.message || '', price: order.price,
      }];
    default:
      throw new ApiError('generic', `Unknown order type: ${order.type}`);
  }
}

export const api = {
  /** { balance, orders, referrals, stars } — mapped from POST /user. */
  getProfile: async () => {
    if (DEMO_MODE) return demo.getProfile();
    const { user } = await request('/user', { method: 'POST' });
    if (!user) throw new ApiError('server');
    return {
      balance: user.balance ?? 0,
      orders: user.total_orders ?? 0,
      referrals: user.referrals ?? 0,
      stars: user.stars_balance ?? 0,
      name: user.name,
      username: user.username,
    };
  },

  /** Last 20 orders, newest first. */
  getOrders: async () => {
    if (DEMO_MODE) return [];
    const { orders } = await request('/orders', { method: 'POST' });
    return Array.isArray(orders) ? orders : [];
  },

  /** { exists: boolean } — whether Fragment knows this username (can receive Stars). */
  checkUsername: async (username) => {
    if (DEMO_MODE) {
      await wait(300);
      return { exists: true };
    }
    return request('/check-username', { method: 'POST', body: { username } });
  },

  /**
   * type: "stars" | "premium" | "gift". The price is sent only so the server
   * can refuse if it differs from what the user saw — the server sets the price.
   */
  createOrder: (order) => {
    if (DEMO_MODE) return demo.createOrder(order);
    const [endpoint, body] = orderRequest(order);
    return request(endpoint, { method: 'POST', body, timeout: PURCHASE_TIMEOUT_MS });
  },

  /**
   * Starts an automatic top-up. The server reserves one of the payment cards
   * and returns { payment_id, card_number, card_holder, amount,
   * expires_in, status }. The user transfers exactly `amount`; the server
   * confirms it by itself (no receipt). Fails with NO_FREE_CARDS when every
   * card already holds someone's pending payment.
   */
  createAutoPayment: ({ amount }) => {
    if (DEMO_MODE) return demo.createAutoPayment({ amount });
    return request('/auto-payment', { method: 'POST', body: { amount } });
  },

  /** { status: "pending" | "paid" | "expired" | "cancelled", balance? (when paid), ... } */
  autoPaymentStatus: ({ paymentId }) => {
    if (DEMO_MODE) return demo.autoPaymentStatus({ paymentId });
    return request('/auto-payment/status', { method: 'POST', body: { payment_id: paymentId } });
  },

  /** Frees the card when the user goes back before paying. */
  cancelAutoPayment: ({ paymentId }) => {
    if (DEMO_MODE) return demo.cancelAutoPayment({ paymentId });
    return request('/auto-payment/cancel', { method: 'POST', body: { payment_id: paymentId } });
  },
};

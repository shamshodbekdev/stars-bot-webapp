/**
 * The order shown on the full-screen "pending" overlay (components/order/OrderPending.jsx).
 *
 * usePurchase() puts every new order here; the overlay is mounted once in App,
 * so it survives page changes. `null` = nothing to show.
 */
import { useSyncExternalStore } from 'react';

let current = null;
const listeners = new Set();

export function showPendingOrder(order) {
  current = order ? { ...order, receivedAt: Date.now() } : null;
  listeners.forEach((fn) => fn());
}

export function clearPendingOrder() {
  showPendingOrder(null);
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function usePendingOrder() {
  return useSyncExternalStore(subscribe, () => current);
}

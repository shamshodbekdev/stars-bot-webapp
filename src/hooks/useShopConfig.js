/**
 * Live shop prices from the server (GET /api/config).
 *
 * Stars and Premium prices follow Fragment's cost, the TON rate and the
 * admin's markup, so they are not hard-coded here. The server re-checks the
 * price on every order and answers `price_changed` if the shown price is
 * stale — usePurchase then calls loadShopConfig({ force: true }).
 *
 * Until the first response arrives `ready` is false and purchases must stay
 * disabled. In demo mode (no API URL) the static config is used.
 */
import { useEffect, useSyncExternalStore } from 'react';
import { API_URL, PREMIUM_PLANS, STARS } from '../config';

const DEMO_MODE = !API_URL;
const MAX_AGE_MS = 60 * 1000;

let state = {
  ready: DEMO_MODE,
  error: null,
  pricePerStar: STARS.pricePerStar,
  premiumPlans: PREMIUM_PLANS,
  loadedAt: 0,
};
let inflight = null;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}

/** Merge server prices into the plan metadata and compute the real saving. */
function buildPlans(serverPlans) {
  const byMonths = new Map(serverPlans.map((p) => [p.months, p.price]));
  const plans = PREMIUM_PLANS.filter((p) => byMonths.has(p.months)).map((p) => ({
    ...p,
    price: byMonths.get(p.months),
  }));
  const base = plans.length ? plans[0].price / plans[0].months : 0;
  return plans.map((p) => ({
    ...p,
    bonus: base > 0 ? Math.max(0, Math.round((1 - p.price / p.months / base) * 100)) : 0,
  }));
}

export function loadShopConfig({ force = false } = {}) {
  if (DEMO_MODE) return Promise.resolve(state);
  if (!force && state.ready && Date.now() - state.loadedAt < MAX_AGE_MS) return Promise.resolve(state);
  if (inflight) return inflight;

  inflight = fetch(`${API_URL}/config`)
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok || !data?.ok) throw new Error(data?.code || 'server');
      setState({
        ready: true,
        error: null,
        pricePerStar: data.stars.price_per_star,
        premiumPlans: buildPlans(data.premium || []),
        loadedAt: Date.now(),
      });
    })
    .catch((err) => {
      // Keep the last good prices if we had them; otherwise purchases stay disabled.
      setState({ error: err.message === 'pricing_unavailable' ? 'pricing_unavailable' : 'network' });
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** { ready, error, pricePerStar, premiumPlans } — refreshed when a page opens. */
export function useShopConfig() {
  const snapshot = useSyncExternalStore(subscribe, () => state);
  useEffect(() => {
    loadShopConfig();
  }, []);
  return snapshot;
}

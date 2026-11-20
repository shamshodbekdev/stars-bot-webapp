/**
 * Shared user state: Telegram identity + profile data from the API
 * (balance and stats). Pages call `refresh()` after a purchase.
 *
 * Force subscribe: when any API call answers not_subscribed, `subscription`
 * holds the channels still to join and App shows <SubscribeGate /> instead of
 * the pages. `checkSubscription()` re-checks live and lifts the gate.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, SUBSCRIPTION_REQUIRED_EVENT } from '../utils/api';
import { getTelegramUser } from '../lib/telegram';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user] = useState(getTelegramUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // null = no gate; { channels: [{ title, url }] } = must subscribe first
  const [subscription, setSubscription] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setProfile(await api.getProfile());
    } catch (err) {
      if (err?.code !== 'not_subscribed') setError(err); // the gate handles that one
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onRequired = (e) => setSubscription({ channels: e.detail?.channels ?? [] });
    window.addEventListener(SUBSCRIPTION_REQUIRED_EVENT, onRequired);
    return () => window.removeEventListener(SUBSCRIPTION_REQUIRED_EVENT, onRequired);
  }, []);

  /** Live re-check. Resolves true when the user may use the app. */
  const checkSubscription = useCallback(async () => {
    const result = await api.checkSubscription();
    if (result.subscribed) {
      setSubscription(null);
      setLoading(true);
      await refresh();
      return true;
    }
    setSubscription({ channels: result.channels });
    return false;
  }, [refresh]);

  return (
    <UserContext.Provider
      value={{ user, profile, loading, error, refresh, subscription, checkSubscription }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

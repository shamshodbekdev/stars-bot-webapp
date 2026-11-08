/**
 * Shared user state: Telegram identity + profile data from the API
 * (balance and stats). Pages call `refresh()` after a purchase.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { getTelegramUser } from '../lib/telegram';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user] = useState(getTelegramUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setProfile(await api.getProfile());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, profile, loading, error, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

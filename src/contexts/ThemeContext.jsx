/**
 * Theme handling.
 * mode: "auto" follows Telegram's colour scheme (and live theme changes);
 *       "light" / "dark" are manual overrides saved in localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getColorScheme, onThemeChanged, setTelegramColors } from '../lib/telegram';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

// Must match --c-bg in index.css
const BG_COLORS = { light: '#fafafa', dark: '#000000' };

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => storage.get('theme') || 'auto');
  const [telegramScheme, setTelegramScheme] = useState(getColorScheme);

  // Track Telegram theme changes while the app is open
  useEffect(() => onThemeChanged(() => setTelegramScheme(getColorScheme())), []);

  const resolved = mode === 'auto' ? telegramScheme : mode;

  // Apply the theme to <html>, the meta theme-color and Telegram's chrome
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG_COLORS[resolved]);
    setTelegramColors(BG_COLORS[resolved]);
  }, [resolved]);

  const changeMode = useCallback((next) => {
    setMode(next);
    storage.set('theme', next);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode: changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

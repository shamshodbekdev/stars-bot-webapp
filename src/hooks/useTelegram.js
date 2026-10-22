import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    const tgUser = WebApp.initDataUnsafe?.user;
    if (tgUser) setUser(tgUser);

    setInitData(WebApp.initData || '');
    setTheme(WebApp.colorScheme || 'light');

    if (WebApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return { user, initData, theme, WebApp };
}

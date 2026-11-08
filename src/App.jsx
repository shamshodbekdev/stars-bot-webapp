import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { backButton } from './lib/telegram';
import { useGoBack } from './components/layout/Header';
import LanguageSelector from './components/LanguageSelector';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Stars from './pages/Stars';
import Premium from './pages/Premium';
import GiftMarket from './pages/GiftMarket';
import Profile from './pages/Profile';
import Balance from './pages/Balance';
import Settings from './pages/Settings';

/** Shows Telegram's native back button on every screen except Home. */
function TelegramBackButton() {
  const { pathname } = useLocation();
  const goBack = useGoBack();

  useEffect(() => {
    if (pathname === '/') return undefined;
    return backButton.show(goBack);
    // goBack is recreated each render; pathname is the meaningful trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

/** Scrolls to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/** Each page animates itself in via <Page />. */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stars" element={<Stars />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/gift" element={<GiftMarket />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/balance" element={<Balance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const { showLanguageSelector } = useLanguage();

  if (showLanguageSelector) return <LanguageSelector />;

  // HashRouter: works on static hosting without server rewrites
  return (
    <HashRouter>
      <ScrollToTop />
      <TelegramBackButton />
      <AppRoutes />
      <BottomNav />
    </HashRouter>
  );
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import Home from './pages/Home';
import Stars from './pages/Stars';
import Premium from './pages/Premium';
import Numbers from './pages/Numbers';
import GiftMarket from './pages/GiftMarket';
import Profile from './pages/Profile';
import Balance from './pages/Balance';
import Settings from './pages/Settings';
import BottomNav from './components/layout/BottomNav';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/stars" element={<Stars />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/numbers" element={<Numbers />} />
          <Route path="/gift" element={<GiftMarket />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const { showLanguageSelector } = useLanguage();

  if (showLanguageSelector) {
    return <LanguageSelector />;
  }

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

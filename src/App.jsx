import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stars from './pages/Stars';
import Premium from './pages/Premium';
import Numbers from './pages/Numbers';
import GiftMarket from './pages/GiftMarket';
import Profile from './pages/Profile';
import Balance from './pages/Balance';
import BottomNav from './components/layout/BottomNav';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stars" element={<Stars />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/numbers" element={<Numbers />} />
        <Route path="/gift" element={<GiftMarket />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/balance" element={<Balance />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

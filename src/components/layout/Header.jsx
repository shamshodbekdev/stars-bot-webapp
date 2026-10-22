import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { motion } from 'framer-motion';

export default function Header({ title, showBack = false, right }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (showBack) {
      navigate(-1);
    } else {
      WebApp.close();
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-tg-bg/95 backdrop-blur-xl border-b border-tg-hint/10"
    >
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-tg-secondaryBg transition-colors"
        >
          <ChevronLeft size={24} className="text-tg-text" />
        </button>
        <h1 className="text-base font-bold flex-1 text-center">{title}</h1>
        <div className="w-10">{right}</div>
      </div>
    </motion.div>
  );
}

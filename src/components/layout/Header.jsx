import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

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
    <div className="sticky top-0 z-40 bg-tg-bg/95 backdrop-blur-lg border-b border-tg-hint/10">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-tg-secondaryBg"
        >
          <ChevronLeft size={24} className="text-tg-text" />
        </button>
        <h1 className="text-base font-semibold flex-1 text-center">{title}</h1>
        <div className="w-10">{right}</div>
      </div>
    </div>
  );
}

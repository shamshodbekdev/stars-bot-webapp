import { useLanguage } from '../contexts/LanguageContext';
import Page from '../components/layout/Page';
import Header from '../components/layout/Header';
import { Gift, Sparkles } from 'lucide-react';

export default function GiftMarket() {
  const { t } = useLanguage();

  return (
    <Page>
      <Header title={t('gift_page.title')} showBack />
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/25">
          <Gift size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Gift Market</h2>
        <p className="text-sm text-tg-hint mb-6 max-w-xs">
          Tez orada bu yerda siz do'stlaringizga sovg'alar yubora olasiz
        </p>
        <div className="inline-flex items-center gap-2 bg-tg-secondaryBg px-4 py-2 rounded-full text-xs font-medium text-tg-hint">
          <Sparkles size={14} />
          {t('gift_page.coming_soon')}
        </div>
      </div>
    </Page>
  );
}

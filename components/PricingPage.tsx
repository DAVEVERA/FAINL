
import { FC } from 'react';
import {
  Shield,
  Zap,
  ArrowRight,
  RefreshCw,
  Crown,
} from 'lucide-react';
import { PRICING } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits?: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({
  onPurchaseTurns,
}) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
          {language === 'nl' ? 'Credits & Toegang' : 'Credits & Access'}
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
          {language === 'nl'
            ? 'Betaal per credit of kies een maandelijks abonnement.'
            : 'Pay per credit or choose a monthly subscription.'}
        </p>
      </div>

      {/* One-time credits */}
      <div className="mb-12 md:mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-black dark:bg-zinc-800 p-3 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Credits Kopen' : 'Buy Credits'}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              {language === 'nl' ? 'Eenmalige credits, verlopen nooit.' : 'One-time credits, never expire.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRICING.CREDITS.map((pkg, idx) => (
            <button
              key={idx}
              onClick={() => onPurchaseTurns(pkg.count)}
              className="group flex flex-col items-start p-5 md:p-6 border-4 rounded-2xl bg-white dark:bg-zinc-900 border-black dark:border-white/20 text-black dark:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              <Zap className="w-5 h-5 text-black/20 dark:text-white/20 mb-3 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <div className="text-3xl md:text-4xl font-black mb-1 text-black dark:text-white">{pkg.count}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
                {language === 'nl' ? 'Credits' : 'Credits'}
              </div>
              <div className="text-xl font-black text-black dark:text-white">€{pkg.price}</div>
              <div className="mt-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">
                {pkg.label} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          {language === 'nl'
            ? 'Alle pakketten worden direct verwerkt via Stripe.'
            : 'All packages processed instantly via Stripe.'}
        </p>
      </div>

      {/* Subscriptions */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-yellow-400 p-3 rounded-xl shadow-lg">
            <RefreshCw className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Maandelijks Abonnement' : 'Monthly Subscription'}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              {language === 'nl' ? 'Automatisch hernieuwd elke maand.' : 'Automatically renewed each month.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PRICING.SUBSCRIPTIONS.map((sub, idx) => (
            <div
              key={sub.id}
              className={`relative flex flex-col p-8 md:p-10 border-4 rounded-[2rem] bg-white dark:bg-zinc-900 text-black dark:text-white ${idx === 1 ? 'border-yellow-400' : 'border-black dark:border-white/20'} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)]`}
            >
              {idx === 1 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl rounded-tr-[1.8rem] flex items-center gap-1.5">
                  <Crown className="w-3 h-3" />
                  {language === 'nl' ? 'Populairst' : 'Most Popular'}
                </div>
              )}
              <div className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">{sub.name}</div>
              <div className="text-4xl md:text-5xl font-black mb-1">€{sub.price}</div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-6">
                {language === 'nl' ? '/ maand' : '/ month'}
              </div>
              <div className="text-sm font-black text-black/60 dark:text-white/60 mb-8">
                <span className="text-2xl font-black text-black dark:text-white">{sub.creditsPerMonth}</span>{' '}
                {language === 'nl' ? 'credits per maand' : 'credits per month'}
              </div>
              <button
                type="button"
                onClick={() => window.open(sub.stripeUrl || '#', '_blank')}
                className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 ${idx === 1 ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02]'} active:scale-[0.98] shadow-lg`}
              >
                {language === 'nl' ? 'Abonnement Starten' : 'Start Subscription'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

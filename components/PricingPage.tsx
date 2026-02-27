
import { FC } from 'react';
import { 
  Zap, 
  Shield, 
  Star, 
  CreditCard, 
  Infinity as InfinityIcon,
  Key,
  ArrowRight,
} from 'lucide-react';
import { PRICING } from '../constants';
import { ScrambleText } from './ScrambleText';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({ 
  hasOwnKeys,
  onPurchaseTurns, 
  onPurchaseCredits
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
          <ScrambleText text="Neural Access Tiers" />
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
          Select your protocol access tier to begin deliberation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
        {/* Standard turns */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-black dark:bg-zinc-800 p-3 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">Standard Access</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Full consensus turns</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {PRICING.TURNS.map((pkg, idx) => (
              <button 
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                className={`group flex flex-col items-start p-4 md:p-5 border-4 rounded-xl md:rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden ${pkg.count === Infinity ? 'col-span-2 sm:col-span-3 bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-white/20' : 'bg-white dark:bg-zinc-900 border-black dark:border-white/20 text-black dark:text-white'}`}
              >
                {pkg.count === Infinity && (
                    <div className="absolute top-2 right-[-2.5rem] bg-yellow-400 text-black px-10 py-1 text-[8px] font-black uppercase tracking-widest rotate-45 shadow-lg z-10">Infinite</div>
                )}
                <div className="text-xl md:text-2xl font-black mb-0.5 flex items-center gap-1.5 text-current">
                  {pkg.count === Infinity ? <InfinityIcon className="w-6 h-6" /> : pkg.count}
                  {pkg.count !== Infinity && <span className="text-sm font-black opacity-60">Turns</span>}
                </div>
                <div className={`text-base font-black ${pkg.count === Infinity ? 'text-yellow-400 dark:text-yellow-600' : 'text-black dark:text-white'}`}>€{pkg.price}</div>
                <div className={`mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${pkg.count === Infinity ? 'text-white/40 dark:text-black/40' : 'text-black/30 dark:text-white/30'}`}>
                  Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Credits — BYO EXP */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-3 rounded-xl shadow-lg">
              <Key className="w-6 h-6 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">BYO Experience</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">1 Credit = 1 full network turn</p>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-zinc-900/40 border-4 border-black dark:border-white/20 p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm">
            <p className="text-xs font-bold text-black/60 dark:text-white/60 leading-relaxed mb-4">
              Orchestrate FAINL using your own API credentials. Pay only for the orchestration layer.
            </p>
            <div className="space-y-3">
              {PRICING.CREDITS.map((pkg, idx) => (
                <button 
                  key={idx}
                  onClick={() => onPurchaseCredits(pkg.count)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-black dark:text-white"
                  disabled={!hasOwnKeys}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase tracking-[0.15em] text-xs text-black dark:text-white">{pkg.label}</span>
                  </div>
                  <div className="font-black text-lg text-black dark:text-white">€{pkg.price}</div>
                </button>
              ))}
              {!hasOwnKeys && (
                <div className="p-3 bg-red-500/10 border-2 border-red-500/20 rounded-xl text-center">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Neural Credentials Required. Connect keys in settings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { FC } from "react";
import {
  Zap,
  Shield,
  Star,
  CreditCard,
  Infinity as InfinityIcon,
  Key,
  ArrowRight,
} from "lucide-react";
import { PRICING } from "../constants";
import { ScrambleText } from "./ScrambleText";

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({
  hasOwnKeys,
  onPurchaseTurns,
  onPurchaseCredits,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
          <ScrambleText text="Tokens" />
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
          Selecteer je pakket om de beraadslaging te starten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
        {/* Tokens Pack */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-black dark:bg-zinc-800 p-3 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">
                Token Pakketten
              </h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                Eenmalige aanschaf
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {PRICING.TOKENS.map((pkg, idx) => (
              <button
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                className={`group flex flex-col items-start p-4 md:p-5 border-4 rounded-xl md:rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden bg-white dark:bg-zinc-900 border-black dark:border-white/20 text-black dark:text-white`}
              >
                <div className="text-xl md:text-2xl font-black mb-0.5 flex items-center gap-1.5 text-current">
                  {pkg.count}
                  <span className="text-sm font-black opacity-60">Tokens</span>
                </div>
                <div
                  className={`text-base font-black text-black dark:text-white`}
                >
                  €{pkg.price}
                </div>
                <div
                  className={`mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30`}
                >
                  Details{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-3 rounded-xl shadow-lg">
              <Star className="w-6 h-6 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">
                Abonnement
              </h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                Maandelijks opzegbaar
              </p>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-zinc-900/40 border-4 border-black dark:border-white/20 p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm">
            <p className="text-xs font-bold text-black/60 dark:text-white/60 leading-relaxed mb-4">
              Kies voor de ultieme FAINL ervaring met ons flexibele maandplan.
            </p>
            <div className="space-y-3">
              {PRICING.SUBSCRIPTIONS.map((pkg, idx) => (
                <button
                  key={idx}
                  onClick={() => onPurchaseCredits(pkg.count)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all group text-black dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase tracking-[0.15em] text-xs text-black dark:text-white">
                      {pkg.label}
                    </span>
                  </div>
                  <div className="font-black text-lg text-black dark:text-white">
                    €{pkg.price}/mnd
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

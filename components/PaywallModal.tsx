import { FC } from "react";
import { Zap, Shield, CheckCircle, X, Star } from "lucide-react";
import { PRICING } from "../constants";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
      <div className="bg-[#c3cdde] dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] dark:shadow-[32px_32px_0px_1px_rgba(255,255,255,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b-4 border-black dark:border-white/20 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-4">
            <div className="bg-black dark:bg-white p-3 rounded-xl shadow-lg text-white dark:text-black">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black dark:text-white">
                Toegang tot Intelligentie Vereist
              </h2>
              <p className="text-[10px] md:text-xs font-black text-black/40 dark:text-white/40 uppercase mt-1 tracking-widest flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                Premium Neurale Consensus Link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close Paywall"
            aria-label="Close Paywall"
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-black dark:text-white"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          {/* Token Packages */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
                Koop Tokens
              </h3>
              <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed">
                Laad je account op met tokens en gebruik onze AI-consensus
                protocollen wanneer jij wilt.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRICING.TOKENS.map((pkg, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(pkg.url, "_blank")}
                  className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all group relative overflow-hidden text-black dark:text-white"
                >
                  <div className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                    {pkg.label}
                  </div>
                  <div className="text-2xl font-black mb-1">
                    {pkg.count} Tokens
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest bg-yellow-400 text-black px-2 py-0.5 rounded">
                    €{pkg.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription */}
          <div className="space-y-6 text-black dark:text-white">
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                Abonnement
              </h3>
              <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed mt-2">
                Onbeperkte toegang tot alle protocollen voor een vast bedrag per
                maand.
              </p>
            </div>
            <div className="space-y-4">
              {PRICING.SUBSCRIPTIONS.map((subs, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(subs.url, "_blank")}
                  className="w-full flex items-center justify-between p-6 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(255,215,0,0.5)] transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-400 text-black rounded-lg">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-black uppercase tracking-widest text-sm">
                        {subs.label}
                      </span>
                      <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">
                        Onbeperkt consensus
                      </span>
                    </div>
                  </div>
                  <div className="font-black text-xl text-yellow-500">
                    €{subs.price}/maand
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white/50 dark:bg-zinc-950/50 border-4 border-black dark:border-white/20 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Multi-Node Consensus
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Zero Data Training
              </span>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-yellow-400 border-4 border-black rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="w-20 h-20 text-black" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h3 className="text-xl font-black uppercase tracking-tighter text-black">
                  Ontvang 15% Korting
                </h3>
                <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest leading-relaxed">
                  Schrijf je in voor onze nieuwsbrief en ontvang direct een
                  kortingscode voor je eerste tokens.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="JE EMAIL ADRES..."
                  className="bg-white border-4 border-black rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none w-full sm:min-w-[240px]"
                />
                <button
                  onClick={() =>
                    alert(
                      "Bedankt voor het inschrijven! Gebruik code: NEURAL15 voor 15% korting.",
                    )
                  }
                  className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap"
                >
                  INSCHRIJVEN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t-4 border-black dark:border-white/20 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em]">
            Secure Checkout • Encrypted Protocol 2.5.1
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Ik beslis later
          </button>
        </div>
      </div>
    </div>
  );
};

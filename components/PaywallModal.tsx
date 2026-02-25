
import { FC } from 'react';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  X, 
  Star, 
  CreditCard, 
  Infinity as InfinityIcon,
  Key
} from 'lucide-react';
import { PRICING } from '../constants';

interface PaywallModalProps {
  isOpen: boolean;
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
  onClose: () => void;
}

export const PaywallModal: FC<PaywallModalProps> = ({ 
  isOpen, 
  hasOwnKeys,
  onPurchaseTurns, 
  onPurchaseCredits,
  onClose 
}) => {
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
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black dark:text-white">Intelligence Access Required</h2>
              <p className="text-[10px] md:text-xs font-black text-black/40 dark:text-white/40 uppercase mt-1 tracking-widest flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                Premium Neural Consensus Link
              </p>
            </div>
          </div>
          <button onClick={onClose} title="Close Paywall" aria-label="Close Paywall" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-black dark:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          
          {/* Main Value Prop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black dark:text-white">Standard Access Protocol</h3>
              <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed">
                Unlock high-performance autonomous neural networks. Perfect for users who want the full FAINL power without managing individual API credentials.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {PRICING.TURNS.map((pkg, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onPurchaseTurns(pkg.count)}
                    className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all group relative overflow-hidden ${pkg.count === Infinity ? 'col-span-2 bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-white/20' : ''}`}
                  >
                    {pkg.count === Infinity && (
                        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-[8px] font-black uppercase tracking-widest rotate-12 translate-x-3 -translate-y-1">Best Value</div>
                    )}
                    <div className={`text-2xl font-black mb-1 ${pkg.count === Infinity ? '' : 'text-black dark:text-white'}`}>
                      {pkg.count === Infinity ? <InfinityIcon className="w-8 h-8" /> : `${pkg.count} Turns`}
                    </div>
                    <div className={`text-xs font-black uppercase tracking-widest ${pkg.count === Infinity ? 'text-white/50' : 'text-black/40 dark:text-white/40'}`}>€{pkg.price}</div>
                    {pkg.count === Infinity && <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-yellow-400">One-Time Lifetime Fee</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 text-black dark:text-white">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Key className="w-6 h-6" />
                BYO Credentials
              </h3>
              <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed">
                Using your own API keys? Purchase usage credits for the FAINL Orchestration Layer. 1 Credit = 1 Comprehensive Multi-Node Turn.
              </p>
              <div className="space-y-4">
                {PRICING.CREDITS.map((pkg, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onPurchaseCredits(pkg.count)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-black dark:text-white"
                    disabled={!hasOwnKeys}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="font-black uppercase tracking-widest text-sm">{pkg.label}</span>
                    </div>
                    <div className="font-black text-lg">€{pkg.price}</div>
                  </button>
                ))}
                {!hasOwnKeys && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center mt-2 animate-pulse">
                      Connect your own API keys in Settings to enable credit billing.
                    </p>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Footer */}
          <div className="bg-white/50 dark:bg-zinc-950/50 border-4 border-black dark:border-white/20 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Multi-Node Consensus</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Local Logic</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Zero Data Training</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t-4 border-black dark:border-white/20 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em]">Secure Checkout • Encrypted Protocol 2.5.1</p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            I'll decide later
          </button>
        </div>
      </div>
    </div>
  );
};

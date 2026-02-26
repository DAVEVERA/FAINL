
import { FC } from 'react';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Star, 
  CreditCard, 
  Infinity as InfinityIcon,
  Key,
  ArrowRight,
  Mail,
  Gift
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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
          <ScrambleText text="Neural Access Tiers" />
        </h1>
        <p className="max-w-2xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
          Eliminate decision uncertainty with the FAINL Orchestration Layer. Our autonomous multi-agent consensus protocol stress-tests every scenario through decentralized node deliberation, distilling complex dilemmas into high-integrity, authoritative council verdicts. Optimize your strategic outcomes with the next generation of neural governance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 md:gap-20">
        {/* Standard turns */}
        <div className="space-y-15">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-black dark:bg-white p-4 rounded-2xl shadow-xl">
              <Shield className="w-10 h-10 text-white dark:text-black" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">Standard Access</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRICING.TURNS.map((pkg, idx) => (
              <button 
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                className={`group flex flex-col items-start p-6 md:p-8 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-all relative overflow-hidden ${pkg.count === Infinity ? 'col-span-1 sm:col-span-2 bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-white/20' : ''}`}
              >
                {pkg.count === Infinity && (
                    <div className="absolute top-2 right-[-2.5rem] bg-yellow-400 text-black px-10 py-1.5 text-[9px] font-black uppercase tracking-widest rotate-45 shadow-lg z-10">Infinite Power</div>
                )}
                <div className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2 text-current">
                  {pkg.count === Infinity ? <InfinityIcon className="w-8 h-8" /> : pkg.count}
                  {pkg.count !== Infinity && <span className="text-base">Turns</span>}
                </div>
                <div className={`text-xl font-black ${pkg.count === Infinity ? 'text-yellow-400 dark:text-yellow-600' : 'text-black dark:text-white'}`}>€{pkg.price}</div>
                <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${pkg.count === Infinity ? 'text-white/40 dark:text-black/40' : 'text-black/30 dark:text-white/30'}`}>
                  Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-4 rounded-2xl shadow-xl">
              <Key className="w-10 h-10 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">BYO Experience</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/40 dark:bg-zinc-900/40 border-4 border-black dark:border-white/20 p-6 md:p-8 rounded-2xl md:rounded-[2rem] backdrop-blur-sm">
                <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed mb-8">
                    Orchestrate FAINL's advanced multi-agent logic using your own API credentials. Pay only for the orchestration layer. 1 Credit = 1 Full Network Turn.
                </p>
                <div className="space-y-4">
                    {PRICING.CREDITS.map((pkg, idx) => (
                        <button 
                            key={idx}
                            onClick={() => onPurchaseCredits(pkg.count)}
                            className="w-full flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-black dark:text-white"
                            disabled={!hasOwnKeys}
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <span className="font-black uppercase tracking-[0.2em] text-sm">{pkg.label}</span>
                            </div>
                            <div className="font-black text-2xl">€{pkg.price}</div>
                        </button>
                    ))}
                    {!hasOwnKeys && (
                        <div className="p-4 bg-red-500/10 border-2 border-red-500/20 rounded-xl text-center">
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

      {/* Newsletter / Discount Section */}
      <div className="mt-32 p-8 md:p-16 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 dark:bg-black/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 rounded-full mb-6">
              <Gift className="w-4 h-4 text-black" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">First-Time User Protocol</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Unlock 15% Neural Discount</h2>
            <p className="text-sm md:text-base font-bold text-white/60 dark:text-black/60 leading-relaxed">
              Synchronize with our development core. Subscribe to the FAINL newsletter and receive an immediate protocol voucher for your first access tier.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-2xl border border-white/20 dark:border-black/10">
              <input 
                type="email" 
                placeholder="NEURAL_EMAIL@USER.LOCAL"
                className="bg-transparent px-6 py-4 font-black uppercase tracking-widest text-xs focus:outline-none min-w-[280px]"
              />
              <button className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-3">
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

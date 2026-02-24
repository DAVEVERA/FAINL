
import React from 'react';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Star, 
  CreditCard, 
  Infinity as InfinityIcon,
  Key,
  ArrowRight
} from 'lucide-react';
import { PRICING, USAGE_LIMITS } from '../constants';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ 
  hasOwnKeys,
  onPurchaseTurns, 
  onPurchaseCredits
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">Neural Access Tiers</h1>
        <p className="max-w-2xl mx-auto text-black/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
          Powering the next generation of autonomous deliberation with multi-node consensus logic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        {/* Standard turns */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-black p-4 rounded-2xl shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Standard Access</h2>
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Managed Neural Consensus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PRICING.TURNS.map((pkg, idx) => (
              <button 
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                className={`group flex flex-col items-start p-8 bg-white border-4 border-black rounded-[2rem] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all relative overflow-hidden ${pkg.count === Infinity ? 'col-span-1 sm:col-span-2 bg-zinc-900 text-white border-zinc-800' : ''}`}
              >
                {pkg.count === Infinity && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rotate-12 translate-x-4 -translate-y-1">Infinite Power</div>
                )}
                <div className="text-4xl font-black mb-2 flex items-center gap-3">
                  {pkg.count === Infinity ? <InfinityIcon className="w-10 h-10" /> : pkg.count}
                  {pkg.count !== Infinity && <span className="text-xl">Turns</span>}
                </div>
                <div className={`text-xl font-black ${pkg.count === Infinity ? 'text-yellow-400' : 'text-black'}`}>€{pkg.price}</div>
                <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${pkg.count === Infinity ? 'text-white/40' : 'text-black/30'}`}>
                  Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-xl">
              <Key className="w-10 h-10 text-black" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">BYO Experience</h2>
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Orchestration Only Link</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/40 border-4 border-black p-8 rounded-[2rem] backdrop-blur-sm">
                <p className="text-sm font-bold text-black/60 leading-relaxed mb-8">
                    Orchestrate FAINL's advanced multi-agent logic using your own API credentials. Pay only for the orchestration layer. 1 Credit = 1 Full Network Turn.
                </p>
                <div className="space-y-4">
                    {PRICING.CREDITS.map((pkg, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onPurchaseCredits(pkg.count)}
                        className="w-full flex items-center justify-between p-6 bg-white border-4 border-black rounded-2xl hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!hasOwnKeys}
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-black text-white rounded-xl">
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

      {/* Value Matrix */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Zero Latency Link", desc: "Proprietary streaming protocol ensures real-time debate visualization." },
          { icon: Shield, title: "High Integrity", desc: "Cross-verified multi-node logic eliminates single-model hallucinations." },
          { icon: CheckCircle, title: "Sovereign Data", desc: "No data training. All sessions are ephemeral and locally saved." }
        ].map((item, i) => (
          <div key={i} className="p-10 bg-white border-4 border-black rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
            <item.icon className="w-10 h-10 mb-6 text-black" />
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">{item.title}</h3>
            <p className="text-sm font-bold text-black/50 leading-loose">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

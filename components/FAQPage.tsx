
import { useState, FC } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap, 
  Coins 
} from 'lucide-react';

const FAQS = [
  {
    q: "What makes FAINL different from standard chat models?",
    a: "FAINL is not a single model. It is an autonomous orchestration layer that triggers a multi-agent consensus protocol. By forcing multiple advanced models to debate and critique each other, we eliminate single-point bias and logical hallucinations.",
    icon: HelpCircle
  },
  {
    q: "Is my mission data secure and private?",
    a: "Absolutely. FAINL follows a Zero-Knowledge architecture. Your API keys and session history are stored exclusively in your browser's local storage. We do not have a centralized database that tracks your neural directives.",
    icon: ShieldCheck
  },
  {
    q: "Why is there a paywall after one turn?",
    a: "Executing multiple high-performance models (Google, OpenAI, Anthropic) simultaneously requires significant compute power. The paywall ensures we can provide the full multi-node intelligence experience without compromising on logic depth.",
    icon: Coins
  },
  {
    q: "Can I use FAINL offline?",
    a: "While the logic orchestration happens in your browser, the neural nodes (the LLMs) require an internet connection to reach their respective API providers. Local-only model support is planned for Phase 2.",
    icon: Zap
  }
];

export const FAQPage: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-16 md:mb-24">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white">Internal Docs</h1>
                <p className="text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Recursive intelligence questioning protocol.</p>
            </div>

            <div className="space-y-6">
                {FAQS.map((faq, idx) => (
                    <div 
                        key={idx}
                        className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] overflow-hidden transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)]"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full text-left p-8 md:p-10 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-3 rounded-xl transition-colors ${openIndex === idx ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-black/5 dark:bg-white/5 text-black dark:text-white'}`}>
                                    <faq.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none group-hover:underline text-black dark:text-white">{faq.q}</h3>
                            </div>
                            {openIndex === idx ? <ChevronUp className="w-8 h-8 text-black dark:text-white" /> : <ChevronDown className="w-8 h-8 text-black dark:text-white" />}
                        </button>
                        {openIndex === idx && (
                            <div className="px-8 md:px-10 pb-8 md:pb-10 animate-in slide-in-from-top-2 duration-300">
                                <div className="pt-6 border-t-2 border-black/5 dark:border-white/5 text-sm md:text-lg font-bold text-black/60 dark:text-white/60 leading-relaxed uppercase tracking-wider">
                                    {faq.a}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <p className="text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">System Revision 4.2.0 • Consensus Priority 0</p>
            </div>
        </div>
    );
};

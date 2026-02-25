
import { FC } from 'react';
import { 
  Book, 
  Sparkles, 
  Code, 
  Brain, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface Mission {
  title: string;
  category: string;
  query: string;
  icon: any;
  difficulty: 'Alpha' | 'Beta' | 'Gamma';
}

const MISSIONS: Mission[] = [
  {
    title: "The Grand Strategy",
    category: "Geopolitics",
    query: "Analyze the long-term viability of a space-based manufacturing hub and its impact on terrestrial resource scarcity.",
    icon: Zap,
    difficulty: "Gamma"
  },
  {
    title: "Logic Auditor",
    category: "Philosophy",
    query: "Identify logical fallacies in this argument for universal basic income being the only solution to automation-driven unemployment.",
    icon: Brain,
    difficulty: "Alpha"
  },
  {
    title: "Code Architect",
    category: "Software",
    query: "Propose a secure, scalable architecture for a peer-to-peer voting system that prevents double-voting without a centralized authority.",
    icon: Code,
    difficulty: "Beta"
  },
  {
    title: "Eco-Consensus",
    category: "Ecology",
    query: "Synthesize a plan for global reforestation that balances carbon capture efficiency with local biodiversity preservation.",
    icon: Sparkles,
    difficulty: "Gamma"
  }
];

export const CookbookPage: FC<{ onSelectMission: (query: string) => void }> = ({ onSelectMission }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white">Neural Cookbook</h1>
        <p className="max-w-2xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            A curated database of complex neural directives for the autonomous multi-agent environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {MISSIONS.map((mission, idx) => (
          <button 
            key={idx}
            onClick={() => onSelectMission(mission.query)}
            className="group text-left bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-10 rounded-[2.5rem] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[24px_24px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-lg">
                    <mission.icon className="w-8 h-8" />
                </div>
                <span className={`px-4 py-1.5 border-2 border-black dark:border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest ${mission.difficulty === 'Gamma' ? 'bg-red-400 text-black' : mission.difficulty === 'Beta' ? 'bg-blue-400 text-black' : 'bg-green-400 text-black'}`}>
                    Tier {mission.difficulty}
                </span>
            </div>
            <span className="block text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.4em] mb-4">{mission.category}</span>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-6 text-black dark:text-white">{mission.title}</h3>
            <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed italic mb-8 border-l-4 border-black/10 dark:border-white/10 pl-6">
                "{mission.query}"
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all text-black dark:text-white">
                Initialize Directive <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-20 p-12 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] text-center space-y-8">
        <Book className="w-16 h-16 mx-auto text-white/20 dark:text-black/20" />
        <h2 className="text-3xl font-black uppercase tracking-tighter">Community Contributions</h2>
        <p className="max-w-xl mx-auto text-white/50 dark:text-black/50 font-bold uppercase tracking-widest text-xs">
            FAINL-01 protocol allows for encrypted sharing of complex directives. Join the neural web to contribute your logic structures.
        </p>
      </div>
    </div>
  );
};

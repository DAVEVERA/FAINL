
import { FC } from 'react';
import { 
  Users, 
  MessageSquare, 
  Zap, 
  Database, 
  History, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import { SessionState, AppConfig } from '../types';

interface AccountPageProps {
  config: AppConfig;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
}

export const AccountPage: FC<AccountPageProps> = ({ 
  config, 
  history,
  onLoadSession
}) => {
  const turnsRemaining = config.isLifetime ? 'Unlimited' : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
        <div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">Command Center</h1>
          <p className="text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Secure User Environment & Neural Statistics</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] text-black dark:text-white">
            <div className="p-3 bg-green-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
            </div>
            <div>
                <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Active Identity</span>
                <span className="font-black text-sm uppercase tracking-tight text-black dark:text-white">FAINL-USER-01</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Statistics Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.1)] relative overflow-hidden text-black dark:text-white">
            <div className={`absolute top-0 right-0 p-3 ${config.isLifetime ? 'bg-yellow-400' : 'bg-black dark:bg-white'} text-white dark:text-black rounded-bl-2xl`}>
                <Zap className={`w-5 h-5 ${config.isLifetime ? 'text-black' : 'text-white dark:text-black'}`} />
            </div>
            <h3 className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em] mb-8">Access Integrity</h3>
            <div className="space-y-6 text-black dark:text-white">
                <div>
                    <span className="block text-4xl font-black">{turnsRemaining}</span>
                    <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Turns Available</span>
                </div>
                <div>
                    <span className="block text-4xl font-black">{config.creditsRemaining}</span>
                    <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Orchestration Credits</span>
                </div>
            </div>
          </div>

          <div className="bg-black dark:bg-zinc-800 text-white dark:text-white p-8 rounded-[2rem] space-y-6">
             <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                 <ShieldAlert className="w-6 h-6 text-yellow-500" />
                 <span className="font-black uppercase tracking-widest text-[10px]">Encrypted Payload</span>
             </div>
             <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase tracking-wider">
                 All mission data is stored on your local node. FAINL Cloud does not possess the keys to your logic history.
             </p>
          </div>
        </div>

        {/* History Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-6 text-black dark:text-white">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                <History className="w-8 h-8" />
                Mission History
            </h2>
            <span className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                {history.length} Saved
            </span>
          </div>

          <div className="space-y-6">
            {history.length === 0 ? (
                <div className="py-20 text-center bg-white/40 border-4 border-dashed border-black/10 rounded-[2rem]">
                    <Database className="w-16 h-16 text-black/5 mx-auto mb-6" />
                    <p className="font-black uppercase tracking-widest text-black/20">No data records found in local vault</p>
                </div>
            ) : (
                history.map((session, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onLoadSession(session)}
                        className="w-full group flex items-center justify-between p-8 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all text-left text-black dark:text-white"
                    >
                        <div className="flex items-center gap-8">
                            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tight mb-1 truncate max-w-md">"{session.query}"</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                                    <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded text-[8px] font-black uppercase tracking-widest">Consensus Achieved</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-8 h-8 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </button>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

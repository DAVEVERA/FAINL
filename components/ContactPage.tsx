
import { FC } from 'react';
import { 
  Globe, 
  Mail, 
  MessageCircle, 
  Github, 
  Terminal,
  Send
} from 'lucide-react';

export const ContactPage: FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-16 md:gap-24">
                <div className="lg:w-1/2 space-y-12">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">Reach The Core</h1>
                    <p className="text-lg md:text-2xl font-bold text-black/50 uppercase tracking-widest leading-loose">
                        Direct encrypted link to the FAINL maintenance architecture. No bots, only high-integrity human nodes.
                    </p>
                    
                    <div className="space-y-8 pt-8">
                        <div className="flex items-center gap-8 group">
                            <div className="p-5 bg-black text-white rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">Electronic Mail</span>
                                <span className="text-2xl font-black uppercase tracking-tight">protocol@fainl.ai</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 group">
                            <div className="p-5 bg-black text-white rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">Neural Chat</span>
                                <span className="text-2xl font-black uppercase tracking-tight">@fainl_core</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 group">
                            <div className="p-5 bg-black text-white rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                                <Globe className="w-8 h-8" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">Global Node</span>
                                <span className="text-2xl font-black uppercase tracking-tight">Earth (GMT+1)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="bg-white border-8 border-black p-8 md:p-12 rounded-[3rem] shadow-[32px_32px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-4 mb-10 text-black">
                            <Terminal className="w-8 h-8" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Transmission</h3>
                        </div>
                        
                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Source Identity</label>
                                <input 
                                    type="text" 
                                    placeholder="NODE_NAME"
                                    className="w-full bg-zinc-50 border-4 border-black p-6 rounded-2xl font-black uppercase tracking-widest text-sm focus:bg-white focus:ring-12 focus:ring-black/5 outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Communication Payload</label>
                                <textarea 
                                    placeholder="ENTER DIRECTIVE..."
                                    rows={5}
                                    className="w-full bg-zinc-50 border-4 border-black p-6 rounded-2xl font-bold uppercase tracking-widest text-sm focus:bg-white focus:ring-12 focus:ring-black/5 outline-none transition-all shadow-inner resize-none"
                                />
                            </div>
                            <button className="w-full py-8 bg-black text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4">
                                <Send className="w-6 h-6" />
                                Initiate Transfer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="mt-32 border-t-8 border-black pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex gap-8">
                    <Github className="w-8 h-8 text-black/20 hover:text-black transition-colors cursor-pointer" />
                    <Globe className="w-8 h-8 text-black/20 hover:text-black transition-colors cursor-pointer" />
                </div>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">© 2026 FAINL PROTOCOL • ALL RIGHTS RESERVED</p>
            </div>
        </div>
    );
};

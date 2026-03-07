import { FC, useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { ScrambleText } from "./ScrambleText";

export const ContactPage: FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
          <ScrambleText text="Contact Node" />
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
          Verstuur een directe transmissie naar FAINL HQ voor ondersteuning of
          feedback.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.05)]">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                  Naam
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-black dark:focus:border-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-black dark:focus:border-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                Bericht
              </label>
              <textarea
                required
                rows={5}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-black dark:focus:border-white transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <Send className="w-4 h-4" />
              Verzend Bericht
            </button>
          </form>
        ) : (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              Transmissie Geslaagd
            </h2>
            <p className="text-sm font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">
              We hebben je bericht ontvangen en nemen zo snel mogelijk contact
              met je op.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white underline"
            >
              Nieuw bericht
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

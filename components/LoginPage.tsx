import React, { useState } from 'react';
import { Shield, Github, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Neural Link sent! Check your email to continue.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-black rounded flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Neural Vault</h2>
          <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest text-balance leading-relaxed">Identity verification required to access secure session history</p>
        </div>

        {message && (
          <div className={`mb-8 p-4 border-2 border-black font-bold text-xs uppercase tracking-wider ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 p-5 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-zinc-50 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale" alt="Google" />
            Connect with Google
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 p-5 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-zinc-50 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            Connect with GitHub
          </button>
        </div>

        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-black/10"></div>
          <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">OR</span>
          <div className="h-px flex-1 bg-black/10"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="NEURAL-ID@EMAIL.COM"
              className="w-full p-5 bg-zinc-50 border-4 border-black font-bold uppercase tracking-widest text-xs placeholder:text-black/20 focus:outline-none focus:bg-white transition-all"
              required
            />
            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-black text-white p-5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initialize Link
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[8px] font-black text-black/20 uppercase tracking-[0.2em] leading-loose max-w-xs mx-auto">
          Auth data is managed by Supabase. Your private missions remain encrypted on the server side.
        </p>
      </div>
    </div>
  );
};


import { useState, useRef, useEffect, FC } from 'react';
import {
  Send,
  Users,
  MessageSquare,
  Gavel,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  AlertTriangle,
  Lock,
  Globe,
  CircleCheck,
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  Coins,
  BookOpen,
  HelpCircle,
  Mail,
  Zap as ZapIcon,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DEFAULT_COUNCIL, DEFAULT_CHAIRMAN, USAGE_LIMITS, PRICING, PRESETS } from './constants';
import { CouncilResponse, PeerReview, WorkflowStage, SessionState, AppConfig, ModelProvider, AppView } from './types';
import { UnifiedCouncilService } from './services/councilService';
import { CouncilCard } from './components/CouncilCard';
import { PaywallModal } from './components/PaywallModal';
import { PricingPage } from './components/PricingPage';
import { AccountPage } from './components/AccountPage';
import { CookbookPage } from './components/CookbookPage';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { DebateRoom } from './components/DebateRoom';
import { supabase } from './services/supabaseClient';
import { LoginPage } from './components/LoginPage';
import { Session } from '@supabase/supabase-js';
import { ScrambleText } from './components/ScrambleText';
import { WelcomePopup } from './components/WelcomePopup';
import { useLanguage } from './contexts/LanguageContext';


const FadingPlaceholder: FC<{ isFocused: boolean; examples: string[] }> = ({ isFocused, examples }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % examples.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [isFocused, examples.length]);

  if (isFocused) return null;

  return (
    <span className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {examples[index]}
    </span>
  );
};

const AnimatedSendIcon: FC = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
      const nextDelay = Math.random() * 4000 + 2000;
      setTimeout(triggerGlitch, nextDelay);
    };
    const timer = setTimeout(triggerGlitch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <Send className={`w-6 h-6 md:w-10 md:h-10 transition-transform duration-100 ${glitch ? 'translate-x-0.5 -translate-y-0.5 opacity-80' : ''}`} />
      {glitch && (
        <Send className="w-6 h-6 md:w-10 md:h-10 absolute top-0 left-0 text-red-500 opacity-50 -translate-x-0.5 translate-y-0.5 mix-blend-screen" />
      )}
    </div>
  );
};

const CyberLogo: FC<{ isAnimated?: boolean }> = ({ isAnimated = true }) => {
  return (
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group overflow-visible">
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500 animate-pulse-glow" />
      {isAnimated && (
        <>
          <div className="absolute inset-x-0.5 inset-y-0.5 border border-white/20 rounded-full animate-orbit pointer-events-none" />
          <div className="absolute inset-x-2 inset-y-2 border border-white/10 dark:border-white/5 rounded-full animate-reverse-orbit pointer-events-none" />
        </>
      )}
      <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-white/50 transition-all duration-500 overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)] opacity-50 group-hover:opacity-80 transition-opacity" />
        <Shield className="text-white dark:text-white w-4 h-4 md:w-5 md:h-5 relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    </div>
  );
};

const App: FC = () => {
  const { t, language, setLanguage } = useLanguage();

  const defaultConfig = {
    // Provider keys (kept for backward/forward compatibility in localStorage config)
    googleKey: '',
    openRouterKey: '',
    openaiKey: '',
    anthropicKey: '',
    deepseekKey: '',
    groqKey: '',
    mistralKey: '',
    customKey: '',
    mimoKey: '',
    devstralKey: '',
    katKey: '',
    olmoKey: '',
    nemotronKey: '',
    gemmaKey: '',
    glmKey: '',
    // App settings
    activeCouncil: DEFAULT_COUNCIL,
    customNodes: [] as any[],
    chairmanId: DEFAULT_CHAIRMAN.id,
    modelCount: 3 as 3 | 5,
    turnsUsed: 0,
    creditsRemaining: 0,
    isLifetime: false,
    totalTurnsAllowed: 2,
    hasWatchedAd: false,
  };

  const normalizeConfig = (raw: any) => {
    const merged = { ...defaultConfig, ...(raw || {}) };
    return {
      ...merged,
      activeCouncil: Array.isArray(merged.activeCouncil) && merged.activeCouncil.length > 0
        ? merged.activeCouncil
        : DEFAULT_COUNCIL,
      customNodes: Array.isArray(merged.customNodes) ? merged.customNodes : [],
      modelCount: merged.modelCount === 5 ? 5 : 3,
      turnsUsed: Number.isFinite(merged.turnsUsed) ? merged.turnsUsed : 0,
      creditsRemaining: Number.isFinite(merged.creditsRemaining) ? merged.creditsRemaining : 0,
      totalTurnsAllowed: Number.isFinite(merged.totalTurnsAllowed) ? merged.totalTurnsAllowed : 2,
      isLifetime: !!merged.isLifetime,
      hasWatchedAd: !!merged.hasWatchedAd,
    };
  };

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('fainl_config_v2');
    if (!saved) return normalizeConfig(null) as AppConfig;
    try {
      return normalizeConfig(JSON.parse(saved)) as AppConfig;
    } catch {
      return normalizeConfig(null) as AppConfig;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fainl_theme') === 'dark' ||
        (!localStorage.getItem('fainl_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('fainl_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView(AppView.HOME);
  };

  const [history, setHistory] = useState<SessionState[]>(() => {
    const saved = localStorage.getItem('fainl_history');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((s: any) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        isArchived: !!s.isArchived
      }));
    } catch (e) {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isDebateOpen, setIsDebateOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    const seen = localStorage.getItem('fainl_visited');
    return !seen;
  });

  const [session, setSession] = useState<SessionState>({
    id: crypto.randomUUID(),
    stage: WorkflowStage.IDLE,
    query: '',
    councilResponses: [],
    debateMessages: [],
    reviews: [],
    synthesis: ''
  });

  const councilService = useRef(new UnifiedCouncilService(config));

  useEffect(() => {
    councilService.current = new UnifiedCouncilService(config);
    localStorage.setItem('fainl_config_v2', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('fainl_history', JSON.stringify(history));
  }, [history]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const MAX_CHARS = 4000;

  const handleStart = async () => {
    if (!input.trim()) return;

    const hasCredits = config.creditsRemaining > 0;
    const hasTurnsRemaining = config.turnsUsed < config.totalTurnsAllowed;
    const isAllowed = config.isLifetime || hasTurnsRemaining || hasCredits;

    if (!isAllowed) {
      setIsPaywallOpen(true);
      return;
    }

    const baseMembers = config.modelCount === 5 ? PRESETS[1].members : DEFAULT_COUNCIL;
    const customNodes = Array.isArray((config as any).customNodes) ? (config as any).customNodes : [];
    const allMembers = [...baseMembers, ...customNodes];
    const readyMembers = councilService.current.getReadyMembers(allMembers);

    if (readyMembers.length < 2) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: "Insufficient active nodes for consensus protocol. Minimum 2 nodes required."
      }));
      return;
    }

    setConfig((current: AppConfig) => {
      if (current.creditsRemaining > 0) {
        return {
          ...current,
          creditsRemaining: current.creditsRemaining - USAGE_LIMITS.CREDITS_PER_TURN
        };
      } else {
        return {
          ...current,
          turnsUsed: current.turnsUsed + 1
        };
      }
    });

    setSession({
      id: crypto.randomUUID(),
      stage: WorkflowStage.PROCESSING_COUNCIL,
      query: input,
      councilResponses: [],
      debateMessages: [],
      reviews: [],
      synthesis: ''
    });

    try {
      const responses = await councilService.current.getCouncilResponses(input, readyMembers);
      setSession((prev: SessionState) => ({
        ...prev,
        councilResponses: responses,
        stage: WorkflowStage.COMPLETED,
        debateMessages: []
      }));
    } catch (err: any) {
      console.error(err);
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Autonomous consensus protocol interrupted."
      }));
    }
  };

  const handleEndDebate = async (debateMessages: import('./types').DebateMessage[]) => {
    setIsDebateOpen(false);
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages,
      stage: WorkflowStage.SYNTHESIZING,
      synthesis: ''
    }));

    const baseMembers = config.modelCount === 5 ? PRESETS[1].members : DEFAULT_COUNCIL;
    const customNodes = Array.isArray((config as any).customNodes) ? (config as any).customNodes : [];
    const allMembers = [...baseMembers, ...customNodes];
    const readyMembers = councilService.current.getReadyMembers(allMembers);

    try {
      const synthesis = await councilService.current.synthesizeStream(
        session.query,
        session.councilResponses,
        [],
        session.debateMessages,
        readyMembers,
        DEFAULT_CHAIRMAN,
        (chunk) => {
          setSession((prev: SessionState) => ({
            ...prev,
            synthesis: (prev.synthesis || '') + chunk
          }));
        }
      );

      setSession((prev: SessionState) => {
        const completedSession = { ...prev, synthesis, stage: WorkflowStage.COMPLETED };
        setHistory((h: SessionState[]) => [completedSession, ...h]);
        return completedSession;
      });
    } catch (err: any) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Synthesis failed."
      }));
    }
  };

  const handleAddDebateMessage = (msg: import('./types').DebateMessage) => {
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages: [...prev.debateMessages, msg]
    }));
  };

  const handlePurchaseTurns = (count: number) => {
    let pkg = PRICING.CREDITS.find(p => p.count === count);
    if (!pkg) pkg = PRICING.SUBSCRIPTIONS.find(p => p.count === count);
    if (!pkg?.stripeUrl || pkg.stripeUrl === '#') {
      alert("Deze betaallink is nog niet actief.");
      return;
    }
    const successUrl = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}?payment_confirm=true&type=${PRICING.CREDITS.find(p => p.count === count) ? 'credits' : 'turns'}&count=${count}`
    );
    window.location.href = `${pkg.stripeUrl}?success_url=${successUrl}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_confirm') === 'true') {
      const type = params.get('type');
      const countStr = params.get('count');
      const count = countStr === 'infinity' ? Infinity : parseInt(countStr || '0', 10);

      if (type === 'turns') {
        setConfig(prev => ({
          ...prev,
          isLifetime: count === Infinity ? true : prev.isLifetime,
          totalTurnsAllowed: count === Infinity ? prev.totalTurnsAllowed : prev.totalTurnsAllowed + count
        }));
      } else if (type === 'credits') {
        setConfig(prev => ({
          ...prev,
          creditsRemaining: prev.creditsRemaining + (count as number)
        }));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const NavLinks = [
    { id: AppView.HOME, label: t.nav.protocols, icon: ZapIcon },
    { id: AppView.PRICING, label: t.nav.access, icon: Coins },
    { id: AppView.ACCOUNT, label: t.nav.myFainls, icon: LayoutDashboard },
    { id: AppView.COOKBOOK, label: t.nav.cookbook, icon: BookOpen },
    { id: AppView.FAQ, label: t.nav.faq, icon: HelpCircle },
    { id: AppView.CONTACT, label: t.nav.contact, icon: Mail },
  ];

  const renderStageIndicator = () => {
    const stages = [
      { id: WorkflowStage.PROCESSING_COUNCIL, label: "Neural Deliberation", icon: Users },
      { id: WorkflowStage.DEBATE, label: "Live Debate", icon: MessageSquare },
      { id: WorkflowStage.SYNTHESIZING, label: "Verdict Synthesis", icon: Gavel },
    ];
    if (session.stage === WorkflowStage.IDLE || session.stage === WorkflowStage.ERROR) return null;
    return (
      <div className="flex justify-center mb-8 md:mb-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/20 dark:bg-white/5 p-2.5 rounded-3xl sm:rounded-full border border-black/10 dark:border-white/10 backdrop-blur-sm w-full sm:w-auto overflow-x-auto">
          {stages.map((s, idx) => {
            const isActive = session.stage === s.id;
            const isCompleted = [WorkflowStage.COMPLETED, ...stages.slice(idx + 1).map(st => st.id)].includes(session.stage);
            return (
              <div key={s.id} className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase transition-all border-2 w-full sm:w-auto justify-center sm:justify-start ${isActive ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]' : isCompleted ? 'bg-white dark:bg-zinc-800 text-black dark:text-white border-black dark:border-white/20' : 'text-black/20 dark:text-white/20 border-transparent'}`}>
                  <s.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="whitespace-nowrap">{s.label}</span>
                </div>
                {idx < stages.length - 1 && <ArrowRight className="hidden sm:block w-4 h-4 text-black/10 dark:text-white/10" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden transition-colors duration-300">
      <header className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => setCurrentView(AppView.HOME)} className="flex items-center gap-3 md:gap-5 group">
              <CyberLogo isAnimated={currentView !== AppView.HOME} />
              <span className="text-2xl font-black tracking-tighter hidden sm:block text-black dark:text-white">FAINL</span>
            </button>
            <nav className="hidden lg:flex items-center gap-1">
              {NavLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg ${currentView === link.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/60 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'nl' ? 'en' : 'nl')}
              className="px-3 py-1 font-black text-[10px] uppercase tracking-widest bg-black/5 dark:bg-white/10 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-black dark:text-white"
            >
              {language === 'nl' ? 'EN' : 'NL'}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg active:scale-95 transition-all"
            >
              {isMenuOpen ? <CloseIcon /> : <Menu />}
            </button>

            {authSession && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-4 border-black dark:border-zinc-700 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {NavLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentView(link.id); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all ${currentView === link.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-50 dark:bg-zinc-800 text-black/40 dark:text-white/40'}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}
            {authSession && (
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-4 p-4 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all bg-red-50 text-red-600 border border-red-200 mt-4"
              >
                <LogOut className="w-5 h-5" />
                {t.nav.signOut}
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full mx-auto">
        {currentView === AppView.HOME ? (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            {renderStageIndicator()}
            {session.stage === WorkflowStage.ERROR && (
              <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 p-6 md:p-12 rounded-xl text-center animate-fade-in-up shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <AlertTriangle className="w-12 h-12 md:w-20 md:h-20 text-black dark:text-white mb-6 mx-auto" />
                <h3 className="text-xl md:text-3xl font-black uppercase mb-3 tracking-tighter">Protocol Halt</h3>
                <p className="text-black/50 dark:text-white/50 font-bold mb-6 leading-relaxed text-sm md:text-lg">{session.error}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setCurrentView(AppView.ACCOUNT)} className="px-6 py-3 md:px-10 md:py-5 bg-black dark:bg-white text-white dark:text-black font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] transition-all">My Nodes</button>
                  <button onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE })} className="px-6 py-3 md:px-10 md:py-5 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] transition-all text-black dark:text-white">Recalibrate</button>
                </div>
              </div>
            )}

            {session.stage === WorkflowStage.IDLE ? (
              <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full text-center space-y-16 md:space-y-32 animate-fade-in-up">
                <div className="space-y-8 md:space-y-12 pt-10 md:pt-20">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9] select-none text-balance">
                    {t.hero.title.split('\n').map((line: string, i: number) => (
                      <div key={i} className={i === 1 ? 'text-black/40 dark:text-white/40' : ''}>{line}</div>
                    ))}
                  </h1>
                  <p className="max-w-2xl mx-auto text-lg md:text-xl font-bold text-black/70 dark:text-white/70 leading-relaxed tracking-tight">
                    {t.hero.description}
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={() => document.getElementById('mission-input')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group relative px-10 py-5 bg-[#FDC700] text-black font-black uppercase text-xl md:text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                    >
                      {t.hero.cta}
                    </button>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                      {t.hero.footer}
                    </p>
                  </div>
                </div>

                <div id="mission-input" className="w-full space-y-8 scroll-mt-24">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, modelCount: 3 }))}
                      className={`px-6 py-3 font-black text-[10px] md:text-xs uppercase tracking-widest border-4 border-black transition-all ${config.modelCount === 3 ? 'bg-[#FDC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white dark:bg-zinc-800 opacity-50'}`}
                    >
                      {t.hero.modelChoice3}
                    </button>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, modelCount: 5 }))}
                      className={`px-6 py-3 font-black text-[10px] md:text-xs uppercase tracking-widest border-4 border-black transition-all ${config.modelCount === 5 ? 'bg-[#FDC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white dark:bg-zinc-800 opacity-50'}`}
                    >
                      {t.hero.modelChoice5}
                    </button>
                  </div>

                  <div className="w-full relative">
                    <div className="relative bg-white dark:bg-zinc-900 border-2 md:border-4 border-black rounded-xl p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="relative w-full min-h-[200px] md:min-h-[350px]">
                        {!input && !isInputFocused && (
                          <div className="absolute top-0 left-0 pointer-events-none text-xl sm:text-2xl md:text-4xl font-black text-black/20 font-serif italic">
                            <FadingPlaceholder isFocused={isInputFocused} examples={t.hero.placeholders} />
                          </div>
                        )}
                        <textarea
                          id="mission-input-field"
                          title={t.hero.description}
                          aria-label={t.hero.cta}
                          value={input}
                          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          className="w-full h-full bg-transparent border-none p-0 text-xl sm:text-2xl md:text-4xl font-black text-black dark:text-white placeholder-transparent focus:ring-0 resize-none font-serif italic absolute top-0 left-0"
                        />
                      </div>
                      <button
                        onClick={handleStart}
                        disabled={!input.trim()}
                        title={t.hero.cta}
                        aria-label={t.hero.cta}
                        className="absolute bottom-4 right-4 md:bottom-12 md:right-12 p-4 md:p-8 bg-black dark:bg-white text-white dark:text-black rounded-xl transition-all hover:scale-105 active:scale-95"
                      >
                        <AnimatedSendIcon />
                      </button>
                    </div>
                  </div>

                  <div className="w-full space-y-12 md:space-y-24 mt-16 text-left">
                    <div className="bg-white dark:bg-zinc-900 border-4 border-black p-8 md:p-16 rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-2xl md:text-4xl font-black uppercase mb-6">{t.marketing.directUitlegTitle}</h3>
                      <p className="text-lg md:text-2xl font-bold text-black/70 dark:text-white/70">{t.marketing.directUitlegBody}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : session.stage !== WorkflowStage.ERROR && (
              <div className="animate-fade-in-up space-y-8 md:space-y-16 w-full pb-12">
                <div className="bg-white/40 dark:bg-zinc-900/40 border-2 border-black/5 rounded-xl p-6 md:p-12 text-center backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl md:text-5xl text-black dark:text-white font-serif italic">"{session.query}"</p>
                </div>

                {(session.stage === WorkflowStage.SYNTHESIZING || session.stage === WorkflowStage.COMPLETED) && (
                  <div className="w-full bg-white dark:bg-zinc-900 border-2 md:border-4 border-black rounded-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-black dark:bg-white text-white dark:text-black p-4 md:p-8 flex items-center gap-5">
                      <Gavel className="w-6 h-6 md:w-8 md:h-8" />
                      <h3 className="font-black text-lg md:text-2xl uppercase tracking-widest">Chairman's Verdict</h3>
                    </div>
                    <div className="p-6 md:p-16 prose prose-base md:prose-2xl max-w-none dark:prose-invert">
                      <ReactMarkdown>{session.synthesis || ""}</ReactMarkdown>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                  {(config.modelCount === 5 ? PRESETS[1].members : DEFAULT_COUNCIL).map(member => {
                    const response = session.councilResponses.find(r => r.memberId === member.id);
                    return <CouncilCard key={member.id} member={member} response={response} isLoading={!response} isExpanded={false} onToggle={() => { }} />;
                  })}
                </div>

                <div className="flex justify-center gap-6">
                  <button onClick={() => setIsDebateOpen(true)} className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,0.12)]">
                    <MessageSquare className="w-5 h-5 inline mr-2" /> Open Debate Room
                  </button>
                  <button onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE, query: '', synthesis: '', councilResponses: [] })} className="px-10 py-5 border-4 border-black font-black uppercase text-sm">New Mission</button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {currentView === AppView.PRICING && (
          <PricingPage
            hasOwnKeys={config.creditsRemaining > 0}
            onPurchaseTurns={(count: number) => handlePurchaseTurns(count)}
          />
        )}
        {currentView === AppView.ACCOUNT && (
          !authSession ? (
            <LoginPage onLoginSuccess={() => setCurrentView(AppView.ACCOUNT)} />
          ) : (
            <AccountPage
              config={config}
              onUpdateConfig={setConfig}
              history={history}
              onLoadSession={(sess) => {
                setSession(sess);
                setCurrentView(AppView.HOME);
              }}
              onDeleteSessions={(ids) => {
                setHistory(prev => prev.filter(s => !ids.includes(s.id)));
              }}
              onArchiveSessions={(ids) => {
                setHistory(prev => prev.map(s => ids.includes(s.id) ? { ...s, isArchived: !s.isArchived } : s));
              }}
            />
          )
        )}
        {currentView === AppView.COOKBOOK && <CookbookPage onSelectMission={setInput} />}
        {currentView === AppView.FAQ && <FAQPage />}
        {currentView === AppView.CONTACT && <ContactPage />}
        {currentView === AppView.PRIVACY && <PrivacyPolicyPage />}
        {currentView === AppView.TERMS && <TermsOfServicePage />}
      </main>

      <footer className="border-t border-black/5 py-8 md:py-12 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-black/30">{t.common.madeBy} MNRV</span>
      </footer>

      <PaywallModal
        isOpen={isPaywallOpen}
        hasOwnKeys={config.creditsRemaining > 0}
        onPurchaseTurns={handlePurchaseTurns}
        onClose={() => setIsPaywallOpen(false)}
      />

      {isWelcomeOpen && (
        <WelcomePopup onClose={() => {
          localStorage.setItem('fainl_visited', '1');
          setIsWelcomeOpen(false);
        }} />
      )}
    </div>
  );
};

export default App;

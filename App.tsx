
import { useState, useRef, useEffect, FC } from 'react';
import { 
  Send, 
  Settings as SettingsIcon, 
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
  CircleCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DEFAULT_COUNCIL, DEFAULT_CHAIRMAN, USAGE_LIMITS } from './constants';
import { CouncilResponse, PeerReview, WorkflowStage, SessionState, AppConfig, ModelProvider, AppView } from './types';
import { UnifiedCouncilService } from './services/councilService';
import { SettingsModal } from './components/SettingsModal';
import { CouncilCard } from './components/CouncilCard';
import { PaywallModal } from './components/PaywallModal';
import { PricingPage } from './components/PricingPage';
import { AccountPage } from './components/AccountPage';
import { CookbookPage } from './components/CookbookPage';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { 
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  Coins,
  BookOpen,
  HelpCircle,
  Mail,
  Zap as ZapIcon
} from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { LoginPage } from './components/LoginPage';
import { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';

const ScrambleText: FC<{ text: string }> = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const isAnimating = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const runFullScramble = () => {
      isAnimating.current = true;
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char: string, index: number) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text);
          isAnimating.current = false;
          scheduleNext();
        }
        iteration += 1 / 4;
      }, 40);
    };

    const runPartialGlitch = () => {
      isAnimating.current = true;
      const numCharsToGlitch = Math.floor(Math.random() * 2) + 1; // 1 or 2 characters
      const indicesToGlitch = new Set<number>();
      while (indicesToGlitch.size < numCharsToGlitch) {
        indicesToGlitch.add(Math.floor(Math.random() * text.length));
      }

      let ticks = 0;
      const maxTicks = Math.floor(Math.random() * 5) + 4; // 4 to 8 ticks (160ms - 320ms)

      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char: string, index: number) => {
            if (indicesToGlitch.has(index)) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return text[index];
          }).join('')
        );
        ticks++;
        if (ticks >= maxTicks) {
          clearInterval(interval);
          setDisplayText(text);
          isAnimating.current = false;
          scheduleNext();
        }
      }, 40);
    };

    const scheduleNext = () => {
      if (isAnimating.current) return;
      // Random interval between 8 and 25 seconds
      const nextDelay = Math.random() * 17000 + 8000;
      timeout = setTimeout(() => {
        // 15% chance for a full word scramble, 85% chance for a subtle partial glitch
        if (Math.random() < 0.15) {
          runFullScramble();
        } else {
          runPartialGlitch();
        }
      }, nextDelay);
    };

    // Initial animation on mount
    runFullScramble();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text]);

  return <>{displayText}</>;
};

const FadingPlaceholder: FC<{ isFocused: boolean }> = ({ isFocused }: { isFocused: boolean }) => {
  const examples = [
    "Should I learn Rust or Go?",
    "Buy vs. Rent in 2026?",
    "To be or not to be?",
    "What came first: Chicken or the egg?"
  ];
  
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % examples.length);
        setFade(true);
      }, 500); // Wait for fade out before changing text
    }, 4000); // Change text every 4 seconds

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

const App: FC = () => {
  // Initialization with Persistent Config
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('fainl_config_v2');
    return saved ? JSON.parse(saved) : {
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
      activeCouncil: DEFAULT_COUNCIL,
      chairmanId: DEFAULT_CHAIRMAN.id,
      turnsUsed: 0,
      creditsRemaining: 0,
      isLifetime: false,
    };
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [authSession, setAuthSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    return saved ? JSON.parse(saved) : [];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const [session, setSession] = useState<SessionState>({
    stage: WorkflowStage.IDLE,
    query: '',
    councilResponses: [],
    debateMessages: [],
    reviews: [],
    synthesis: ''
  });

  const [debateTimeLeft, setDebateTimeLeft] = useState(120);
  const [isDebateActive, setIsDebateActive] = useState(false);
  const [isDebatePaused, setIsDebatePaused] = useState(false);
  const [userDebateInput, setUserDebateInput] = useState('');
  
  const debateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const debateSpeakerIndexRef = useRef(0);
  const isGeneratingRef = useRef(false);

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

    // Usage check
    const hasOwnKeys = config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey;
    const canUseCredits = hasOwnKeys && config.creditsRemaining > 0;
    const hasTurnsRemaining = config.turnsUsed < config.totalTurnsAllowed;
    const isAllowed = config.isLifetime || hasTurnsRemaining || canUseCredits;

    if (!isAllowed) {
      setIsPaywallOpen(true);
      return;
    }

    // Detect active nodes
    const readyMembers = councilService.current.getReadyMembers(config.activeCouncil);
    
    // Ensure we meet the minimum requirement for consensus logic
    if (readyMembers.length < 2) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: "Insufficient active nodes for consensus protocol. Minimum 2 nodes required."
      }));
      return;
    }

    setSession({
      stage: WorkflowStage.PROCESSING_COUNCIL,
      query: input,
      councilResponses: [],
      debateMessages: [],
      reviews: [],
      synthesis: ''
    });

    try {
      // 1. Council Analysis Phase
      const responses = await councilService.current.getCouncilResponses(input, readyMembers);
      
      setSession((prev: SessionState) => ({
        ...prev,
        councilResponses: responses,
        stage: WorkflowStage.DEBATE,
        debateMessages: []
      }));

      setDebateTimeLeft(120);
      setIsDebateActive(true);
      setIsDebatePaused(false);
      debateSpeakerIndexRef.current = 0;

    } catch (err: any) {
      console.error(err);
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Autonomous consensus protocol interrupted."
      }));
    }
  };

  useEffect(() => {
    if (session.stage === WorkflowStage.DEBATE && isDebateActive && !isDebatePaused && debateTimeLeft > 0) {
      debateIntervalRef.current = setInterval(() => {
        setDebateTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(debateIntervalRef.current!);
            handleEndDebate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (debateIntervalRef.current) {
      clearInterval(debateIntervalRef.current);
    }
    return () => {
      if (debateIntervalRef.current) clearInterval(debateIntervalRef.current);
    };
  }, [session.stage, isDebateActive, isDebatePaused, debateTimeLeft]);

  useEffect(() => {
    let mounted = true;

    const runDebateTurn = async () => {
      if (
        session.stage !== WorkflowStage.DEBATE || 
        !isDebateActive || 
        isDebatePaused || 
        debateTimeLeft <= 0 || 
        isGeneratingRef.current
      ) return;

      isGeneratingRef.current = true;

      const readyMembers = councilService.current.getReadyMembers(config.activeCouncil);
      const speaker = readyMembers[debateSpeakerIndexRef.current % readyMembers.length];
      
      try {
        const response = await councilService.current.generateDebateResponse(
          session.query,
          speaker,
          session.councilResponses,
          session.debateMessages,
          readyMembers
        );

        if (mounted && session.stage === WorkflowStage.DEBATE && !isDebatePaused) {
          setSession((prev: SessionState) => ({
            ...prev,
            debateMessages: [
              ...prev.debateMessages,
              {
                id: Date.now().toString(),
                memberId: speaker.id,
                content: response,
                timestamp: Date.now()
              }
            ]
          }));
          debateSpeakerIndexRef.current += 1;
        }
      } catch (err) {
        console.error("Debate generation error", err);
      } finally {
        if (mounted) {
          isGeneratingRef.current = false;
        }
      }
    };

    let timeoutId: NodeJS.Timeout;
    if (session.stage === WorkflowStage.DEBATE && isDebateActive && !isDebatePaused && !isGeneratingRef.current && debateTimeLeft > 0) {
       timeoutId = setTimeout(() => {
         runDebateTurn();
       }, 800);
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [session.stage, isDebateActive, isDebatePaused, debateTimeLeft, session.debateMessages, config.activeCouncil]);

  const handleEndDebate = async () => {
    setIsDebateActive(false);
    setIsDebatePaused(true);
    
    setSession((prev: SessionState) => ({
      ...prev,
      stage: WorkflowStage.SYNTHESIZING,
      synthesis: ''
    }));

    const readyMembers = councilService.current.getReadyMembers(config.activeCouncil);

    try {
      const synthesis = await councilService.current.synthesizeStream(
        session.query, 
        session.councilResponses, 
        [], // Skip peer reviews for now
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
        
        // Update Usage Tracking
        setConfig((current: AppConfig) => {
          const hasOwnKeys = current.googleKey || current.openaiKey || current.anthropicKey || current.groqKey || current.deepseekKey;
          if (hasOwnKeys && current.creditsRemaining > 0) {
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

  const handleUserDebateMessage = () => {
    if (!userDebateInput.trim()) return;
    
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages: [
        ...prev.debateMessages,
        {
          id: Date.now().toString(),
          memberId: 'user',
          content: userDebateInput,
          timestamp: Date.now()
        }
      ]
    }));
    setUserDebateInput('');
  };

  const handleQuoteMessage = (memberId: string, content: string) => {
    const memberName = memberId === 'user' ? 'User' : config.activeCouncil.find(m => m.id === memberId)?.name || 'Unknown';
    const quote = `> [${memberName}]: "${content}"\n\n`;
    setUserDebateInput((prev: string) => prev + quote);
    setIsDebatePaused(true);
  };

  const NavLinks = [
    { id: AppView.HOME, label: 'Protocols', icon: ZapIcon },
    { id: AppView.PRICING, label: 'Access', icon: Coins },
    { id: AppView.ACCOUNT, label: 'My FAINLS', icon: LayoutDashboard },
    { id: AppView.COOKBOOK, label: 'Cookbook', icon: BookOpen },
    { id: AppView.FAQ, label: 'FAQ', icon: HelpCircle },
    { id: AppView.CONTACT, label: 'Contact', icon: Mail },
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/20 p-2.5 rounded-3xl sm:rounded-full border border-black/10 backdrop-blur-sm w-full sm:w-auto overflow-x-auto">
          {stages.map((s, idx) => {
            const isActive = session.stage === s.id;
            const isCompleted = [WorkflowStage.COMPLETED, ...stages.slice(idx + 1).map(st => st.id)].includes(session.stage);
            return (
              <div key={s.id} className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase transition-all border-2 w-full sm:w-auto justify-center sm:justify-start ${isActive ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]' : isCompleted ? 'bg-white text-black border-black' : 'text-black/20 border-transparent'}`}>
                  <s.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="whitespace-nowrap">{s.label}</span>
                </div>
                {idx < stages.length - 1 && <ArrowRight className="hidden sm:block w-4 h-4 text-black/10" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-black flex flex-col font-sans selection:bg-black selection:text-white overflow-x-hidden">
      {/* Refined Navigation */}
      <header className="border-b border-black/10 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setCurrentView(AppView.HOME)}
              className="flex items-center gap-3 md:gap-5 group"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 bg-black rounded flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter hidden sm:block">FAINL</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NavLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg ${currentView === link.id ? 'bg-black text-white' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="group flex items-center gap-3 px-3 py-2.5 sm:px-5 bg-white border border-black/10 rounded font-black text-[10px] uppercase tracking-widest hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-px transition-all"
            >
              <Lock className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 bg-black text-white rounded-lg active:scale-95 transition-all"
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

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                {NavLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => { setCurrentView(link.id); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 p-4 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all ${currentView === link.id ? 'bg-black text-white' : 'bg-zinc-50 text-black/40'}`}
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
                    Sign Out
                  </button>
                )}
            </div>
        )}
      </header>

      <main className="flex-1 w-full mx-auto">
        {currentView === AppView.HOME ? (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            {renderStageIndicator()}
            {/* Protocol Error Display */}
            {session.stage === WorkflowStage.ERROR && (
                <div className="w-full max-w-xl bg-white border-2 md:border-4 border-black p-6 md:p-12 rounded-xl md:rounded rounded shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center animate-fade-in-up">
                    <AlertTriangle className="w-12 h-12 md:w-20 md:h-20 text-black mb-6 md:mb-8 mx-auto" />
                    <h3 className="text-xl md:text-3xl font-black uppercase mb-3 md:mb-4 tracking-tighter">Protocol Halt</h3>
                    <p className="text-black/50 font-bold mb-6 md:mb-10 leading-relaxed text-sm md:text-lg">{session.error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setIsSettingsOpen(true)} className="px-6 py-3 md:px-10 md:py-5 bg-black text-white font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] hover:bg-zinc-800 shadow-lg md:shadow-xl transition-all">Resolve Keys</button>
                    <button onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE })} className="px-6 py-3 md:px-10 md:py-5 bg-white border-2 border-black font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] transition-all">Recalibrate</button>
                    </div>
                </div>
            )}
            
            {/* Rest of home content logic */}
            {session.stage === WorkflowStage.IDLE ? (
                /* Mission Input Stage */
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center space-y-8 md:space-y-16 animate-fade-in-up">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black text-black tracking-tighter uppercase leading-[0.9] md:leading-[0.8] select-none">
                <ScrambleText text="FAINL" />
              </h2>
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <p className="text-[10px] md:text-xs text-black/30 font-black uppercase tracking-[0.4em] md:tracking-[0.6em] max-w-md mx-auto leading-loose">Fully Autonomous Intelligence Network & Logic</p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                   <div className="flex items-center gap-2 md:gap-2.5 px-4 py-1.5 md:px-5 md:py-2 bg-white/60 border border-black/10 rounded-full shadow-sm">
                     <CircleCheck className={`w-3 h-3 md:w-4 md:h-4 ${config.googleKey ? 'text-green-600' : 'text-zinc-300'}`} />
                     <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{config.googleKey ? 'Primary Node Active' : 'Primary Node Offline'}</span>
                   </div>
                </div>
              </div>
            </div>
            
            {!config.googleKey ? (
              <div className="w-full max-w-2xl bg-white border-4 border-black p-8 md:p-16 rounded-3xl shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] text-left animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-6 mb-10 pb-6 border-b-4 border-black">
                  <div className="p-4 bg-black rounded-2xl">
                    <ZapIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Quick Start</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Neural Link Authorization Required</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-black uppercase tracking-[0.2em]">Paste Google Gemini API Key</label>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Get Free Key</a>
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="password"
                        placeholder="AIza..."
                        className="flex-1 bg-zinc-100 border-4 border-black p-5 rounded-2xl font-mono text-sm focus:bg-white transition-all shadow-inner"
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (val.startsWith('AIza')) {
                            setConfig(prev => ({ ...prev, googleKey: val }));
                          }
                        }}
                      />
                    </div>
                    <p className="mt-4 text-[9px] font-bold text-black/30 uppercase tracking-widest leading-relaxed">
                      FAINL is a "bring your own key" protocol. Your keys are stored locally in your browser and are never sent to our servers.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 border-2 border-black/5 rounded-2xl bg-zinc-50">
                      <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase tracking-widest">
                        <Shield className="w-4 h-4" /> Zero-Data
                      </div>
                      <p className="text-[9px] text-black/40 font-bold uppercase leading-tight">Missions are encrypted and stored only on your device.</p>
                    </div>
                    <div className="p-5 border-2 border-black/5 rounded-2xl bg-zinc-50">
                      <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase tracking-widest">
                        <Globe className="w-4 h-4" /> Pure Logic
                      </div>
                      <p className="text-[9px] text-black/40 font-bold uppercase leading-tight">No central filters. Direct access to raw neural reasoning.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full relative">
                <div className="relative bg-white border-2 md:border-4 border-black rounded-xl p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="relative w-full min-h-[200px] md:min-h-[350px]">
                    {!input && !isInputFocused && (
                      <div className="absolute top-0 left-0 pointer-events-none text-xl sm:text-2xl md:text-4xl font-black text-black/20 font-serif italic">
                        <FadingPlaceholder isFocused={isInputFocused} />
                      </div>
                    )}
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      aria-label="Enter your mission or directive"
                      placeholder="Enter your mission..."
                      className="w-full h-full bg-transparent border-none p-0 text-xl sm:text-2xl md:text-4xl font-black text-black placeholder-transparent focus:ring-0 transition-all resize-none font-serif italic absolute top-0 left-0"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 pointer-events-none">
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${input.length >= MAX_CHARS ? 'text-red-500' : 'text-black/20'}`}>
                      {input.length} / {MAX_CHARS}
                    </span>
                  </div>
                  <button
                    onClick={handleStart}
                    disabled={!input.trim()}
                    title="Send mission"
                    aria-label="Send mission"
                    className="absolute bottom-4 right-4 md:bottom-12 md:right-12 p-4 md:p-8 bg-black hover:bg-zinc-800 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed text-white rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden"
                  >
                    <AnimatedSendIcon />
                  </button>
                </div>
                <p className="mt-4 md:mt-8 text-[8px] md:text-[10px] font-black text-black/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Encrypted Session. Data persistent locally only.</p>
              </div>
            )}
          </div>
        ) : session.stage !== WorkflowStage.ERROR && (
          <div className="animate-fade-in-up space-y-8 md:space-y-16 w-full pb-12 md:pb-20">
            {/* Active Context */}
            <div className="bg-white/40 border-2 border-black/5 rounded-xl md:rounded-2xl p-6 md:p-12 text-center backdrop-blur-sm">
               <span className="text-[8px] md:text-[10px] font-black text-black/20 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 md:mb-6 block border-b border-black/5 pb-2 md:pb-3 mx-auto w-fit italic">Deliberation Protocol Active</span>
               <p className="text-2xl sm:text-3xl md:text-5xl text-black font-serif italic font-medium tracking-tight leading-tight">"{session.query}"</p>
            </div>

            {/* Synthesis Display */}
            {(session.stage === WorkflowStage.SYNTHESIZING || session.stage === WorkflowStage.COMPLETED) && (
              <div className="w-full bg-white border-2 md:border-4 border-black rounded-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-black text-white p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 border-b-2 md:border-b-4 border-black">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                      <Gavel className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg md:text-2xl uppercase tracking-widest leading-none">Chairman's Verdict</h3>
                      <p className="text-[8px] md:text-[10px] text-white/40 font-black uppercase mt-1 md:mt-2 tracking-widest">Final Consolidated Synthesis</p>
                    </div>
                  </div>
                  {session.stage === WorkflowStage.SYNTHESIZING && (
                    <div className="ml-auto flex items-center gap-2 md:gap-3 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded font-black text-[8px] md:text-[10px] tracking-widest animate-pulse">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                      SYNTHESIZING...
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-16 prose prose-base md:prose-2xl max-w-none prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black bg-white leading-relaxed">
                  {session.synthesis ? (
                    <ReactMarkdown>{session.synthesis}</ReactMarkdown>
                  ) : (
                    <div className="h-40 md:h-80 flex flex-col items-center justify-center gap-4 md:gap-8 text-black/10">
                      <Loader2 className="animate-spin w-10 h-10 md:w-16 md:h-16 text-black" />
                      <span className="font-black text-lg md:text-2xl uppercase tracking-[0.3em] md:tracking-[0.5em] text-center">Merging Neural Logic States</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Distributed Council Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
              {config.activeCouncil.map(member => {
                const response = session.councilResponses.find(r => r.memberId === member.id);
                const isLoading = session.stage === WorkflowStage.PROCESSING_COUNCIL && !response;
                return (
                  <div key={member.id} className="flex flex-col gap-4 md:gap-8">
                    <CouncilCard member={member} response={response} isLoading={isLoading} isExpanded={false} onToggle={() => {}} />
                  </div>
                );
              })}
            </div>

            {/* Live Debate Section */}
            {(session.stage === WorkflowStage.DEBATE || session.debateMessages.length > 0) && (
              <div className="w-full bg-white border-2 md:border-4 border-black rounded-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                <div className="bg-black text-white p-4 md:p-6 flex items-center justify-between border-b-2 md:border-b-4 border-black">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg md:text-xl uppercase tracking-widest leading-none">Live Debate</h3>
                      <p className="text-[8px] md:text-[10px] text-white/40 font-black uppercase mt-1 tracking-widest">Agents Defending Positions</p>
                    </div>
                  </div>
                  {session.stage === WorkflowStage.DEBATE && (
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-bold text-xl md:text-2xl text-red-400">
                        {Math.floor(debateTimeLeft / 60)}:{(debateTimeLeft % 60).toString().padStart(2, '0')}
                      </div>
                      <button 
                        onClick={() => setIsDebatePaused(!isDebatePaused)}
                        className="px-4 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded hover:bg-zinc-200 transition-all"
                      >
                        {isDebatePaused ? 'Resume' : 'Pause'}
                      </button>
                      <button 
                        onClick={handleEndDebate}
                        className="px-4 py-2 bg-green-500 text-white font-black text-[10px] uppercase tracking-widest rounded hover:bg-green-600 transition-all"
                      >
                        Proceed to Verdict
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:p-8 bg-zinc-50 flex-1 overflow-y-auto max-h-[500px] space-y-6">
                  {session.debateMessages.map((msg) => {
                    const isUser = msg.memberId === 'user';
                    const member = isUser ? null : config.activeCouncil.find(m => m.id === msg.memberId);
                    return (
                      <div key={msg.id} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-black ${isUser ? 'bg-black' : member?.color || 'bg-zinc-500'}`}>
                          {isUser ? <Users className="w-5 h-5 text-white" /> : <img src={member?.avatar} alt={member?.name} className="w-full h-full rounded-full object-cover" />}
                        </div>
                        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                          <span className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">
                            {isUser ? 'You' : member?.name}
                          </span>
                          <div 
                            onClick={() => !isUser && handleQuoteMessage(msg.memberId, msg.content)}
                            className={`p-4 rounded-xl border-2 border-black text-sm md:text-base font-medium leading-relaxed transition-all ${isUser ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5'}`}
                            title={!isUser ? "Click to quote" : ""}
                          >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {session.stage === WorkflowStage.DEBATE && !isDebatePaused && isGeneratingRef.current && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-black/10 animate-pulse border-2 border-black/20"></div>
                      <div className="p-4 rounded-xl border-2 border-black/10 bg-black/5 text-black/40 text-sm font-medium animate-pulse rounded-tl-none">
                        Agent is typing...
                      </div>
                    </div>
                  )}
                </div>

                {session.stage === WorkflowStage.DEBATE && (
                  <div className="p-4 md:p-6 bg-white border-t-2 md:border-t-4 border-black flex gap-4">
                    <input 
                      type="text" 
                      value={userDebateInput}
                      onChange={(e) => {
                        setUserDebateInput(e.target.value);
                        if (!isDebatePaused) setIsDebatePaused(true); // Auto-pause when user types
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUserDebateMessage()}
                      placeholder="Jump into the debate..."
                      className="flex-1 bg-zinc-100 border-2 border-black rounded-lg px-4 py-3 font-medium text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all"
                    />
                    <button 
                      onClick={handleUserDebateMessage}
                      disabled={!userDebateInput.trim()}
                      className="px-6 py-3 bg-black text-white rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 disabled:opacity-50 transition-all"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}

            {session.stage === WorkflowStage.COMPLETED && (
              <div className="flex justify-center pt-12 md:pt-24 pb-20 md:pb-40">
                <button 
                  onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE, query: '', synthesis: '', councilResponses: [], reviews: [] })} 
                  className="px-10 py-6 md:px-20 md:py-10 bg-black hover:bg-zinc-800 rounded-xl md:rounded-2xl text-white transition-all hover:scale-105 flex items-center gap-4 md:gap-8 font-black text-xl md:text-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] md:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-2 active:shadow-none uppercase tracking-tighter"
                >
                  <Send className="w-8 h-8 md:w-12 md:h-12" />
                  Initialize New Mission
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    ) : null}

        {/* New Pages */}
        {currentView === AppView.PRICING && (
            <PricingPage 
                hasOwnKeys={!!(config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey)}
                onPurchaseTurns={(count: number | typeof Infinity) => {
                    setConfig(prev => ({
                        ...prev,
                        isLifetime: count === Infinity ? true : prev.isLifetime,
                        totalTurnsAllowed: count === Infinity ? prev.totalTurnsAllowed : prev.totalTurnsAllowed + count
                    }));
                }}
                onPurchaseCredits={(count: number) => {
                    setConfig(prev => ({
                        ...prev,
                        creditsRemaining: prev.creditsRemaining + count
                    }));
                }}
            />
        )}
        {currentView === AppView.ACCOUNT && (
            !authSession ? (
                <LoginPage onLoginSuccess={() => setCurrentView(AppView.ACCOUNT)} />
            ) : (
                <AccountPage 
                    config={config}
                    history={history}
                    onLoadSession={(sess: SessionState) => {
                        setSession(sess);
                        setCurrentView(AppView.HOME);
                    }}
                />
            )
        )}
        {currentView === AppView.COOKBOOK && (
            <CookbookPage 
                onSelectMission={(q: string) => {
                    setInput(q);
                    setCurrentView(AppView.HOME);
                }}
            />
        )}
        {currentView === AppView.FAQ && <FAQPage />}
        {currentView === AppView.CONTACT && <ContactPage />}
        {currentView === AppView.PRIVACY && <PrivacyPolicyPage />}
        {currentView === AppView.TERMS && <TermsOfServicePage />}
      </main>

      {/* Modern Footer with Privacy Link */}
      <footer className="border-t border-black/5 py-8 md:py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <Shield className="text-white w-3 h-3" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase opacity-20">FAINL Protocol</span>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentView(AppView.PRIVACY)}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setCurrentView(AppView.TERMS)}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/10">© 2026</span>
          </div>
        </div>
      </footer>

      <PaywallModal 
        isOpen={isPaywallOpen}
        hasOwnKeys={!!(config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey)}
        onPurchaseTurns={(count: number | typeof Infinity) => {
          setConfig(prev => ({
            ...prev,
            isLifetime: count === Infinity ? true : prev.isLifetime,
            totalTurnsAllowed: count === Infinity ? prev.totalTurnsAllowed : prev.totalTurnsAllowed + count
          }));
          setIsPaywallOpen(false);
          handleStart(); // Auto-start after "purchase"
        }}
        onPurchaseCredits={(count: number) => {
          setConfig(prev => ({
            ...prev,
            creditsRemaining: prev.creditsRemaining + count
          }));
          setIsPaywallOpen(false);
          handleStart(); // Auto-start after "purchase"
        }}
        onClose={() => setIsPaywallOpen(false)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={setConfig}
        history={history}
        onImportHistory={setHistory}
        onVerifyKey={(provider: ModelProvider, key: string) => councilService.current.verifyProviderKey(provider, key)}
      />
    </div>
  );
};
export default App;

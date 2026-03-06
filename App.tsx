import { useState, useRef, useEffect, FC } from "react";
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
  CircleCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  DEFAULT_COUNCIL,
  DEFAULT_CHAIRMAN,
  USAGE_LIMITS,
  PRICING,
} from "./constants";
import {
  CouncilResponse,
  PeerReview,
  WorkflowStage,
  SessionState,
  AppConfig,
  ModelProvider,
} from "./types";
import { UnifiedCouncilService } from "./services/councilService";
import { SettingsModal } from "./components/SettingsModal";
import { CouncilCard } from "./components/CouncilCard";
import { PaywallModal } from "./components/PaywallModal";
import { TrialChoiceModal } from "./components/TrialChoiceModal";
import { PricingPage } from "./components/PricingPage";
import { AccountPage } from "./components/AccountPage";
import { CookbookPage } from "./components/CookbookPage";
import { FAQPage } from "./components/FAQPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import { DebateRoom } from "./components/DebateRoom";
import {
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
} from "lucide-react";
import { supabase } from "./services/supabaseClient";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { SEO } from "./components/SEO";
import { LoginPage } from "./components/LoginPage";
import { QuestionPage } from "./components/QuestionPage";
import { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { ScrambleText } from "./components/ScrambleText";
import { WelcomePopup } from "./components/WelcomePopup";
import { CookieConsent } from "./components/CookieConsent";

const FadingPlaceholder: FC<{ isFocused: boolean }> = ({
  isFocused,
}: {
  isFocused: boolean;
}) => {
  const examples = [
    "Should I learn Rust or Go?",
    "Buy vs. Rent in 2026?",
    "To be or not to be?",
    "What came first: Chicken or the egg?",
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
    <span
      className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
    >
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
      <Send
        className={`w-6 h-6 md:w-10 md:h-10 transition-transform duration-100 ${glitch ? "translate-x-0.5 -translate-y-0.5 opacity-80" : ""}`}
      />
      {glitch && (
        <Send className="w-6 h-6 md:w-10 md:h-10 absolute top-0 left-0 text-red-500 opacity-50 -translate-x-0.5 translate-y-0.5 mix-blend-screen" />
      )}
    </div>
  );
};
const CyberLogo: FC<{ isAnimated?: boolean }> = ({ isAnimated = true }) => {
  return (
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group overflow-visible">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500 animate-pulse-glow" />

      {/* Orbital Layers */}
      {isAnimated && (
        <>
          <div className="absolute inset-x-0.5 inset-y-0.5 border border-white/20 rounded-full animate-orbit pointer-events-none" />
          <div className="absolute inset-x-2 inset-y-2 border border-white/10 dark:border-white/5 rounded-full animate-reverse-orbit pointer-events-none" />
        </>
      )}

      {/* Core Geometry (Shield with Glassmorphism) */}
      <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-white/50 transition-all duration-500 overflow-hidden">
        {/* Internal Light Source */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)] opacity-50 group-hover:opacity-80 transition-opacity" />

        <Shield className="text-white dark:text-white w-4 h-4 md:w-5 md:h-5 relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

        {/* Glass Glint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    </div>
  );
};

const App: FC = () => {
  // Initialization with Persistent Config
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem("fainl_config_v2");
    return saved
      ? JSON.parse(saved)
      : {
          googleKey: "",
          openRouterKey: "",
          openaiKey: "",
          anthropicKey: "",
          deepseekKey: "",
          groqKey: "",
          mistralKey: "",
          customKey: "",
          mimoKey: "",
          devstralKey: "",
          katKey: "",
          olmoKey: "",
          nemotronKey: "",
          gemmaKey: "",
          glmKey: "",
          activeCouncil: DEFAULT_COUNCIL,
          chairmanId: DEFAULT_CHAIRMAN.id,
          turnsUsed: 0,
          creditsRemaining: 0,
          isLifetime: false,
          totalTurnsAllowed: 1, // Default to 1 free turn
          hasWatchedAd: false,
          hasSubscribed: false,
        };
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("fainl_theme") === "dark" ||
        (!localStorage.getItem("fainl_theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("fainl_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
    navigate("/");
  };

  const [history, setHistory] = useState<SessionState[]>(() => {
    const saved = localStorage.getItem("fainl_history");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migrate: Ensure all sessions have an ID
      const migrated = parsed.map((s: any) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        isArchived: !!s.isArchived,
      }));
      return migrated;
    } catch (e) {
      return [];
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isDebateOpen, setIsDebateOpen] = useState(false);
  const [isTrialChoiceOpen, setIsTrialChoiceOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    const seen = localStorage.getItem("fainl_visited");
    if (!seen) {
      // Delay popup slightly so page loads first
      setTimeout(() => {}, 0);
      return true;
    }
    return false;
  });

  const [session, setSession] = useState<SessionState>({
    id: crypto.randomUUID(),
    stage: WorkflowStage.IDLE,
    query: "",
    councilResponses: [],
    debateMessages: [],
    reviews: [],
    synthesis: "",
  });

  const councilService = useRef(new UnifiedCouncilService(config));

  useEffect(() => {
    councilService.current = new UnifiedCouncilService(config);
    localStorage.setItem("fainl_config_v2", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("fainl_history", JSON.stringify(history));
  }, [history]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const MAX_CHARS = 4000;

  const handleStart = async () => {
    if (!input.trim()) return;

    // Usage check
    const hasOwnKeys =
      config.googleKey ||
      config.openaiKey ||
      config.anthropicKey ||
      config.groqKey ||
      config.deepseekKey;
    const canUseCredits = hasOwnKeys && config.creditsRemaining > 0;
    const hasTurnsRemaining = config.turnsUsed < config.totalTurnsAllowed;
    const isAllowed = config.isLifetime || hasTurnsRemaining || canUseCredits;

    if (!isAllowed) {
      if (config.turnsUsed === 1 && !config.hasWatchedAd) {
        setIsTrialChoiceOpen(true);
      } else {
        setIsPaywallOpen(true);
      }
      return;
    }

    // Detect active nodes
    const readyMembers = councilService.current.getReadyMembers(
      config.activeCouncil,
    );

    // Ensure we meet the minimum requirement for consensus logic
    if (readyMembers.length < 2) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error:
          "Insufficient active nodes for consensus protocol. Minimum 2 nodes required.",
      }));
      return;
    }

    setSession({
      id: crypto.randomUUID(),
      stage: WorkflowStage.PROCESSING_COUNCIL,
      query: input,
      councilResponses: [],
      debateMessages: [],
      reviews: [],
      synthesis: "",
    });

    try {
      // 1. Council Analysis Phase
      const responses = await councilService.current.getCouncilResponses(
        input,
        readyMembers,
      );

      // Council done — stage stays at PROCESSING_COUNCIL until user opens debate
      setSession((prev: SessionState) => ({
        ...prev,
        councilResponses: responses,
        stage: WorkflowStage.COMPLETED,
        debateMessages: [],
      }));
    } catch (err: any) {
      console.error(err);
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Autonomous consensus protocol interrupted.",
      }));
    }
  };

  const handleEndDebate = async (
    debateMessages: import("./types").DebateMessage[],
  ) => {
    setIsDebateOpen(false);

    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages,
      stage: WorkflowStage.SYNTHESIZING,
      synthesis: "",
    }));

    const readyMembers = councilService.current.getReadyMembers(
      config.activeCouncil,
    );

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
            synthesis: (prev.synthesis || "") + chunk,
          }));
        },
      );

      setSession((prev: SessionState) => {
        const completedSession = {
          ...prev,
          synthesis,
          stage: WorkflowStage.COMPLETED,
        };
        setHistory((h: SessionState[]) => [completedSession, ...h]);

        // Update Usage Tracking
        setConfig((current: AppConfig) => {
          const hasOwnKeys =
            current.googleKey ||
            current.openaiKey ||
            current.anthropicKey ||
            current.groqKey ||
            current.deepseekKey;
          if (hasOwnKeys && current.creditsRemaining > 0) {
            return {
              ...current,
              creditsRemaining:
                current.creditsRemaining - USAGE_LIMITS.CREDITS_PER_TURN,
            };
          } else {
            return {
              ...current,
              turnsUsed: current.turnsUsed + 1,
            };
          }
        });

        return completedSession;
      });
    } catch (err: any) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Synthesis failed.",
      }));
    }
  };

  const handleAddDebateMessage = (msg: import("./types").DebateMessage) => {
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages: [...prev.debateMessages, msg],
    }));
  };

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePurchase = async (
    type: "turns" | "subscription" | "credits",
    count: number,
  ) => {
    setIsPaymentLoading(true);
    try {
      const pkg =
        type === "turns" || type === "credits"
          ? PRICING.TOKENS.find((p) => p.count === count)
          : PRICING.SUBSCRIPTIONS[0];

      if (pkg?.url) {
        window.location.href = pkg.url;
        return;
      }
      throw new Error("Invalid package or URL");
    } catch (err: any) {
      console.error("Payment initialization failed:", err);
      setIsPaywallOpen(false);
      setIsPaymentLoading(false);
    }
  };

  const handleWatchAd = () => {
    setConfig((prev) => ({
      ...prev,
      hasWatchedAd: true,
      totalTurnsAllowed: prev.totalTurnsAllowed + 1,
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Handle mission query param
    const queryParam = params.get("q");
    if (queryParam && location.pathname === "/mission") {
      setInput(queryParam);
    }

    if (params.get("payment_confirm") === "true") {
      const type = params.get("type");
      const countStr = params.get("count");
      const count =
        countStr === "infinity" ? Infinity : parseInt(countStr || "0", 10);

      if (type === "turns") {
        setConfig((prev) => ({
          ...prev,
          totalTurnsAllowed: prev.totalTurnsAllowed + count,
        }));
      } else if (type === "subscription") {
        setConfig((prev) => ({
          ...prev,
          isLifetime: true, // Treat subscription as unlimited for now or handle appropriately
        }));
      }

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const NavLinks = [
    { id: "/", label: "Protocols", icon: ZapIcon },
    { id: "/tokens", label: "Tokens", icon: Coins },
    { id: "/dashboard", label: "My FAINLS", icon: LayoutDashboard },
    { id: "/cookbook", label: "Cookbook", icon: BookOpen },
    { id: "/faq", label: "FAQ", icon: HelpCircle },
    { id: "/contact", label: "Contact", icon: Mail },
  ];

  const renderStageIndicator = () => {
    const stages = [
      {
        id: WorkflowStage.PROCESSING_COUNCIL,
        label: "Neural Deliberation",
        icon: Users,
      },
      { id: WorkflowStage.DEBATE, label: "Live Debate", icon: MessageSquare },
      {
        id: WorkflowStage.SYNTHESIZING,
        label: "Verdict Synthesis",
        icon: Gavel,
      },
    ];
    if (
      session.stage === WorkflowStage.IDLE ||
      session.stage === WorkflowStage.ERROR
    )
      return null;
    return (
      <div className="flex justify-center mb-8 md:mb-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/20 dark:bg-white/5 p-2.5 rounded-3xl sm:rounded-full border border-black/10 dark:border-white/10 backdrop-blur-sm w-full sm:w-auto overflow-x-auto">
          {stages.map((s, idx) => {
            const isActive = session.stage === s.id;
            const isCompleted = [
              WorkflowStage.COMPLETED,
              ...stages.slice(idx + 1).map((st) => st.id),
            ].includes(session.stage);
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 w-full sm:w-auto"
              >
                <div
                  className={`flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase transition-all border-2 w-full sm:w-auto justify-center sm:justify-start ${isActive ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]" : isCompleted ? "bg-white dark:bg-zinc-800 text-black dark:text-white border-black dark:border-white/20" : "text-black/20 dark:text-white/20 border-transparent"}`}
                >
                  <s.icon
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "animate-pulse" : ""}`}
                  />
                  <span className="whitespace-nowrap">{s.label}</span>
                </div>
                {idx < stages.length - 1 && (
                  <ArrowRight className="hidden sm:block w-4 h-4 text-black/10 dark:text-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden transition-colors duration-300">
      {/* Refined Navigation */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              className="flex items-center gap-3 md:gap-5 group"
            >
              <CyberLogo isAnimated={location.pathname !== "/"} />
              <div className="text-2xl font-black tracking-tighter hidden sm:block text-black dark:text-white relative top-[2px]">
                <ScrambleText text="FAINL" />
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NavLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.id}
                  className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg ${
                    location.pathname === link.id
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-black/60 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="group flex items-center gap-3 px-3 py-2.5 sm:px-5 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded font-black text-[10px] uppercase tracking-widest hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-px transition-all"
            >
              <Lock className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg active:scale-95 transition-all"
            >
              {isMenuOpen ? <CloseIcon /> : <Menu />}
            </button>

            {authSession && (
              <button
                type="button"
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
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-4 border-black dark:border-zinc-700 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {NavLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => {
                  navigate(link.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all ${location.pathname === link.id ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-50 dark:bg-zinc-800 text-black/40 dark:text-white/40"}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}

            {authSession && (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
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
        <Routes>
          {/* Home / Landing Page */}
          <Route
            path="/"
            element={
              <>
                <SEO
                  title="Revolutionaire AI Consensus"
                  description="Krijg antwoorden met de gecombineerde kracht van meerdere AI-systemen. FAINL biedt diepgaande reflectie en gewogen oordelen."
                  canonical="/"
                />
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
                  <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center space-y-8 md:space-y-16 animate-fade-in-up">
                    <div className="space-y-4 md:space-y-8">
                      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-tight max-w-3xl mx-auto">
                        Eén antwoord. Meerdere intelligenties.
                      </h1>
                      <p className="max-w-2xl mx-auto text-lg md:text-xl font-semibold text-black/70 dark:text-white/70 leading-relaxed tracking-[0.06em]">
                        FAINL laat meerdere AI’s tegelijk naar jouw vraag
                        kijken. Ze controleren elkaars redenering, filteren
                        fouten en geven samen één intelligent antwoord. Zo krijg
                        je meer zekerheid en betere resultaten.
                      </p>
                    </div>

                    {!config.googleKey ? (
                      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-8 md:p-16 rounded-3xl shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] dark:shadow-[32px_32px_0px_0px_rgba(255,255,255,0.1)] text-left animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-6 mb-10 pb-6 border-b-4 border-black dark:border-zinc-700">
                          <div className="p-4 bg-black dark:bg-white rounded-2xl">
                            <ZapIcon className="w-8 h-8 text-white dark:text-black" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
                              Quick Start
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <label className="text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white">
                                Paste Google Gemini API Key
                              </label>
                              <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                              >
                                Get Free Key
                              </a>
                            </div>
                            <div className="flex gap-4">
                              <input
                                type="password"
                                placeholder="AIza..."
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl font-mono text-sm focus:bg-white dark:focus:bg-zinc-700 transition-all shadow-inner text-black dark:text-white"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  if (val.startsWith("AIza")) {
                                    setConfig((prev) => ({
                                      ...prev,
                                      googleKey: val,
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 border-2 border-black/5 dark:border-white/5 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                              <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase tracking-widest">
                                <Shield className="w-4 h-4" /> Zero-Data
                              </div>
                              <p className="text-[9px] text-black/40 dark:text-white/40 font-bold uppercase leading-tight">
                                Missions are encrypted and stored only on your
                                device.
                              </p>
                            </div>
                            <div className="p-5 border-2 border-black/5 dark:border-white/5 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                              <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase tracking-widest">
                                <Globe className="w-4 h-4" /> Pure Logic
                              </div>
                              <p className="text-[9px] text-black/40 dark:text-white/40 font-bold uppercase leading-tight">
                                No central filters. Direct access to raw neural
                                reasoning.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full relative mt-8">
                        <button
                          type="button"
                          onClick={() => navigate("/mission")}
                          className="w-full relative bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all text-center group flex flex-col items-center justify-center min-h-[150px] md:min-h-[200px]"
                        >
                          <div className="text-xl sm:text-2xl md:text-3xl font-black text-black/40 dark:text-white/40 font-serif italic mb-6 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Start session
                          </div>
                          <div className="p-3 md:p-4 bg-black dark:bg-white text-white dark:text-black rounded-lg md:rounded-xl group-hover:scale-110 shadow-lg transition-transform flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            }
          />

          {/* Mission / Chat Area */}
          <Route
            path="/mission"
            element={
              <>
                <SEO
                  title="Missie Controle"
                  description="Start je AI-sessie en zie hoe meerdere modellen tot een consensus komen."
                  canonical="/mission"
                />
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
                  {renderStageIndicator()}
                  {session.stage === WorkflowStage.ERROR && (
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 p-6 md:p-12 rounded-xl text-center animate-fade-in-up">
                      <AlertTriangle className="w-12 h-12 md:w-20 md:h-20 text-black dark:text-white mb-6 md:mb-8 mx-auto" />
                      <h3 className="text-xl md:text-3xl font-black uppercase mb-3 md:mb-4 tracking-tighter">
                        Protocol Halt
                      </h3>
                      <p className="text-black/50 dark:text-white/50 font-bold mb-6 md:mb-10 leading-relaxed text-sm md:text-lg">
                        {session.error}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setIsSettingsOpen(true)}
                          className="px-6 py-3 md:px-10 md:py-5 bg-black dark:bg-white text-white dark:text-black font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg transition-all"
                        >
                          Resolve Keys
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSession({
                              ...session,
                              stage: WorkflowStage.IDLE,
                            })
                          }
                          className="px-6 py-3 md:px-10 md:py-5 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 font-black rounded uppercase tracking-[0.2em] text-[9px] md:text-[10px] transition-all text-black dark:text-white"
                        >
                          Recalibrate
                        </button>
                      </div>
                    </div>
                  )}

                  {session.stage === WorkflowStage.IDLE ? (
                    <div className="w-full relative">
                      <div className="relative bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] focus-within:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:md:focus-within:shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] transition-all">
                        <div className="relative w-full min-h-[200px] md:min-h-[350px]">
                          {!input && !isInputFocused && (
                            <div className="absolute top-0 left-0 pointer-events-none text-xl sm:text-2xl md:text-4xl font-black text-black/20 dark:text-white/20 font-serif italic">
                              <FadingPlaceholder isFocused={isInputFocused} />
                            </div>
                          )}
                          <textarea
                            value={input}
                            onChange={(e) =>
                              setInput(e.target.value.slice(0, MAX_CHARS))
                            }
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            aria-label="Enter your mission or directive"
                            placeholder="Stel je vraag..."
                            className="w-full h-full bg-transparent border-none p-0 text-xl sm:text-2xl md:text-4xl font-black text-black dark:text-white placeholder-transparent focus:ring-0 transition-all resize-none font-serif italic absolute top-0 left-0"
                          />
                        </div>
                        <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 pointer-events-none">
                          <span
                            className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${input.length >= MAX_CHARS ? "text-red-500" : "text-black/40 dark:text-white/40"}`}
                          >
                            {input.length} / {MAX_CHARS}
                          </span>
                        </div>
                        <button
                          onClick={handleStart}
                          disabled={!input.trim()}
                          title="Send mission"
                          className="absolute bottom-4 right-4 md:bottom-12 md:right-12 p-4 md:p-8 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-20 disabled:grayscale text-white dark:text-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg overflow-hidden"
                        >
                          <AnimatedSendIcon />
                        </button>
                      </div>
                      <p className="mt-4 md:mt-8 text-[8px] md:text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em] block text-center">
                        Versleutelde sessie. Data wordt alleen lokaal
                        opgeslagen.
                      </p>
                    </div>
                  ) : (
                    session.stage !== WorkflowStage.ERROR && (
                      <div className="animate-fade-in-up space-y-8 md:space-y-16 w-full pb-12">
                        <div className="bg-white/40 dark:bg-zinc-900/40 border-2 border-black/5 dark:border-white/5 rounded-xl p-6 md:p-12 text-center backdrop-blur-sm">
                          <span className="text-[8px] md:text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.3em] mb-4 block border-b border-black/5 pb-2 mx-auto w-fit italic">
                            Deliberation Protocol Active
                          </span>
                          <p className="text-2xl sm:text-3xl md:text-5xl text-black dark:text-white font-serif italic font-medium tracking-tight leading-tight">
                            "{session.query}"
                          </p>
                        </div>

                        {(session.stage === WorkflowStage.SYNTHESIZING ||
                          session.stage === WorkflowStage.COMPLETED) && (
                          <div className="w-full bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
                            <div className="bg-black dark:bg-white text-white dark:text-black p-4 md:p-8 flex items-center gap-4 border-b-2">
                              <Gavel className="w-6 h-6 md:w-8 md:h-8" />
                              <h3 className="font-black text-lg md:text-2xl uppercase tracking-widest">
                                Chairman's Verdict
                              </h3>
                            </div>
                            <div className="p-6 md:p-16 prose prose-base md:prose-2xl max-w-none bg-white dark:bg-zinc-900 leading-relaxed">
                              {session.synthesis ? (
                                <ReactMarkdown>
                                  {session.synthesis}
                                </ReactMarkdown>
                              ) : (
                                <div className="h-40 flex flex-col items-center justify-center gap-4">
                                  <Loader2 className="animate-spin w-10 h-10" />
                                  <span className="font-black text-center uppercase tracking-widest">
                                    Merging Neural Logic States
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {config.activeCouncil.map((member) => (
                            <CouncilCard
                              key={member.id}
                              member={member}
                              response={session.councilResponses.find(
                                (r) => r.memberId === member.id,
                              )}
                              isLoading={
                                session.stage ===
                                  WorkflowStage.PROCESSING_COUNCIL &&
                                !session.councilResponses.find(
                                  (r) => r.memberId === member.id,
                                )
                              }
                            />
                          ))}
                        </div>

                        {session.stage === WorkflowStage.COMPLETED && (
                          <div className="flex justify-center pt-12">
                            <button
                              type="button"
                              onClick={() => navigate("/")}
                              className="px-10 py-6 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xl hover:scale-105 transition-all shadow-xl uppercase"
                            >
                              Initialize New Mission
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </>
            }
          />

          {/* Pricing / Tokens */}
          <Route
            path="/tokens"
            element={
              <>
                <SEO
                  title="Tokens & Abonnementen"
                  description="Kies het pakket dat bij je past. Tokens voor incidentele vragen of een maandelijks abonnement voor onbeperkte toegang."
                  canonical="/tokens"
                />
                <PricingPage
                  hasOwnKeys={
                    !!(
                      config.googleKey ||
                      config.openaiKey ||
                      config.anthropicKey ||
                      config.groqKey ||
                      config.deepseekKey
                    )
                  }
                  onPurchaseTurns={(count: number | typeof Infinity) =>
                    handlePurchase("turns", count)
                  }
                  onPurchaseCredits={(count: number) =>
                    handlePurchase("credits", count)
                  }
                />
              </>
            }
          />

          {/* Account / Dashboard */}
          <Route
            path="/dashboard"
            element={
              !authSession ? (
                <LoginPage onLoginSuccess={() => navigate("/dashboard")} />
              ) : (
                <>
                  <SEO
                    title="Mijn Dashboard"
                    description="Beheer je sessies, bekijk je geschiedenis en configureer je persoonlijke AI-raad."
                    canonical="/dashboard"
                  />
                  <AccountPage
                    config={config}
                    history={history}
                    onLoadSession={(sess: SessionState) => {
                      setSession(sess);
                      navigate("/mission");
                    }}
                    onDeleteSessions={(ids: string[]) => {
                      setHistory((prev) =>
                        prev.filter((s) => !ids.includes(s.id)),
                      );
                    }}
                    onArchiveSessions={(ids: string[]) => {
                      setHistory((prev) =>
                        prev.map((s) =>
                          ids.includes(s.id)
                            ? { ...s, isArchived: !s.isArchived }
                            : s,
                        ),
                      );
                    }}
                  />
                </>
              )
            }
          />

          {/* Cookbook */}
          <Route
            path="/cookbook"
            element={
              <>
                <SEO
                  title="Het Kookboek"
                  description="Een verzameling van 400 diepgaande levensvragen, geoptimaliseerd voor collectieve AI-reflectie."
                  canonical="/cookbook"
                />
                <CookbookPage
                  onSelectMission={(q: string) => {
                    setInput(q);
                    navigate("/mission");
                  }}
                />
              </>
            }
          />

          <Route path="/cookbook/:id" element={<QuestionPage />} />

          {/* Static Pages */}
          <Route
            path="/faq"
            element={
              <>
                <SEO
                  title="Veelgestelde Vragen"
                  description="Antwoorden op al je vragen over FAINL, AI-consensus en privacy."
                  canonical="/faq"
                />
                <FAQPage />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <SEO
                  title="Contact"
                  description="Neem contact met ons op voor vragen, suggesties of ondersteuning."
                  canonical="/contact"
                />
                <ContactPage />
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>
                <SEO
                  title="Privacybeleid"
                  description="Hoe wij omgaan met jouw data. Bij FAINL staat jouw privacy centraal."
                  canonical="/privacy"
                />
                <PrivacyPolicyPage />
              </>
            }
          />
          <Route
            path="/terms"
            element={
              <>
                <SEO
                  title="Algemene Voorwaarden"
                  description="De spelregels van FAINL. Transparant en eerlijk."
                  canonical="/terms"
                />
                <TermsOfServicePage />
              </>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modern Footer with Privacy Link */}
      <footer className="border-t border-black/5 dark:border-white/5 py-8 md:py-12 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/10 dark:text-white/10">
              © 2026
            </span>
          </div>
        </div>
      </footer>

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />

      <TrialChoiceModal
        isOpen={isTrialChoiceOpen}
        onClose={() => setIsTrialChoiceOpen(false)}
        onWatchAd={handleWatchAd}
        onBuyTokens={() => {
          setIsTrialChoiceOpen(false);
          navigate("/tokens");
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={setConfig}
        history={history}
        onImportHistory={setHistory}
        onVerifyKey={(provider: ModelProvider, key: string) =>
          councilService.current.verifyProviderKey(provider, key)
        }
      />
      {isWelcomeOpen && (
        <WelcomePopup
          onClose={() => {
            localStorage.setItem("fainl_visited", "1");
            setIsWelcomeOpen(false);
          }}
        />
      )}

      {/* GDPR Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};
export default App;

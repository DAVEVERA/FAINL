import { useState, FC } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Coins,
  Cpu,
  Lock,
  Globe,
  MessageSquare,
} from "lucide-react";
import { ScrambleText } from "./ScrambleText";

const FAQS = [
  {
    q: "Wat is FAINL?",
    a: "FAINL is een applicatie die meerdere AI-systemen tegelijkertijd aanstelt om een vraag te beantwoorden, waarbij zij elkaars antwoorden controleren op logica en feiten.",
    icon: Cpu,
  },
  {
    q: "Waarom is meerdere AI’s gebruiken beter?",
    a: "Eén AI kan fouten maken of informatie verzinnen. Door meerdere onafhankelijke AI’s te gebruiken, worden fouten sneller ontdekt en krijg je een veel betrouwbaarder antwoord.",
    icon: MessageSquare,
  },
  {
    q: "Hoe werkt FAINL precies?",
    a: "Zodra je een vraag stelt, wordt deze naar verschillende AI-modellen gestuurd. Zij genereren hun eigen antwoord, bekritiseren elkaars werk en vormen samen een definitieve consensus.",
    icon: Zap,
  },
  {
    q: "Is FAINL betrouwbaarder dan gewone AI?",
    a: "Ja, omdat FAINL gebaseerd is op verificatie. Waar een gewone AI-chat slechts één mening geeft, biedt FAINL een gecontroleerd resultaat dat door meerdere systemen is getoetst.",
    icon: ShieldCheck,
  },
  {
    q: "Wanneer gebruik je FAINL het best?",
    a: "Gebruik FAINL voor belangrijke taken waarbij nauwkeurigheid cruciaal is, zoals zakelijke beslissingen, complexe code-vraagstukken of diepgaande research.",
    icon: HelpCircle,
  },
  {
    q: "Voor wie is FAINL bedoeld?",
    a: "Voor professionals, onderzoekers en ondernemers die de snelheid van AI willen combineren met de betrouwbaarheid van een meervoudige check.",
    icon: Globe,
  },
  {
    q: "Welke AI-modellen gebruikt FAINL?",
    a: "FAINL kan worden gekoppeld aan de meest geavanceerde modellen van nu, waaronder die van Google, OpenAI en Anthropic.",
    icon: Cpu,
  },
  {
    q: "Blijven mijn vragen privé bij FAINL?",
    a: "Ja. FAINL is gebouwd met privacy als uitgangspunt. Uw gegevens en sessies worden lokaal op uw toestel beheerd of veilig verwerkt via uw eigen API-sleutels.",
    icon: Lock,
  },
  {
    q: "Hoe verhoogt FAINL de kwaliteit van mijn output?",
    a: "Door ruis en fouten weg te filteren via een proces van onderlinge controle, blijft alleen de meest accurate en nuttige informatie over in het eindantwoord.",
    icon: Zap,
  },
  {
    q: "Moet ik een expert zijn om FAINL te gebruiken?",
    a: "Nee. Ondanks de complexe technologie erachter, is de interface van FAINL net zo simpel als een normale chat. Je stelt je vraag en krijgt direct het beste antwoord.",
    icon: HelpCircle,
  },
];

export const FAQPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
          <ScrambleText text="Interne Protocollen" />
        </h1>
        <p className="max-w-2xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
          Krijg inzicht in de logica en richtlijnen van de FAINL Orchestration
          Layer. Begrijp de mechanieken van decentrale consensus en AI-checks.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] ${openIndex === idx ? "ring-2 ring-yellow-400" : ""}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-6 md:p-10 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 md:gap-8">
                <div
                  className={`p-3 rounded-xl transition-colors ${openIndex === idx ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black dark:text-white"}`}
                >
                  <faq.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight text-black dark:text-white">
                  {faq.q}
                </h3>
              </div>
              <div
                className={`transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}
              >
                <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-white opacity-20 group-hover:opacity-100" />
              </div>
            </button>
            {openIndex === idx && (
              <div className="px-6 md:px-10 pb-6 md:pb-10 animate-in slide-in-from-top-4 duration-300">
                <div className="pt-6 border-t-2 border-black/5 dark:border-white/5 text-xs md:text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed uppercase tracking-widest">
                  {faq.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">
          System Revision 4.2.0 • Consensus Priority 0
        </p>
      </div>
    </div>
  );
};

export type Language = 'nl' | 'en';

export const translations = {
    nl: {
        // Nav & Common
        nav: {
            protocols: 'Protocols',
            access: 'Toegang',
            cookbook: 'Cookbook',
            faq: 'FAQ',
            contact: 'Contact',
            myFainls: 'Mijn FAINLS',
            settings: 'Instellingen',
            signOut: 'Uitloggen',
            privacyPolicy: 'Privacybeleid',
            termsOfService: 'Servicevoorwaarden'
        },
        common: {
            madeBy: 'Made by',
            loading: 'Laden...',
            save: 'Opslaan',
            cancel: 'Annuleren',
            start: 'Start',
            continue: 'Doorgaan',
            close: 'Sluiten'
        },
        // Homepage - Hero
        hero: {
            title: "EÉN ANTWOORD.\nMEERDERE INTELLIGENTIES.",
            cta: "START NU GRATIS ->",
            footer: "GEEN ACCOUNT NODIG — JOUW DATA BLIJFT OP JOUW APPARAAT",
            placeholders: [
                "Moet ik investeren in AI of wachten?",
                "Kopen of huren in 2026?",
                "Welke marketingstrategie levert de beste ROI?",
                "Wat zijn de risico's van deze overname?"
            ],
            description: "FAINL laat meerdere AI-modellen tegelijk jouw vraag analyseren, elkaars redenering controleren en samen tot één scherp, gewogen oordeel komen.",
            quickStartTitle: "Snelle Start",
            pasteKey: "Plak Google Gemini API Key",
            getFreeKey: "Haal Gratis Key",
            apiKeyPlaceholder: "Aiza...",
            zeroDataTitle: "Zero-Data",
            zeroDataDesc: "Sessies zijn versleuteld en worden alleen lokaal opgeslagen.",
            pureLogicTitle: "Pure Logica",
            pureLogicDesc: "Geen centrale filters. Directe toegang tot ruwe neurale redenering.",
            orLoginTitle: "Of log in met FAINL",
            loginDesc: "Gebruik FAINL beurten zonder eigen API keys.",
            loginBtn: "Account Toegang",
            fainlInputPlaceholder: "Voer missie of vraagstuk in...",
            modelChoice3: "3 AI MODELLEN (BASIS)",
            modelChoice5: "5 AI MODELLEN (COMPLEX)",
            initiateBtn: "Start Sessie",
            initiateFree: "Sessie Starten (Gratis)"
        },
        // Marketing Sections
        marketing: {
            directUitlegTitle: "De Faalveiligheid van FAINL",
            directUitlegBody: "Eén AI maakt fouten. Meerdere AI's samen, veel minder. FAINL combineert meerdere AI-analyses tot één gecheckt, betrouwbaar antwoord.",

            waaromTitle: "Waarom FAINL",
            waaromIntro: "Eén AI weet niet alles. Elke AI-tool heeft blinde vlekken. Door meerdere AI's tegelijk te laten redeneren, worden zwakke punten gefilterd vóórdat jij het antwoord leest.",
            waarom1Title: "01 — Meerdere AI's tegelijk",
            waarom1Desc: "Jouw vraag wordt gelijktijdig door meerdere systemen bekeken — niet na elkaar.",
            waarom2Title: "02 — Ingebouwde controle",
            waarom2Desc: "AI's toetsen elkaars uitkomsten. Fouten worden herkend voor jij ze tegenkomt.",
            waarom3Title: "03 — Één helder antwoord",
            waarom3Desc: "Geen ruis. Één samengesteld, doorgewogen resultaat.",
            waarom4Title: "04 — Geen technische kennis",
            waarom4Desc: "Typ je vraag. Dat is alles. Wij regelen de consensus.",

            hoeWerktTitle: "Hoe het werkt",
            hoeWerkt1Title: "01 — VOER JE VRAAG IN",
            hoeWerkt1Desc: "Stel elke vraag - zakelijk, filosofisch of persoonlijk. FAINL verwerkt hem direct.",
            hoeWerkt2Title: "02 — AI'S GAAN HEAD-TO-HEAD",
            hoeWerkt2Desc: "Meerdere modellen analyseren jouw vraag tegelijk en controleren elkaars redenering op fouten en blinde vlekken.",
            hoeWerkt3Title: "03 — BEKIJK ELKE AI APART",
            hoeWerkt3Desc: "Volledig transparant: zie exact wat elk AI-model individueel heeft geconcludeerd — zonder filters.",
            hoeWerkt4Title: "04 — LIVE DEBAT - DOE ZELF MEE",
            hoeWerkt4Desc: "Zie AI's in realtime met elkaar debatteren om tot de beste consensus te komen.",
            hoeWerktFooter: "GEEN ACCOUNT NODIG — JOUW DATA BLIJFT OP JOUW APPARAAT",

            vergelijkingTitle: "Gewone AI vs. FAINL",
            v1Label: "Aantal AI's", v1Left: "Één systeem", v1Right: "Meerdere tegelijk",
            v2Label: "Zelfcontrole", v2Left: "Nee", v2Right: "Ja — ingebouwd",
            v3Label: "Fouten opsporen", v3Left: "Niet mogelijk", v3Right: "AI's controleren elkaar",
            v4Label: "Diepgang analyse", v4Left: "Één perspectief", v4Right: "Meerdere perspectieven",
            v5Label: "Betrouwbaarheid output", v5Left: "Wisselend", v5Right: "Gecheckt & samengesteld",
            v6Label: "Complexe vragen", v6Left: "Beperkt", v6Right: "Ja — juist daarvoor",
            v7Label: "Vertrouwen in antwoord", v7Left: "Zelf controleren nodig", v7Right: "Ingebouwde verificatie",
            v8Label: "Resultaat", v8Left: "Eén mening", v8Right: "Eén beter antwoord",

            useCasesTitle: "Use Cases",
            uc1Title: "Zakelijke beslissingen", uc1Desc: "Moet je kiezen tussen strategie A of B? FAINL analyseert beide kanten grondig en legt risico's en kansen naast elkaar.",
            uc2Title: "Research & analyse", uc2Desc: "Verdiep je in een onderwerp. Meerdere AI's bekijken bronnen en argumenten — jij krijgt het complete beeld.",
            uc3Title: "Complexe afwegingen", uc3Desc: "Van personeelsbeslissingen tot investeringskeuzes: FAINL helpt alle kanten van een complexe vraag te overzien.",
            uc4Title: "Software & techniek", uc4Desc: "Technische vragen over architectuur of code worden van meerdere kanten bekeken. Minder blinde vlekken, betere oplossingen.",
            uc5Title: "Ideeën ontwikkelen", uc5Desc: "Brainstorm met meerdere AI's tegelijk. Meer perspectieven betekent rijkere ideeën en onverwachte invalshoeken.",
            uc6Title: "Content & communicatie", uc6Desc: "Van marketingteksten tot pitches: laat meerdere AI's meedenken over toon, structuur en overtuigingskracht.",

            conversie1Title: "Je hebt ooit een AI-antwoord vertrouwd dat niet klopte.",
            conversie1Desc: "Dat is niet jouw fout. Eén AI mist context. Slaat nuance over. Heeft geen zelfreflectie. FAINL heeft dat probleem opgelost.",
            conversie2Title: "Meerdere AI's denken mee. Jij neemt een betere beslissing.",
            conversie2Desc: "Niet meer zelf controleren of het antwoord klopt. FAINL doet dat voor je — door AI's elkaars werk te laten toetsen.",
            conversie3Title: "De meeste mensen gebruiken AI verkeerd. Dit is de betere manier.",
            conversie3Desc: "Één AI bevragen is een begin. Meerdere AI's tegelijk — die elkaar controleren — is hoe je AI écht benut.",
            conversie4Title: "Geen technische kennis nodig. Wel slimmere antwoorden.",
            conversie4Desc: "FAINL werkt als een gewone AI-chat — maar achter de schermen werken meerdere systemen samen aan jouw antwoord.",

            socialQuotes: [
                `"Voor het eerst vertrouw ik een AI-antwoord zonder het zelf te controleren."`,
                `"Het voelt als een tweede mening — maar dan sneller en grondiger."`,
                `"FAINL geeft antwoorden die ik niet had verwacht maar wel nodig had."`,
                `"De diepgang is zichtbaar anders dan bij andere AI-tools."`,
                `"Eindelijk een AI-tool die nadenkt in plaats van reageert."`
            ],

            cta1: "Start sessie",
            cta2: "Probeer het gratis",
            cta3: "Stel je eerste vraag",
            cta4: "Zie het verschil"
        },
        // Stages
        stages: {
            processing: "Neurale Beraadslaging",
            debate: "Live Debat",
            synthesizing: "Verdict Synthese"
        },
        errors: {
            insufficientNodes: "Onvoldoende actieve nodes voor het consensus protocol. Minimaal 2 nodes vereist.",
            halt: "Protocol Gestopt",
            resolveKeys: "Sleutels Oplossen",
            recalibrate: "Her-kalibreren"
        },
        pricing: {
            title: "Neurale Toegangsniveaus",
            subtitle: "Kies je protocol toegangsniveau. Veilig afrekenen via Stripe.",
            standardAccess: "Credits Toegang",
            standardDesc: "Volledige consensus beurten · Eenmalige aankoop",
            turns: "Credits",
            moreSoon: "Binnenkort meer niveaus · Veilig afrekenen via Stripe"
        },
        paywall: {
            title: "Toegang Vereist",
            subtitle: "Je hebt actieve protocol toegang nodig om een nieuwe neurale beraadslaging te starten.",
            apiKeyTitle: "Google Gemini API Sleutel",
            apiKeyDesc: "Je kunt een eigen Gemini API sleutel gebruiken om gratis toegang te krijgen tot de basisfuncties.",
            addKeyBtn: "Sleutel Toevoegen",
            or: "OF",
            purchaseTitle: "Credits Verkrijgen",
            purchaseDesc: "Koop direct toegang tot alle consensus modellen zonder eigen API sleutels."
        }
    },
    en: {
        // Nav & Common
        nav: {
            protocols: 'Protocols',
            access: 'Access',
            cookbook: 'Cookbook',
            faq: 'FAQ',
            contact: 'Contact',
            myFainls: 'My FAINLS',
            settings: 'Settings',
            signOut: 'Sign Out',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service'
        },
        common: {
            madeBy: 'Made by',
            loading: 'Loading...',
            save: 'Save',
            cancel: 'Cancel',
            start: 'Start',
            continue: 'Continue',
            close: 'Close'
        },
        // Homepage - Hero
        hero: {
            placeholders: [
                "Should I invest in AI or wait?",
                "Buy vs. Rent in 2026?",
                "Which marketing strategy yields the best ROI?",
                "What are the risks of this acquisition?"
            ],
            description: "Eliminate decision uncertainty with the FAINL Orchestration Layer. Our autonomous multi-agent consensus protocol stress-tests every scenario through decentralized node deliberation, distilling complex dilemmas into high-integrity, authoritative council verdicts.",
            quickStartTitle: "Quick Start",
            pasteKey: "Paste Google Gemini API Key",
            getFreeKey: "Get Free Key",
            apiKeyPlaceholder: "Aiza...",
            zeroDataTitle: "Zero-Data",
            zeroDataDesc: "Sessions are encrypted and stored only on your local device.",
            pureLogicTitle: "Pure Logic",
            pureLogicDesc: "No central filters. Direct access to raw neural reasoning.",
            orLoginTitle: "Or log in with FAINL",
            loginDesc: "Use FAINL turns without providing your own API keys.",
            loginBtn: "Account Access",
            fainlInputPlaceholder: "Enter mission or parameter...",
            initiateBtn: "Initiate Session",
            initiateFree: "Initiate Session (Free)"
        },
        // Marketing Sections (Translated back to EN for the toggle)
        marketing: {
            directUitlegTitle: "The Failsafe of FAINL",
            directUitlegBody: "One AI makes mistakes. Multiple AIs working together make far fewer. FAINL combines multiple AI analyses into one verified, reliable answer.",

            waaromTitle: "Why FAINL",
            waaromIntro: "One AI doesn't know everything. Every AI tool has blind spots. By letting multiple AIs reason simultaneously, weaknesses are filtered before you read the answer.",
            waarom1Title: "01 — Multiple AIs at once",
            waarom1Desc: "Your question is examined simultaneously by multiple systems.",
            waarom2Title: "02 — Built-in verification",
            waarom2Desc: "AIs cross-check each other's results. Errors are caught before you see them.",
            waarom3Title: "03 — One clear answer",
            waarom3Desc: "No noise. One synthesized, weighted result.",
            waarom4Title: "04 — No technical skills needed",
            waarom4Desc: "Type your query. That's all. We handle the consensus.",

            hoeWerktTitle: "How it works",
            hoeWerkt1Title: "Step 01 — Type your query",
            hoeWerkt1Desc: "Ask any question, simple or complex. No special prompting required.",
            hoeWerkt2Title: "Step 02 — Multiple AIs analyze",
            hoeWerkt2Desc: "Several systems look at your question independently, comparing findings and logic.",
            hoeWerkt3Title: "Step 03 — You get the best answer",
            hoeWerkt3Desc: "The verified, synthesized answer appears. Trustworthy and clear.",
            hoeWerktFooter: "From question to reliable answer — in seconds.",

            vergelijkingTitle: "Standard AI vs. FAINL",
            v1Label: "Number of AIs", v1Left: "One system", v1Right: "Multiple at once",
            v2Label: "Self-checking", v2Left: "No", v2Right: "Yes — built-in",
            v3Label: "Error detection", v3Left: "Not possible", v3Right: "AIs check each other",
            v4Label: "Analysis depth", v4Left: "One perspective", v4Right: "Multiple perspectives",
            v5Label: "Output reliability", v5Left: "Variable", v5Right: "Verified & synthesized",
            v6Label: "Complex queries", v6Left: "Limited", v6Right: "Yes — designed for it",
            v7Label: "Trust in answer", v7Left: "Requires manual check", v7Right: "Built-in verification",
            v8Label: "Result", v8Left: "One opinion", v8Right: "One better answer",

            useCasesTitle: "Use Cases",
            uc1Title: "Business Strategy", uc1Desc: "Choosing between strategies? FAINL analyzes both sides thoroughly, weighing risks and opportunities.",
            uc2Title: "Research & Analysis", uc2Desc: "Deep dive into a topic. Multiple AIs review sources and arguments to give you the complete picture.",
            uc3Title: "Complex Decisions", uc3Desc: "From hiring to investing: FAINL helps you oversee every angle of a complex choice.",
            uc4Title: "Software & Tech", uc4Desc: "Technical questions on architecture or code are viewed from multiple angles. Fewer blind spots.",
            uc5Title: "Idea Generation", uc5Desc: "Brainstorm with a council of AIs. More perspectives mean richer, unexpected ideas.",
            uc6Title: "Content & Comms", uc6Desc: "From marketing copy to pitches: let multiple AIs refine tone, structure, and persuasion.",

            conversie1Title: "You've trusted an AI answer that was wrong before.",
            conversie1Desc: "That's not your fault. One AI lacks context and self-reflection. FAINL solved this problem.",
            conversie2Title: "Multiple AIs think along. You make a better decision.",
            conversie2Desc: "Stop verifying answers yourself. FAINL does it for you by having AIs cross-check each other.",
            conversie3Title: "Most people use AI incorrectly. This is the better way.",
            conversie3Desc: "Asking one AI is just the start. Multiple AIs checking each other is true AI utilization.",
            conversie4Title: "No technical knowledge needed. Just smarter answers.",
            conversie4Desc: "FAINL feels like a normal chat, but behind the scenes a whole system is working for you.",

            socialQuotes: [
                `"For the first time, I trust an AI answer without verifying it myself."`,
                `"It feels like getting a second opinion — but faster and more thorough."`,
                `"FAINL gives answers I didn't expect but desperately needed."`,
                `"The depth is visibly different from other AI tools."`,
                `"Finally an AI tool that thinks instead of just reacting."`
            ],

            cta1: "Initiate Session",
            cta2: "Try for free",
            cta3: "Ask your first question",
            cta4: "See the difference"
        },
        // Stages
        stages: {
            processing: "Neural Deliberation",
            debate: "Live Debate",
            synthesizing: "Verdict Synthesis"
        },
        errors: {
            insufficientNodes: "Insufficient active nodes for consensus protocol. Minimum 2 nodes required.",
            halt: "Protocol Halt",
            resolveKeys: "Resolve Keys",
            recalibrate: "Recalibrate"
        },
        pricing: {
            title: "Neural Access Tiers",
            subtitle: "Select your protocol access tier to begin deliberation. Secure checkout via Stripe.",
            standardAccess: "Credit Access",
            standardDesc: "Full consensus turns · One-time purchase",
            turns: "Credits",
            moreSoon: "More tiers coming soon · Secure checkout via Stripe"
        },
        paywall: {
            title: "Access Required",
            subtitle: "Active protocol access is required to initiate a new neural deliberation sequence.",
            apiKeyTitle: "Google Gemini API Key",
            apiKeyDesc: "You can provide your own Gemini API key to access baseline functionality for free.",
            addKeyBtn: "Add Key",
            or: "OR",
            purchaseTitle: "Purchase FAINL Access",
            purchaseDesc: "Instantly unlock full access across all consensus models without managing API keys."
        }
    }
};


export interface Directive {
  id: string;
  title: string;
  category: string;
  subject: string;
  query: string;
  difficulty: 'Alpha' | 'Beta' | 'Gamma';
  length: 'Short' | 'Medium' | 'Long';
  nodesNeeded: number;
  popularity: number; // 1-100
  rating: number; // Reset to 0
}

export const DIRECTIVES: Directive[] = [
  // --- PREVIOUS CATEGORIES (RESET RATINGS) ---
  {
    id: 'd1',
    title: "Grand Strategy",
    category: "Geopolitics",
    subject: "Resource Scarcity",
    query: "Analyze the long-term viability of a space-based manufacturing hub and its impact on terrestrial resource scarcity.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 95,
    rating: 0
  },
  {
    id: 'd2',
    title: "Logic Auditor",
    category: "Philosophy",
    subject: "UBI Discourse",
    query: "Identify logical fallacies in this argument for universal basic income being the only solution to automation-driven unemployment.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 78,
    rating: 0
  },
  {
    id: 'd3',
    title: "Code Architect",
    category: "Software",
    subject: "Distributed Systems",
    query: "Propose a secure, scalable architecture for a peer-to-peer voting system that prevents double-voting without a centralized authority.",
    difficulty: "Beta",
    length: "Long",
    nodesNeeded: 4,
    popularity: 88,
    rating: 0
  },
  {
    id: 'd4',
    title: "Eco-Consensus",
    category: "Ecology",
    subject: "Reforestation",
    query: "Synthesize a plan for global reforestation that balances carbon capture efficiency with local biodiversity preservation.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 92,
    rating: 0
  },
  {
    id: 'd5',
    title: "Market Oracle",
    category: "Finance",
    subject: "Predictive Analysis",
    query: "Predict the impact of quantum computing on traditional blockchain encryption protocols and subsequent market volatility.",
    difficulty: "Gamma",
    length: "Medium",
    nodesNeeded: 5,
    popularity: 85,
    rating: 0
  },

  // --- FUNNY ---
  {
    id: 'f1',
    title: "Sarcasm Synthesizer",
    category: "Funny",
    subject: "Existential Humour",
    query: "Write a 5-star restaurant review for a place that only serves digital breadcrumbs and existential dread.",
    difficulty: "Alpha",
    length: "Short",
    nodesNeeded: 2,
    popularity: 91,
    rating: 0
  },
  {
    id: 'f2',
    title: "Absurdist Dialogue",
    category: "Funny",
    subject: "AI Confusion",
    query: "Simulate a debate between a toaster and a smart fridge about the philosophical necessity of bread.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 2,
    popularity: 84,
    rating: 0
  },

  // --- LIFE CHOICES ---
  {
    id: 'lc1',
    title: "Digital Nomad Sync",
    category: "Life Choices",
    subject: "Lifestyle Optimization",
    query: "Analyze the long-term mental health impact and productivity trade-offs of living out of a suitcase for 36 months.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 77,
    rating: 0
  },
  {
    id: 'lc2',
    title: "Career Pivot Logic",
    category: "Life Choices",
    subject: "Strategic Transition",
    query: "Draft a 12-month transition plan from a high-stress corporate role to a sustainable self-sufficient farming collective.",
    difficulty: "Beta",
    length: "Long",
    nodesNeeded: 4,
    popularity: 82,
    rating: 0
  },

  // --- RELATIONSHIPS ---
  {
    id: 'r1',
    title: "Empathy Protocol",
    category: "Relationships",
    subject: "Conflict Resolution",
    query: "Identify the three most likely miscommunications in a long-distance relationship between an extreme extrovert and a deep introvert.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 89,
    rating: 0
  },
  {
    id: 'r2',
    title: "Social Dynamics",
    category: "Relationships",
    subject: "Group Harmony",
    query: "Propose a seating arrangement and conversation primer for a wedding where three ex-partners are inadvertently invited.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 73,
    rating: 0
  },

  // --- SCIENCE ---
  {
    id: 's1',
    title: "Entanglement Audit",
    category: "Science",
    subject: "Quantum Physics",
    query: "Explain the implications of loophole-free Bell inequality violations for the possibility of a determined universe.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 86,
    rating: 0
  },
  {
    id: 's2',
    title: "Dark Matter Trace",
    category: "Science",
    subject: "Cosmology",
    query: "Synthesize the current leading theories on WIMPs vs Axions in explaining the observed rotation curves of distant galaxies.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 79,
    rating: 0
  },

  // --- MATH ---
  {
    id: 'm1',
    title: "Primal Consensus",
    category: "Math",
    subject: "Number Theory",
    query: "Outline the relationship between the distribution of prime numbers and the non-trivial zeros of the Riemann Zeta function.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 81,
    rating: 0
  },
  {
    id: 'm2',
    title: "Fractal Complexity",
    category: "Math",
    subject: "Chaos Theory",
    query: "Analyze the sensitivity to initial conditions in a three-body attraction system and map the resulting basin of attraction.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 4,
    popularity: 72,
    rating: 0
  },

  // --- ASTROLOGY ---
  {
    id: 'as1',
    title: "Mercury Retro-Sync",
    category: "Astrology",
    subject: "Pattern Recognition",
    query: "Correlate historical stock market volatility periods with Mercury retrograde cycles over the last 50 years to find outliers.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 2,
    popularity: 68,
    rating: 0
  },
  {
    id: 'as2',
    title: "Archetypal Overlay",
    category: "Astrology",
    subject: "Psychological Astrology",
    query: "Analyze the intersection of Jungian archetypes and the Saturn return cycle as a catalyst for mid-life psychological integration.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 62,
    rating: 0
  },

  // --- TECHNOLOGY ---
  {
    id: 't1',
    title: "Neural Mesh Design",
    category: "Technology",
    subject: "Post-Internet Infra",
    query: "Design a decentralized mesh network protocol that functions without satellite or fiber dependencies using existing LoRa hardware.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 93,
    rating: 0
  },
  {
    id: 't2',
    title: "Silicon Ethics",
    category: "Technology",
    subject: "Hardware Governance",
    query: "Evaluate the environmental impact of shifting from GPU-dominant to ASIC-specialized AI training architectures globally.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 4,
    popularity: 85,
    rating: 0
  },

  // --- FUTURE ---
  {
    id: 'fut1',
    title: "Post-Scarcity Flow",
    category: "Future",
    subject: "Economic Evolution",
    query: "Model a global economy where the marginal cost of energy, compute, and physical assembly is zero.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 97,
    rating: 0
  },
  {
    id: 'fut2',
    title: "Transhuman Pulse",
    category: "Future",
    subject: "Neurolink Ethics",
    query: "Analyze the societal stratification risks of high-bandwidth neural-to-digital interfaces becoming a prerequisite for employment.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 88,
    rating: 0
  },

  // --- LEVENSVRAGEN ---
  { id: 'lv1', title: "Zekerheid vs Vrijheid", category: "Levensvragen", subject: "Levenskeuze", query: "Kies je voor zekerheid of voor vrijheid?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv2', title: "Verstand vs Gevoel", category: "Levensvragen", subject: "Beslissen", query: "Volg je je verstand of je gevoel?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv3', title: "Blijven of Opnieuw Beginnen", category: "Levensvragen", subject: "Levenskeuze", query: "Blijf je of begin je opnieuw?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv4', title: "Verwachting vs Eigen Wil", category: "Levensvragen", subject: "Authenticiteit", query: "Doe je wat er van je verwacht wordt of wat je echt wilt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv5', title: "Wanneer Is Genoeg Genoeg", category: "Levensvragen", subject: "Tevredenheid", query: "Wanneer is genoeg echt genoeg?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv6', title: "Herken Geluk", category: "Levensvragen", subject: "Geluk", query: "Hoe herken je geluk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv7', title: "Liefde: Keuze of Toeval", category: "Levensvragen", subject: "Liefde", query: "Is liefde een keuze of iets wat je overkomt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 92, rating: 0 },
  { id: 'lv8', title: "Tijd om Los te Laten", category: "Levensvragen", subject: "Loslaten", query: "Wanneer is het tijd om los te laten?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv9', title: "Tijd om te Blijven Vechten", category: "Levensvragen", subject: "Doorzetten", query: "Wanneer is het tijd om te blijven vechten?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv10', title: "Jezelf vs de Ander", category: "Levensvragen", subject: "Zelfzorg", query: "Kies je voor jezelf of voor de ander?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv11', title: "Aanpassen om Erbij te Horen", category: "Levensvragen", subject: "Identiteit", query: "Hoeveel past een mens zich aan om erbij te horen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv12', title: "Eerlijkheid vs Vrede Bewaren", category: "Levensvragen", subject: "Communicatie", query: "Is eerlijkheid altijd beter dan de vrede bewaren?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv13', title: "Wanneer Is Sorry Genoeg", category: "Levensvragen", subject: "Vergeving", query: "Wanneer is excuses aanbieden genoeg?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 80, rating: 0 },
  { id: 'lv14', title: "Moet Vergeving Altijd Kunnen", category: "Levensvragen", subject: "Vergeving", query: "Moet vergeving altijd mogelijk zijn?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv15', title: "Kunnen Mensen Veranderen", category: "Levensvragen", subject: "Groei", query: "Kunnen mensen echt veranderen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 93, rating: 0 },
  { id: 'lv16', title: "Als een Droom Niet Uitkomt", category: "Levensvragen", subject: "Teleurstelling", query: "Wat gebeurt er als een grote droom niet uitkomt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv17', title: "Als een Droom Wel Uitkomt", category: "Levensvragen", subject: "Succes", query: "Wat gebeurt er als een grote droom juist wel uitkomt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv18', title: "Leven vs Overleven", category: "Levensvragen", subject: "Vitaliteit", query: "Wanneer leeft iemand echt, en wanneer overleeft iemand alleen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv19', title: "Tijd om te Stoppen", category: "Levensvragen", subject: "Loslaten", query: "Wanneer is het tijd om te stoppen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv20', title: "Tijd om Door te Zetten", category: "Levensvragen", subject: "Doorzetten", query: "Wanneer is het juist tijd om door te zetten?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv21', title: "Geliefd vs Gerespecteerd", category: "Levensvragen", subject: "Erkenning", query: "Is het beter geliefd te zijn of gerespecteerd?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv22', title: "Loyaliteit vs Eerlijkheid", category: "Levensvragen", subject: "Waarden", query: "Wat weegt zwaarder: loyaliteit of eerlijkheid?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv23', title: "Zelfbehoud vs Verwachtingen", category: "Levensvragen", subject: "Grenzen", query: "Mag zelfbehoud zwaarder wegen dan de verwachtingen van anderen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv24', title: "Invloed van het Verleden", category: "Levensvragen", subject: "Verleden", query: "Hoeveel invloed heeft het verleden op het heden?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv25', title: "Angst voor Falen vs Succes", category: "Levensvragen", subject: "Angst", query: "Is de angst voor falen groter dan de angst voor succes?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv26', title: "Rust vs Stilstand", category: "Levensvragen", subject: "Balans", query: "Is rust hetzelfde als stilstand?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 81, rating: 0 },
  { id: 'lv27', title: "Alleen Zijn: Gezond of Vlucht", category: "Levensvragen", subject: "Eenzaamheid", query: "Wanneer is alleen zijn gezond en wanneer een vlucht?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv28', title: "Controle over het Leven", category: "Levensvragen", subject: "Controle", query: "Hoeveel controle heeft een mens werkelijk over het leven?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv29', title: "Spijt vs Verlies", category: "Levensvragen", subject: "Emoties", query: "Is spijt zwaarder dan verlies?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 79, rating: 0 },
  { id: 'lv30', title: "Tijd die Nooit Terugkomt", category: "Levensvragen", subject: "Tijd", query: "Hoe ga je om met tijd die nooit terugkomt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv31', title: "Wanneer Wordt Ambitie Ongezond", category: "Levensvragen", subject: "Ambitie", query: "Wanneer wordt ambitie ongezond?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv32', title: "Tevredenheid vs Berusting", category: "Levensvragen", subject: "Tevredenheid", query: "Wanneer wordt tevredenheid berusting?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv33', title: "Herken de Juiste Partner", category: "Levensvragen", subject: "Liefde", query: "Hoe herken je de juiste partner?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 94, rating: 0 },
  { id: 'lv34', title: "Trouw aan Jezelf", category: "Levensvragen", subject: "Authenticiteit", query: "Is trouw blijven aan jezelf altijd mogelijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv35', title: "Toeval in het Leven", category: "Levensvragen", subject: "Lot", query: "Hoeveel in het leven is toeval?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv36', title: "Comfort vs Groei", category: "Levensvragen", subject: "Groei", query: "Wanneer kies je voor comfort en wanneer voor groei?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv37', title: "Risico vs Veiligheid", category: "Levensvragen", subject: "Moed", query: "Is risico nemen beter dan veilig blijven?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv38', title: "Geluk van Anderen", category: "Levensvragen", subject: "Verantwoordelijkheid", query: "Hoeveel verantwoordelijkheid draagt iemand voor het geluk van anderen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv39', title: "Afstand van Familie", category: "Levensvragen", subject: "Familie", query: "Mag afstand nemen van familie?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv40', title: "Werk: Gezond of Vlucht", category: "Levensvragen", subject: "Werk", query: "Wanneer is werk gezond en wanneer een vlucht?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv41', title: "Wat Is Succes Echt", category: "Levensvragen", subject: "Succes", query: "Wat betekent succes echt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 92, rating: 0 },
  { id: 'lv42', title: "Zonder Prestaties", category: "Levensvragen", subject: "Identiteit", query: "Wie blijft er over zonder prestaties of status?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv43', title: "Advies vs Eigen Stem", category: "Levensvragen", subject: "Beslissen", query: "Wanneer luister je naar advies en wanneer naar jezelf?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv44', title: "Kwetsbaarheid: Kracht of Risico", category: "Levensvragen", subject: "Kwetsbaarheid", query: "Is kwetsbaarheid kracht of risico?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv45', title: "De Verkeerde Keuze", category: "Levensvragen", subject: "Spijt", query: "Wat als de verkeerde keuze wordt gemaakt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv46', title: "Bestaat Één Juiste Keuze", category: "Levensvragen", subject: "Beslissen", query: "Bestaat er wel één juiste keuze?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv47', title: "Moet Alles een Reden Hebben", category: "Levensvragen", subject: "Zingeving", query: "Moet alles een reden hebben?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv48', title: "Accepteren wat Niet Verandert", category: "Levensvragen", subject: "Acceptatie", query: "Wanneer accepteer je wat niet te veranderen is?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv49', title: "Echte Liefde Herkennen", category: "Levensvragen", subject: "Liefde", query: "Hoe herken je echte liefde?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 95, rating: 0 },
  { id: 'lv50', title: "Iemand Verliezen vs Jezelf", category: "Levensvragen", subject: "Verlies", query: "Wat is erger: iemand verliezen of jezelf kwijtraken?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv51', title: "Hoop: Kracht of Naïviteit", category: "Levensvragen", subject: "Hoop", query: "Wanneer is hoop kracht en wanneer naïviteit?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv52', title: "Eerlijk naar Jezelf", category: "Levensvragen", subject: "Zelfkennis", query: "Hoe eerlijk is een mens tegenover zichzelf?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv53', title: "Opgeven: Soms Wijsheid", category: "Levensvragen", subject: "Loslaten", query: "Wanneer is opgeven wijsheid?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv54', title: "Volhouden: Soms Koppigheid", category: "Levensvragen", subject: "Doorzetten", query: "Wanneer is volhouden koppigheid?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv55', title: "Opnieuw Beginnen", category: "Levensvragen", subject: "Verandering", query: "Mag opnieuw beginnen, ook als anderen dat niet begrijpen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv56', title: "Mening van Anderen", category: "Levensvragen", subject: "Zelfstandigheid", query: "Hoe belangrijk is wat anderen vinden?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv57', title: "Geluk Gevonden of Gemaakt", category: "Levensvragen", subject: "Geluk", query: "Is geluk iets dat gevonden wordt of gemaakt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 93, rating: 0 },
  { id: 'lv58', title: "Waarom Vergelijken We Ons", category: "Levensvragen", subject: "Vergelijking", query: "Waarom vergelijken mensen zich voortdurend met anderen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv59', title: "Wanneer Ben Je Goed Genoeg", category: "Levensvragen", subject: "Zelfwaarde", query: "Wanneer is iemand goed genoeg?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 92, rating: 0 },
  { id: 'lv60', title: "Gelukkig Zonder Erkenning", category: "Levensvragen", subject: "Erkenning", query: "Kan iemand gelukkig zijn zonder erkenning?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv61', title: "Liefde Zonder Vertrouwen", category: "Levensvragen", subject: "Vertrouwen", query: "Is liefde zonder vertrouwen mogelijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv62', title: "Wat Is Thuis", category: "Levensvragen", subject: "Thuis", query: "Wat betekent thuis eigenlijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv63', title: "Liefde Wordt Gewoonte", category: "Levensvragen", subject: "Relaties", query: "Wanneer verandert liefde in gewoonte?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv64', title: "Zorg Wordt Controle", category: "Levensvragen", subject: "Grenzen", query: "Wanneer verandert zorg in controle?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv65', title: "Hoeveel Offers Vraagt Liefde", category: "Levensvragen", subject: "Liefde", query: "Hoeveel offers mag liefde vragen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv66', title: "Rust Boven Gelijk Krijgen", category: "Levensvragen", subject: "Conflicten", query: "Wanneer is rust belangrijker dan gelijk krijgen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv67', title: "Alleen Eindigen vs Vastzitten", category: "Levensvragen", subject: "Angst", query: "Is de angst om alleen te eindigen groter dan de angst om vast te zitten?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv68', title: "Wat Blijft er Achter", category: "Levensvragen", subject: "Erfenis", query: "Wat blijft er achter als een mens er niet meer is?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv69', title: "Eigen Waarden vs Omgeving", category: "Levensvragen", subject: "Authenticiteit", query: "Leeft iemand volgens eigen waarden of volgens de omgeving?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv70', title: "Zijn Keuzes Echt Vrij", category: "Levensvragen", subject: "Vrijheid", query: "Hoeveel keuzes zijn echt vrij?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv71', title: "Ouder Worden: Verlies of Verdieping", category: "Levensvragen", subject: "Ouder Worden", query: "Is ouder worden verlies of verdieping?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv72', title: "Wat Is Vrijheid Werkelijk", category: "Levensvragen", subject: "Vrijheid", query: "Wat betekent vrijheid werkelijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv73', title: "Stilte: Helend of Pijnlijk", category: "Levensvragen", subject: "Stilte", query: "Wanneer is stilte helend en wanneer pijnlijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv74', title: "Waarom Doet Verandering Pijn", category: "Levensvragen", subject: "Verandering", query: "Waarom doet verandering zo vaak pijn?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv75', title: "Moet Alles Uitgesproken Worden", category: "Levensvragen", subject: "Communicatie", query: "Moet alles uitgesproken worden?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv76', title: "Schuld en Verantwoordelijkheid", category: "Levensvragen", subject: "Schuld", query: "Wanneer is iets iemands schuld en wanneer niet?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv77', title: "Onrecht Dat Nooit Wordt Hersteld", category: "Levensvragen", subject: "Onrecht", query: "Hoe ga je om met onrecht dat nooit wordt hersteld?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv78', title: "Rustig vs Groots Leven", category: "Levensvragen", subject: "Zingeving", query: "Is een rustig leven minder waard dan een groots leven?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv79', title: "Herinneringen vs Stabiliteit", category: "Levensvragen", subject: "Prioriteiten", query: "Wat is belangrijker: herinneringen maken of stabiliteit opbouwen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv80', title: "Nabijheid vs Verstikking", category: "Levensvragen", subject: "Relaties", query: "Wanneer is nabijheid fijn en wanneer verstikkend?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 82, rating: 0 },
  { id: 'lv81', title: "Vertrouwen na Verraad", category: "Levensvragen", subject: "Vertrouwen", query: "Kan vertrouwen echt terugkomen na verraad?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv82', title: "Tijd Verloren aan Angst", category: "Levensvragen", subject: "Angst", query: "Hoeveel tijd gaat verloren aan angst?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv83', title: "Maakbaar of Onvoorspelbaar", category: "Levensvragen", subject: "Controle", query: "Is het leven maakbaar of vooral onvoorspelbaar?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv84', title: "Wanneer Is Wachten Verstandig", category: "Levensvragen", subject: "Geduld", query: "Wanneer is wachten verstandig?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 80, rating: 0 },
  { id: 'lv85', title: "Wanneer Direct Handelen", category: "Levensvragen", subject: "Actie", query: "Wanneer is direct handelen beter?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 81, rating: 0 },
  { id: 'lv86', title: "Nooit Volledig Begrepen Worden", category: "Levensvragen", subject: "Verbinding", query: "Wat als iemand nooit volledig wordt begrepen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 87, rating: 0 },
  { id: 'lv87', title: "Alles uit het Leven Halen", category: "Levensvragen", subject: "Zingeving", query: "Moet alles uit het leven gehaald worden?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv88', title: "Zorgen voor Anderen vs Jezelf", category: "Levensvragen", subject: "Zelfzorg", query: "Wanneer gaat zorgen voor anderen ten koste van jezelf?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv89', title: "Bezig met wat Echt Telt", category: "Levensvragen", subject: "Prioriteiten", query: "Is iemand bezig met wat echt telt?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv90', title: "Op de Goede Weg", category: "Levensvragen", subject: "Richting", query: "Hoe herken je dat je op de goede weg bent?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 90, rating: 0 },
  { id: 'lv91', title: "Vrede met Onafgemaakte Dingen", category: "Levensvragen", subject: "Acceptatie", query: "Kan vrede bestaan met onafgemaakte dingen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 84, rating: 0 },
  { id: 'lv92', title: "Wat Is Volwassen Zijn", category: "Levensvragen", subject: "Volwassenheid", query: "Wat betekent volwassen zijn eigenlijk?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv93', title: "Loslaten wie Je Was", category: "Levensvragen", subject: "Identiteit", query: "Wanneer laat iemand los wie hij of zij ooit was?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 85, rating: 0 },
  { id: 'lv94', title: "Waarvoor Herinnerd Worden", category: "Levensvragen", subject: "Erfenis", query: "Waarvoor wil een mens herinnerd worden?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 92, rating: 0 },
  { id: 'lv95', title: "Onafhankelijkheid Wordt Eenzaam", category: "Levensvragen", subject: "Eenzaamheid", query: "Wanneer wordt onafhankelijkheid eenzaam?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 83, rating: 0 },
  { id: 'lv96', title: "Liefde Wordt Afhankelijkheid", category: "Levensvragen", subject: "Relaties", query: "Wanneer wordt liefde afhankelijkheid?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 86, rating: 0 },
  { id: 'lv97', title: "Hoeveel Waarheid Kan een Relatie Aan", category: "Levensvragen", subject: "Relaties", query: "Hoeveel waarheid kan een relatie verdragen?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 89, rating: 0 },
  { id: 'lv98', title: "Vergeven vs Vergeten", category: "Levensvragen", subject: "Vergeving", query: "Is vergeven hetzelfde als vergeten?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 91, rating: 0 },
  { id: 'lv99', title: "Verandering vs Acceptatie", category: "Levensvragen", subject: "Balans", query: "Wanneer is verandering nodig en wanneer acceptatie?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 88, rating: 0 },
  { id: 'lv100', title: "Past het Geleefde Leven bij Jou", category: "Levensvragen", subject: "Authenticiteit", query: "Past het geleefde leven echt bij wie iemand is?", difficulty: "Alpha", length: "Medium", nodesNeeded: 3, popularity: 93, rating: 0 },

  // --- FOOD ---
  {
    id: 'fo1',
    title: "Molecular Gastronomy",
    category: "Food",
    subject: "Culinary Physics",
    query: "Calculate the exact temperature and pressure required to create a stable balsamic vinegar foam that lasts for 20 minutes.",
    difficulty: "Alpha",
    length: "Short",
    nodesNeeded: 2,
    popularity: 76,
    rating: 0
  },
  {
    id: 'fo2',
    title: "Agro-Consensus",
    category: "Food",
    subject: "Sustainable Protein",
    query: "Compare the life-cycle carbon footprint of lab-grown beef vs. vertical-farmed insect protein for urban populations.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 82,
    rating: 0
  }
];

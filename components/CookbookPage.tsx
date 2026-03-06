import { Book, ArrowRight, Search, ChevronUp, ChevronDown } from "lucide-react";
import { FC, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DIRECTIVES, Directive } from "../data/directives";
import { ScrambleText } from "./ScrambleText";

interface CookbookPageProps {
  onSelectMission: (query: string) => void;
}

export const CookbookPage: FC<CookbookPageProps> = ({ onSelectMission }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"popularity" | "rating" | "newest">(
    "popularity",
  );

  // Local state for simulated rankings
  const [localRatings, setLocalRatings] = useState<Record<string, number>>({});

  const categories = [
    "All",
    ...Array.from(new Set(DIRECTIVES.map((d) => d.category))),
  ];

  const handleVote = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRatings((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + delta,
    }));
  };

  const filteredDirectives = useMemo(() => {
    return DIRECTIVES.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = a.rating + (localRatings[a.id] || 0);
        const ratingB = b.rating + (localRatings[b.id] || 0);
        return ratingB - ratingA;
      }
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return 0; // Newest not implemented (no date field)
    });
  }, [searchQuery, activeCategory, sortBy, localRatings]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
          <ScrambleText text="Het Kookboek" />
        </h1>
        <p className="max-w-2xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
          Een verzameling van diepgaande levensvragen en scenario's,
          geoptimaliseerd voor collectieve AI-reflectie.
        </p>
      </div>

      {/* Control Bar */}
      <div className="mb-12 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 dark:text-white/20 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="ZOEK IN DE DATABASE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 rounded-2xl px-16 py-5 font-black uppercase tracking-widest text-[10px] focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-400 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative group min-w-[160px]">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                title="Filter op categorie"
                className="w-full appearance-none bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 rounded-2xl px-6 py-5 font-black uppercase tracking-widest text-[10px] focus:outline-none cursor-pointer pr-12 text-black dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "ALLE CATEGORIEËN" : c.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-20" />
            </div>

            <div className="relative group min-w-[160px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                title="Sorteren"
                className="w-full appearance-none bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 rounded-2xl px-6 py-5 font-black uppercase tracking-widest text-[10px] focus:outline-none cursor-pointer pr-12 text-black dark:text-white"
              >
                <option value="popularity">OP POPULARITEIT</option>
                <option value="rating">OP WAARDERING</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/30 mr-2 ml-1">
            SNEL ZOEKEN:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2.5 rounded-xl border-4 font-black uppercase tracking-widest text-[9px] transition-all
                ${
                  activeCategory === c
                    ? "bg-yellow-400 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5"
                    : "bg-white dark:bg-zinc-900 border-black dark:border-white/10 text-black/60 dark:text-white/40 hover:border-yellow-400 dark:hover:border-yellow-400 hover:text-black dark:hover:text-white"
                }`}
            >
              {c === "All" ? "ALLE" : c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {filteredDirectives.length === 0 ? (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-black/10 dark:border-white/10 rounded-[3rem]">
            <p className="font-black uppercase tracking-widest text-black/20 dark:text-white/20">
              Geen resultaten gevonden
            </p>
          </div>
        ) : (
          filteredDirectives.map((directive) => (
            <Link
              key={directive.id}
              to={`/cookbook/${directive.id}`}
              className="group text-left bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 p-5 md:p-6 rounded-2xl md:rounded-[2rem] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col min-h-[180px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[8px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest px-2 py-1 border border-black/10 dark:border-white/10 rounded-lg">
                    {directive.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-black/5 dark:bg-white/5 rounded-lg z-20">
                  <button
                    onClick={(e) => handleVote(directive.id, 1, e)}
                    title="Upvote"
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-black/40 dark:text-white/40 hover:text-green-500 flex items-center gap-1 group/vote"
                  >
                    <ChevronUp className="w-4 h-4 group-hover/vote:scale-110 transition-transform" />
                  </button>
                  <span className="text-[10px] font-black text-black dark:text-white min-w-[16px] text-center">
                    {directive.rating + (localRatings[directive.id] || 0)}
                  </span>
                  <button
                    onClick={(e) => handleVote(directive.id, -1, e)}
                    title="Downvote"
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-black/40 dark:text-white/40 hover:text-red-500 flex items-center gap-1 group/vote"
                  >
                    <ChevronDown className="w-4 h-4 group-hover/vote:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 text-black dark:text-white line-clamp-2 leading-tight flex-grow">
                {directive.title}
              </h3>

              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all text-black dark:text-white">
                  ONTDEK RECEPT <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-32 p-12 md:p-20 bg-black dark:bg-zinc-900 text-white rounded-[3rem] text-center space-y-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent pointer-events-none" />
        <Book className="w-16 h-16 mx-auto text-yellow-400 animate-pulse-glow" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Collectieve Intelligentie
          </h2>
          <p className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-[0.2em] leading-relaxed">
            FAINL recepten zijn ontworpen om de kracht van meerdere AI-systemen
            tegelijk te benutten. Kies een vraag en zie hoe onze raad tot een
            gewogen oordeel komt.
          </p>
        </div>
      </div>
    </div>
  );
};

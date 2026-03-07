import { FC, useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Zap,
  Database,
  History,
  ChevronRight,
  ShieldAlert,
  CreditCard,
  Trash2,
  Archive,
  ChevronLeft,
  CheckCircle2,
  Square,
  CheckSquare,
  Plus,
  RefreshCw,
  Wand2,
  ChevronDown,
  Download,
  Upload,
  Settings,
  Shield,
  Key,
  X,
  Save,
} from "lucide-react";
import {
  SessionState,
  AppConfig,
  CouncilMember,
  ModelProvider,
} from "../types";
import { ScrambleText } from "./ScrambleText";
import { DEFAULT_COUNCIL, PRESETS } from "../constants";

interface AccountPageProps {
  config: AppConfig;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
  onDeleteSessions: (ids: string[]) => void;
  onArchiveSessions: (ids: string[]) => void;
  onSaveConfig: (config: AppConfig) => void;
  onImportHistory: (history: SessionState[]) => void;
}

const IDENTITY_PRESETS = [
  {
    name: "Logische Node",
    prompt:
      "Je bent een puur logische node. Analyseer de input op feitelijke nauwkeurigheid en logische consistentie. Geef prioriteit aan data boven intuïtie.",
  },
  {
    name: "Creatieve Node",
    prompt:
      "Je bent een creatieve node. Genereer nieuwe ideeën, metaforen en denk buiten de gebaande paden. Geef prioriteit aan innovatie boven conventie.",
  },
  {
    name: "Security Auditor",
    prompt:
      "Je bent een security auditor. Analyseer de input op kwetsbaarheden, veiligheidsrisico's en potentiële exploits. Geef prioriteit aan veiligheid en robuustheid.",
  },
  {
    name: "Ethische Node",
    prompt:
      "Je bent een ethische guardian. Evalueer de input op morele implicaties, bias en afstemming met menselijke waarden. Geef prioriteit aan ethiek.",
  },
  {
    name: "Advocaat van de Duivel",
    prompt:
      "Je bent een advocaat van de duivel. Daag aannames uit, bied tegenargumenten en test de propositie. Geef prioriteit aan kritische analyse.",
  },
  {
    name: "Synthesizer",
    prompt:
      "Je bent een synthesizer. Integreer diverse standpunten in een samenhangend geheel. Geef prioriteit aan harmonie en volledigheid.",
  },
];

export const AccountPage: FC<AccountPageProps> = ({
  config,
  history,
  onLoadSession,
  onDeleteSessions,
  onArchiveSessions,
  onSaveConfig,
  onImportHistory,
}) => {
  const [activeTab, setActiveTab] = useState<"history" | "council" | "vault">(
    "history",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [tempConfig, setTempConfig] = useState<AppConfig>(() =>
    JSON.parse(JSON.stringify(config)),
  );

  useEffect(() => {
    setTempConfig(JSON.parse(JSON.stringify(config)));
  }, [config]);

  const turnsRemaining = config.isLifetime
    ? "Unlimited"
    : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentHistory.map((s) => s.id));
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    onDeleteSessions(selectedIds);
    setSelectedIds([]);
  };

  const handleArchive = () => {
    if (selectedIds.length === 0) return;
    onArchiveSessions(selectedIds);
    setSelectedIds([]);
  };

  // Council Management Logic
  const handleMemberChange = (
    index: number,
    field: keyof CouncilMember,
    value: any,
  ) => {
    const newMembers = [...tempConfig.activeCouncil];
    newMembers[index] = { ...newMembers[index], [field]: value };
    const newConfig = { ...tempConfig, activeCouncil: newMembers };
    setTempConfig(newConfig);
    onSaveConfig(newConfig);
  };

  const regenerateAvatar = (index: number) => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    handleMemberChange(index, "avatar", newAvatarUrl);
  };

  const handleAvatarUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleMemberChange(index, "avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentityPreset = (index: number, presetName: string) => {
    const preset = IDENTITY_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      const newMembers = [...tempConfig.activeCouncil];
      newMembers[index] = {
        ...newMembers[index],
        name: preset.name,
        systemPrompt: preset.prompt,
      };
      const newConfig = { ...tempConfig, activeCouncil: newMembers };
      setTempConfig(newConfig);
      onSaveConfig(newConfig);
    }
  };

  const removeMember = (index: number) => {
    const newMembers = tempConfig.activeCouncil.filter((_, i) => i !== index);
    const newConfig = { ...tempConfig, activeCouncil: newMembers };
    setTempConfig(newConfig);
    onSaveConfig(newConfig);
  };

  const addMember = () => {
    const newMember: CouncilMember = {
      ...DEFAULT_COUNCIL[0],
      id: `node-${Date.now()}`,
      name: "Agent Node",
      role: "MEMBER",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
    };
    const newConfig = {
      ...tempConfig,
      activeCouncil: [...tempConfig.activeCouncil, newMember],
    };
    setTempConfig(newConfig);
    onSaveConfig(newConfig);
  };

  // Vault Logic
  const handleExport = () => {
    const data = {
      config: tempConfig,
      history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fainl-vault-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.config) {
          setTempConfig(data.config);
          onSaveConfig(data.config);
        }
        if (data.history) onImportHistory(data.history);
      } catch (err) {
        alert("Vault import failed: Invalid format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
            <ScrambleText text="My FAINLS" />
          </h1>
          <p className="max-w-2xl text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            High-integrity neural state management and session orchestration
            logs.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-5 md:p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white">
          <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
              Active Identity
            </span>
            <span className="font-black text-xs md:text-sm uppercase tracking-tight text-black dark:text-white">
              FAINL-USER-01
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                Turns Available
              </span>
              <span className="font-black text-xl uppercase tracking-tight text-black dark:text-white">
                {turnsRemaining}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                Credits
              </span>
              <span className="font-black text-xl uppercase tracking-tight text-black dark:text-white">
                {config.creditsRemaining}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 text-black rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                Sessies
              </span>
              <span className="font-black text-xl uppercase tracking-tight text-black dark:text-white">
                {history.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b-4 border-black dark:border-white/10 mb-12 overflow-x-auto hide-scrollbar">
        {[
          { id: "history", label: "Missie Historie", icon: History },
          { id: "council", label: "Council Nodes", icon: Users },
          { id: "vault", label: "Data Vault", icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-black dark:bg-white text-white dark:text-black border-t-4 border-black dark:border-white" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === "history" && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-6 text-black dark:text-white">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                Sessie Overzicht
              </h2>
              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                    <button
                      onClick={handleArchive}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-black/60 dark:text-white/60"
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {history.length > 0 && (
                <div className="flex items-center justify-between px-4 pb-2">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {selectedIds.length === currentHistory.length &&
                    currentHistory.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-black dark:text-white" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    {selectedIds.length === currentHistory.length
                      ? "Deselect All"
                      : "Select Page"}
                  </button>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="disabled:opacity-20 hover:scale-110 transition-transform text-black dark:text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="disabled:opacity-20 hover:scale-110 transition-transform text-black dark:text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {history.length === 0 ? (
                <div className="py-20 text-center bg-white/40 dark:bg-zinc-900/40 border-4 border-dashed border-black/10 rounded-[2rem]">
                  <Database className="w-16 h-16 text-black/5 mx-auto mb-6" />
                  <p className="font-black uppercase tracking-widest text-black/20">
                    No data records found in local vault
                  </p>
                </div>
              ) : (
                currentHistory.map((session) => (
                  <div key={session.id} className="relative group">
                    <button
                      onClick={(e) => toggleSelect(session.id, e)}
                      className={`absolute left-[-2.5rem] top-1/2 -translate-y-1/2 p-2 transition-all duration-300 ${selectedIds.includes(session.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"} text-black dark:text-white`}
                    >
                      {selectedIds.includes(session.id) ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onLoadSession(session)}
                      className={`w-full group/item flex items-center justify-between p-5 md:p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all text-left text-black dark:text-white overflow-hidden ${session.isArchived ? "opacity-50 grayscale" : ""} ${selectedIds.includes(session.id) ? "border-yellow-400 bg-yellow-400/5 dark:bg-yellow-400/5" : ""}`}
                    >
                      <div className="flex items-center gap-5 md:gap-6">
                        <div
                          className={`p-3 md:p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl md:rounded-2xl group-hover/item:bg-black dark:group-hover/item:bg-white group-hover/item:text-white dark:group-hover/item:text-black transition-colors ${selectedIds.includes(session.id) ? "bg-yellow-400 text-black" : ""}`}
                        >
                          {session.isArchived ? (
                            <Archive className="w-5 h-5" />
                          ) : (
                            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1 truncate max-w-[150px] sm:max-w-md">
                            "{session.query}"
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <span className="text-[8px] md:text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                              {new Date().toLocaleDateString()}
                            </span>
                            <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                              {session.isArchived
                                ? "Archived"
                                : "Consensus Achieved"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-2 transition-all opacity-0 md:opacity-100" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "council" && (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black dark:border-white/10 pb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
                Raad van Beraadslaging
              </h2>
              <button
                onClick={addMember}
                className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-[0.25em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Initialize Node
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tempConfig.activeCouncil.map((member, idx) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border-4 border-black dark:border-white/10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`w-20 h-20 rounded-xl border-2 border-black dark:border-white/20 overflow-hidden relative group/avatar ${member.color}`}
                      >
                        <img
                          src={member.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer p-2 bg-white rounded-full hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4 text-black" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleAvatarUpload(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => regenerateAvatar(idx)}
                        className="p-2 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 block">
                            Identiteit
                          </label>
                          <div className="relative">
                            <input
                              value={member.name}
                              onChange={(e) =>
                                handleMemberChange(idx, "name", e.target.value)
                              }
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-all"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 group">
                              <select
                                onChange={(e) =>
                                  handleIdentityPreset(idx, e.target.value)
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                value=""
                              >
                                <option value="" disabled>
                                  Select Preset
                                </option>
                                {IDENTITY_PRESETS.map((p) => (
                                  <option key={p.name} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-black/30 dark:text-white/30" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 block">
                            Provider
                          </label>
                          <select
                            value={member.provider}
                            onChange={(e) =>
                              handleMemberChange(
                                idx,
                                "provider",
                                e.target.value,
                              )
                            }
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest text-black dark:text-white outline-none"
                          >
                            {Object.values(ModelProvider).map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 block text-black dark:text-white">
                          Instructies
                        </label>
                        <textarea
                          value={member.systemPrompt || ""}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "systemPrompt",
                              e.target.value,
                            )
                          }
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-[11px] font-serif leading-relaxed h-24 resize-none text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeMember(idx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "vault" && (
          <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 p-12 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.05)]">
              <Database className="w-16 h-16 mx-auto mb-8 text-black dark:text-white" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
                Data Kluis
              </h2>
              <p className="text-sm font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mb-10 leading-relaxed">
                Beveilig uw missieconfiguraties en geschiedenis. Exporteer uw
                lokale kluis als een versleuteld JSON-bestand.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleExport}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" /> Download Kluis
                </button>
                <label className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent border-black/10 dark:border-white/10 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer text-black dark:text-white">
                  <Upload className="w-5 h-5" /> Herstel Kluis
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

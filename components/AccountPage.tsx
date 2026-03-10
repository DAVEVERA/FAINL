
import { FC } from 'react';
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
  CheckSquare
} from 'lucide-react';
import { useState } from 'react';
import { SessionState, AppConfig, ModelProvider } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AccountPageProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
  onDeleteSessions: (ids: string[]) => void;
  onArchiveSessions: (ids: string[]) => void;
}

export const AccountPage: FC<AccountPageProps> = ({
  config,
  onUpdateConfig,
  history,
  onLoadSession,
  onDeleteSessions,
  onArchiveSessions
}) => {
  const { language, t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNode, setNewNode] = useState({ name: '', role: '', model: 'gpt-4o' as any, systemPrompt: '' });

  const turnsRemaining = config.isLifetime ? (language === 'nl' ? 'Onbeperkt' : 'Unlimited') : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddNode = () => {
    if (!newNode.name || !newNode.role) return;
    const nodeToAdd = {
      id: `custom-${Date.now()}`,
      name: newNode.name,
      role: newNode.role,
      provider: ModelProvider.OPENAI, // Default for custom nodes
      modelId: newNode.model,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newNode.name}`,
      color: "bg-zinc-800",
      description: newNode.role || "Custom AI Node",
      systemPrompt: newNode.systemPrompt
    };
    onUpdateConfig({
      ...config,
      customNodes: [...(config.customNodes || []), nodeToAdd as any]
    });
    setNewNode({ name: '', role: '', model: 'gpt-4o', systemPrompt: '' });
    setIsAddingNode(false);
  };

  const handleRemoveNode = (id: string) => {
    onUpdateConfig({
      ...config,
      customNodes: config.customNodes.filter(n => n.id !== id)
    });
  };

  const handleExportData = () => {
    const data = JSON.stringify({ config, history }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fainl_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.config && parsed.history) {
          onUpdateConfig(parsed.config);
          // Note: history update would usually go through a parent prop, but for local storage it's often direct
          localStorage.setItem('fainl_history', JSON.stringify(parsed.history));
          window.location.reload(); // Quick way to refresh all states
        }
      } catch (err) {
        alert('Invalid data file');
      }
    };
    reader.readAsText(file);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentHistory.map(s => s.id));
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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
            {language === 'nl' ? 'Commandocentrum' : 'Command Center'}
          </h1>
          <p className="max-w-2xl text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            {language === 'nl' ? 'Beheer je persoonlijke nodes, datakluis en missiegeschiedenis.' : 'Manage your personal nodes, data vault and mission history.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        <div className="space-y-12">
          {/* Custom Nodes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-4">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                <Users className="w-6 h-6" />
                {language === 'nl' ? 'Persoonlijke Nodes' : 'Personal Nodes'}
              </h2>
              <button
                onClick={() => setIsAddingNode(!isAddingNode)}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:scale-105 transition-all"
              >
                {isAddingNode ? (language === 'nl' ? 'Annuleren' : 'Cancel') : (language === 'nl' ? 'Nieuwe Node' : 'New Node')}
              </button>
            </div>

            {isAddingNode && (
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-4 border-black dark:border-white/10 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Node Name (e.g. Legal Expert)"
                    value={newNode.name}
                    onChange={e => setNewNode({ ...newNode, name: e.target.value })}
                    className="bg-white dark:bg-zinc-900 border-2 border-black p-3 font-bold text-sm rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Advocaat)"
                    value={newNode.role}
                    onChange={e => setNewNode({ ...newNode, role: e.target.value })}
                    className="bg-white dark:bg-zinc-900 border-2 border-black p-3 font-bold text-sm rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="System Prompt / Instruction..."
                  value={newNode.systemPrompt}
                  onChange={e => setNewNode({ ...newNode, systemPrompt: e.target.value })}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-black p-3 font-bold text-sm rounded-lg h-32 resize-none"
                />
                <button
                  onClick={handleAddNode}
                  className="w-full py-3 bg-[#FDC700] text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
                >
                  {language === 'nl' ? 'Node Activeren' : 'Activate Node'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.customNodes?.map(node => (
                <div key={node.id} className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs">{node.name}</h4>
                      <p className="text-[9px] font-bold text-black/40 dark:text-white/40">{node.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNode(node.id)}
                    className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-lg"
                    title={language === 'nl' ? 'Node Verwijderen' : 'Remove Node'}
                    aria-label={language === 'nl' ? 'Node Verwijderen' : 'Remove Node'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!config.customNodes || config.customNodes.length === 0) && !isAddingNode && (
                <p className="col-span-2 text-center py-8 text-[10px] font-black uppercase tracking-widest text-black/20 italic">
                  {language === 'nl' ? 'Geen aangepaste nodes gevonden' : 'No custom nodes found'}
                </p>
              )}
            </div>
          </div>

          {/* Data Vault Section */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-4 border-b-4 border-black dark:border-white/20 pb-4">
              <Database className="w-6 h-6" />
              {language === 'nl' ? 'Datakluis' : 'Data Vault'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-3 p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-white/10 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
              >
                <Database className="w-5 h-5 group-hover:animate-bounce" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xs">{language === 'nl' ? 'Export' : 'Export'}</span>
                  <span className="text-[9px] font-bold opacity-50">{language === 'nl' ? 'Backup je data' : 'Backup your data'}</span>
                </div>
              </button>
              <label className="flex items-center justify-center gap-3 p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-white/10 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer group">
                <Database className="w-5 h-5 group-hover:animate-pulse" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xs">{language === 'nl' ? 'Import' : 'Import'}</span>
                  <span className="text-[9px] font-bold opacity-50">{language === 'nl' ? 'Herstel je data' : 'Restore your data'}</span>
                </div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* History Area */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-6 text-black dark:text-white">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
              <History className="w-6 h-6 md:w-8 md:h-8" />
              {language === 'nl' ? 'Missiegeschiedenis' : 'Mission History'}
            </h2>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                  <button
                    onClick={handleArchive}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-black/60 dark:text-white/60"
                    title={language === 'nl' ? 'Geselecteerde Archiveren' : 'Archive Selected'}
                    aria-label={language === 'nl' ? 'Geselecteerde Archiveren' : 'Archive Selected'}
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                    title={language === 'nl' ? 'Geselecteerde Verwijderen' : 'Delete Selected'}
                    aria-label={language === 'nl' ? 'Geselecteerde Verwijderen' : 'Delete Selected'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
              <span className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                {history.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {history.length > 0 && (
              <div className="flex items-center justify-between px-4 pb-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                  {selectedIds.length === currentHistory.length && currentHistory.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-black dark:text-white" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {language === 'nl' ? 'Selecteer Pagina' : 'Select Page'}
                </button>
                {totalPages > 1 && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="disabled:opacity-20 text-black dark:text-white"
                      title={language === 'nl' ? 'Vorige Pagina' : 'Previous Page'}
                      aria-label={language === 'nl' ? 'Vorige Pagina' : 'Previous Page'}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="disabled:opacity-20 text-black dark:text-white"
                      title={language === 'nl' ? 'Volgende Pagina' : 'Next Page'}
                      aria-label={language === 'nl' ? 'Volgende Pagina' : 'Next Page'}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {history.length === 0 ? (
              <div className="py-20 text-center bg-white/40 dark:bg-zinc-900/40 border-4 border-dashed border-black/10 dark:border-white/10 rounded-[2rem]">
                <Database className="w-16 h-16 text-black/5 dark:text-white/5 mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-black/20 dark:text-white/20">{language === 'nl' ? 'Lokale Kluis Leeg' : 'Local Vault Empty'}</p>
              </div>
            ) : (
              currentHistory.map((session) => (
                <div key={session.id} className="relative group/row">
                  <button
                    onClick={(e) => toggleSelect(session.id, e)}
                    className={`absolute left-[-2.5rem] top-1/2 -translate-y-1/2 p-2 transition-all ${selectedIds.includes(session.id) ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'}`}
                  >
                    {selectedIds.includes(session.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => onLoadSession(session)}
                    className={`w-full flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] transition-all ${session.isArchived ? 'opacity-50 grayscale' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                        {session.isArchived ? <Archive className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black uppercase tracking-tight truncate max-w-[150px] sm:max-w-md">"{session.query}"</h4>
                        <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover/row:opacity-100 transition-all" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

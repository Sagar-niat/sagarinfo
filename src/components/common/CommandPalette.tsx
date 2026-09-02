import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FileText,
  Award,
  FolderGit2,
  Presentation,
  Trophy,
  Sparkles,
  Link as LinkIcon,
  LayoutDashboard,
  User,
  Settings,
  GraduationCap,
  FileCheck,
  ArrowRight,
  Shield,
  Eye,
  Terminal,
  BookmarkCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CommandPaletteProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ currentTab, setCurrentTab }) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    documents,
    certificates,
    projects,
    presentations,
    achievements,
    skills,
    links,
    appliedHackathons,
    appliedScholarships,
    openPreviewFile,
  } = useData();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const handleClose = () => {
    setCommandPaletteOpen(false);
  };

  const handleNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    handleClose();
  };

  const q = query.toLowerCase().trim();

  // Search Results
  const filteredDocs = query
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const filteredCerts = query
    ? certificates.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.issuingOrganization.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const filteredProjects = query
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const filteredSkills = query
    ? skills.filter(
        (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      )
    : [];

  const filteredLinks = query
    ? links.filter((l) => l.name.toLowerCase().includes(q) || l.category.toLowerCase().includes(q))
    : [];

  const navCommands = [
    { label: 'Go to Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
    { label: 'Go to Document Vault', icon: FileText, tab: 'documents' },
    { label: 'Go to Certificate Manager', icon: Award, tab: 'certificates' },
    { label: 'Go to Projects Hub', icon: FolderGit2, tab: 'projects' },
    { label: 'Go to Applied Hackathons', icon: Terminal, tab: 'applied-hackathons' },
    { label: 'Go to Applied Scholarships', icon: BookmarkCheck, tab: 'applied-scholarships' },
    { label: 'Go to Presentations', icon: Presentation, tab: 'presentations' },
    { label: 'Go to Achievements', icon: Trophy, tab: 'achievements' },
    { label: 'Go to Education Timeline', icon: GraduationCap, tab: 'education' },
    { label: 'Go to Skills Matrix', icon: Sparkles, tab: 'skills' },
    { label: 'Go to Resume Center', icon: FileCheck, tab: 'resume' },
    { label: 'Go to Important Links', icon: LinkIcon, tab: 'links' },
    { label: 'Go to Profile', icon: User, tab: 'profile' },
    { label: 'Go to Settings', icon: Settings, tab: 'settings' },
  ].filter((c) => !query || c.label.toLowerCase().includes(q));

  const totalResults =
    filteredDocs.length +
    filteredCerts.length +
    filteredProjects.length +
    filteredSkills.length +
    filteredLinks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a search query (e.g. React, Aadhaar, B.Tech, AWS)..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Quick Navigation Commands */}
          {(!query || navCommands.length > 0) && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Navigation Commands
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navCommands.slice(0, query ? 6 : 8).map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.tab}
                      onClick={() => handleNavigate(cmd.tab)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        <span>{cmd.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Hits: Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                <span>Projects ({filteredProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleNavigate('projects')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{p.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{p.shortDescription}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 font-medium">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Hits: Documents */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Documents ({filteredDocs.length})
              </div>
              <div className="space-y-1.5">
                {filteredDocs.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyan-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{d.title}</p>
                        <p className="text-[11px] text-slate-500">{d.fileName} • {d.fileSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleClose();
                          openPreviewFile(d.previewUrl || d.fileUrl, d.title, d.fileType);
                        }}
                        className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-medium flex items-center gap-1 hover:bg-indigo-500"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Hits: Certificates */}
          {filteredCerts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Certificates ({filteredCerts.length})
              </div>
              <div className="space-y-1.5">
                {filteredCerts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleNavigate('certificates')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{c.title}</p>
                        <p className="text-[11px] text-slate-500">{c.issuingOrganization}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-500 font-semibold">{c.issueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Hits: Skills */}
          {filteredSkills.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Skills ({filteredSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredSkills.map((s) => (
                  <span
                    key={s.id}
                    onClick={() => handleNavigate('skills')}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-500 hover:text-white cursor-pointer transition-colors"
                  >
                    {s.name} ({s.proficiency}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {query && totalResults === 0 && navCommands.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                No matching records found for "{query}"
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for technologies like "React", "Python", or document names like "Aadhaar".
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">esc</kbd>
            <span>to close</span>
          </div>
          <span>SAGARINFO Deep Search Index</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  User,
  FileText,
  Award,
  FolderGit2,
  Presentation,
  Trophy,
  GraduationCap,
  Sparkles,
  FileCheck,
  Link,
  Star,
  Activity,
  Settings,
  Globe,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Terminal,
  BookmarkCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const { logout, isPublicView, setPublicView } = useAuth();
  const { profile, documents, appliedHackathons, appliedScholarships } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documents.length },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'applied-hackathons', label: 'Applied Hackathons', icon: Terminal, badge: appliedHackathons.length },
    { id: 'applied-scholarships', label: 'Applied Scholarships', icon: BookmarkCheck, badge: appliedScholarships.length },
    { id: 'presentations', label: 'Presentations', icon: Presentation },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'resume', label: 'Resume', icon: FileCheck },
    { id: 'links', label: 'Important Links', icon: Link },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    if (isPublicView) {
      setPublicView(false);
    }
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handlePublicClick = () => {
    setPublicView(true);
    setCurrentTab('public');
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col justify-between ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <span className="text-lg font-black tracking-wider">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide leading-tight">
                SAGAR<span className="text-indigo-400 font-extrabold">INFO</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Everything about me. One place.
              </p>
            </div>
          </div>
        </div>

        {/* Public Portfolio Quick Mode */}
        <div className="px-4 pt-4">
          <button
            onClick={handlePublicClick}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              isPublicView
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-transparent shadow-md'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Public Developer Portfolio</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Vault Operating System
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isPublicView && currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/90 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-semibold border border-slate-700/50">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/80">
        {/* Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">{profile.fullName}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Vault Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {effectiveTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Vault / Logout</span>
        </button>
      </div>
    </aside>
  );
};

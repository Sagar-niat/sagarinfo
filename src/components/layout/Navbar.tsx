import React from 'react';
import {
  Search,
  Menu,
  Shield,
  Globe,
  Sun,
  Moon,
  Upload,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenUploadModal,
}) => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const { isPublicView, logout } = useAuth();
  const { setCommandPaletteOpen, profile } = useData();

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'profile':
        return 'Personal Profile & Identity';
      case 'documents':
        return 'Document Vault';
      case 'certificates':
        return 'Certificate Manager';
      case 'projects':
        return 'Projects Hub';
      case 'applied-hackathons':
        return 'Applied Hackathons Hub';
      case 'applied-scholarships':
        return 'Applied Scholarships';
      case 'presentations':
        return 'Presentations Library';
      case 'achievements':
        return 'Achievements & Milestones';
      case 'education':
        return 'Education Timeline';
      case 'skills':
        return 'Skills Matrix';
      case 'resume':
        return 'Resume Center';
      case 'links':
        return 'Important Links';
      case 'favorites':
        return 'Starred & Favorites';
      case 'activity':
        return 'Audit Logs';
      case 'settings':
        return 'Vault Settings';
      case 'public':
        return 'Public Developer Portfolio';
      default:
        return 'SAGARINFO Vault';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
      {/* Pill Container Floating Header */}
      <div className="w-full glass-panel border border-cyan-500/25 rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_0_25px_rgba(6,182,212,0.12)]">
        {/* Left side: Mobile menu toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-base font-black text-white tracking-wide">
              {getTitle()}
            </h1>
            {isPublicView ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Globe className="w-3 h-3" /> Public Portfolio
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Shield className="w-3 h-3" /> Private Vault
              </span>
            )}
          </div>
        </div>

        {/* Right side: Global Search palette trigger + Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Ctrl + K Search trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-cyan-300 text-xs font-semibold border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-800 text-cyan-400 border border-cyan-500/20">
              Ctrl K
            </kbd>
          </button>

          {/* Lock Vault / Logout Quick Action */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-rose-500/15 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 text-xs font-bold transition-all"
            title="Lock Vault & Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Lock Vault</span>
          </button>

          {/* Quick Upload Pill Button */}
          <button
            onClick={onOpenUploadModal}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full pill-button text-xs font-bold transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Avatar */}
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/40 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

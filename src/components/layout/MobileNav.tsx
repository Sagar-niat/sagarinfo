import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Search,
  Menu,
  X,
  Award,
  GraduationCap,
  Sparkles,
  FileCheck,
  Shield,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { effectiveTheme, toggleTheme } = useTheme();
  const { setCommandPaletteOpen } = useData();

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Navigation Bar on Mobile (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#070d18]/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
            currentTab === 'dashboard'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => handleTabClick('documents')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
            currentTab === 'documents'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Docs</span>
        </button>

        <button
          onClick={() => handleTabClick('projects')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
            currentTab === 'projects'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px]">Projects</span>
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400"
        >
          <Search className="w-5 h-5 text-cyan-500" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Mobile Drawer Menu for "More" */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="w-full bg-white dark:bg-[#0a1324] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-6 space-y-5 animate-modal-pop max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">SAGARINFO Modules</h3>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Sparkles },
                { id: 'resume', label: 'Resume', icon: FileCheck },
                { id: 'applied-hackathons', label: 'Hackathons', icon: FolderGit2 },
                { id: 'applied-scholarships', label: 'Scholarships', icon: GraduationCap },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'settings', label: 'Settings & Security', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-cyan-500/50"
                  >
                    <Icon className="w-4 h-4 text-cyan-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span>{effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import {
  FileText,
  Award,
  FolderGit2,
  Presentation,
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  HardDrive,
  MapPin,
  Mail,
  GraduationCap,
  Plus,
  Eye,
  Edit,
  Globe,
  Zap,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GlobeGraphic } from '../components/common/GlobeGraphic';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
  onOpenUploadModal: () => void;
  onOpenEditProfileModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentTab,
  onOpenUploadModal,
  onOpenEditProfileModal,
}) => {
  const {
    profile,
    documents,
    certificates,
    projects,
    presentations,
    achievements,
    skills,
    education,
    activities,
    storageStats,
    openPreviewFile,
    toggleFavoriteDocument,
  } = useData();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Area: Profile Summary & Personalized Greeting */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Glow halo backdrop */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-cyan-500/40 shadow-xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Digital Identity
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">{profile.location}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Good morning, {profile.fullName} 👋
              </h1>

              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> {profile.education}
                </span>
                <span>•</span>
                <span className="text-cyan-400 font-semibold">{profile.currentStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={onOpenEditProfileModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 shadow-md touch-target"
            >
              <Edit className="w-4 h-4" /> Quick Edit Profile
            </button>
          </div>
        </div>

        {/* 3D Wireframe Globe Graphic Banner */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <GlobeGraphic className="max-h-48" />
        </div>
      </div>

      {/* Prominent Quick Actions Section */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          Quick Actions — Create & Attach Assets
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: '+ Add Document', color: 'bg-cyan-600 hover:bg-cyan-500 text-white', action: onOpenUploadModal },
            { label: '+ Add Certificate', color: 'bg-amber-600 hover:bg-amber-500 text-white', action: () => setCurrentTab('certificates') },
            { label: '+ Add Project', color: 'bg-indigo-600 hover:bg-indigo-500 text-white', action: () => setCurrentTab('projects') },
            { label: '+ Add Achievement', color: 'bg-emerald-600 hover:bg-emerald-500 text-white', action: () => setCurrentTab('achievements') },
            { label: '+ Add Presentation', color: 'bg-rose-600 hover:bg-rose-500 text-white', action: () => setCurrentTab('presentations') },
            { label: '+ Add Education', color: 'bg-purple-600 hover:bg-purple-500 text-white', action: () => setCurrentTab('education') },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`p-3 rounded-2xl ${btn.color} text-xs font-extrabold shadow-md transition-all touch-target text-center flex items-center justify-center`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Dynamic Statistics Cards */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          Live Digital Inventory
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'Documents', value: documents.length, icon: FileText, color: 'text-cyan-500', tab: 'documents' },
            { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-amber-500', tab: 'certificates' },
            { label: 'Projects', value: projects.length, icon: FolderGit2, color: 'text-indigo-500', tab: 'projects' },
            { label: 'Presentations', value: presentations.length, icon: Presentation, color: 'text-rose-500', tab: 'presentations' },
            { label: 'Achievements', value: achievements.length, icon: Trophy, color: 'text-emerald-500', tab: 'achievements' },
            { label: 'Skills', value: skills.length, icon: Sparkles, color: 'text-purple-500', tab: 'skills' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentTab(stat.tab)}
                className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 glow-card cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-cyan-500/10 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Vault Documents & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Vault Assets</h3>
            </div>
            <button
              onClick={() => setCurrentTab('documents')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              View Document Vault <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {doc.category.toUpperCase()} • {doc.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPreviewFile(doc.previewUrl || doc.fileUrl, doc.title, doc.fileType)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Preview File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavoriteDocument(doc.id)}
                    className={`p-1.5 rounded-lg ${doc.isFavorite ? 'text-amber-400' : 'text-slate-400'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vault Storage</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {storageStats.totalStorageUsedFormatted}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                  used of {storageStats.storageLimitFormatted}
                </span>
              </div>
              <span className="text-xs font-bold text-cyan-500">{storageStats.usedPercentage}%</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${storageStats.usedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

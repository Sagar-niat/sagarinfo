import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Plus,
  Star,
  ExternalLink,
  Eye,
  Trash2,
  Trophy,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Award,
  X,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AppliedHackathon } from '../types/sagarinfo';

export const AppliedHackathonsPage: React.FC = () => {
  const {
    appliedHackathons,
    addAppliedHackathon,
    deleteAppliedHackathon,
    toggleFavoriteAppliedHackathon,
    openPreviewFile,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Hackathon Form State
  const [name, setName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [projectSubmitted, setProjectSubmitted] = useState('');
  const [status, setStatus] = useState<AppliedHackathon['status']>('Under Review');
  const [prizePool, setPrizePool] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');

  const statuses = ['All', 'Winner', 'Selected', 'Shortlisted', 'Under Review', 'Applied'];

  const filtered = appliedHackathons.filter((h) => {
    if (selectedStatus !== 'All' && h.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.organizer.toLowerCase().includes(q) ||
        h.projectSubmitted.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organizer) return;

    addAppliedHackathon({
      name,
      organizer,
      applicationDate: applicationDate || new Date().toISOString().split('T')[0],
      projectSubmitted: projectSubmitted || 'Full Stack Prototype',
      status,
      prizePool,
      submissionUrl,
      proofUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      notes,
      isFavorite: false,
    });

    setIsAddModalOpen(false);
    setName('');
    setOrganizer('');
    setProjectSubmitted('');
    setPrizePool('');
    setSubmissionUrl('');
    setNotes('');
  };

  const getStatusBadge = (s: AppliedHackathon['status']) => {
    switch (s) {
      case 'Winner':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Selected':
      case 'Shortlisted':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Under Review':
      case 'Applied':
      default:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            Applied Hackathons & Competitions Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track hackathons applied, submitted prototypes, jury evaluation status, prizes & certificates.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-full pill-button text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Hackathon Entry
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedStatus === s
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-cyan-500/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hackathons or projects..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hack) => (
          <div
            key={hack.id}
            className="glass-panel p-6 rounded-3xl border border-cyan-500/20 glow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(hack.status)}`}>
                  {hack.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteAppliedHackathon(hack.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      hack.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => deleteAppliedHackathon(hack.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white line-clamp-1">{hack.name}</h3>
              <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-1">
                <Building className="w-3.5 h-3.5" /> {hack.organizer}
              </p>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 mt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Submitted Project:</span>
                  <span className="font-bold text-indigo-300">{hack.projectSubmitted}</span>
                </div>
                {hack.prizePool && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Prize Pool:</span>
                    <span className="font-bold text-amber-400">{hack.prizePool}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Applied Date:</span>
                  <span className="text-slate-300">{hack.applicationDate}</span>
                </div>
              </div>

              {hack.notes && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">
                  "{hack.notes}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {hack.proofUrl && (
                <button
                  onClick={() => openPreviewFile(hack.proofUrl!, hack.name, 'pdf')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Proof / Certificate
                </button>
              )}

              {hack.submissionUrl && (
                <a
                  href={hack.submissionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Project Repo <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Hackathon Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Hackathon Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart India Hackathon 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Organizer / Body *</label>
                  <input
                    type="text"
                    required
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. AICTE / Google"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Application Date</label>
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Project Submitted</label>
                  <input
                    type="text"
                    value={projectSubmitted}
                    onChange={(e) => setProjectSubmitted(e.target.value)}
                    placeholder="e.g. AgriSage AI"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Selected">Selected</option>
                    <option value="Winner">Winner</option>
                    <option value="Not Shortlisted">Not Shortlisted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Prize Pool / Award</label>
                  <input
                    type="text"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    placeholder="₹1,00,000 / $5,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Submission URL</label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://devpost.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Notes & Results</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key accomplishments or feedback..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

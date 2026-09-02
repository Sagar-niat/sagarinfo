import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Star,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  Building2,
  IndianRupee,
  FileCheck2,
  Clock,
  X,
  FileText,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AppliedScholarship } from '../types/sagarinfo';

export const AppliedScholarshipsPage: React.FC = () => {
  const {
    appliedScholarships,
    addAppliedScholarship,
    deleteAppliedScholarship,
    toggleFavoriteAppliedScholarship,
    openPreviewFile,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<AppliedScholarship['status']>('Under Review');
  const [eligibility, setEligibility] = useState('');
  const [submittedDocument, setSubmittedDocument] = useState('');
  const [notes, setNotes] = useState('');

  const statuses = ['All', 'Awarded', 'Disbursed', 'Shortlisted', 'Under Review', 'Applied'];

  const filtered = appliedScholarships.filter((s) => {
    if (selectedStatus !== 'All' && s.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        (s.eligibility && s.eligibility.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !provider) return;

    addAppliedScholarship({
      name,
      provider,
      applicationDate: applicationDate || new Date().toISOString().split('T')[0],
      amount: amount || '₹50,000 / Year',
      status,
      eligibility,
      submittedDocument: submittedDocument || 'Marksheet Transcript',
      proofUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      notes,
      isFavorite: false,
    });

    setIsAddModalOpen(false);
    setName('');
    setProvider('');
    setAmount('');
    setEligibility('');
    setSubmittedDocument('');
    setNotes('');
  };

  const getStatusBadge = (s: AppliedScholarship['status']) => {
    switch (s) {
      case 'Disbursed':
      case 'Awarded':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
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
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            Applied Scholarships & Financial Grant Records
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track scholarship applications, grant stipends, submitted eligibility marksheets & disbursement status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-full pill-button text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Scholarship Entry
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
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-emerald-500/40'
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
            placeholder="Search scholarships or provider..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((schol) => (
          <div
            key={schol.id}
            className="glass-panel p-6 rounded-3xl border border-cyan-500/20 glow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(schol.status)}`}>
                  {schol.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteAppliedScholarship(schol.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      schol.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => deleteAppliedScholarship(schol.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white line-clamp-1">{schol.name}</h3>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5" /> {schol.provider}
              </p>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 mt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Scholarship Stipend:</span>
                  <span className="font-bold text-emerald-400">{schol.amount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Applied Date:</span>
                  <span className="text-slate-300">{schol.applicationDate}</span>
                </div>
                {schol.submittedDocument && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Submitted Proof:</span>
                    <span className="text-cyan-300 font-mono text-[11px] truncate max-w-[140px]">{schol.submittedDocument}</span>
                  </div>
                )}
              </div>

              {schol.eligibility && (
                <p className="text-xs text-slate-300 mt-2">
                  <strong className="text-slate-400 font-semibold">Eligibility:</strong> {schol.eligibility}
                </p>
              )}

              {schol.notes && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
                  "{schol.notes}"
                </p>
              )}
            </div>

            {schol.proofUrl && (
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => openPreviewFile(schol.proofUrl!, schol.name, 'pdf')}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> View Scholarship Approval Proof
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Scholarship Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Scholarship Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Reliance Foundation Undergraduate Scholarship"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Provider / Foundation *</label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g. Ministry / Reliance Foundation"
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
                  <label className="block text-xs font-semibold mb-1">Amount / Stipend *</label>
                  <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. ₹50,000 / year"
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
                    <option value="Awarded">Awarded</option>
                    <option value="Disbursed">Disbursed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Submitted Document Name</label>
                <input
                  type="text"
                  value={submittedDocument}
                  onChange={(e) => setSubmittedDocument(e.target.value)}
                  placeholder="e.g. BTech_Consolidated_Marksheet.pdf"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. B.Tech students with >8.5 CGPA"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Notes & Progress</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Disbursement details or review notes..."
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
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md">
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

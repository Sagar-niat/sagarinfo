import React, { useState } from 'react';
import { FileCheck, Download, Eye, Upload, CheckCircle2, FileText, Plus, X, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ResumePage: React.FC = () => {
  const { resumes, setCurrentResume, deleteResumeVersion, addResumeVersion, openPreviewFile, showToast } = useData();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [versionName, setVersionName] = useState('');
  const [notes, setNotes] = useState('');

  const currentResume = resumes.find((r) => r.isCurrent) || resumes[0];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName) return;

    addResumeVersion({
      versionName,
      title: `Sagar_Resume_${versionName.replace(/\s+/g, '_')}.pdf`,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '430 KB',
      isCurrent: true,
      notes: notes || 'Updated resume version',
    });

    setIsUploadModalOpen(false);
    setVersionName('');
    setNotes('');
  };

  const handleDownload = (res: any) => {
    const link = document.createElement('a');
    link.href = res.fileUrl;
    link.download = res.title;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Downloading "${res.title}"...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-500" />
            Resume Center & Multi-Version Vault
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage active primary resume, store role-specific versions, preview & download instantly.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Upload className="w-4 h-4" /> Upload New Version
        </button>
      </div>

      {/* Current Active Primary Resume Highlight */}
      {currentResume && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-indigo-500/50 shadow-2xl bg-gradient-to-r from-indigo-900/20 via-slate-900/60 to-slate-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <FileCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Primary Active Resume
                </span>
                <span className="text-xs text-slate-400">{currentResume.uploadDate}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{currentResume.versionName}</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentResume.title} ({currentResume.fileSize})</p>
              {currentResume.notes && (
                <p className="text-xs text-slate-300 mt-2 italic">"{currentResume.notes}"</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => openPreviewFile(currentResume.fileUrl, currentResume.title, 'pdf')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Eye className="w-4 h-4" /> Preview PDF
            </button>
            <button
              onClick={() => handleDownload(currentResume)}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      )}

      {/* Resume Version History List */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Resume Version History</h3>
        <div className="space-y-3">
          {resumes.map((res) => (
            <div
              key={res.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                res.isCurrent
                  ? 'border-indigo-500/50 bg-indigo-500/5'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{res.versionName}</h4>
                    {res.isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{res.title} • {res.fileSize} • Uploaded {res.uploadDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                {!res.isCurrent && (
                  <button
                    onClick={() => setCurrentResume(res.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => openPreviewFile(res.fileUrl, res.title, 'pdf')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-indigo-500"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDownload(res)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteResumeVersion(res.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition-colors"
                  title="Delete Resume Version"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload New Resume Version</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Version Title *</label>
                <input
                  type="text"
                  required
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. v3.1 - Senior AI Specialist"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Version Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tailored summary notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                  Upload & Set Active
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

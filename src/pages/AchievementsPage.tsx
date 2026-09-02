import React, { useState } from 'react';
import { Trophy, Award, Calendar, ExternalLink, Plus, Eye, Trash2, CheckCircle2, Star, List, Grid, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AchievementsPage: React.FC = () => {
  const { achievements, addAchievement, deleteAchievement, openPreviewFile } = useData();
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [event, setEvent] = useState('');
  const [rank, setRank] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rank) return;

    addAchievement({
      title,
      organization: org || 'Ministry of Innovation',
      date: new Date().toISOString().split('T')[0],
      description,
      event: event || 'National Tech Challenge 2026',
      rankOrResult: rank,
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      isFavorite: true,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setOrg('');
    setEvent('');
    setRank('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-500" />
            Achievements, Awards & Milestones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            National hackathon 1st place victories, academic honors, department top rank & open source milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Timeline View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Card Grid
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/30 space-y-8 my-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 shadow-md">
                <Trophy className="w-3 h-3" />
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover-glow transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {ach.rankOrResult}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{ach.date}</span>
                  </div>
                  <button
                    onClick={() => deleteAchievement(ach.id)}
                    className="text-slate-400 hover:text-rose-500 self-end sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{ach.title}</h3>
                <p className="text-xs font-semibold text-indigo-500">{ach.organization} • {ach.event}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ach.description}</p>

                {ach.certificateUrl && (
                  <div className="pt-2">
                    <button
                      onClick={() => openPreviewFile(ach.certificateUrl!, ach.title, 'pdf')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Winner Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover-glow transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {ach.rankOrResult}
                  </span>
                  <button onClick={() => deleteAchievement(ach.id)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{ach.title}</h3>
                <p className="text-xs font-semibold text-indigo-500 mt-1">{ach.organization}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{ach.description}</p>
              </div>

              {ach.certificateUrl && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => openPreviewFile(ach.certificateUrl!, ach.title, 'pdf')}
                    className="w-full px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Award Proof
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Achievement / Award</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1st Place Winner - Grand Champion"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Rank / Result *</label>
                  <input
                    type="text"
                    required
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="🏆 1st Winner"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Ministry / AICTE"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Event Name</label>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="National Hackathon 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Presentation, Search, Download, Eye, Plus, Trash2, Calendar, FileText, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PresentationsPage: React.FC = () => {
  const { presentations, addPresentation, deletePresentation, openPreviewFile } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [event, setEvent] = useState('');
  const [description, setDescription] = useState('');

  const filtered = presentations.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.eventOrHackathon && p.eventOrHackathon.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addPresentation({
      title,
      relatedProjectName: project || undefined,
      eventOrHackathon: event || 'Tech Symposium 2026',
      date: new Date().toISOString().split('T')[0],
      description,
      fileFormat: 'pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '4.2 MB',
      slideCount: 18,
      isFavorite: false,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setProject('');
    setEvent('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Presentation className="w-6 h-6 text-rose-500" />
            Presentations & Pitch Decks Library
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            PPTX & PDF slide decks delivered at national hackathons, tech talks & paper seminars.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Add Presentation
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presentations or hackathon decks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((pres) => (
          <div
            key={pres.id}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover-glow transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                  <Presentation className="w-6 h-6" />
                </div>
                <button
                  onClick={() => deletePresentation(pres.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">{pres.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{pres.description}</p>

              <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-slate-400">
                {pres.eventOrHackathon && (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-semibold">
                    {pres.eventOrHackathon}
                  </span>
                )}
                <span>{pres.slideCount} Slides</span>
                <span>{pres.fileSize}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => openPreviewFile(pres.fileUrl, pres.title, pres.fileFormat)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Slides
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Presentation Deck</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Presentation Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AgriSage AI Pitch Deck"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Event / Hackathon Name</label>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="e.g. Smart India Hackathon 2025"
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
                  Save Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

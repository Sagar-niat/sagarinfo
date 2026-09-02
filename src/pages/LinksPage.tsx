import React, { useState } from 'react';
import { Link as LinkIcon, Search, ExternalLink, Copy, Check, Plus, Star, Trash2, Code2, Globe, Mail, Database, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ImportantLink } from '../types/sagarinfo';

export const LinksPage: React.FC = () => {
  const { links, addLink, deleteLink, toggleFavoriteLink, showToast } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<ImportantLink['category']>('Professional');
  const [description, setDescription] = useState('');

  const filtered = links.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied URL to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    addLink({
      name,
      url,
      category,
      description: description || name,
      iconName: category === 'Professional' ? 'Linkedin' : 'ExternalLink',
      isFavorite: false,
    });

    setIsAddModalOpen(false);
    setName('');
    setUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-cyan-500" />
            Important Links & Quick Bookmarks Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized repository of LinkedIn, GitHub, live app deployments & developer portals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Add Important Link
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved links by name or URL..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((link) => (
          <div
            key={link.id}
            className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover-glow transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                  {link.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteLink(link.id)}
                    className={`p-1.5 rounded-lg ${link.isFavorite ? 'text-amber-400' : 'text-slate-400'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="p-1.5 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{link.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{link.description}</p>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-2">{link.url}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleCopy(link.id, link.url)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === link.id ? 'Copied!' : 'Copy URL'}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
              >
                Open <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Important Link</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Link Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GitHub Repository"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Target URL *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                >
                  <option value="Professional">Professional</option>
                  <option value="Projects">Projects</option>
                  <option value="Social">Social</option>
                  <option value="Useful">Useful</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
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
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

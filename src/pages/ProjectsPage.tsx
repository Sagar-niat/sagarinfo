import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  ExternalLink,
  Code2,
  Plus,
  Trophy,
  Video,
  FileText,
  Presentation,
  Star,
  Trash2,
  CheckCircle2,
  Cpu,
  Layers,
  X,
  Eye,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProjectItem } from '../types/sagarinfo';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, deleteProject, toggleFavoriteProject, openPreviewFile } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Form state
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState<ProjectItem['category']>('AI & Automation');
  const [technologiesInput, setTechnologiesInput] = useState('React, TypeScript, Python');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');

  const categories = ['All', 'AI & Automation', 'Full Stack', 'Mobile App', 'DevOps & Tools'];

  const filtered = projects.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDescription) return;

    addProject({
      name,
      shortDescription,
      detailedDescription: detailedDescription || shortDescription,
      category,
      technologies: technologiesInput.split(',').map((t) => t.trim()).filter(Boolean),
      githubUrl: githubUrl || 'https://github.com/sagar-dev',
      liveUrl,
      screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'],
      status: 'Completed',
      startDate: new Date().toISOString().split('T')[0],
      problemStatement: problemStatement || 'Addressing high processing complexity and fragmented tools.',
      solution: solution || 'Built an end-to-end modern software system with reactive interface and backend storage.',
      features: ['Real-time analytics', 'Modern SaaS dashboard interface', 'Instant search & export'],
      isFavorite: false,
      isPublic: true,
    });

    setIsAddModalOpen(false);
    setName('');
    setShortDescription('');
    setDetailedDescription('');
    setGithubUrl('');
    setLiveUrl('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-500" />
            Projects Hub & Case Studies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full Stack web apps, AI microservices, hackathon winning prototypes & architecture case studies.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-transparent shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tech..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover-glow transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Project Image Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800 bg-slate-900">
                <img
                  src={proj.screenshots[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFavoriteProject(proj.id)}
                    className={`p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md transition-colors ${
                      proj.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {proj.achievement && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white backdrop-blur-sm flex items-center gap-1 w-fit shadow-md">
                      <Trophy className="w-3 h-3 text-amber-300" />
                      {proj.achievement}
                    </span>
                  </div>
                )}
              </div>

              {/* Category & Status */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                  {proj.category}
                </span>
                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {proj.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                {proj.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {proj.shortDescription}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {proj.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setSelectedProject(proj)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Eye className="w-3.5 h-3.5" /> Case Study
              </button>

              <div className="flex items-center gap-3">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    title="GitHub Repository"
                  >
                    <Code2 className="w-4 h-4" />
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-500 hover:text-indigo-400 font-semibold text-xs flex items-center gap-1"
                  >
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rich Project Detail Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {selectedProject.category} Case Study
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedProject.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
              {/* Screenshots Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedProject.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Screenshot"
                    className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" /> Visit Live App
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4" /> GitHub Source Code
                  </a>
                )}
                {selectedProject.presentationUrl && (
                  <button
                    onClick={() => openPreviewFile(selectedProject.presentationUrl!, 'Presentation Deck', 'pdf')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2"
                  >
                    <Presentation className="w-4 h-4 text-amber-400" /> Presentation Deck
                  </button>
                )}
              </div>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 text-rose-400">
                    The Problem Statement
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProject.problemStatement}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 text-emerald-400">
                    The AI & Engineering Solution
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Key Product Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Stack */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Project Case Study</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AgriSage AI"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="1-2 sentences summarizing the app..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  >
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="DevOps & Tools">DevOps & Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technologies
                  </label>
                  <input
                    type="text"
                    value={technologiesInput}
                    onChange={(e) => setTechnologiesInput(e.target.value)}
                    placeholder="React, Python, Supabase"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

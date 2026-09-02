import React, { useState } from 'react';
import { Sparkles, Code2, Layout, Server, Cpu, Wrench, Plus, Trash2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SkillItem } from '../types/sagarinfo';

export const SkillsPage: React.FC = () => {
  const { skills, addSkill, deleteSkill } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillItem['category']>('Programming');
  const [proficiency, setProficiency] = useState(90);
  const [years, setYears] = useState('3 yrs');

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'All', label: 'All Tech Stack', icon: Sparkles },
    { id: 'Programming', label: 'Programming', icon: Code2 },
    { id: 'Frontend', label: 'Frontend UI', icon: Layout },
    { id: 'Backend', label: 'Backend & DB', icon: Server },
    { id: 'AI & ML', label: 'AI & Generative AI', icon: Cpu },
    { id: 'Tools & DevOps', label: 'Tools & DevOps', icon: Wrench },
  ];

  const filtered = skills.filter((s) => selectedCategory === 'All' || s.category === selectedCategory);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addSkill({
      name,
      category,
      proficiency,
      yearsOfExperience: years,
      relatedProjectsCount: 5,
      featured: true,
    });

    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Skills & Technical Proficiency Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured skill categories: Programming languages, Frontend frameworks, Backend architectures, AI tools & DevOps.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-transparent shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Elegant Skill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((skill) => (
          <div
            key={skill.id}
            className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover-glow transition-all space-y-3 relative group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase">
                  {skill.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{skill.name}</h3>
              </div>

              <button
                onClick={() => deleteSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Experience: {skill.yearsOfExperience}</span>
              <span>{skill.relatedProjectsCount} Projects linked</span>
            </div>

            {/* Proficiency Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Proficiency Level</span>
                <span className="text-indigo-400">{skill.proficiency}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Skill</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. PyTorch / Docker"
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
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Proficiency ({proficiency}%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full"
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

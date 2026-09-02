import React from 'react';
import {
  Globe,
  FolderGit2,
  Award,
  Sparkles,
  FileCheck,
  ExternalLink,
  Code2,
  Mail,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GlobeGraphic } from '../components/common/GlobeGraphic';

export const PublicPortfolioPage: React.FC = () => {
  const { profile, projects, certificates, skills, resumes, openPreviewFile } = useData();

  const publicProjects = projects.filter((p) => p.isPublic);
  const currentResume = resumes.find((r) => r.isCurrent) || resumes[0];

  return (
    <div className="space-y-12 animate-fade-in pb-16 bg-tech-grid">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between text-xs max-w-4xl mx-auto shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>You are viewing Sagar's <strong>Public Developer Portfolio</strong>. Private identity files are strictly secured.</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          sagarinfo.dev/public
        </span>
      </div>

      {/* Hero Section matching screenshot 1 */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.18)] bg-gradient-to-b from-[#081326] via-[#050B17] to-[#030712] relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5" /> Full Stack & AI Software Engineer
          </div>

          {/* Web3 Metallic Headline matching reference image 1 */}
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 tracking-tight leading-none">
            Architecting Intelligent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-cyan-200">
              Web & AI Applications
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Building scalable full-stack web applications, computer vision pipelines, and intelligent agentic workflows for modern digital products.
          </p>

          {/* Pill Action Buttons matching screenshot Contact Sales button style */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full pill-button text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Code2 className="w-4 h-4" /> GitHub Repositories
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" /> LinkedIn Profile
            </a>
            {currentResume && (
              <button
                onClick={() => openPreviewFile(currentResume.fileUrl, currentResume.title, 'pdf')}
                className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" /> View Resume
              </button>
            )}
          </div>
        </div>

        {/* Wireframe Globe Graphic in Hero matching screenshot */}
        <div className="mt-8 pt-4 border-t border-cyan-500/20">
          <GlobeGraphic className="max-h-80" />
        </div>
      </div>

      {/* Tech Stack & Partner Badges Bar matching screenshot 3 ("TRUSTED BY BELOVED PARTNERS AND CUSTOMERS") */}
      <div className="text-center space-y-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          CORE TECHNOLOGIES & CLOUD PLATFORMS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-80">
          {['REACT 19', 'TYPESCRIPT', 'PYTHON', 'FASTAPI', 'PYTORCH', 'TAILWIND CSS', 'SUPABASE', 'AWS CLOUD', 'DOCKER'].map((brand, i) => (
            <span key={i} className="text-xs font-black text-slate-400 tracking-wider hover:text-cyan-400 transition-colors">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Public Projects matching screenshot 3 feature grid card style */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Powerful Applications Just for You
          </h2>
          <p className="text-xs text-slate-400">
            Real-world product case studies with problem statements, solutions, and live deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicProjects.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel p-6 rounded-3xl border border-cyan-500/20 glow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <img
                  src={proj.screenshots[0]}
                  alt={proj.name}
                  className="w-full h-48 object-cover rounded-2xl mb-4 border border-slate-800"
                />
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  {proj.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.shortDescription}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Source Code
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-cyan-400 flex items-center gap-1"
                  >
                    Live Application <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills Showcase */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          Technical Skill Proficiency
        </h2>

        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/25 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
              <span>{skill.name}</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                {skill.proficiency}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Verified Credentials */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          Verified Cloud & Professional Certifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <div key={cert.id} className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
              <span className="text-[10px] font-bold text-amber-400">{cert.issuingOrganization}</span>
              <h4 className="text-sm font-bold text-white">{cert.title}</h4>
              <p className="text-[11px] text-slate-400">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

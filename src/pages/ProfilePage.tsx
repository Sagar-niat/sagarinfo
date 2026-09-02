import React, { useState } from 'react';
import { User, Edit, ShieldCheck, Mail, MapPin, Phone, GraduationCap, Globe, Target, Sparkles, Code2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ProfilePageProps {
  onOpenEditModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenEditModal }) => {
  const { profile } = useData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-500" />
            Personal Profile & Identity Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured identity information, contact details, social links & career objectives.
          </p>
        </div>

        <button
          onClick={onOpenEditModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Edit className="w-4 h-4" /> Edit Profile Information
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{profile.fullName}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="w-3 h-3" /> Verified Vault Owner
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-500">{profile.currentStatus}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300 max-w-2xl leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Contact & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{profile.phone}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{profile.location}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Education</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className="truncate">{profile.education}</span>
            </div>
          </div>
        </div>

        {/* Career Objective & Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
              <Target className="w-4 h-4" /> Career Goal & Vision
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.careerGoal}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
              <Sparkles className="w-4 h-4" /> Technical & Personal Interests
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.interests.map((interest, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

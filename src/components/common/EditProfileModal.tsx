import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useData();

  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [education, setEducation] = useState(profile.education);
  const [currentStatus, setCurrentStatus] = useState(profile.currentStatus);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [interestsStr, setInterestsStr] = useState(profile.interests.join(', '));
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [linkedin, setLinkedin] = useState(profile.linkedin);
  const [github, setGithub] = useState(profile.github);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      fullName,
      bio,
      email,
      phone,
      location,
      education,
      currentStatus,
      careerGoal,
      interests: interestsStr.split(',').map((i) => i.trim()).filter(Boolean),
      avatarUrl,
      linkedin,
      github,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Current Status</label>
              <input
                type="text"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Short Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Career Goal</label>
            <textarea
              rows={2}
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Interests (comma separated)</label>
            <input
              type="text"
              value={interestsStr}
              onChange={(e) => setInterestsStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

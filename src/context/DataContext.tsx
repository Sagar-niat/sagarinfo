import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserProfile,
  DocumentItem,
  CertificateItem,
  ProjectItem,
  PresentationItem,
  AchievementItem,
  EducationItem,
  SkillItem,
  ResumeVersion,
  ImportantLink,
  ActivityLog,
  AppliedHackathon,
  AppliedScholarship,
  StorageStats,
} from '../types/sagarinfo';
import { storageService } from '../services/storageService';
import { supabaseService, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from './AuthContext';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface DataContextType {
  profile: UserProfile;
  documents: DocumentItem[];
  certificates: CertificateItem[];
  projects: ProjectItem[];
  presentations: PresentationItem[];
  achievements: AchievementItem[];
  education: EducationItem[];
  skills: SkillItem[];
  resumes: ResumeVersion[];
  links: ImportantLink[];
  appliedHackathons: AppliedHackathon[];
  appliedScholarships: AppliedScholarship[];
  activities: ActivityLog[];
  storageStats: StorageStats;

  // Actions
  updateProfile: (profile: UserProfile) => void;

  // Document Vault
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  updateDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => void;
  toggleFavoriteDocument: (id: string) => void;

  // Certificate Manager
  addCertificate: (cert: Omit<CertificateItem, 'id'>) => void;
  updateCertificate: (cert: CertificateItem) => void;
  deleteCertificate: (id: string) => void;
  toggleFavoriteCertificate: (id: string) => void;

  // Project Hub
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  updateProject: (proj: ProjectItem) => void;
  deleteProject: (id: string) => void;
  toggleFavoriteProject: (id: string) => void;

  // Presentations
  addPresentation: (pres: Omit<PresentationItem, 'id'>) => void;
  deletePresentation: (id: string) => void;

  // Achievements
  addAchievement: (ach: Omit<AchievementItem, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  // Education
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (edu: EducationItem) => void;

  // Skills
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  deleteSkill: (id: string) => void;

  // Resume
  addResumeVersion: (resume: Omit<ResumeVersion, 'id' | 'uploadDate'>) => void;
  setCurrentResume: (id: string) => void;
  deleteResumeVersion: (id: string) => void;

  // Links
  addLink: (link: Omit<ImportantLink, 'id'>) => void;
  deleteLink: (id: string) => void;
  toggleFavoriteLink: (id: string) => void;

  // Applied Hackathons
  addAppliedHackathon: (hack: Omit<AppliedHackathon, 'id'>) => void;
  updateAppliedHackathon: (hack: AppliedHackathon) => void;
  deleteAppliedHackathon: (id: string) => void;
  toggleFavoriteAppliedHackathon: (id: string) => void;

  // Applied Scholarships
  addAppliedScholarship: (schol: Omit<AppliedScholarship, 'id'>) => void;
  updateAppliedScholarship: (schol: AppliedScholarship) => void;
  deleteAppliedScholarship: (id: string) => void;
  toggleFavoriteAppliedScholarship: (id: string) => void;

  // Modals & Search Controls
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  previewFile: { url: string; title: string; type: string } | null;
  openPreviewFile: (url: string, title: string, type?: string) => void;
  closePreviewFile: () => void;

  toast: ToastMessage | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  resetAllData: () => void;
  startFreshCleanVault: () => void;
  importBackupData: (data: any) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for generating standard PostgreSQL compatible UUIDs
const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile);
  const [documents, setDocuments] = useState<DocumentItem[]>(storageService.getDocuments);
  const [certificates, setCertificates] = useState<CertificateItem[]>(storageService.getCertificates);
  const [projects, setProjects] = useState<ProjectItem[]>(storageService.getProjects);
  const [presentations, setPresentations] = useState<PresentationItem[]>(storageService.getPresentations);
  const [achievements, setAchievements] = useState<AchievementItem[]>(storageService.getAchievements);
  const [education, setEducation] = useState<EducationItem[]>(storageService.getEducation);
  const [skills, setSkills] = useState<SkillItem[]>(storageService.getSkills);
  const [resumes, setResumes] = useState<ResumeVersion[]>(storageService.getResumes);
  const [links, setLinks] = useState<ImportantLink[]>(storageService.getLinks);
  const [appliedHackathons, setAppliedHackathons] = useState<AppliedHackathon[]>(storageService.getAppliedHackathons);
  const [appliedScholarships, setAppliedScholarships] = useState<AppliedScholarship[]>(storageService.getAppliedScholarships);
  const [activities, setActivities] = useState<ActivityLog[]>(storageService.getActivities);

  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; title: string; type: string } | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync authenticated Supabase user profile & records across all devices on login
  useEffect(() => {
    if (user) {
      setProfile((prev) => {
        const updated = {
          ...prev,
          fullName: user.name || prev.fullName,
          email: user.email || prev.email,
        };
        storageService.saveProfile(updated);
        return updated;
      });

      // Fetch user's cloud records directly from Supabase DB on login
      if (isSupabaseConfigured()) {
        supabaseService.fetchProfile().then((profData) => {
          if (profData) {
            setProfile((prev) => ({
              ...prev,
              fullName: profData.full_name || prev.fullName,
              email: profData.email || prev.email,
              tagline: profData.tagline || prev.tagline,
              bio: profData.bio || prev.bio,
              phone: profData.phone || prev.phone,
              location: profData.location || prev.location,
              avatarUrl: profData.avatar_url || prev.avatarUrl,
            }));
          }
        });

        // 1. Documents Cloud Sync
        supabaseService.fetchDocuments().then((cloudDocs) => {
          if (Array.isArray(cloudDocs)) {
            setDocuments(cloudDocs);
            storageService.saveDocuments(cloudDocs);
          }
        });

        // 2. Certificates Cloud Sync
        supabaseService.fetchCertificates().then((cloudCerts) => {
          if (Array.isArray(cloudCerts)) {
            setCertificates(cloudCerts);
            storageService.saveCertificates(cloudCerts);
          }
        });

        // 3. Projects Cloud Sync
        supabaseService.fetchProjects().then((cloudProjs) => {
          if (Array.isArray(cloudProjs)) {
            setProjects(cloudProjs);
            storageService.saveProjects(cloudProjs);
          }
        });

        // 4. Education Cloud Sync
        supabaseService.fetchEducation().then((cloudEdu) => {
          if (Array.isArray(cloudEdu)) {
            setEducation(cloudEdu);
            storageService.saveEducation(cloudEdu);
          }
        });

        // 5. Applied Hackathons Cloud Sync
        supabaseService.fetchAppliedHackathons().then((cloudHacks) => {
          if (Array.isArray(cloudHacks)) {
            setAppliedHackathons(cloudHacks);
            storageService.saveAppliedHackathons(cloudHacks);
          }
        });

        // 6. Applied Scholarships Cloud Sync
        supabaseService.fetchAppliedScholarships().then((cloudSchols) => {
          if (Array.isArray(cloudSchols)) {
            setAppliedScholarships(cloudSchols);
            storageService.saveAppliedScholarships(cloudSchols);
          }
        });
      }
    } else {
      // When not logged in / logged out, reset state to clear user data
      setDocuments([]);
      setCertificates([]);
      setProjects([]);
      setEducation([]);
      setAppliedHackathons([]);
      setAppliedScholarships([]);
    }
  }, [user]);

  const storageStats = storageService.calculateStorageStats(
    documents,
    certificates,
    projects,
    presentations,
    appliedHackathons,
    appliedScholarships
  );

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Keyboard shortcut listener for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hydrate full state & heavy files from persistent IndexedDB on mount
  useEffect(() => {
    storageService.hydrateFromIndexedDB().then((data) => {
      if (data) {
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.documents) && data.documents.length > 0) setDocuments(data.documents);
        if (Array.isArray(data.certificates) && data.certificates.length > 0) setCertificates(data.certificates);
        if (Array.isArray(data.projects) && data.projects.length > 0) setProjects(data.projects);
        if (Array.isArray(data.presentations)) setPresentations(data.presentations);
        if (Array.isArray(data.achievements)) setAchievements(data.achievements);
        if (Array.isArray(data.education) && data.education.length > 0) setEducation(data.education);
        if (Array.isArray(data.skills)) setSkills(data.skills);
        if (Array.isArray(data.resumes)) setResumes(data.resumes);
        if (Array.isArray(data.links)) setLinks(data.links);
        if (Array.isArray(data.appliedHackathons) && data.appliedHackathons.length > 0) setAppliedHackathons(data.appliedHackathons);
        if (Array.isArray(data.appliedScholarships) && data.appliedScholarships.length > 0) setAppliedScholarships(data.appliedScholarships);
        if (Array.isArray(data.activities)) setActivities(data.activities);
      }
    });
  }, []);

  // Update Profile
  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
    supabaseService.syncProfile(newProfile);
    storageService.addActivity('Updated profile information', newProfile.fullName, 'Document');
    setActivities(storageService.getActivities());
    showToast('Profile updated and synced to cloud');
  };

  // Documents (Supabase Cloud Database + Local Storage)
  const addDocument = async (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: generateUUID(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    storageService.saveDocuments(updated);

    const syncRes = await supabaseService.syncDocument(newDoc);
    storageService.addActivity('Uploaded document', newDoc.title, 'Document');
    setActivities(storageService.getActivities());

    if (syncRes.success) {
      showToast(`Uploaded "${newDoc.title}" (Stored in Cloud & Synced)`);
    } else {
      showToast(`Uploaded "${newDoc.title}" locally`, 'info');
    }
  };

  const updateDocument = async (doc: DocumentItem) => {
    const updated = documents.map((d) => (d.id === doc.id ? doc : d));
    setDocuments(updated);
    storageService.saveDocuments(updated);
    await supabaseService.syncDocument(doc);
    showToast(`Updated document "${doc.title}"`);
  };

  const deleteDocument = async (id: string) => {
    const target = documents.find((d) => d.id === id);
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    storageService.saveDocuments(updated);
    await supabaseService.deleteDocument(id);
    if (target) {
      storageService.addActivity('Deleted document', target.title, 'Document');
      setActivities(storageService.getActivities());
      showToast(`Deleted document "${target.title}"`, 'info');
    }
  };

  const toggleFavoriteDocument = async (id: string) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
    setDocuments(updated);
    storageService.saveDocuments(updated);
    const target = updated.find((d) => d.id === id);
    if (target) await supabaseService.syncDocument(target);
  };

  // Certificates (Supabase Cloud Database + Local Storage)
  const addCertificate = async (cert: Omit<CertificateItem, 'id'>) => {
    const newCert: CertificateItem = { ...cert, id: generateUUID() };
    const updated = [newCert, ...certificates];
    setCertificates(updated);
    storageService.saveCertificates(updated);

    const syncRes = await supabaseService.syncCertificate(newCert);
    storageService.addActivity('Added certificate', newCert.title, 'Certificate');
    setActivities(storageService.getActivities());

    if (syncRes.success) {
      showToast(`Added certificate "${newCert.title}" (Stored in Cloud & Synced)`);
    } else {
      showToast(`Added certificate "${newCert.title}" locally`, 'info');
    }
  };

  const updateCertificate = async (cert: CertificateItem) => {
    const updated = certificates.map((c) => (c.id === cert.id ? cert : c));
    setCertificates(updated);
    storageService.saveCertificates(updated);
    await supabaseService.syncCertificate(cert);
    showToast(`Updated certificate "${cert.title}"`);
  };

  const deleteCertificate = async (id: string) => {
    const updated = certificates.filter((c) => c.id !== id);
    setCertificates(updated);
    storageService.saveCertificates(updated);
    await supabaseService.deleteCertificate(id);
    showToast('Certificate removed', 'info');
  };

  const toggleFavoriteCertificate = async (id: string) => {
    const updated = certificates.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    setCertificates(updated);
    storageService.saveCertificates(updated);
    const target = updated.find((c) => c.id === id);
    if (target) await supabaseService.syncCertificate(target);
  };

  // Projects (Supabase Cloud Database + Local Storage)
  const addProject = async (proj: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = { ...proj, id: generateUUID() };
    const updated = [newProj, ...projects];
    setProjects(updated);
    storageService.saveProjects(updated);

    const syncRes = await supabaseService.syncProject(newProj);
    storageService.addActivity('Created project hub entry', newProj.name, 'Project');
    setActivities(storageService.getActivities());

    if (syncRes.success) {
      showToast(`Added project "${newProj.name}" (Stored in Cloud & Synced)`);
    } else {
      showToast(`Added project "${newProj.name}" locally`, 'info');
    }
  };

  const updateProject = async (proj: ProjectItem) => {
    const updated = projects.map((p) => (p.id === proj.id ? proj : p));
    setProjects(updated);
    storageService.saveProjects(updated);
    await supabaseService.syncProject(proj);
    showToast(`Updated project "${proj.name}"`);
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    storageService.saveProjects(updated);
    await supabaseService.deleteProject(id);
    showToast('Project deleted', 'info');
  };

  const toggleFavoriteProject = async (id: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setProjects(updated);
    storageService.saveProjects(updated);
    const target = updated.find((p) => p.id === id);
    if (target) await supabaseService.syncProject(target);
  };

  // Presentations
  const addPresentation = (pres: Omit<PresentationItem, 'id'>) => {
    const newPres: PresentationItem = { ...pres, id: generateUUID() };
    const updated = [newPres, ...presentations];
    setPresentations(updated);
    storageService.savePresentations(updated);
    storageService.addActivity('Added presentation deck', newPres.title, 'Presentation');
    setActivities(storageService.getActivities());
    showToast(`Added presentation "${newPres.title}"`);
  };

  const deletePresentation = (id: string) => {
    const updated = presentations.filter((p) => p.id !== id);
    setPresentations(updated);
    storageService.savePresentations(updated);
    showToast('Presentation removed', 'info');
  };

  // Achievements
  const addAchievement = (ach: Omit<AchievementItem, 'id'>) => {
    const newAch: AchievementItem = { ...ach, id: generateUUID() };
    const updated = [newAch, ...achievements];
    setAchievements(updated);
    storageService.saveAchievements(updated);
    storageService.addActivity('Logged achievement award', newAch.title, 'Achievement');
    setActivities(storageService.getActivities());
    showToast(`Logged achievement "${newAch.title}"`);
  };

  const deleteAchievement = (id: string) => {
    const updated = achievements.filter((a) => a.id !== id);
    setAchievements(updated);
    storageService.saveAchievements(updated);
    showToast('Achievement removed', 'info');
  };

  // Education (Supabase Cloud + Local)
  const addEducation = async (edu: Omit<EducationItem, 'id'>) => {
    const newEdu: EducationItem = { ...edu, id: generateUUID() };
    const updated = [...education, newEdu];
    setEducation(updated);
    storageService.saveEducation(updated);
    await supabaseService.syncEducation(newEdu);
    showToast('Education record added (Synced to Cloud)');
  };

  const updateEducation = async (edu: EducationItem) => {
    const updated = education.map((e) => (e.id === edu.id ? edu : e));
    setEducation(updated);
    storageService.saveEducation(updated);
    await supabaseService.syncEducation(edu);
    showToast('Education record updated');
  };

  // Skills
  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = { ...skill, id: generateUUID() };
    const updated = [...skills, newSkill];
    setSkills(updated);
    storageService.saveSkills(updated);
    showToast(`Added skill "${newSkill.name}"`);
  };

  const deleteSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    storageService.saveSkills(updated);
    showToast('Skill removed', 'info');
  };

  // Resumes
  const addResumeVersion = (resume: Omit<ResumeVersion, 'id' | 'uploadDate'>) => {
    const newRes: ResumeVersion = {
      ...resume,
      id: generateUUID(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    let updated = [newRes, ...resumes];
    if (newRes.isCurrent) {
      updated = updated.map((r) => ({ ...r, isCurrent: r.id === newRes.id }));
    }
    setResumes(updated);
    storageService.saveResumes(updated);
    storageService.addActivity('Uploaded new resume version', newRes.title, 'Resume');
    setActivities(storageService.getActivities());
    showToast('Uploaded new resume version');
  };

  const setCurrentResume = (id: string) => {
    const updated = resumes.map((r) => ({ ...r, isCurrent: r.id === id }));
    setResumes(updated);
    storageService.saveResumes(updated);
    showToast('Primary active resume updated');
  };

  const deleteResumeVersion = (id: string) => {
    const target = resumes.find((r) => r.id === id);
    if (resumes.length <= 1) {
      showToast('Cannot delete the only remaining resume version', 'error');
      return;
    }
    const updated = resumes.filter((r) => r.id !== id);
    if (target?.isCurrent && updated.length > 0) {
      updated[0].isCurrent = true;
    }
    setResumes(updated);
    storageService.saveResumes(updated);
    if (target) {
      storageService.addActivity('Deleted resume version', target.title, 'Resume');
      setActivities(storageService.getActivities());
      showToast(`Deleted resume "${target.versionName}"`, 'info');
    }
  };

  // Links
  const addLink = (link: Omit<ImportantLink, 'id'>) => {
    const newLink: ImportantLink = { ...link, id: generateUUID() };
    const updated = [newLink, ...links];
    setLinks(updated);
    storageService.saveLinks(updated);
    showToast(`Added link "${newLink.name}"`);
  };

  const deleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    storageService.saveLinks(updated);
    showToast('Link removed', 'info');
  };

  const toggleFavoriteLink = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l));
    setLinks(updated);
    storageService.saveLinks(updated);
  };

  // Applied Hackathons (Supabase Cloud + Local)
  const addAppliedHackathon = async (hack: Omit<AppliedHackathon, 'id'>) => {
    const newHack: AppliedHackathon = { ...hack, id: generateUUID() };
    const updated = [newHack, ...appliedHackathons];
    setAppliedHackathons(updated);
    storageService.saveAppliedHackathons(updated);
    await supabaseService.syncHackathon(newHack);
    storageService.addActivity('Logged hackathon application', newHack.name, 'Hackathon');
    setActivities(storageService.getActivities());
    showToast(`Added hackathon application "${newHack.name}" (Synced to Cloud)`);
  };

  const updateAppliedHackathon = async (hack: AppliedHackathon) => {
    const updated = appliedHackathons.map((h) => (h.id === hack.id ? hack : h));
    setAppliedHackathons(updated);
    storageService.saveAppliedHackathons(updated);
    await supabaseService.syncHackathon(hack);
    showToast(`Updated hackathon "${hack.name}"`);
  };

  const deleteAppliedHackathon = async (id: string) => {
    const target = appliedHackathons.find((h) => h.id === id);
    const updated = appliedHackathons.filter((h) => h.id !== id);
    setAppliedHackathons(updated);
    storageService.saveAppliedHackathons(updated);
    await supabaseService.deleteHackathon(id);
    if (target) {
      storageService.addActivity('Removed hackathon entry', target.name, 'Hackathon');
      setActivities(storageService.getActivities());
      showToast(`Removed hackathon "${target.name}"`, 'info');
    }
  };

  const toggleFavoriteAppliedHackathon = async (id: string) => {
    const updated = appliedHackathons.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h));
    setAppliedHackathons(updated);
    storageService.saveAppliedHackathons(updated);
    const target = updated.find((h) => h.id === id);
    if (target) await supabaseService.syncHackathon(target);
  };

  // Applied Scholarships (Supabase Cloud + Local)
  const addAppliedScholarship = async (schol: Omit<AppliedScholarship, 'id'>) => {
    const newSchol: AppliedScholarship = { ...schol, id: generateUUID() };
    const updated = [newSchol, ...appliedScholarships];
    setAppliedScholarships(updated);
    storageService.saveAppliedScholarships(updated);
    await supabaseService.syncScholarship(newSchol);
    storageService.addActivity('Logged scholarship application', newSchol.name, 'Scholarship');
    setActivities(storageService.getActivities());
    showToast(`Added scholarship application "${newSchol.name}" (Synced to Cloud)`);
  };

  const updateAppliedScholarship = async (schol: AppliedScholarship) => {
    const updated = appliedScholarships.map((s) => (s.id === schol.id ? schol : s));
    setAppliedScholarships(updated);
    storageService.saveAppliedScholarships(updated);
    await supabaseService.syncScholarship(schol);
    showToast(`Updated scholarship "${schol.name}"`);
  };

  const deleteAppliedScholarship = async (id: string) => {
    const target = appliedScholarships.find((s) => s.id === id);
    const updated = appliedScholarships.filter((s) => s.id !== id);
    setAppliedScholarships(updated);
    storageService.saveAppliedScholarships(updated);
    await supabaseService.deleteScholarship(id);
    if (target) {
      storageService.addActivity('Removed scholarship entry', target.name, 'Scholarship');
      setActivities(storageService.getActivities());
      showToast(`Removed scholarship "${target.name}"`, 'info');
    }
  };

  const toggleFavoriteAppliedScholarship = async (id: string) => {
    const updated = appliedScholarships.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
    setAppliedScholarships(updated);
    storageService.saveAppliedScholarships(updated);
    const target = updated.find((s) => s.id === id);
    if (target) await supabaseService.syncScholarship(target);
  };

  // File Preview Modal
  const openPreviewFile = (url: string, title: string, type: string = 'document') => {
    setPreviewFile({ url, title, type });
  };

  const closePreviewFile = () => {
    setPreviewFile(null);
  };

  // Clear all data to fresh 100% clean vault
  const resetAllData = () => {
    storageService.clearToEmptyVault();
    setProfile(storageService.getProfile());
    setDocuments([]);
    setCertificates([]);
    setProjects([]);
    setPresentations([]);
    setAchievements([]);
    setEducation([]);
    setSkills([]);
    setResumes([]);
    setLinks([]);
    setAppliedHackathons([]);
    setAppliedScholarships([]);
    setActivities(storageService.getActivities());
    showToast('Vault cleared to a 100% fresh clean state.', 'success');
  };

  const startFreshCleanVault = () => {
    resetAllData();
  };

  const importBackupData = (importedData: any): boolean => {
    const success = storageService.importAllData(importedData);
    if (success) {
      setProfile(storageService.getProfile());
      setDocuments(storageService.getDocuments());
      setCertificates(storageService.getCertificates());
      setProjects(storageService.getProjects());
      setPresentations(storageService.getPresentations());
      setAchievements(storageService.getAchievements());
      setEducation(storageService.getEducation());
      setSkills(storageService.getSkills());
      setResumes(storageService.getResumes());
      setLinks(storageService.getLinks());
      setAppliedHackathons(storageService.getAppliedHackathons());
      setAppliedScholarships(storageService.getAppliedScholarships());
      setActivities(storageService.getActivities());
      showToast('Vault backup imported successfully!', 'success');
      return true;
    } else {
      showToast('Failed to import vault backup: invalid format', 'error');
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        documents,
        certificates,
        projects,
        presentations,
        achievements,
        education,
        skills,
        resumes,
        links,
        appliedHackathons,
        appliedScholarships,
        activities,
        storageStats,

        updateProfile,

        addDocument,
        updateDocument,
        deleteDocument,
        toggleFavoriteDocument,

        addCertificate,
        updateCertificate,
        deleteCertificate,
        toggleFavoriteCertificate,

        addProject,
        updateProject,
        deleteProject,
        toggleFavoriteProject,

        addPresentation,
        deletePresentation,

        addAchievement,
        deleteAchievement,

        addEducation,
        updateEducation,

        addSkill,
        deleteSkill,

        addResumeVersion,
        setCurrentResume,
        deleteResumeVersion,

        addLink,
        deleteLink,
        toggleFavoriteLink,

        addAppliedHackathon,
        updateAppliedHackathon,
        deleteAppliedHackathon,
        toggleFavoriteAppliedHackathon,

        addAppliedScholarship,
        updateAppliedScholarship,
        deleteAppliedScholarship,
        toggleFavoriteAppliedScholarship,

        isCommandPaletteOpen,
        setCommandPaletteOpen,

        previewFile,
        openPreviewFile,
        closePreviewFile,

        toast,
        showToast,
        resetAllData,
        startFreshCleanVault,
        importBackupData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

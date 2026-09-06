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
import {
  initialProfile,
  initialDocuments,
  initialCertificates,
  initialProjects,
  initialPresentations,
  initialAchievements,
  initialEducation,
  initialSkills,
  initialResumeVersions,
  initialLinks,
  initialActivities,
  initialAppliedHackathons,
  initialAppliedScholarships,
} from './mockData';

const VAULT_VERSION_KEY = 'sagarinfo_vault_version_v3_clean';

const KEYS = {
  PROFILE: 'sagarinfo_profile',
  DOCUMENTS: 'sagarinfo_documents',
  CERTIFICATES: 'sagarinfo_certificates',
  PROJECTS: 'sagarinfo_projects',
  PRESENTATIONS: 'sagarinfo_presentations',
  ACHIEVEMENTS: 'sagarinfo_achievements',
  EDUCATION: 'sagarinfo_education',
  SKILLS: 'sagarinfo_skills',
  RESUMES: 'sagarinfo_resumes',
  LINKS: 'sagarinfo_links',
  ACTIVITIES: 'sagarinfo_activities',
  HACKATHONS: 'sagarinfo_hackathons',
  SCHOLARSHIPS: 'sagarinfo_scholarships',
};

// Automatic cleanup migration: ensures any legacy mock documents in user browser are purged
const ensureCleanStorage = () => {
  try {
    const version = localStorage.getItem(VAULT_VERSION_KEY);
    if (!version) {
      // Clear legacy storage items containing mock Aadhaar/PAN cards
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(VAULT_VERSION_KEY, 'v3_clean');
    }
  } catch (err) {
    console.warn('Storage check error:', err);
  }
};

ensureCleanStorage();

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

export const storageService = {
  getProfile: (): UserProfile => getStorageItem(KEYS.PROFILE, initialProfile),
  saveProfile: (profile: UserProfile): UserProfile => {
    setStorageItem(KEYS.PROFILE, profile);
    storageService.pushFullStateToServer();
    return profile;
  },

  getDocuments: (): DocumentItem[] => getStorageItem(KEYS.DOCUMENTS, initialDocuments),
  saveDocuments: (docs: DocumentItem[]): void => {
    setStorageItem(KEYS.DOCUMENTS, docs);
    storageService.pushFullStateToServer();
  },

  getCertificates: (): CertificateItem[] => getStorageItem(KEYS.CERTIFICATES, initialCertificates),
  saveCertificates: (certs: CertificateItem[]): void => {
    setStorageItem(KEYS.CERTIFICATES, certs);
    storageService.pushFullStateToServer();
  },

  getProjects: (): ProjectItem[] => getStorageItem(KEYS.PROJECTS, initialProjects),
  saveProjects: (projects: ProjectItem[]): void => {
    setStorageItem(KEYS.PROJECTS, projects);
    storageService.pushFullStateToServer();
  },

  getPresentations: (): PresentationItem[] => getStorageItem(KEYS.PRESENTATIONS, initialPresentations),
  savePresentations: (pres: PresentationItem[]): void => {
    setStorageItem(KEYS.PRESENTATIONS, pres);
    storageService.pushFullStateToServer();
  },

  getAchievements: (): AchievementItem[] => getStorageItem(KEYS.ACHIEVEMENTS, initialAchievements),
  saveAchievements: (ach: AchievementItem[]): void => {
    setStorageItem(KEYS.ACHIEVEMENTS, ach);
    storageService.pushFullStateToServer();
  },

  getEducation: (): EducationItem[] => getStorageItem(KEYS.EDUCATION, initialEducation),
  saveEducation: (edu: EducationItem[]): void => {
    setStorageItem(KEYS.EDUCATION, edu);
    storageService.pushFullStateToServer();
  },

  getSkills: (): SkillItem[] => getStorageItem(KEYS.SKILLS, initialSkills),
  saveSkills: (skills: SkillItem[]): void => {
    setStorageItem(KEYS.SKILLS, skills);
    storageService.pushFullStateToServer();
  },

  getResumes: (): ResumeVersion[] => getStorageItem(KEYS.RESUMES, initialResumeVersions),
  saveResumes: (resumes: ResumeVersion[]): void => {
    setStorageItem(KEYS.RESUMES, resumes);
    storageService.pushFullStateToServer();
  },

  getLinks: (): ImportantLink[] => getStorageItem(KEYS.LINKS, initialLinks),
  saveLinks: (links: ImportantLink[]): void => {
    setStorageItem(KEYS.LINKS, links);
    storageService.pushFullStateToServer();
  },

  getAppliedHackathons: (): AppliedHackathon[] => getStorageItem(KEYS.HACKATHONS, initialAppliedHackathons),
  saveAppliedHackathons: (hacks: AppliedHackathon[]): void => {
    setStorageItem(KEYS.HACKATHONS, hacks);
    storageService.pushFullStateToServer();
  },

  getAppliedScholarships: (): AppliedScholarship[] => getStorageItem(KEYS.SCHOLARSHIPS, initialAppliedScholarships),
  saveAppliedScholarships: (schol: AppliedScholarship[]): void => {
    setStorageItem(KEYS.SCHOLARSHIPS, schol);
    storageService.pushFullStateToServer();
  },

  getActivities: (): ActivityLog[] => getStorageItem(KEYS.ACTIVITIES, initialActivities),
  addActivity: (action: string, targetName: string, targetType: ActivityLog['targetType']): void => {
    const current = getStorageItem<ActivityLog[]>(KEYS.ACTIVITIES, initialActivities);
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      action,
      targetName,
      targetType,
      timestamp: 'Just now',
    };
    const updated = [newLog, ...current.slice(0, 25)];
    setStorageItem(KEYS.ACTIVITIES, updated);
  },

  calculateStorageStats: (
    docs: DocumentItem[],
    certs: CertificateItem[],
    projs: ProjectItem[],
    pres: PresentationItem[],
    hacks: AppliedHackathon[] = [],
    schol: AppliedScholarship[] = []
  ): StorageStats => {
    const totalBytes = docs.reduce((acc, d) => acc + (d.fileSizeBytes || 0), 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
    const limitMB = 500;
    const usedPct = Math.min(100, Math.round(((totalBytes / (1024 * 1024)) / limitMB) * 100));

    return {
      totalDocuments: docs.length,
      totalStorageUsedFormatted: `${totalMB} MB`,
      totalCertificates: certs.length,
      totalProjects: projs.length,
      totalPresentations: pres.length,
      totalAppliedHackathons: hacks.length,
      totalAppliedScholarships: schol.length,
      storageLimitFormatted: `${limitMB} MB`,
      usedPercentage: usedPct,
    };
  },

  // Cross-device sync helper: bundle full state
  getFullState: () => ({
    profile: storageService.getProfile(),
    documents: storageService.getDocuments(),
    certificates: storageService.getCertificates(),
    projects: storageService.getProjects(),
    presentations: storageService.getPresentations(),
    achievements: storageService.getAchievements(),
    education: storageService.getEducation(),
    skills: storageService.getSkills(),
    resumes: storageService.getResumes(),
    links: storageService.getLinks(),
    appliedHackathons: storageService.getAppliedHackathons(),
    appliedScholarships: storageService.getAppliedScholarships(),
    activities: storageService.getActivities(),
    updatedAt: new Date().toISOString(),
  }),

  // Push updates to Vite sync server (persisting to laptop disk)
  pushFullStateToServer: async () => {
    try {
      const data = storageService.getFullState();
      await fetch('/api/vault-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Offline fallback: localStorage is primary
    }
  },

  // Pull updates from Vite sync server (called when app loads on phone or laptop)
  pullFullStateFromServer: async (): Promise<any | null> => {
    try {
      const res = await fetch('/api/vault-sync');
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.empty) return null;

      if (data.profile) setStorageItem(KEYS.PROFILE, data.profile);
      if (Array.isArray(data.documents)) setStorageItem(KEYS.DOCUMENTS, data.documents);
      if (Array.isArray(data.certificates)) setStorageItem(KEYS.CERTIFICATES, data.certificates);
      if (Array.isArray(data.projects)) setStorageItem(KEYS.PROJECTS, data.projects);
      if (Array.isArray(data.presentations)) setStorageItem(KEYS.PRESENTATIONS, data.presentations);
      if (Array.isArray(data.achievements)) setStorageItem(KEYS.ACHIEVEMENTS, data.achievements);
      if (Array.isArray(data.education)) setStorageItem(KEYS.EDUCATION, data.education);
      if (Array.isArray(data.skills)) setStorageItem(KEYS.SKILLS, data.skills);
      if (Array.isArray(data.resumes)) setStorageItem(KEYS.RESUMES, data.resumes);
      if (Array.isArray(data.links)) setStorageItem(KEYS.LINKS, data.links);
      if (Array.isArray(data.appliedHackathons)) setStorageItem(KEYS.HACKATHONS, data.appliedHackathons);
      if (Array.isArray(data.appliedScholarships)) setStorageItem(KEYS.SCHOLARSHIPS, data.appliedScholarships);
      if (Array.isArray(data.activities)) setStorageItem(KEYS.ACTIVITIES, data.activities);

      return data;
    } catch {
      return null;
    }
  },

  exportAllData: (): void => {
    const fullData = storageService.getFullState();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sagar_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importAllData: (importedData: any): boolean => {
    try {
      if (!importedData || typeof importedData !== 'object') return false;

      if (importedData.profile) setStorageItem(KEYS.PROFILE, importedData.profile);
      if (Array.isArray(importedData.documents)) setStorageItem(KEYS.DOCUMENTS, importedData.documents);
      if (Array.isArray(importedData.certificates)) setStorageItem(KEYS.CERTIFICATES, importedData.certificates);
      if (Array.isArray(importedData.projects)) setStorageItem(KEYS.PROJECTS, importedData.projects);
      if (Array.isArray(importedData.presentations)) setStorageItem(KEYS.PRESENTATIONS, importedData.presentations);
      if (Array.isArray(importedData.achievements)) setStorageItem(KEYS.ACHIEVEMENTS, importedData.achievements);
      if (Array.isArray(importedData.education)) setStorageItem(KEYS.EDUCATION, importedData.education);
      if (Array.isArray(importedData.skills)) setStorageItem(KEYS.SKILLS, importedData.skills);
      if (Array.isArray(importedData.resumes)) setStorageItem(KEYS.RESUMES, importedData.resumes);
      if (Array.isArray(importedData.links)) setStorageItem(KEYS.LINKS, importedData.links);
      if (Array.isArray(importedData.appliedHackathons)) setStorageItem(KEYS.HACKATHONS, importedData.appliedHackathons);
      if (Array.isArray(importedData.appliedScholarships)) setStorageItem(KEYS.SCHOLARSHIPS, importedData.appliedScholarships);
      if (Array.isArray(importedData.activities)) setStorageItem(KEYS.ACTIVITIES, importedData.activities);

      storageService.pushFullStateToServer();
      return true;
    } catch (err) {
      console.error('Failed to import vault data:', err);
      return false;
    }
  },

  // Reset to clean 0-item state (no mock data is ever restored)
  resetToDemoData: (): void => {
    storageService.clearToEmptyVault();
  },

  clearToEmptyVault: (): void => {
    localStorage.clear();
    localStorage.setItem(VAULT_VERSION_KEY, 'v3_clean');
    setStorageItem(KEYS.PROFILE, initialProfile);
    setStorageItem(KEYS.DOCUMENTS, []);
    setStorageItem(KEYS.CERTIFICATES, []);
    setStorageItem(KEYS.PROJECTS, []);
    setStorageItem(KEYS.PRESENTATIONS, []);
    setStorageItem(KEYS.ACHIEVEMENTS, []);
    setStorageItem(KEYS.EDUCATION, []);
    setStorageItem(KEYS.SKILLS, []);
    setStorageItem(KEYS.RESUMES, []);
    setStorageItem(KEYS.LINKS, []);
    setStorageItem(KEYS.HACKATHONS, []);
    setStorageItem(KEYS.SCHOLARSHIPS, []);
    setStorageItem(KEYS.ACTIVITIES, [
      {
        id: 'act-01',
        action: 'Initialized Clean Personal Vault',
        targetName: 'Sagar Digital Vault',
        targetType: 'Document',
        timestamp: 'Just now',
      },
    ]);
    storageService.pushFullStateToServer();
  },
};

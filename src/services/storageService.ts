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
import { idbGet, idbSet, idbSaveFile, idbGetFile, idbClearAll } from './vaultDB';

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

// Safe localStorage getter
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
};

// Safe localStorage setter that avoids QuotaExceededError
const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err: any) {
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      console.warn(`LocalStorage quota reached for ${key}. Storing metadata only; full files are secured in IndexedDB.`);
      try {
        // Strip large data URLs if attempting to store into localStorage
        const sanitized = sanitizeForLocalStorage(value);
        localStorage.setItem(key, JSON.stringify(sanitized));
      } catch (innerErr) {
        console.warn(`LocalStorage completely full for ${key}. Data is preserved in IndexedDB.`, innerErr);
      }
    } else {
      console.warn(`Error writing ${key} to localStorage:`, err);
    }
  }
};

// Helper: strips giant base64 payloads from localStorage object to keep it under 5MB
const sanitizeForLocalStorage = (val: any): any => {
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (item && typeof item === 'object') {
        const copy = { ...item };
        if (typeof copy.fileUrl === 'string' && copy.fileUrl.length > 20000) {
          copy.fileUrl = 'idb:' + (copy.id || 'file');
        }
        if (typeof copy.previewUrl === 'string' && copy.previewUrl.length > 20000) {
          copy.previewUrl = 'idb:' + (copy.id || 'file');
        }
        if (typeof copy.certificateUrl === 'string' && copy.certificateUrl.length > 20000) {
          copy.certificateUrl = 'idb:' + (copy.id || 'file');
        }
        return copy;
      }
      return item;
    });
  }
  return val;
};

export const storageService = {
  // Synchronous getters from localStorage (used for instant 0ms app boot)
  getProfile: (): UserProfile => getStorageItem(KEYS.PROFILE, initialProfile),
  getDocuments: (): DocumentItem[] => getStorageItem(KEYS.DOCUMENTS, initialDocuments),
  getCertificates: (): CertificateItem[] => getStorageItem(KEYS.CERTIFICATES, initialCertificates),
  getProjects: (): ProjectItem[] => getStorageItem(KEYS.PROJECTS, initialProjects),
  getPresentations: (): PresentationItem[] => getStorageItem(KEYS.PRESENTATIONS, initialPresentations),
  getAchievements: (): AchievementItem[] => getStorageItem(KEYS.ACHIEVEMENTS, initialAchievements),
  getEducation: (): EducationItem[] => getStorageItem(KEYS.EDUCATION, initialEducation),
  getSkills: (): SkillItem[] => getStorageItem(KEYS.SKILLS, initialSkills),
  getResumes: (): ResumeVersion[] => getStorageItem(KEYS.RESUMES, initialResumeVersions),
  getLinks: (): ImportantLink[] => getStorageItem(KEYS.LINKS, initialLinks),
  getAppliedHackathons: (): AppliedHackathon[] => getStorageItem(KEYS.HACKATHONS, initialAppliedHackathons),
  getAppliedScholarships: (): AppliedScholarship[] => getStorageItem(KEYS.SCHOLARSHIPS, initialAppliedScholarships),
  getActivities: (): ActivityLog[] => getStorageItem(KEYS.ACTIVITIES, initialActivities),

  // Dual-layer saving (IndexedDB for unlimited capacity + localStorage for fast boot)
  saveProfile: (profile: UserProfile): UserProfile => {
    setStorageItem(KEYS.PROFILE, profile);
    idbSet(KEYS.PROFILE, profile);
    return profile;
  },

  saveDocuments: (docs: DocumentItem[]): void => {
    // Persist full files in IndexedDB files store if large dataUrls exist
    docs.forEach((d) => {
      if (d.fileUrl && d.fileUrl.startsWith('data:') && d.fileUrl.length > 50000) {
        idbSaveFile(d.id, d.fileUrl);
      }
    });
    idbSet(KEYS.DOCUMENTS, docs);
    setStorageItem(KEYS.DOCUMENTS, sanitizeForLocalStorage(docs));
  },

  saveCertificates: (certs: CertificateItem[]): void => {
    certs.forEach((c) => {
      if (c.fileUrl && c.fileUrl.startsWith('data:') && c.fileUrl.length > 50000) {
        idbSaveFile(c.id, c.fileUrl);
      }
    });
    idbSet(KEYS.CERTIFICATES, certs);
    setStorageItem(KEYS.CERTIFICATES, sanitizeForLocalStorage(certs));
  },

  saveProjects: (projects: ProjectItem[]): void => {
    idbSet(KEYS.PROJECTS, projects);
    setStorageItem(KEYS.PROJECTS, projects);
  },

  savePresentations: (pres: PresentationItem[]): void => {
    idbSet(KEYS.PRESENTATIONS, pres);
    setStorageItem(KEYS.PRESENTATIONS, pres);
  },

  saveAchievements: (ach: AchievementItem[]): void => {
    idbSet(KEYS.ACHIEVEMENTS, ach);
    setStorageItem(KEYS.ACHIEVEMENTS, ach);
  },

  saveEducation: (edu: EducationItem[]): void => {
    idbSet(KEYS.EDUCATION, edu);
    setStorageItem(KEYS.EDUCATION, edu);
  },

  saveSkills: (skills: SkillItem[]): void => {
    idbSet(KEYS.SKILLS, skills);
    setStorageItem(KEYS.SKILLS, skills);
  },

  saveResumes: (resumes: ResumeVersion[]): void => {
    resumes.forEach((r) => {
      if (r.fileUrl && r.fileUrl.startsWith('data:') && r.fileUrl.length > 50000) {
        idbSaveFile(r.id, r.fileUrl);
      }
    });
    idbSet(KEYS.RESUMES, resumes);
    setStorageItem(KEYS.RESUMES, sanitizeForLocalStorage(resumes));
  },

  saveLinks: (links: ImportantLink[]): void => {
    idbSet(KEYS.LINKS, links);
    setStorageItem(KEYS.LINKS, links);
  },

  saveAppliedHackathons: (hacks: AppliedHackathon[]): void => {
    idbSet(KEYS.HACKATHONS, hacks);
    setStorageItem(KEYS.HACKATHONS, hacks);
  },

  saveAppliedScholarships: (schol: AppliedScholarship[]): void => {
    idbSet(KEYS.SCHOLARSHIPS, schol);
    setStorageItem(KEYS.SCHOLARSHIPS, schol);
  },

  addActivity: (action: string, targetName: string, targetType: ActivityLog['targetType']): void => {
    const current = getStorageItem<ActivityLog[]>(KEYS.ACTIVITIES, initialActivities);
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      action,
      targetName,
      targetType,
      timestamp: 'Just now',
    };
    const updated = [newLog, ...current.slice(0, 30)];
    setStorageItem(KEYS.ACTIVITIES, updated);
    idbSet(KEYS.ACTIVITIES, updated);
  },

  // Hydrate all vault state from IndexedDB (preserves all uploaded files & edits across refreshes)
  hydrateFromIndexedDB: async () => {
    try {
      const [
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
      ] = await Promise.all([
        idbGet<UserProfile | null>(KEYS.PROFILE, null),
        idbGet<DocumentItem[] | null>(KEYS.DOCUMENTS, null),
        idbGet<CertificateItem[] | null>(KEYS.CERTIFICATES, null),
        idbGet<ProjectItem[] | null>(KEYS.PROJECTS, null),
        idbGet<PresentationItem[] | null>(KEYS.PRESENTATIONS, null),
        idbGet<AchievementItem[] | null>(KEYS.ACHIEVEMENTS, null),
        idbGet<EducationItem[] | null>(KEYS.EDUCATION, null),
        idbGet<SkillItem[] | null>(KEYS.SKILLS, null),
        idbGet<ResumeVersion[] | null>(KEYS.RESUMES, null),
        idbGet<ImportantLink[] | null>(KEYS.LINKS, null),
        idbGet<AppliedHackathon[] | null>(KEYS.HACKATHONS, null),
        idbGet<AppliedScholarship[] | null>(KEYS.SCHOLARSHIPS, null),
        idbGet<ActivityLog[] | null>(KEYS.ACTIVITIES, null),
      ]);

      // Rehydrate files that might be referenced as idb:id
      let restoredDocs = documents;
      if (Array.isArray(restoredDocs)) {
        restoredDocs = await Promise.all(
          restoredDocs.map(async (doc) => {
            if (doc.fileUrl && doc.fileUrl.startsWith('idb:')) {
              const fileId = doc.fileUrl.replace('idb:', '');
              const realFile = await idbGetFile(fileId);
              if (realFile) {
                return { ...doc, fileUrl: realFile, previewUrl: realFile };
              }
            }
            return doc;
          })
        );
      }

      return {
        profile,
        documents: restoredDocs,
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
      };
    } catch (err) {
      console.warn('Hydration from IndexedDB error:', err);
      return null;
    }
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

  exportAllData: (): void => {
    const fullData = storageService.getFullState();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sagar_vault_complete_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importAllData: (importedData: any): boolean => {
    try {
      if (!importedData || typeof importedData !== 'object') return false;

      if (importedData.profile) storageService.saveProfile(importedData.profile);
      if (Array.isArray(importedData.documents)) storageService.saveDocuments(importedData.documents);
      if (Array.isArray(importedData.certificates)) storageService.saveCertificates(importedData.certificates);
      if (Array.isArray(importedData.projects)) storageService.saveProjects(importedData.projects);
      if (Array.isArray(importedData.presentations)) storageService.savePresentations(importedData.presentations);
      if (Array.isArray(importedData.achievements)) storageService.saveAchievements(importedData.achievements);
      if (Array.isArray(importedData.education)) storageService.saveEducation(importedData.education);
      if (Array.isArray(importedData.skills)) storageService.saveSkills(importedData.skills);
      if (Array.isArray(importedData.resumes)) storageService.saveResumes(importedData.resumes);
      if (Array.isArray(importedData.links)) storageService.saveLinks(importedData.links);
      if (Array.isArray(importedData.appliedHackathons)) storageService.saveAppliedHackathons(importedData.appliedHackathons);
      if (Array.isArray(importedData.appliedScholarships)) storageService.saveAppliedScholarships(importedData.appliedScholarships);
      if (Array.isArray(importedData.activities)) {
        setStorageItem(KEYS.ACTIVITIES, importedData.activities);
        idbSet(KEYS.ACTIVITIES, importedData.activities);
      }

      return true;
    } catch (err) {
      console.error('Failed to import vault data:', err);
      return false;
    }
  },

  resetToDemoData: (): void => {
    storageService.clearToEmptyVault();
  },

  clearToEmptyVault: (): void => {
    localStorage.clear();
    idbClearAll();
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
  },
};

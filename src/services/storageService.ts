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
    return profile;
  },

  getDocuments: (): DocumentItem[] => getStorageItem(KEYS.DOCUMENTS, initialDocuments),
  saveDocuments: (docs: DocumentItem[]): void => setStorageItem(KEYS.DOCUMENTS, docs),

  getCertificates: (): CertificateItem[] => getStorageItem(KEYS.CERTIFICATES, initialCertificates),
  saveCertificates: (certs: CertificateItem[]): void => setStorageItem(KEYS.CERTIFICATES, certs),

  getProjects: (): ProjectItem[] => getStorageItem(KEYS.PROJECTS, initialProjects),
  saveProjects: (projects: ProjectItem[]): void => setStorageItem(KEYS.PROJECTS, projects),

  getPresentations: (): PresentationItem[] => getStorageItem(KEYS.PRESENTATIONS, initialPresentations),
  savePresentations: (pres: PresentationItem[]): void => setStorageItem(KEYS.PRESENTATIONS, pres),

  getAchievements: (): AchievementItem[] => getStorageItem(KEYS.ACHIEVEMENTS, initialAchievements),
  saveAchievements: (ach: AchievementItem[]): void => setStorageItem(KEYS.ACHIEVEMENTS, ach),

  getEducation: (): EducationItem[] => getStorageItem(KEYS.EDUCATION, initialEducation),
  saveEducation: (edu: EducationItem[]): void => setStorageItem(KEYS.EDUCATION, edu),

  getSkills: (): SkillItem[] => getStorageItem(KEYS.SKILLS, initialSkills),
  saveSkills: (skills: SkillItem[]): void => setStorageItem(KEYS.SKILLS, skills),

  getResumes: (): ResumeVersion[] => getStorageItem(KEYS.RESUMES, initialResumeVersions),
  saveResumes: (resumes: ResumeVersion[]): void => setStorageItem(KEYS.RESUMES, resumes),

  getLinks: (): ImportantLink[] => getStorageItem(KEYS.LINKS, initialLinks),
  saveLinks: (links: ImportantLink[]): void => setStorageItem(KEYS.LINKS, links),

  getAppliedHackathons: (): AppliedHackathon[] => getStorageItem(KEYS.HACKATHONS, initialAppliedHackathons),
  saveAppliedHackathons: (hacks: AppliedHackathon[]): void => setStorageItem(KEYS.HACKATHONS, hacks),

  getAppliedScholarships: (): AppliedScholarship[] => getStorageItem(KEYS.SCHOLARSHIPS, initialAppliedScholarships),
  saveAppliedScholarships: (schol: AppliedScholarship[]): void => setStorageItem(KEYS.SCHOLARSHIPS, schol),

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
    const updated = [newLog, ...current.slice(0, 20)];
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
    const totalBytes = docs.reduce((acc, d) => acc + (d.fileSizeBytes || 1000000), 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
    const limitMB = 500; // 500 MB mock vault limit
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

  exportAllData: (): void => {
    const fullData = {
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
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sagarinfo_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  resetToDemoData: (): void => {
    localStorage.clear();
    setStorageItem(KEYS.PROFILE, initialProfile);
    setStorageItem(KEYS.DOCUMENTS, initialDocuments);
    setStorageItem(KEYS.CERTIFICATES, initialCertificates);
    setStorageItem(KEYS.PROJECTS, initialProjects);
    setStorageItem(KEYS.PRESENTATIONS, initialPresentations);
    setStorageItem(KEYS.ACHIEVEMENTS, initialAchievements);
    setStorageItem(KEYS.EDUCATION, initialEducation);
    setStorageItem(KEYS.SKILLS, initialSkills);
    setStorageItem(KEYS.RESUMES, initialResumeVersions);
    setStorageItem(KEYS.LINKS, initialLinks);
    setStorageItem(KEYS.HACKATHONS, initialAppliedHackathons);
    setStorageItem(KEYS.SCHOLARSHIPS, initialAppliedScholarships);
    setStorageItem(KEYS.ACTIVITIES, initialActivities);
  },

  clearToEmptyVault: (): void => {
    localStorage.clear();
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
      { id: 'act-01', action: 'Initialized Clean Vault OS', targetName: 'Sagar Digital Vault', targetType: 'Document', timestamp: 'Just now' }
    ]);
  },
};

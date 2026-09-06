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
} from '../types/sagarinfo';

export const initialProfile: UserProfile = {
  id: 'sagar-profile-01',
  fullName: 'Sagar',
  tagline: 'Personal Digital Vault & Portfolio',
  bio: 'My personal documents, verified credentials, projects, and achievements — all in one private place.',
  email: '',
  phone: '',
  location: '',
  education: '',
  currentStatus: 'Personal Digital Vault Ready',
  careerGoal: '',
  interests: [],
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
  linkedin: '',
  github: '',
  twitter: '',
  website: '',
  isPublicProfile: false,
};

// 100% Clean Slate: All mock/dummy documents and data deleted
export const initialDocuments: DocumentItem[] = [];
export const initialCertificates: CertificateItem[] = [];
export const initialProjects: ProjectItem[] = [];
export const initialPresentations: PresentationItem[] = [];
export const initialAchievements: AchievementItem[] = [];
export const initialEducation: EducationItem[] = [];
export const initialSkills: SkillItem[] = [];
export const initialResumeVersions: ResumeVersion[] = [];
export const initialLinks: ImportantLink[] = [];
export const initialAppliedHackathons: AppliedHackathon[] = [];
export const initialAppliedScholarships: AppliedScholarship[] = [];

export const initialActivities: ActivityLog[] = [
  {
    id: 'act-init-01',
    action: 'Initialized Clean Personal Vault',
    targetName: 'Sagar Digital Vault',
    targetType: 'Document',
    timestamp: 'Just now',
  },
];

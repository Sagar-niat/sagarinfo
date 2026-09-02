export type CategoryType = 'identity' | 'education' | 'career' | 'financial' | 'other';

export type FileFormat = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx';

export interface UserProfile {
  id: string;
  fullName: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  currentStatus: string;
  careerGoal: string;
  interests: string[];
  avatarUrl: string;
  linkedin: string;
  github: string;
  twitter?: string;
  website?: string;
  isPublicProfile: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: CategoryType;
  fileName: string;
  fileSize: string; // e.g. "1.2 MB"
  fileSizeBytes: number;
  fileType: FileFormat;
  fileUrl: string;
  previewUrl?: string;
  uploadDate: string;
  description?: string;
  tags: string[];
  isFavorite: boolean;
  isPrivate: boolean;
  visibility?: 'private' | 'public';
}

export interface CertificateItem {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  fileUrl: string;
  certificateUrl?: string;
  imageUrl?: string;
  skills: string[];
  description: string;
  tags: string[];
  isFavorite: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  category: 'AI & Automation' | 'Full Stack' | 'Mobile App' | 'DevOps & Tools' | 'Web3 / Blockchain' | 'Other';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  presentationUrl?: string;
  documentationUrl?: string;
  screenshots: string[];
  status: 'Completed' | 'In Progress' | 'Archived' | 'Planned';
  startDate: string;
  endDate?: string;
  teamMembers?: string[];
  hackathonName?: string;
  achievement?: string;
  problemStatement: string;
  solution: string;
  features: string[];
  architectureOverview?: string;
  isFavorite: boolean;
  isPublic: boolean;
}

export interface PresentationItem {
  id: string;
  title: string;
  relatedProjectName?: string;
  eventOrHackathon?: string;
  date: string;
  description: string;
  fileFormat: 'pdf' | 'ppt' | 'pptx';
  fileUrl: string;
  fileSize: string;
  slideCount?: number;
  isFavorite: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  event: string;
  rankOrResult: string; // e.g. "1st Place Winner", "Top 5 Finalist"
  certificateUrl?: string;
  proofDocumentUrl?: string;
  relatedProjectName?: string;
  link?: string;
  isFavorite: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  level?: 'School' | 'Intermediate' | 'B.Tech' | 'Other';
  institution: string;
  boardOrUniversity?: string;
  startYear: string;
  endYear: string;
  score: string; // e.g., "9.8 CGPA" or "96.4%"
  status: 'Completed' | 'Pursuing';
  fieldOfStudy?: string;
  location?: string;
  highlights?: string[];
  certificateUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'AI & ML' | 'Tools & DevOps';
  proficiency: number; // 1 - 100
  yearsOfExperience: string;
  iconName?: string;
  relatedProjectsCount: number;
  featured: boolean;
}

export interface ResumeVersion {
  id: string;
  versionName: string;
  title: string;
  uploadDate: string;
  fileUrl: string;
  fileSize: string;
  isCurrent: boolean;
  notes?: string;
}

export interface ImportantLink {
  id: string;
  name: string;
  url: string;
  category: 'Professional' | 'Projects' | 'Social' | 'Useful';
  description: string;
  iconName: string;
  isFavorite: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  targetName: string;
  targetType: 'Document' | 'Certificate' | 'Project' | 'Achievement' | 'Resume' | 'Skill' | 'Presentation' | 'Link' | 'Hackathon' | 'Scholarship';
  timestamp: string;
  icon?: string;
}

export interface AppliedHackathon {
  id: string;
  name: string;
  organizer: string;
  applicationDate: string;
  projectSubmitted: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Winner' | 'Not Shortlisted';
  prizePool?: string;
  submissionUrl?: string;
  proofUrl?: string;
  notes?: string;
  isFavorite: boolean;
}

export interface AppliedScholarship {
  id: string;
  name: string;
  provider: string;
  applicationDate: string;
  amount: string; // e.g. "₹50,000 / year"
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Awarded' | 'Disbursed' | 'Closed';
  eligibility?: string;
  submittedDocument?: string;
  proofUrl?: string;
  notes?: string;
  isFavorite: boolean;
}

export interface StorageStats {
  totalDocuments: number;
  totalStorageUsedFormatted: string;
  totalCertificates: number;
  totalProjects: number;
  totalPresentations: number;
  totalAppliedHackathons: number;
  totalAppliedScholarships: number;
  storageLimitFormatted: string;
  usedPercentage: number;
}

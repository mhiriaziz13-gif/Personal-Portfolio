export type Profile = {
  name: string;
  location: string;
  email: string;
  linkedIn: string;
  headline: string;
  homepageTitle: string;
  tagline: string;
  availability: string;
  summary: string;
  aboutHeading: string;
  aboutBody: string;
  longTermObjective: string;
  targetCountries: string[];
  portraitUrl: string;
};

export type ValueCard = {
  id?: string;
  kicker: string;
  title: string;
  body: string;
  detail: string;
  sortOrder?: number;
};

export type Project = {
  id?: string;
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  impact: string;
  contributions: string[];
  businessValue: string[];
  workflow: string[];
  tools: string[];
  cover: 'automation' | 'journey' | 'architecture';
  coverImageUrl?: string | null;
  confidentiality?: string;
  beforeAfter?: { before: string[]; after: string[] };
  sortOrder?: number;
};

export type Experience = {
  id?: string;
  organisation: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  responsibilities: string[];
  tools?: string[];
  sortOrder?: number;
};

export type SkillCluster = {
  id?: string;
  title: string;
  items: string[];
  sortOrder?: number;
};

export type Education = {
  id?: string;
  title: string;
  organisation: string;
  date: string;
  detail: string;
  sortOrder?: number;
};

export type Certification = {
  id?: string;
  title: string;
  issuer: string;
  detail: string;
  sortOrder?: number;
};

export type Resume = {
  id?: string;
  title: string;
  language: string;
  use: string;
  description: string;
  pdf: string;
  docx: string;
  pdfSize: string;
  docxSize: string;
  sortOrder?: number;
};

export type PortfolioContent = {
  profile: Profile;
  valueCards: ValueCard[];
  projects: Project[];
  experiences: Experience[];
  skillClusters: SkillCluster[];
  education: Education[];
  certifications: Certification[];
  resumes: Resume[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

import { certification, education, person, skillClusters, valueCards } from '@/data/site';
import { experiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { resumes } from '@/data/resumes';
import { getVerifiedAdmin, isVerifiedAdmin } from '@/lib/security/admin-auth';
import type { Certification, ContactMessage, Education, Experience, PortfolioContent, Profile, Project, Resume, SkillCluster, ValueCard } from './cms-types';
import { isSupabaseConfigured } from './supabase/config';
import { createClient } from './supabase/server';

const fallbackContent: PortfolioContent = {
  profile: person,
  valueCards,
  projects,
  experiences,
  skillClusters,
  education,
  certifications: [{ title: 'Fundamentals of Digital Marketing', issuer: 'Google', detail: '' }],
  resumes,
};

type Row = Record<string, unknown>;

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function mapProfile(row: Row): Profile {
  return {
    name: stringValue(row.name, person.name),
    location: stringValue(row.location, person.location),
    email: stringValue(row.email, person.email),
    linkedIn: stringValue(row.linkedin_url, person.linkedIn),
    headline: stringValue(row.headline, person.headline),
    homepageTitle: stringValue(row.homepage_title, person.homepageTitle),
    tagline: stringValue(row.tagline, person.tagline),
    availability: stringValue(row.availability, person.availability),
    summary: stringValue(row.summary, person.summary),
    aboutHeading: stringValue(row.about_heading, person.aboutHeading),
    aboutBody: stringValue(row.about_body, person.aboutBody),
    longTermObjective: stringValue(row.long_term_objective, person.longTermObjective),
    targetCountries: stringArray(row.target_countries).length ? stringArray(row.target_countries) : person.targetCountries,
    portraitUrl: stringValue(row.portrait_url, person.portraitUrl),
  };
}

function mapValueCard(row: Row): ValueCard {
  return { id: stringValue(row.id), kicker: stringValue(row.kicker), title: stringValue(row.title), body: stringValue(row.body), detail: stringValue(row.detail), sortOrder: numberValue(row.sort_order) };
}

function mapProject(row: Row): Project {
  const beforeAfter = row.before_after && typeof row.before_after === 'object' ? row.before_after as Record<string, unknown> : null;
  const cover = stringValue(row.cover, 'automation');
  return {
    id: stringValue(row.id),
    slug: stringValue(row.slug),
    title: stringValue(row.title),
    industry: stringValue(row.industry),
    challenge: stringValue(row.challenge),
    impact: stringValue(row.impact),
    contributions: stringArray(row.contributions),
    businessValue: stringArray(row.business_value),
    workflow: stringArray(row.workflow),
    tools: stringArray(row.tools),
    cover: cover === 'journey' || cover === 'architecture' ? cover : 'automation',
    coverImageUrl: stringValue(row.cover_image_url) || null,
    confidentiality: stringValue(row.confidentiality) || undefined,
    beforeAfter: beforeAfter ? { before: stringArray(beforeAfter.before), after: stringArray(beforeAfter.after) } : undefined,
    sortOrder: numberValue(row.sort_order),
  };
}

function mapExperience(row: Row): Experience {
  return { id: stringValue(row.id), organisation: stringValue(row.organisation), role: stringValue(row.role), dates: stringValue(row.date_label), location: stringValue(row.location), summary: stringValue(row.summary), responsibilities: stringArray(row.responsibilities), tools: stringArray(row.tools), sortOrder: numberValue(row.sort_order) };
}

function mapSkillCluster(row: Row): SkillCluster {
  return { id: stringValue(row.id), title: stringValue(row.title), items: stringArray(row.items), sortOrder: numberValue(row.sort_order) };
}

function mapEducation(row: Row): Education {
  return { id: stringValue(row.id), title: stringValue(row.title), organisation: stringValue(row.organisation), date: stringValue(row.date_label), detail: stringValue(row.detail), sortOrder: numberValue(row.sort_order) };
}

function mapCertification(row: Row): Certification {
  return { id: stringValue(row.id), title: stringValue(row.title), issuer: stringValue(row.issuer), detail: stringValue(row.detail), sortOrder: numberValue(row.sort_order) };
}

function mapResume(row: Row): Resume {
  return { id: stringValue(row.id), title: stringValue(row.title), language: stringValue(row.language), use: stringValue(row.intended_use), description: stringValue(row.description), pdf: stringValue(row.pdf_url), docx: stringValue(row.docx_url), pdfSize: stringValue(row.pdf_size), docxSize: stringValue(row.docx_size), sortOrder: numberValue(row.sort_order) };
}

async function loadContent(includeUnpublished: boolean): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) return fallbackContent;

  try {
    const supabase = await createClient();
    const visible = <T extends { eq: Function }>(query: T) => includeUnpublished ? query : query.eq('is_published', true);

    const [profileResult, valuesResult, projectsResult, experiencesResult, skillsResult, educationResult, certificationsResult, resumesResult] = await Promise.all([
      supabase.from('site_profile').select('*').eq('id', 1).maybeSingle(),
      visible(supabase.from('value_cards').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('projects').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('experiences').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('skill_clusters').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('education').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('certifications').select('*').order('sort_order', { ascending: true })),
      visible(supabase.from('resumes').select('*').order('sort_order', { ascending: true })),
    ]);

    return {
      profile: profileResult.error || !profileResult.data ? fallbackContent.profile : mapProfile(profileResult.data as Row),
      valueCards: valuesResult.error ? fallbackContent.valueCards : (valuesResult.data as Row[]).map(mapValueCard),
      projects: projectsResult.error ? fallbackContent.projects : (projectsResult.data as Row[]).map(mapProject),
      experiences: experiencesResult.error ? fallbackContent.experiences : (experiencesResult.data as Row[]).map(mapExperience),
      skillClusters: skillsResult.error ? fallbackContent.skillClusters : (skillsResult.data as Row[]).map(mapSkillCluster),
      education: educationResult.error ? fallbackContent.education : (educationResult.data as Row[]).map(mapEducation),
      certifications: certificationsResult.error ? fallbackContent.certifications : (certificationsResult.data as Row[]).map(mapCertification),
      resumes: resumesResult.error ? fallbackContent.resumes : (resumesResult.data as Row[]).map(mapResume),
    };
  } catch {
    return fallbackContent;
  }
}

export async function getPortfolioContent() {
  return loadContent(false);
}

export async function getAdminPortfolioContent() {
  await getVerifiedAdmin();
  return loadContent(true);
}

export async function getProjectFromCMS(slug: string) {
  const content = await getPortfolioContent();
  return content.projects.find((project) => project.slug === slug);
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    await getVerifiedAdmin();
    const supabase = await createClient();
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as ContactMessage[];
  } catch {
    return [];
  }
}

export async function isCurrentUserAdmin() {
  if (!isSupabaseConfigured()) return false;
  return isVerifiedAdmin();
}

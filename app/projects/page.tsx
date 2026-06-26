import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ProjectCard } from '@/components/project-card';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Projects', description: 'Selected case studies in process automation, digital customer journeys, business intelligence and AI-supported learning.', alternates: { canonical: '/projects' }, openGraph: { title: 'Projects | Ahmed Aziz Mhiri', description: 'Case studies in automation, customer journey improvement, reporting logic and AI-supported learning.' } };

export default async function ProjectsPage() {
  const { projects } = await getPortfolioContent();
  return <><PageHero eyebrow="Case studies" title="Selected work in analytics, automation and digital growth." intro="A concise collection of projects showing business context, practical contribution, tools used and value for operations, customer journeys and internal learning." /><section className="section"><div className="shell project-grid project-grid-wide">{projects.map((project) => <ProjectCard project={project} key={project.id || project.slug} />)}</div></section></>;
}
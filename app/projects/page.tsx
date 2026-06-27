import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ProjectCard } from '@/components/project-card';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Projects', description: 'Selected projects by Ahmed Aziz Mhiri in process automation, digital customer journeys, business intelligence and AI-supported learning.', alternates: { canonical: '/projects' }, openGraph: { title: 'Projects | Ahmed Aziz Mhiri', description: 'Selected work in automation, customer journey improvement, reporting logic and AI-supported learning.' } };

export default async function ProjectsPage() {
  const { projects } = await getPortfolioContent();
  return <><PageHero eyebrow="Projects" title="Selected work in analytics, automation and digital operations." intro="Projects with business context, practical contribution, tools used and clear outcomes for operations, customer journeys and internal learning." /><section className="section"><div className="shell project-grid project-grid-wide">{projects.map((project) => <ProjectCard project={project} key={project.id || project.slug} />)}</div></section></>;
}

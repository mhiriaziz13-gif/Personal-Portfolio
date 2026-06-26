import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ProjectCard } from '@/components/project-card';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Projects', description: 'Case studies across automation, data-driven digital transformation and AI-ready enterprise learning.', alternates: { canonical: '/projects' }, openGraph: { title: 'Projects | Ahmed Aziz Mhiri', description: 'Case studies in automation, customer journey improvement and AI-ready learning.' } };

export default async function ProjectsPage() {
  const { projects } = await getPortfolioContent();
  return <><PageHero eyebrow="Case studies" title="Data, automation and digital growth applied to real business contexts." intro="Selected projects showing how operational controls, customer journeys and secure learning platforms can be made more useful through structured digital work." /><section className="section"><div className="shell project-grid project-grid-wide">{projects.map((project) => <ProjectCard project={project} key={project.id || project.slug} />)}</div></section></>;
}

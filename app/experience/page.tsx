import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Experience', description: 'Experience across process automation, commercial marketing, business intelligence, management control and full-stack development.', alternates: { canonical: '/experience' }, openGraph: { title: 'Experience | Ahmed Aziz Mhiri', description: 'Experience across automation, marketing, management control, analytics and software development.' } };

export default async function ExperiencePage() {
  const { experiences } = await getPortfolioContent();
  return <><PageHero eyebrow="Experience" title="Experience across operations, marketing, analytics and software delivery." intro="Roles and projects that combine business context with data, digital tools, reporting logic and process improvement." /><section className="section"><div className="shell experience-list">{experiences.map((item, index) => <article className="experience-card" key={item.id || item.organisation}><div className="experience-top"><span className="experience-number">0{index + 1}</span><div><p className="timeline-date">{item.dates}</p><h2>{item.role}</h2><p className="timeline-org">{item.organisation} - {item.location}</p></div></div><p className="experience-summary">{item.summary}</p><ul>{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>{item.tools && item.tools.length > 0 && <div className="tool-list">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>}</article>)}</div></section></>;
}
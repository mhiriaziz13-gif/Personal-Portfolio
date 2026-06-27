import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'CV & Resume', description: 'Download Ahmed Aziz Mhiri CV versions for analytics, business intelligence, automation and digital marketing roles.', alternates: { canonical: '/resume' }, openGraph: { title: 'CV & Resume | Ahmed Aziz Mhiri', description: 'CV downloads for analytics, business intelligence, automation and digital marketing roles.' } };

export default async function ResumePage() {
  const { resumes } = await getPortfolioContent();
  return <><PageHero eyebrow="CV" title="CV & Resume" /><section className="section"><div className="shell resume-grid">{resumes.map((resume, index) => <article className="resume-card" key={resume.id || resume.title}><span className="resume-number">0{index + 1}</span><p className="project-industry">{resume.language} - {resume.use}</p><h2>{resume.title}</h2><p>{resume.description}</p><div className="resume-downloads"><a className="button button-primary" href={resume.pdf} download><Icon name="download" /> Download PDF</a><a className="button button-secondary" href={resume.docx} download><Icon name="download" /> Download DOCX</a></div></article>)}</div></section></>;
}

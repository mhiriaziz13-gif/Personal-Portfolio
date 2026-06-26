import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Resume / CV Download Centre', description: 'Download four tailored CV versions in PDF and editable DOCX formats.', alternates: { canonical: '/resume' }, openGraph: { title: 'Resume / CV Download Centre | Ahmed Aziz Mhiri', description: 'Download four tailored CV versions in PDF and editable DOCX formats.' } };

export default async function ResumePage() {
  const { resumes } = await getPortfolioContent();
  return <><PageHero eyebrow="Resume / CV Download Centre" title="Four tailored CV formats for different application contexts." intro="Each version uses the same verified professional information, structured for a specific audience and available in both PDF and editable DOCX format." /><section className="section"><div className="shell resume-grid">{resumes.map((resume, index) => <article className="resume-card" key={resume.id || resume.title}><span className="resume-number">0{index + 1}</span><p className="project-industry">{resume.language} · {resume.use}</p><h2>{resume.title}</h2><p>{resume.description}</p><div className="resume-downloads"><a className="button button-primary" href={resume.pdf} download><Icon name="download" /> PDF <small>{resume.pdfSize}</small></a><a className="button button-secondary" href={resume.docx} download><Icon name="download" /> DOCX <small>{resume.docxSize}</small></a></div></article>)}</div></section><section className="section section-soft"><div className="shell content-narrow"><p className="eyebrow">CMS-managed</p><h2>CV links can now be replaced in the private admin dashboard.</h2><p>Upload a new PDF or DOCX file, then save its public URL in the relevant CV entry. The public download buttons update from Supabase without changing application code.</p></div></section></>;
}

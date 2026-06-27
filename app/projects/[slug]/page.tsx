import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { ProjectCover } from '@/components/project-cover';
import { getProjectFromCMS } from '@/lib/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectFromCMS(slug);
  return { title: project ? project.title : 'Project', description: project?.challenge || 'Project detail', alternates: { canonical: project ? `/projects/${project.slug}` : '/projects' }, openGraph: { title: project ? `${project.title} | Ahmed Aziz Mhiri` : 'Project | Ahmed Aziz Mhiri', description: project?.impact || 'Project detail' } };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectFromCMS(slug);
  if (!project) notFound();
  return <><section className="case-hero"><div className="shell case-hero-grid"><div><Link href="/projects" className="back-link">Back to projects</Link><p className="eyebrow">{project.industry}</p><h1>{project.title}</h1><p className="case-summary">{project.challenge}</p><p className="impact-line"><strong>Practical value:</strong> {project.impact}</p></div><ProjectCover type={project.cover} imageUrl={project.coverImageUrl} /></div></section><section className="section"><div className="shell case-grid"><article className="case-main"><p className="eyebrow">Context</p><h2>The challenge</h2><p className="case-section-copy">{project.challenge}</p></article><aside className="case-aside"><p className="eyebrow">Stack</p><h2>Tools used</h2><div className="tool-list tool-list-stack">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></aside></div></section><section className="section section-soft"><div className="shell case-grid"><article className="case-main"><p className="eyebrow">Role</p><h2>What I worked on</h2><ul className="check-list">{project.contributions.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul></article>{project.confidentiality && <aside className="case-note"><p className="eyebrow">Confidentiality</p><p>{project.confidentiality}</p></aside>}</div></section>{project.beforeAfter && <section className="section"><div className="shell"><p className="eyebrow">Customer journey</p><h2>Before and after</h2><div className="before-after"><article><span>Before</span><ul>{project.beforeAfter.before.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>After</span><ul>{project.beforeAfter.after.map((item) => <li key={item}>{item}</li>)}</ul></article></div></div></section>}<section className="section workflow-section"><div className="shell"><p className="eyebrow">Process</p><h2>How the workflow works</h2><div className="workflow-diagram" role="img" aria-label={`${project.title} workflow`}>{project.workflow.map((step, index) => <div className="workflow-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < project.workflow.length - 1 && <i aria-hidden="true">-</i>}</div>)}</div></div></section><section className="section"><div className="shell case-grid"><article><p className="eyebrow">Outcome</p><h2>Why it matters</h2><ul className="check-list">{project.businessValue.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul></article></div></section><section className="section contact-cta-section"><div className="shell contact-cta small"><p className="eyebrow">Next</p><h2>See the experience behind this work.</h2><Link className="button button-primary" href="/experience">View Experience <Icon name="arrow" /></Link></div></section></>;
}

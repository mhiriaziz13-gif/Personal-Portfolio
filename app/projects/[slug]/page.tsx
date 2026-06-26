import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { ProjectCover } from '@/components/project-cover';
import { getProjectFromCMS } from '@/lib/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectFromCMS(slug);
  return { title: project ? project.title : 'Project', description: project?.challenge || 'Project case study', alternates: { canonical: project ? `/projects/${project.slug}` : '/projects' }, openGraph: { title: project ? `${project.title} | Ahmed Aziz Mhiri` : 'Project | Ahmed Aziz Mhiri', description: project?.impact || 'Project case study' } };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectFromCMS(slug);
  if (!project) notFound();
  return <><section className="case-hero"><div className="shell case-hero-grid"><div><Link href="/projects" className="back-link">← All projects</Link><p className="eyebrow">{project.industry}</p><h1>{project.title}</h1><p className="case-summary">{project.challenge}</p><p className="impact-line"><strong>Business value:</strong> {project.impact}</p></div><ProjectCover type={project.cover} imageUrl={project.coverImageUrl} /></div></section><section className="section"><div className="shell case-grid"><article className="case-main"><p className="eyebrow">Contribution</p><h2>What I worked on</h2><ul className="check-list">{project.contributions.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul></article><aside className="case-aside"><p className="eyebrow">Tools</p><div className="tool-list tool-list-stack">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></aside></div></section>{project.beforeAfter && <section className="section section-soft"><div className="shell"><p className="eyebrow">Journey shift</p><h2>From fragmented touchpoints to a connected experience.</h2><div className="before-after"><article><span>Before</span><ul>{project.beforeAfter.before.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>After</span><ul>{project.beforeAfter.after.map((item) => <li key={item}>{item}</li>)}</ul></article></div></div></section>}<section className="section workflow-section"><div className="shell"><p className="eyebrow">Workflow / architecture</p><h2>A clear operating path</h2><div className="workflow-diagram" role="img" aria-label={`${project.title} workflow`}>{project.workflow.map((step, index) => <div className="workflow-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < project.workflow.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div></div></section><section className="section"><div className="shell case-grid"><article><p className="eyebrow">Business value</p><h2>Designed for clearer execution</h2><ul className="check-list">{project.businessValue.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul></article><aside className="case-note">{project.confidentiality && <><p className="eyebrow">Confidentiality</p><p>{project.confidentiality}</p></>}</aside></div></section><section className="section contact-cta-section"><div className="shell contact-cta small"><p className="eyebrow">Next</p><h2>Explore the full experience behind these projects.</h2><Link className="button button-primary" href="/experience">View experience <Icon name="arrow" /></Link></div></section></>;
}

import Link from 'next/link';
import type { Project } from '@/lib/cms-types';
import { ProjectCover } from './project-cover';
import { Icon } from './icons';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <ProjectCover type={project.cover} imageUrl={project.coverImageUrl} />
      <div className="project-card-body">
        <p className="project-industry">{project.industry}</p>
        <h3>{project.title}</h3>
        <p className="project-context">{project.challenge}</p>
        <p>{project.impact}</p>
        <div className="tool-list" aria-label={`Tools used for ${project.title}`}>{project.tools.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}</div>
        <Link className="text-link" href={`/projects/${project.slug}`}>Read the Case Study <Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

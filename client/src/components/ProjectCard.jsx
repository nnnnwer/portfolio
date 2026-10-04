import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECT_STATUS_LABELS } from '../utils/format';
import PlaceholderBadge from './PlaceholderBadge';
import PlaceholderText from './PlaceholderText';
import ProjectImage from './ProjectImage';
import TechChip from './TechChip';

const MAX_CHIPS = 4;

export default function ProjectCard({ project }) {
  const href = `/projects/${project.slug}`;
  const chips = project.tech_stack ?? [];
  const meta = [PROJECT_STATUS_LABELS[project.status], project.year].filter(Boolean).join(', ');

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink">
      <div className="aspect-[16/10] overflow-hidden border-b border-line">
        <ProjectImage src={project.image_url} title={project.title} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm text-muted">
          <span>{meta}</span>
          {project.is_placeholder && <PlaceholderBadge />}
        </div>

        <h3 className="text-lg leading-snug font-semibold">
          {/* The ::after makes the whole card clickable without nesting links. */}
          <Link to={href} className="after:absolute after:inset-0 group-hover:text-copper">
            <PlaceholderText value={project.title} inline />
          </Link>
        </h3>

        <div className="mt-2 text-muted">
          <PlaceholderText value={project.summary} fallback="No summary yet." />
        </div>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {chips.slice(0, MAX_CHIPS).map((tech) => (
              <li key={tech}>
                <TechChip name={tech} />
              </li>
            ))}
            {chips.length > MAX_CHIPS && (
              <li className="self-center px-1 text-sm text-muted">+{chips.length - MAX_CHIPS} more</li>
            )}
          </ul>
        )}

        {(project.github_url || project.live_url) && (
          <div className="relative z-10 mt-5 flex gap-4 border-t border-line pt-4 text-sm font-medium">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-copper"
              >
                <FolderGit2 className="size-4" aria-hidden="true" />
                Source code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-copper"
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
                Live demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

import { ArrowLeft, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PlaceholderBadge from '../components/PlaceholderBadge';
import PlaceholderText from '../components/PlaceholderText';
import ProjectImage from '../components/ProjectImage';
import TechChip from '../components/TechChip';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getProject } from '../services/portfolioService';
import { PROJECT_STATUS_LABELS, toParagraphs } from '../utils/format';
import { isPlaceholderText, stripPlaceholder } from '../utils/placeholder';

function BackLink() {
  return (
    <Link
      to="/projects"
      className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-muted hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      All projects
    </Link>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, loading, error, slow, retry } = useApi((signal) => getProject(id, signal), [id]);

  useDocumentMeta({
    title: project ? stripPlaceholder(project.title) : error?.status === 404 ? 'Project not found' : 'Project',
    description: project?.summary && !isPlaceholderText(project.summary) ? project.summary : undefined,
    noIndex: error?.status === 404,
  });

  if (loading && !project) {
    return (
      <Container className="py-14">
        <BackLink />
        <LoadingState label="Loading project" slow={slow} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-14">
        <BackLink />
        <div className="mt-8">
          {error.status === 404 ? (
            <EmptyState title="This project doesn't exist" message="It may have been renamed or unpublished.">
              <Button to="/projects" variant="secondary" size="sm">
                Browse all projects
              </Button>
            </EmptyState>
          ) : (
            <ErrorState title="Couldn't load this project" error={error} onRetry={retry} />
          )}
        </div>
      </Container>
    );
  }

  const paragraphs = toParagraphs(project.description);
  const meta = [PROJECT_STATUS_LABELS[project.status], project.year, project.role].filter(Boolean);

  return (
    <article>
      <Container className="pt-10 sm:pt-14">
        <BackLink />

        <header className="mt-8 max-w-[48rem]">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            {meta.map((item) => (
              <span key={item} className="rounded-full border border-line px-3 py-1">
                {item}
              </span>
            ))}
            {project.is_placeholder && <PlaceholderBadge />}
          </div>
          <h1 className="text-[clamp(2.2rem,5.5vw,3.75rem)] leading-[1.04] font-semibold">
            <PlaceholderText value={project.title} inline />
          </h1>
          <div className="mt-4 text-lg text-muted">
            <PlaceholderText value={project.summary} fallback="No summary yet." />
          </div>
        </header>

        <div className="mt-10 aspect-[16/8] overflow-hidden rounded-xl border border-line">
          <ProjectImage src={project.image_url} title={project.title} priority />
        </div>
      </Container>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div className="max-w-[65ch] space-y-5 text-[1.05rem] leading-relaxed">
          <h2 className="text-2xl font-semibold">Overview</h2>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => <PlaceholderText key={index} value={paragraph} />)
          ) : (
            <PlaceholderText value={null} fallback="A full description hasn't been added yet." />
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="stack-heading">
            <h2 id="stack-heading" className="mb-3 font-semibold">
              Technologies used
            </h2>
            {project.tech_stack?.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech) => (
                  <li key={tech}>
                    <TechChip name={tech} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Not listed yet.</p>
            )}
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading" className="mb-3 font-semibold">
              Links
            </h2>
            {project.github_url || project.live_url ? (
              <div className="flex flex-col gap-2">
                {project.live_url && (
                  <Button href={project.live_url} icon={ArrowUpRight}>
                    Open live demo
                  </Button>
                )}
                {project.github_url && (
                  <Button href={project.github_url} variant="secondary" icon={FolderGit2}>
                    View source code
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted">No public links for this project yet.</p>
            )}
          </section>
        </aside>
      </Container>
    </article>
  );
}

import { FileText, FolderGit2, Mail } from 'lucide-react';
import Button from '../components/Button';
import CircuitBoard from '../components/CircuitBoard';
import Container from '../components/Container';
import DataState from '../components/DataState';
import ErrorState from '../components/ErrorState';
import ProjectCard from '../components/ProjectCard';
import QuickFacts from '../components/QuickFacts';
import SectionHeading from '../components/SectionHeading';
import { SITE_NAME } from '../constants/site';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useProfile } from '../hooks/useProfile';
import { getProjects } from '../services/portfolioService';
import { isPlaceholderText } from '../utils/placeholder';

export default function Home() {
  const profileState = useProfile();
  const { data: profile, loading, error, retry } = profileState;
  const featured = useApi((signal) => getProjects(signal, { featured: true }), [], { cacheKey: 'projects-featured' });

  useDocumentMeta({
    title: null,
    description: profile?.short_intro && !isPlaceholderText(profile.short_intro) ? profile.short_intro : undefined,
  });

  const name = profile?.full_name || SITE_NAME;

  return (
    <>
      <section aria-labelledby="hero-heading" className="border-b border-line">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
          <div className="order-2 lg:order-1">
            <h1
              id="hero-heading"
              className="text-[clamp(3rem,8.5vw,6.25rem)] leading-[0.92] font-semibold tracking-[-0.04em]"
            >
              {name}
            </h1>

            <p className="mt-6 text-xl font-medium sm:text-2xl">
              {profile?.title || 'Computer Engineering Graduate'}
            </p>
            {profile?.headline && <p className="mt-1 text-lg text-muted sm:text-xl">{profile.headline}</p>}

            {loading && !profile ? (
              <div className="mt-6 max-w-[52ch] space-y-2" aria-hidden="true">
                <div className="h-4 w-full animate-pulse rounded bg-line" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
              </div>
            ) : (
              profile?.short_intro &&
              !isPlaceholderText(profile.short_intro) && (
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{profile.short_intro}</p>
              )
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/resume" icon={FileText}>
                View CV
              </Button>
              <Button to="/projects" variant="secondary" icon={FolderGit2}>
                Explore projects
              </Button>
              <Button to="/contact" variant="secondary" icon={Mail}>
                Contact me
              </Button>
            </div>

            {error && (
              <ErrorState className="mt-8" title="Couldn't load profile details" error={error} onRetry={retry} />
            )}
          </div>

          <div className="order-1 w-full max-w-[19rem] justify-self-center sm:max-w-[23rem] lg:order-2 lg:max-w-none">
            <CircuitBoard photoUrl={profile?.photo_url} name={name} loading={loading && !profile} />
          </div>
        </Container>
      </section>

      {profile && (
        <section aria-labelledby="facts-heading">
          <Container className="py-16 sm:py-20">
            <SectionHeading id="facts-heading" title="At a glance" action={{ to: '/about', label: 'More about me' }} />
            <QuickFacts profile={profile} className="lg:grid-cols-4" />
          </Container>
        </section>
      )}

      <section aria-labelledby="featured-heading">
        <Container className="pb-4">
          <SectionHeading
            id="featured-heading"
            title="Selected projects"
            action={{ to: '/projects', label: 'All projects' }}
          />
          <DataState
            state={featured}
            label="projects"
            emptyTitle="No featured projects yet"
            emptyMessage="Projects marked as featured in the database will appear here."
          >
            {(projects) => (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </DataState>
        </Container>
      </section>
    </>
  );
}
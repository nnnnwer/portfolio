import CircuitBoard from '../components/CircuitBoard';
import Container from '../components/Container';
import DataState from '../components/DataState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import PlaceholderText from '../components/PlaceholderText';
import QuickFacts from '../components/QuickFacts';
import TimelineItem from '../components/TimelineItem';
import { SITE_NAME } from '../constants/site';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useProfile } from '../hooks/useProfile';
import { getEducation } from '../services/portfolioService';
import { formatYearRange } from '../utils/format';

function AboutSection({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-8">
      <h2 id={id} className="mb-4 text-2xl font-semibold">
        {title}
      </h2>
      <div className="max-w-[65ch] text-[1.05rem] leading-relaxed">{children}</div>
    </section>
  );
}

export default function About() {
  const { data: profile, loading, error, slow, retry } = useProfile();
  const education = useApi((signal) => getEducation(signal), [], { cacheKey: 'education' });

  useDocumentMeta({
    title: 'About',
    description: `About ${profile?.full_name || SITE_NAME}: education, background and career objectives.`,
  });

  const name = profile?.full_name || SITE_NAME;

  return (
    <>
      <PageHeader
        title="About"
        description="Who I am, where I studied, and the kind of software work I'm aiming for."
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto max-w-[16rem] lg:mx-0">
            <CircuitBoard photoUrl={profile?.photo_url} name={name} loading={loading && !profile} animated={false} />
          </div>
          {profile && (
            <p className="mt-5 text-center text-lg font-semibold lg:text-left">
              {[profile.honorific, profile.full_name].filter(Boolean).join(' ')}
            </p>
          )}
        </aside>

        <div className="space-y-10">
          {loading && !profile && <LoadingState label="Loading profile" slow={slow} />}
          {error && <ErrorState title="Couldn't load profile" error={error} onRetry={retry} />}

          {profile && (
            <>
              <QuickFacts profile={profile} />

              <AboutSection id="intro-heading" title="Introduction">
                <PlaceholderText value={profile.about} fallback="Introduction not added yet." />
              </AboutSection>
            </>
          )}

          <AboutSection id="education-heading" title="Education">
            <DataState
              state={education}
              label="education"
              emptyTitle="No education entries yet"
              emptyMessage="Add rows to the education table in Supabase to show them here."
            >
              {(items) => (
                <ol className="mt-2">
                  {items.map((item) => (
                    <TimelineItem
                      key={item.id}
                      title={item.degree}
                      subtitle={[item.field_of_study, item.institution].filter(Boolean).join(', ')}
                      period={formatYearRange(item.start_year, item.end_year, item.status)}
                      meta={item.status === 'graduated' ? 'Graduated' : 'In progress'}
                      description={item.description}
                      highlights={item.highlights}
                      isPlaceholder={item.is_placeholder}
                    />
                  ))}
                </ol>
              )}
            </DataState>
          </AboutSection>

          {profile && (
            <>
              <AboutSection id="background-heading" title="Background">
                <PlaceholderText value={profile.background} fallback="Background not added yet." />
              </AboutSection>

              <AboutSection id="objectives-heading" title="Career objectives">
                <PlaceholderText value={profile.career_objectives} fallback="Career objectives not added yet." />
              </AboutSection>
            </>
          )}
        </div>
      </Container>
    </>
  );
}
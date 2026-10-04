import { Download, Printer } from 'lucide-react';
import Button from '../components/Button';
import Container from '../components/Container';
import DataState from '../components/DataState';
import PageHeader from '../components/PageHeader';
import PlaceholderText from '../components/PlaceholderText';
import TechChip from '../components/TechChip';
import TimelineItem from '../components/TimelineItem';
import { SKILL_CATEGORIES, SKILL_LEVELS } from '../constants/skills';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getEducation, getExperience, getProfile, getProjects, getSkills } from '../services/portfolioService';
import { formatDateRange, formatYearRange } from '../utils/format';
import { hasRealValue, isPlaceholderText, stripPlaceholder } from '../utils/placeholder';

const loadResume = async (signal) => {
  const [profile, education, experience, skills, projects] = await Promise.all([
    getProfile(signal),
    getEducation(signal),
    getExperience(signal),
    getSkills(signal),
    getProjects(signal),
  ]);
  return { profile, education, experience, skills, projects };
};

function CvSection({ title, children }) {
  return (
    <section className="print-avoid-break">
      <h2 className="mb-4 border-b-2 border-ink pb-1.5 text-sm font-semibold tracking-wide text-copper">{title}</h2>
      {children}
    </section>
  );
}

function ContactLine({ profile }) {
  const items = [
    { value: profile.email, fallback: 'Email' },
    { value: profile.phone, fallback: 'Phone' },
    { value: profile.location, fallback: 'Location' },
    { value: profile.linkedin_url?.replace(/^https?:\/\/(www\.)?/, ''), fallback: 'LinkedIn' },
    { value: profile.github_url?.replace(/^https?:\/\/(www\.)?/, ''), fallback: 'GitHub' },
  ];

  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.95rem]">
      {items.map((item) =>
        hasRealValue(item.value) ? (
          <li key={item.fallback}>{item.value}</li>
        ) : (
          <li key={item.fallback} className="text-muted italic print:hidden">
            {item.fallback} (placeholder)
          </li>
        ),
      )}
    </ul>
  );
}

function CvDocument({ profile, education, experience, skills, projects }) {
  const skillGroups = SKILL_CATEGORIES.map((c) => ({
    ...c,
    skills: skills.filter((s) => s.category === c.key),
  })).filter((g) => g.skills.length > 0);

  const fullName = [profile.honorific, profile.full_name].filter(Boolean).join(' ');

  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-10 lg:p-14 print:rounded-none print:border-0 print:p-0">
      <header className="border-b border-line pb-6">
        <h2 className="text-[clamp(2rem,5vw,2.75rem)] leading-tight font-semibold">{fullName}</h2>
        <p className="mt-1 text-lg font-medium">
          {profile.title}
          {profile.headline && <span className="text-muted">, {profile.headline}</span>}
        </p>
        <ContactLine profile={profile} />
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_15rem] print:grid-cols-[1fr_13rem] print:gap-8">
        <div className="space-y-9">
          <CvSection title="Profile">
            <PlaceholderText
              value={hasRealValue(profile.career_objectives) ? profile.career_objectives : profile.short_intro}
              fallback="Professional summary not added yet."
            />
          </CvSection>

          <CvSection title="Experience">
            {experience.length > 0 ? (
              <ol>
                {experience.map((item) => (
                  <TimelineItem
                    key={item.id}
                    compact
                    title={item.role}
                    subtitle={item.organization}
                    period={formatDateRange(item.start_date, item.end_date, item.is_current)}
                    meta={[item.employment_type, item.location].filter(Boolean).join(', ') || null}
                    description={item.description}
                    highlights={item.highlights}
                    isPlaceholder={item.is_placeholder}
                  />
                ))}
              </ol>
            ) : (
              <PlaceholderText value={null} fallback="Experience entries not added yet." />
            )}
          </CvSection>

          <CvSection title="Selected projects">
            {projects.length > 0 ? (
              <ul className="space-y-5">
                {projects.slice(0, 4).map((project) => (
                  <li key={project.id} className="print-avoid-break">
                    <p className="font-semibold">
                      <PlaceholderText value={project.title} inline />
                    </p>
                    <div className="mt-1 text-[0.95rem]">
                      <PlaceholderText value={project.summary} fallback="Summary not added yet." />
                    </div>
                    {project.tech_stack?.length > 0 && (
                      <p className="mt-1.5 font-mono text-[0.8rem] text-muted">
                        {project.tech_stack.map((t) => (isPlaceholderText(t) ? stripPlaceholder(t) : t)).join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <PlaceholderText value={null} fallback="Projects not added yet." />
            )}
          </CvSection>
        </div>

        <div className="space-y-9">
          <CvSection title="Education">
            {education.length > 0 ? (
              <ol>
                {education.map((item) => (
                  <TimelineItem
                    key={item.id}
                    compact
                    title={item.degree}
                    subtitle={[item.field_of_study, item.institution].filter(Boolean).join(', ')}
                    period={formatYearRange(item.start_year, item.end_year, item.status)}
                    meta={item.status === 'graduated' ? 'Graduated' : 'In progress'}
                    isPlaceholder={item.is_placeholder}
                  />
                ))}
              </ol>
            ) : (
              <PlaceholderText value={null} fallback="Education not added yet." />
            )}
          </CvSection>

          <CvSection title="Skills">
            {skillGroups.length > 0 ? (
              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.key}>
                    <p className="mb-1.5 text-sm font-semibold">{group.label}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <li key={skill.id} title={skill.level ? SKILL_LEVELS[skill.level] : undefined}>
                          <TechChip name={skill.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <PlaceholderText value={null} fallback="Skills not added yet." />
            )}
          </CvSection>

          {profile.age != null && (
            <CvSection title="Personal">
              <p className="text-[0.95rem]">Age {profile.age}</p>
            </CvSection>
          )}
        </div>
      </div>
    </div>
  );
}

/** Supabase Storage serves files as attachments when ?download=<filename> is added. */
const toDownloadUrl = (url, name) => {
  if (!url || !url.includes('/storage/v1/object/public/')) return url;
  const filename = `${(name || 'CV').replace(/[^a-z0-9]+/gi, '-')}-CV.pdf`;
  return `${url}${url.includes('?') ? '&' : '?'}download=${encodeURIComponent(filename)}`;
};

export default function Resume() {
  const resume = useApi(loadResume, []);
  const cvUrl = toDownloadUrl(resume.data?.profile?.cv_url, resume.data?.profile?.full_name);

  useDocumentMeta({
    title: 'Resume',
    description: 'CV with education, experience, skills and selected projects. Download as PDF.',
  });

  return (
    <>
      <PageHeader title="Resume" description="My CV on one page. Download it as a PDF to keep or share.">
        <div className="flex flex-wrap items-center gap-3">
          {cvUrl ? (
            <Button href={cvUrl} icon={Download}>
              Download CV (PDF)
            </Button>
          ) : (
            <Button icon={Download} onClick={() => window.print()} disabled={!resume.data}>
              Download CV (PDF)
            </Button>
          )}
          {cvUrl && (
            <Button variant="secondary" icon={Printer} onClick={() => window.print()} disabled={!resume.data}>
              Print this page
            </Button>
          )}
          {!cvUrl && (
            <p className="text-sm text-muted">Opens your browser's print dialog. Choose "Save as PDF" as the printer.</p>
          )}
        </div>
      </PageHeader>

      <Container className="py-12 print:max-w-none print:p-0">
        <DataState state={resume} label="resume" isEmpty={() => false}>
          {(data) => <CvDocument {...data} />}
        </DataState>
      </Container>
    </>
  );
}

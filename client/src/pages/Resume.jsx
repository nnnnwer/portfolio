import { Download, Printer } from 'lucide-react';
import Button from '../components/Button';
import Container from '../components/Container';
import DataState from '../components/DataState';
import PageHeader from '../components/PageHeader';
import PlaceholderText from '../components/PlaceholderText';
import ProfilePhoto from '../components/ProfilePhoto';
import TimelineItem from '../components/TimelineItem';
import { SKILL_CATEGORIES } from '../constants/skills';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getEducation, getExperience, getProfile, getProjects, getSkills } from '../services/portfolioService';
import { formatDateRange, formatYearRange } from '../utils/format';
import { hasRealValue, stripPlaceholder } from '../utils/placeholder';

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

// Languages are not stored in the database. Set level to 1-5 to show dots,
// or leave it null to show only the language name.
const LANGUAGES = [
  { name: 'Lao', level: null },
  { name: 'English', level: null },
];

// Keeps the dark sidebar (and white paper) when printing or saving as PDF.
const PRINT_EXACT = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' };

// The CV is always a white document, even in dark mode. Overriding the theme
// variables here keeps reused components (TimelineItem, PlaceholderText) readable.
const CV_PAPER_VARS = {
  '--ink': '#1e293b',
  '--muted': '#64748b',
  '--line': '#cbd5e1',
  '--canvas': '#ffffff',
  '--surface': '#ffffff',
  '--copper': '#334155',
  '--copper-soft': '#f1f5f9',
};

function CvSection({ title, children }) {
  return (
    <section className="print-avoid-break">
      <h2 className="mb-2.5 border-b border-slate-300 pb-1 text-[0.78rem] font-bold tracking-[0.14em] text-slate-800 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SidebarSection({ title, children }) {
  return (
    <section className="print-avoid-break border-t border-white/15 pt-4">
      <h2 className="mb-3 text-[0.72rem] font-bold tracking-[0.16em] text-white uppercase">{title}</h2>
      {children}
    </section>
  );
}

function SidebarRow({ label, value, href }) {
  if (!hasRealValue(value)) {
    return <li className="text-[0.78rem] text-slate-400 italic print:hidden">{label} not added yet</li>;
  }

  const text = String(value).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <li className="leading-snug">
      <p className="text-[0.7rem] text-slate-400">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-[0.82rem] break-words text-slate-100 hover:underline"
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {text}
        </a>
      ) : (
        <p className="text-[0.82rem] break-words text-slate-100">{text}</p>
      )}
    </li>
  );
}

function LanguageDots({ level }) {
  if (!level) return null;
  return (
    <span role="img" aria-label={`${level} of 5`} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`size-2 rounded-full ${i < level ? 'bg-white' : 'border border-white/40'}`} />
      ))}
    </span>
  );
}

function CvSidebar({ profile }) {
  return (
    <aside className="flex flex-col gap-5 bg-[#1f2b3d] px-6 py-8 text-slate-100" style={PRINT_EXACT}>
      <div className="mx-auto size-32 overflow-hidden rounded-full border-4 border-white/85 bg-slate-600 print:size-28">
        <ProfilePhoto src={profile.photo_url} name={profile.full_name} />
      </div>

      <SidebarSection title="Personal information">
        <ul className="space-y-2.5">
          {profile.age != null && <SidebarRow label="Age" value={`${profile.age} years old`} />}
          <SidebarRow label="Location" value={profile.location} />
        </ul>
      </SidebarSection>

      <SidebarSection title="Contact">
        <ul className="space-y-2.5">
          <SidebarRow
            label="Email"
            value={profile.email}
            href={hasRealValue(profile.email) ? `mailto:${profile.email}` : undefined}
          />
          <SidebarRow
            label="Phone"
            value={profile.phone}
            href={hasRealValue(profile.phone) ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : undefined}
          />
          {profile.linkedin_url && (
            <SidebarRow label="LinkedIn" value={profile.linkedin_url} href={profile.linkedin_url} />
          )}
          {profile.github_url && <SidebarRow label="GitHub" value={profile.github_url} href={profile.github_url} />}
        </ul>
      </SidebarSection>

      <SidebarSection title="Languages">
        <ul className="space-y-2">
          {LANGUAGES.map((language) => (
            <li key={language.name} className="flex items-center justify-between gap-3 text-[0.82rem]">
              <span>{language.name}</span>
              <LanguageDots level={language.level} />
            </li>
          ))}
        </ul>
      </SidebarSection>
    </aside>
  );
}

function CvDocument({ profile, education, experience, skills, projects }) {
  const skillGroups = SKILL_CATEGORIES.map((c) => ({
    ...c,
    skills: skills.filter((s) => s.category === c.key),
  })).filter((g) => g.skills.length > 0);

  // Never show placeholder jobs on the CV; projects carry the weight instead.
  const realExperience = experience.filter((item) => !item.is_placeholder);
  const summary = hasRealValue(profile.career_objectives) ? profile.career_objectives : profile.short_intro;

  return (
    <div
      className="mx-auto grid max-w-[56rem] overflow-hidden border border-line bg-white md:grid-cols-[31%_1fr] print:min-h-[260mm] print:max-w-none print:grid-cols-[31%_1fr] print:border-0"
      style={PRINT_EXACT}
    >
      <CvSidebar profile={profile} />

      <div className="space-y-5 px-6 py-8 text-[0.88rem] leading-relaxed text-slate-700 sm:px-9" style={CV_PAPER_VARS}>
        <header className="border-b-2 border-slate-800 pb-4">
          <h2 className="text-[clamp(1.8rem,4.5vw,2.4rem)] leading-tight font-bold tracking-tight text-slate-900">
            {profile.full_name}
          </h2>
          <p className="mt-1 text-[0.82rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {profile.headline || profile.title}
          </p>
        </header>

        <CvSection title="Profile">
          <PlaceholderText value={summary} fallback="Professional summary not added yet." />
        </CvSection>

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
                  description={item.description}
                  isPlaceholder={item.is_placeholder}
                />
              ))}
            </ol>
          ) : (
            <PlaceholderText value={null} fallback="Education not added yet." />
          )}
        </CvSection>

        {realExperience.length > 0 && (
          <CvSection title="Experience">
            <ol>
              {realExperience.map((item) => (
                <TimelineItem
                  key={item.id}
                  compact
                  title={item.role}
                  subtitle={item.organization}
                  period={formatDateRange(item.start_date, item.end_date, item.is_current)}
                  meta={[item.employment_type, item.location].filter(Boolean).join(', ') || null}
                  description={item.description}
                  highlights={item.highlights}
                />
              ))}
            </ol>
          </CvSection>
        )}

        <CvSection title="Projects">
          {projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <li key={project.id} className="print-avoid-break">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="font-semibold text-slate-900">
                      <PlaceholderText value={project.title} inline />
                    </p>
                    {project.tech_stack?.length > 0 && (
                      <p className="text-[0.75rem] text-slate-500">
                        {project.tech_stack.map(stripPlaceholder).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="mt-0.5">
                    <PlaceholderText value={project.summary} fallback="Summary not added yet." />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <PlaceholderText value={null} fallback="Projects not added yet." />
          )}
        </CvSection>

        <CvSection title="Skills">
          {skillGroups.length > 0 ? (
            <dl className="space-y-1.5">
              {skillGroups.map((group) => (
                <div key={group.key} className="grid gap-x-4 sm:grid-cols-[9rem_1fr] print:grid-cols-[8rem_1fr]">
                  <dt className="font-semibold text-slate-800">{group.label}</dt>
                  <dd>{group.skills.map((skill) => stripPlaceholder(skill.name)).join(', ')}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <PlaceholderText value={null} fallback="Skills not added yet." />
          )}
        </CvSection>
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
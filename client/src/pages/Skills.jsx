import Container from '../components/Container';
import DataState from '../components/DataState';
import PageHeader from '../components/PageHeader';
import SkillCategory from '../components/SkillCategory';
import SkillMeter from '../components/SkillMeter';
import { SKILL_CATEGORIES } from '../constants/skills';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getSkills } from '../services/portfolioService';

const groupByCategory = (skills) =>
  SKILL_CATEGORIES.map((category) => ({
    ...category,
    skills: skills.filter((skill) => skill.category === category.key),
  })).filter((group) => group.skills.length > 0);

export default function Skills() {
  const skills = useApi((signal) => getSkills(signal), [], { cacheKey: 'skills' });

  useDocumentMeta({
    title: 'Skills',
    description: 'Programming languages, frontend and backend technologies, databases and development tools.',
  });

  return (
    <>
      <PageHeader
        title="Skills"
        description="Languages, technologies and tools, grouped by area. Each meter shows my current level, from beginner to expert."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span>How to read the meters:</span>
          <SkillMeter level={1} />
          <SkillMeter level={3} />
          <SkillMeter level={5} />
        </div>
      </PageHeader>

      <Container className="py-14">
        <DataState
          state={skills}
          label="skills"
          emptyTitle="No skills added yet"
          emptyMessage="Add rows to the skills table in Supabase to show them here."
        >
          {(items) => (
            <div className="grid gap-6 md:grid-cols-2">
              {groupByCategory(items).map((group) => (
                <SkillCategory key={group.key} label={group.label} icon={group.icon} skills={group.skills} />
              ))}
            </div>
          )}
        </DataState>
      </Container>
    </>
  );
}
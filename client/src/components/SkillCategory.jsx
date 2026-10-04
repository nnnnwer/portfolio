import PlaceholderText from './PlaceholderText';
import SkillMeter from './SkillMeter';

export default function SkillCategory({ label, icon: Icon, skills }) {
  const headingId = `skills-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-line bg-surface p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-board text-[#c98a45]">
          <Icon className="size-[1.1rem]" aria-hidden="true" />
        </span>
        <h2 id={headingId} className="text-lg font-semibold">
          {label}
        </h2>
        <span className="ml-auto text-sm text-muted">{skills.length}</span>
      </div>

      <ul className="divide-y divide-line">
        {skills.map((skill) => (
          <li key={skill.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <PlaceholderText value={skill.name} inline className="font-medium" />
            <SkillMeter level={skill.level} />
          </li>
        ))}
      </ul>
    </section>
  );
}

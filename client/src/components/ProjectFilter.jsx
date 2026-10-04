import { isPlaceholderText } from '../utils/placeholder';

/** Toggle buttons that filter the gallery by technology. */
export default function ProjectFilter({ projects, selected, onSelect }) {
  const technologies = [
    ...new Set(projects.flatMap((p) => p.tech_stack ?? []).filter((t) => !isPlaceholderText(t))),
  ].sort((a, b) => a.localeCompare(b));

  if (technologies.length < 2) return null;

  const options = [null, ...technologies];

  return (
    <div role="group" aria-label="Filter projects by technology" className="mb-8 flex flex-wrap gap-2">
      {options.map((tech) => {
        const active = selected === tech;
        return (
          <button
            key={tech ?? 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(tech)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              active ? 'border-mask bg-mask text-mask-ink' : 'border-line text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {tech ?? 'All projects'}
          </button>
        );
      })}
    </div>
  );
}

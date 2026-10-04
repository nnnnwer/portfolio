import { MAX_SKILL_LEVEL, SKILL_LEVELS } from '../constants/skills';

/** Five-segment LED bar. Lit segments = proficiency level. */
export default function SkillMeter({ level }) {
  const label = level ? `${SKILL_LEVELS[level]}, ${level} of ${MAX_SKILL_LEVEL}` : 'Not rated yet';

  return (
    <div className="flex items-center gap-3">
      <div role="img" aria-label={label} className="flex gap-1">
        {Array.from({ length: MAX_SKILL_LEVEL }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-4 rounded-[2px] sm:w-5 ${
              level && i < level ? 'bg-mask' : 'border border-line bg-transparent'
            }`}
          />
        ))}
      </div>
      <span className="w-24 text-sm text-muted" aria-hidden="true">
        {level ? SKILL_LEVELS[level] : 'Not rated'}
      </span>
    </div>
  );
}

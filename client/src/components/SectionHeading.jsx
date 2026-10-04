import { Link } from 'react-router-dom';

export default function SectionHeading({ id, title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-[60ch] text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="text-[0.95rem] font-medium text-ink underline decoration-copper decoration-2 underline-offset-[6px] hover:text-copper"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

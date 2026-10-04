/** Labelled input or textarea with accessible error and hint text. */
export default function FormField({ id, label, error, hint, as = 'input', className = '', ...props }) {
  const Control = as;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-medium">
        {label}
      </label>
      <Control
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-md border bg-canvas px-3.5 py-2.5 text-ink placeholder:text-muted/70 transition-colors focus:border-copper ${
          error ? 'border-danger' : 'border-line hover:border-muted'
        } ${as === 'textarea' ? 'min-h-40 resize-y' : 'h-11'}`}
        {...props}
      />
      <div className="mt-1.5 flex justify-between gap-4 text-sm">
        {error ? (
          <p id={`${id}-error`} className="text-danger">
            {error}
          </p>
        ) : (
          <span />
        )}
        {hint && (
          <p id={`${id}-hint`} className="text-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

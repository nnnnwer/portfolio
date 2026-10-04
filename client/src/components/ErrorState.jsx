import { CircleAlert, RotateCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = "Couldn't load this content", error, onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-4 rounded-lg border border-danger/40 bg-surface p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-muted">{error?.message || 'An unexpected error occurred.'}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

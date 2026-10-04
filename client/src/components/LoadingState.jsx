import { LoaderCircle } from 'lucide-react';

export default function LoadingState({ label = 'Loading', slow = false, className = '' }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-start gap-3 py-12 ${className}`}>
      <div className="flex items-center gap-3 text-muted">
        <LoaderCircle className="size-5 animate-spin text-copper" aria-hidden="true" />
        <span>{label}…</span>
      </div>
      {slow && (
        <p className="max-w-[52ch] text-sm text-muted">
          The server is starting up after a quiet period. This can take up to a minute.
        </p>
      )}
    </div>
  );
}

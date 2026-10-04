import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, message, children, className = '' }) {
  return (
    <div className={`flex flex-col items-start gap-3 rounded-lg border border-dashed border-line p-8 ${className}`}>
      <Icon className="size-6 text-muted" aria-hidden="true" />
      <p className="font-medium">{title}</p>
      {message && <p className="max-w-[52ch] text-muted">{message}</p>}
      {children}
    </div>
  );
}

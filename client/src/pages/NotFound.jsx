import { House, FolderGit2 } from 'lucide-react';
import Button from '../components/Button';
import Container from '../components/Container';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/** A broken trace: the copper path stops short of its pad. */
function OpenCircuit() {
  return (
    <svg viewBox="0 0 320 90" className="w-full max-w-sm" aria-hidden="true">
      <rect width="320" height="90" rx="12" fill="var(--board)" />
      <g stroke="#c98a45" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M28 45 H110 L128 27 H150" />
        <path d="M188 27 H206 L224 45 H292" />
      </g>
      <g fill="#c98a45">
        <circle cx="28" cy="45" r="8" />
        <circle cx="292" cy="45" r="8" />
      </g>
      <g stroke="#e8eee6" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <path d="M162 19 L176 35" />
        <path d="M176 19 L162 35" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found', noIndex: true });

  return (
    <Container className="flex flex-col items-start py-20 sm:py-28">
      <OpenCircuit />
      <p className="mt-10 font-mono text-copper">404</p>
      <h1 className="mt-2 text-[clamp(2.2rem,6vw,3.75rem)] leading-tight font-semibold">This page doesn't exist</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-muted">
        The link may be mistyped, or the page may have moved. Everything on this site is reachable from the home
        page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/" icon={House}>
          Go to home page
        </Button>
        <Button to="/projects" variant="secondary" icon={FolderGit2}>
          Browse projects
        </Button>
      </div>
    </Container>
  );
}

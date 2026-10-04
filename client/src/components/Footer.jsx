import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants/navigation';
import { SITE_NAME } from '../constants/site';
import { useProfile } from '../hooks/useProfile';
import { hasRealValue } from '../utils/placeholder';
import Container from './Container';

export default function Footer() {
  const { data: profile } = useProfile();
  const year = new Date().getFullYear();

  const externalLinks = [
    { label: 'GitHub', href: profile?.github_url },
    { label: 'LinkedIn', href: profile?.linkedin_url },
    { label: 'Email', href: hasRealValue(profile?.email) ? `mailto:${profile.email}` : null },
  ].filter((link) => link.href);

  return (
    <footer className="mt-24 border-t border-line print:hidden">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold tracking-tight">{profile?.full_name || SITE_NAME}</p>
          <p className="mt-1 max-w-[40ch] text-muted">
            {profile?.title || 'Computer Engineering Graduate'}
            {profile?.headline ? `, ${profile.headline.toLowerCase()}.` : '.'}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-medium text-muted">Pages</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink hover:text-copper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-sm font-medium text-muted">Elsewhere</p>
          {externalLinks.length > 0 ? (
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-ink hover:text-copper"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Link to="/contact" className="text-ink hover:text-copper">
              Send a message
            </Link>
          )}
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {profile?.full_name || SITE_NAME}
        </p>
        <p>Built with React, Express and Supabase.</p>
      </Container>
    </footer>
  );
}

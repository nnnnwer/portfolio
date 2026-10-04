import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants/navigation';
import { SITE_NAME } from '../constants/site';
import { useProfile } from '../hooks/useProfile';
import Container from './Container';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import NavItem from './NavItem';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: profile } = useProfile();
  const close = useCallback(() => setOpen(false), []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md print:hidden">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo name={profile?.full_name || SITE_NAME} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavItem to={link.to} end={link.end}>
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>
    </header>

    {/* Rendered outside <header>: its backdrop-filter would otherwise trap position:fixed. */}
    <MobileMenu id="mobile-menu" open={open} onClose={close} />
    </>
  );
}

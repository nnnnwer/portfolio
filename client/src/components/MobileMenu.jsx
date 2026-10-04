import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants/navigation';

export default function MobileMenu({ id, open, onClose }) {
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id={id} className="fixed inset-x-0 top-16 bottom-0 z-40 bg-canvas lg:hidden">
      <nav aria-label="Main" className="mx-auto max-w-6xl px-5 pt-4 pb-10 sm:px-8">
        <ul className="divide-y divide-line border-y border-line">
          {NAV_LINKS.map((link, index) => (
            <li key={link.to}>
              <NavLink
                ref={index === 0 ? firstLinkRef : undefined}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between py-4 text-2xl tracking-tight transition-colors ${
                    isActive ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="size-2.5 rounded-full bg-copper" aria-hidden="true" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

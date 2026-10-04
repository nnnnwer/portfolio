import { NavLink } from 'react-router-dom';

/** Desktop navigation link. The active page gets a copper "trace" underline. */
export default function NavItem({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative rounded-md px-3 py-2 text-[0.95rem] transition-colors ${
          isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            aria-hidden="true"
            className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-copper transition-transform duration-200 ${
              isActive ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

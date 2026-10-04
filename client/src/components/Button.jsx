import { Link } from 'react-router-dom';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 select-none whitespace-nowrap';

const VARIANTS = {
  primary: 'bg-mask text-mask-ink hover:bg-ink hover:text-canvas',
  secondary: 'border border-line bg-surface text-ink hover:border-ink',
  ghost: 'text-ink hover:text-copper underline-offset-4 hover:underline',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
};

/**
 * One button for every case:
 *  - `to`   renders a React Router <Link>
 *  - `href` renders an <a> (external links open in a new tab safely)
 *  - otherwise a <button>
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'start',
  className = '',
  children,
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const content = (
    <>
      {Icon && iconPosition === 'start' && <Icon aria-hidden="true" className="size-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'end' && <Icon aria-hidden="true" className="size-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

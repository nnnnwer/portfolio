import { Link } from 'react-router-dom';

/** Monogram drawn as a small chip with pins, echoing the hero board. */
export default function Logo({ name }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3 rounded-md" aria-label={`${name}, home`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="var(--board)" />
        <g fill="#c98a45">
          <rect x="9" y="3" width="2" height="4" rx="1" />
          <rect x="15" y="3" width="2" height="4" rx="1" />
          <rect x="21" y="3" width="2" height="4" rx="1" />
          <rect x="9" y="25" width="2" height="4" rx="1" />
          <rect x="15" y="25" width="2" height="4" rx="1" />
          <rect x="21" y="25" width="2" height="4" rx="1" />
        </g>
        <rect x="7" y="7" width="18" height="18" rx="3" fill="#0f1a16" />
        <text
          x="16"
          y="19.5"
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="8.5"
          fontWeight="500"
          fill="#e8eee6"
        >
          OT
        </text>
      </svg>
      <span className="text-[1.02rem] font-semibold tracking-tight text-ink transition-colors group-hover:text-copper">
        {name}
      </span>
    </Link>
  );
}
